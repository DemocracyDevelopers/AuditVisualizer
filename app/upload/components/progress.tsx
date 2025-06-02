import React from "react";
import { File, TriangleAlert } from "lucide-react";

interface UploadProgressProps {
  currentPhase: number;
  phaseErrors: boolean[];
  fileName: string;
}

const phaseLabels = [
  "Parsing assertion",
  "Cross checking",
  "Generating results",
  "Finishing up",
];

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
      <div className="border-2 border-gray-300 p-8 rounded-lg bg-muted cursor-pointer w-full relative text-center flex flex-col flex-grow justify-center">
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

        <div className="w-full h-2 rounded-lg bg-gray-200 overflow-hidden mb-4">
          <div
            className={`h-full transition-all duration-500 ${
              hasError ? "bg-red-500" : "bg-blue-500"
            }`}
            style={{ width: `${(currentPhase / 3) * 100}%` }}
          ></div>
        </div>

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
