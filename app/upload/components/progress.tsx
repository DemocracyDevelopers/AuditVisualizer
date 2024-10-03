import React from "react";
import { File, TriangleAlert } from "lucide-react";

interface UploadProgressProps {
  currentPhase: number; // 当前进度的阶段（0, 1, 2, 3）
  phaseErrors: boolean[]; // 每个阶段是否出错的布尔数组
}

const phaseLabels = [
  "Parsing assertion",
  "Cross checking",
  "Generating results",
  "Finishing up",
];

const UploadProgress: React.FC<UploadProgressProps> = ({
  currentPhase,
  phaseErrors,
}) => {
  // 检查是否有任何阶段出错
  const hasError = phaseErrors.some((error) => error);

  return (
    <div className="w-full p-4 border rounded-lg bg-white">
      {/* 显示单个图标，根据是否出错决定图标类型 */}
      <div className="flex items-center justify-center mb-4">
        {hasError ? (
          <TriangleAlert className="text-red-500" size={80} />
        ) : (
          <File className="text-gray-500" size={80} />
        )}
      </div>

      {/* 分段进度条 */}
      <div className="w-full h-2 rounded-lg bg-gray-200 overflow-hidden mb-4">
        <div
          className={`h-full transition-all duration-500 ${
            hasError ? "bg-red-500" : "bg-blue-500"
          }`}
          style={{ width: `${(currentPhase / 3) * 100}%` }} // 使用阶段索引来计算进度条长度
        ></div>
      </div>

      {/* 显示每个阶段的文字描述 */}
      <div className="flex justify-between mt-4 text-sm">
        {phaseLabels.map((label, index) => (
          <div
            key={index}
            className={`flex flex-col items-center ${
              index <= currentPhase && currentPhase >= 0
                ? phaseErrors[index]
                  ? "text-red-500"
                  : "text-blue-600"
                : "text-gray-400"
            }`}
          >
            <span>{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UploadProgress;
