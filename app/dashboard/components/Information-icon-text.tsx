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
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <span className="ml-2 relative">
            {/* Automatically adapts to dark mode */}
            <FaInfoCircle
              className="text-foreground dark:text-foreground cursor-pointer"
              size={18}
            />
          </span>
        </TooltipTrigger>

        <TooltipContent
          side="right"
          align="center"
          className="bg-popover text-popover-foreground rounded-lg shadow-lg p-4 w-64"
        >
          <div className="font-bold mb-2">{title}</div>
          <div className="font-normal">
            {description}{" "}
            <Link
              href={linkHref}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary underline hover:opacity-80"
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
