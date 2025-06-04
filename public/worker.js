// Listen for messages from the main thread
self.addEventListener("message", function (e) {
  const { id, fn, args } = e.data;

  try {
    // Execute the passed-in function string
    const func = new Function("return " + fn)();
    const result = func(...args);

    // Send the result back to the main thread
    self.postMessage({
      id,
      success: true,
      result,
    });
  } catch (error) {
    // If an error occurs, return the error message
    self.postMessage({
      id,
      success: false,
      error: error.message,
    });
  }
});

// Notify the main thread that the worker is ready
self.postMessage({
  type: "ready",
});
