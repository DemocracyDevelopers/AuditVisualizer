// 这个文件没用，这是我之前写过的一个hook, 只是拿过来当例子
import { useState, useEffect } from "react";

const useMediaMinWidth = () => {
  const [matches, setMatches] = useState({
    sm: false,
    md: false,
    lg: false,
  });

  useEffect(() => {
    const handleQueryChange = () => {
      setMatches({
        sm: matchMedia("(min-width: 640px)").matches,
        md: matchMedia("(min-width: 768px)").matches,
        lg: matchMedia("(min-width: 1024px)").matches,
      });
    };

    handleQueryChange(); // 初始加载时触发一次匹配状态更新

    window.addEventListener("resize", handleQueryChange); // 监听窗口大小变化

    return () => {
      window.removeEventListener("resize", handleQueryChange); // 清理函数，移除监听器
    };
  }, []);

  return { matches };
};

export default useMediaMinWidth;
