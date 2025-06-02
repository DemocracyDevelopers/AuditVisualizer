import { useEffect } from "react";
import { useTour } from "@reactour/tour";
import { usePathname } from "next/navigation";

export const CloseTourOnRouteChange = () => {
  const pathname = usePathname(); 
  const { setIsOpen } = useTour();

  useEffect(() => {
    setIsOpen(false);
  }, [pathname, setIsOpen]);

  return null;
};
