// 监听来自主线程的消息
self.addEventListener("message", function (e) {
  const { id, fn, args } = e.data;

  try {
    // 执行传入的函数字符串
    const func = new Function("return " + fn)();
    const result = func(...args);

    // 将结果返回给主线程
    self.postMessage({
      id,
      success: true,
      result,
    });
  } catch (error) {
    // 发生错误时，返回错误信息
    self.postMessage({
      id,
      success: false,
      error: error.message,
    });
  }
});

// 通知主线程 worker 已准备好
self.postMessage({
  type: "ready",
});
