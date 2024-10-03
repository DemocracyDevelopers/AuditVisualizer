import React from "react";
import { File, TriangleAlert } from "lucide-react";

interface UploadProgressProps {
  currentPhase: number; // 当前进度的阶段（0, 1, 2, 3）
  phaseErrors: boolean[]; // 每个阶段是否出错的布尔数组
  fileName: string;
}

const phaseLabels = [
  "Parsing assertion",
  "Cross checking",
  "Generating results",
  "Finishing up",
];

// 定义每个阶段的错误信息
const errorMessages = [
  {
    title: "Data Parsing Error",
    description:
      "Your data contains errors and could not be parsed. Please check the file and re-upload.",
  },
  {
    title: "Cross Check Error",
    description:
      "An error occurred during the cross-check process. Please review the data and try again.",
  },
  {
    title: "Result Generation Error",
    description:
      "An error occurred while generating the result. Please try again later or contact support.",
  },
  {
    title: "Finish Up Error",
    description:
      "An error occurred during the finish-up process. Please review the steps and try again.",
  },
];

const UploadProgress: React.FC<UploadProgressProps> = ({
  currentPhase,
  phaseErrors,
  fileName,
}) => {
  // 检查是否有任何阶段出错
  const hasError = phaseErrors.some((error) => error);

  return (
    <div className="flex flex-col flex-grow text-left p-4">
      {phaseErrors[currentPhase] ? (
        <>
          <h2 className="text-2xl font-bold">
            {errorMessages[currentPhase].title}
          </h2>
          <p className="mb-4 text-sm text-gray-500">
            {errorMessages[currentPhase].description}
          </p>
        </>
      ) : (
        <>
          <h2 className="text-2xl font-bold">Upload your data</h2>
          <p className="mb-4 text-sm text-gray-500">
            Use the dropzone below to upload your file.
          </p>
        </>
      )}
      <div className="border-2 border-gray-300 p-8 rounded-lg bg-gray-50 cursor-pointer w-full relative text-center flex flex-col flex-grow justify-center">
        <div>
          {hasError ? (
            <TriangleAlert className="mx-auto mb-2 text-red-500" size={80} />
          ) : (
            <File className="mx-auto mb-2 text-gray-500" size={80} />
          )}
          <p className="text-lg font-semibold mt-2 text-gray-400 mb-2">
            {fileName}
          </p>
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
    </div>
  );
};

export default UploadProgress;
