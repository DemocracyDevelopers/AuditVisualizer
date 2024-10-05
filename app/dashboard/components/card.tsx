import React from "react";

interface CardProps {
  title: string;
  value: string | number;
  icon?: React.ReactNode;
}

const Card: React.FC<CardProps> = ({ title, value, icon }) => {
  return (
    <div className="border border-gray-300 rounded-lg p-6 flex items-center justify-between w-full max-w-sm">
      <div>
        <h3 className="text-gray-600 text-lg font-medium">{title}</h3>
        <p className="text-3xl font-bold">{value}</p>
      </div>
      {icon && <div className="text-gray-400 text-3xl">{icon}</div>}
    </div>
  );
};

export default Card;
