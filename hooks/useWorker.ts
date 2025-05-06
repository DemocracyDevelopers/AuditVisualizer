import { getWorkerManager } from "@/utils/worker-manager";
import { useState, useEffect, useCallback } from "react";

// 任务状态类型
export type TaskStatus =
  | "idle"
  | "loading"
  | "processing"
  | "success"
  | "error";

// Hook 返回类型
interface UseWorkerResult<T = any> {
  execute: <F extends (...args: any[]) => any>(
    fn: F,
    ...args: Parameters<F>
  ) => Promise<T>;
  executeAsync: <F extends (...args: any[]) => any>(
    fn: F,
    ...args: Parameters<F>
  ) => void;
  result: T | null;
  error: Error | null;
  status: TaskStatus;
  isReady: boolean;
  reset: () => void;
}

/**
 * Web Worker Hook - 允许在 Worker 线程中执行函数
 */
export function useWorker<T = any>(): UseWorkerResult<T> {
  const [status, setStatus] = useState<TaskStatus>("idle");
  const [result, setResult] = useState<T | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [isReady, setIsReady] = useState<boolean>(false);

  // 初始化 Worker
  useEffect(() => {
    // 获取 Worker 管理器单例
    const workerManager = getWorkerManager();

    setStatus("loading");

    // 初始化 Worker
    workerManager
      .init()
      .then(() => {
        setIsReady(true);
        setStatus("idle");
      })
      .catch((err) => {
        setError(err instanceof Error ? err : new Error(String(err)));
        setStatus("error");
      });

    // 组件卸载时清理
    return () => {
      // 不终止 Worker，因为它可能被其他组件使用
      // 如果确实需要终止，应在应用级别进行
    };
  }, []);

  // 执行函数并等待结果
  const execute = useCallback(
    <F extends (...args: any[]) => any>(
      fn: F,
      ...args: Parameters<F>
    ): Promise<T> => {
      const workerManager = getWorkerManager();

      if (!isReady) {
        return Promise.reject(new Error("Worker 尚未准备就绪"));
      }

      setStatus("processing");
      setResult(null);
      setError(null);

      return workerManager
        .executeFunction<T>(fn, ...args)
        .then((result) => {
          setResult(result);
          setStatus("success");
          return result;
        })
        .catch((err) => {
          const error = err instanceof Error ? err : new Error(String(err));
          setError(error);
          setStatus("error");
          throw error;
        });
    },
    [isReady],
  );

  // 异步执行函数（不等待结果，但更新状态）
  const executeAsync = useCallback(
    <F extends (...args: any[]) => any>(
      fn: F,
      ...args: Parameters<F>
    ): void => {
      execute(fn, ...args).catch(() => {
        // 错误已在 execute 中处理
      });
    },
    [execute],
  );

  // 重置状态
  const reset = useCallback(() => {
    setStatus("idle");
    setResult(null);
    setError(null);
  }, []);

  return {
    execute,
    executeAsync,
    result,
    error,
    status,
    isReady,
    reset,
  };
}
