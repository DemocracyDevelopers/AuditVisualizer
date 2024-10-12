import { useState } from "react";
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
  const [isTooltipVisible, setTooltipVisible] = useState(false);

  return (
    <span
      className="ml-2 relative"
      onMouseEnter={() => setTooltipVisible(true)}
      onMouseLeave={() => setTooltipVisible(true)} // Keep tooltip open
    >
      {/* Information Icon */}
      <FaInfoCircle className="text-black cursor-pointer" size={18} />

      {/* Tooltip Box */}
      {isTooltipVisible && (
        <div className="absolute bg-white text-black text-sm rounded-lg shadow-lg py-3 px-5 left-full ml-2 w-64">
          <div className="font-bold mb-2">{title}</div>
          <div className="font-normal">
            {description}{" "}
            <Link
              href="/tutorial"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:underline"
            >
              Tutorial
            </Link>
            .
          </div>
          <button
            className="mt-4 text-gray-500 hover:text-gray-700"
            onClick={() => setTooltipVisible(false)}
          >
            Hide
          </button>
        </div>
      )}
    </span>
  );
};

export default TooltipWithIcon;
