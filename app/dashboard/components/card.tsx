import React from "react";

interface CardProps {
  title: string;
  value: string | number;
  icon?: React.ReactNode;
}

const Card = ({ title, value, icon }: CardProps) => {
  return (
    <div className="border border-gray-300 rounded-lg p-4 flex items-center justify-between w-full">
      <div>
        <h3 className="text-gray-600 text-sm md:text-lg font-medium">
          {title}
        </h3>
        <p className="text-xl md:text-3xl font-bold">{value}</p>
      </div>
      {icon && <div className="text-gray-400 text-2xl md:text-3xl">{icon}</div>}
    </div>
  );
};
export default Card;
