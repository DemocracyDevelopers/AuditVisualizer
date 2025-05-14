import { useEffect } from "react";
import { useTour } from "@reactour/tour";
import { usePathname } from "next/navigation";

export const CloseTourOnRouteChange = () => {
  const pathname = usePathname(); // Next.js 路由路径
  const { setIsOpen } = useTour();

  useEffect(() => {
    // 每次路由变动时关闭 tour
    setIsOpen(false);
  }, [pathname, setIsOpen]);

  return null;
};
