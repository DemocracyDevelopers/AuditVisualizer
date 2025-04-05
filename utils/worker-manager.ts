// Worker 管理器类
export class WorkerManager {
  private worker: Worker | null = null;
  private isReady = false;
  private callbacks = new Map<
    string,
    { resolve: Function; reject: Function }
  >();
  private taskIdCounter = 0;

  constructor(private workerUrl: string = "/worker.js") {}

  // 初始化 worker
  public init(): Promise<void> {
    // 如果已经初始化，直接返回
    if (this.worker) {
      return Promise.resolve();
    }

    return new Promise((resolve, reject) => {
      try {
        // 创建新的 worker
        this.worker = new Worker(this.workerUrl);

        // 监听 worker 消息
        this.worker.addEventListener("message", this.handleWorkerMessage);

        // 设置超时，避免 worker 加载失败时永久等待
        const timeout = setTimeout(() => {
          if (!this.isReady) {
            reject(new Error("Worker 初始化超时"));
          }
        }, 5000);

        // 等待 worker 准备就绪
        const readyHandler = (e: MessageEvent) => {
          if (e.data && e.data.type === "ready") {
            clearTimeout(timeout);
            this.isReady = true;
            this.worker?.removeEventListener("message", readyHandler);
            resolve();
          }
        };

        this.worker.addEventListener("message", readyHandler);
      } catch (error) {
        reject(error instanceof Error ? error : new Error(String(error)));
      }
    });
  }

  // 处理来自 worker 的消息
  private handleWorkerMessage = (e: MessageEvent) => {
    const { id, success, result, error } = e.data;

    // 查找对应的回调
    const callback = this.callbacks.get(id);
    if (callback) {
      if (success) {
        callback.resolve(result);
      } else {
        callback.reject(new Error(error));
      }

      // 删除已完成的回调
      this.callbacks.delete(id);
    }
  };

  // 在 worker 中执行函数
  public executeFunction<T = any>(fn: Function, ...args: any[]): Promise<T> {
    if (!this.worker || !this.isReady) {
      return Promise.reject(new Error("Worker 未初始化"));
    }

    // 生成唯一任务 ID
    const id = String(++this.taskIdCounter);

    // 创建 Promise 用于接收结果
    return new Promise<T>((resolve, reject) => {
      // 存储回调函数
      this.callbacks.set(id, { resolve, reject });

      // 发送函数和参数到 worker
      this.worker!.postMessage({
        id,
        fn: fn.toString(),
        args,
      });

      // 设置超时，避免永久等待
      setTimeout(() => {
        if (this.callbacks.has(id)) {
          this.callbacks.delete(id);
          reject(new Error("函数执行超时"));
        }
      }, 30000); // 30 秒超时
    });
  }

  // 终止 worker
  public terminate() {
    if (this.worker) {
      this.worker.terminate();
      this.worker = null;
      this.isReady = false;

      // 拒绝所有待处理的 Promise
      for (const [id, { reject }] of this.callbacks.entries()) {
        reject(new Error("Worker 已终止"));
        this.callbacks.delete(id);
      }
    }
  }

  // 获取 worker 状态
  public getStatus() {
    return {
      isInitialized: !!this.worker,
      isReady: this.isReady,
      pendingTasks: this.callbacks.size,
    };
  }
}

// 单例实例
let workerManagerInstance: WorkerManager | null = null;

// 获取 WorkerManager 单例
export function getWorkerManager(): WorkerManager {
  if (!workerManagerInstance) {
    workerManagerInstance = new WorkerManager();
  }
  return workerManagerInstance;
}
