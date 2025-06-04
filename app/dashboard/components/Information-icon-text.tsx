import { useState } from "react";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
} from "@/components/ui/tooltip";
import { FaInfoCircle } from "react-icons/fa";
import Link from "next/link";

interface TooltipWithIconProps {
  title: string;
  linkText: string;
  linkHref: string;
  description: string;
}

const TooltipWithIcon: React.FC<TooltipWithIconProps> = ({
  title,
  linkText,
  linkHref,
  description,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleClick = () => {
    setIsOpen(!isOpen);
  };

  const handleMouseEnter = () => {
    setIsOpen(true);
  };

  return (
    <TooltipProvider>
      <Tooltip
        open={isOpen}
        onOpenChange={setIsOpen}
        disableHoverableContent={false}
      >
        <TooltipTrigger asChild>
          <span
            className="ml-2 relative"
            onClick={handleClick}
            onMouseEnter={handleMouseEnter}
          >
            {/* Information Icon */}
            <FaInfoCircle className="text-primary cursor-pointer" size={18} />
          </span>
        </TooltipTrigger>

        <TooltipContent
          side="right"
          align="center"
          className="bg-background text-primary rounded-lg shadow-lg p-4 w-64"
        >
          <div className="font-bold mb-2">{title}</div>
          <div className="font-normal">
            {description}{" "}
            <Link
              href={linkHref}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:underline"
            >
              {linkText}
            </Link>
            .
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default TooltipWithIcon;
