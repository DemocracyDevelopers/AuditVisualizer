import React, { useState, useEffect } from "react";
import { AlertCircle, X, CloudUpload, File, ArrowLeft } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import UploadProgress from "./progress";

interface UploaderProps {
  className?: string;
}

const Uploader: React.FC<UploaderProps> = ({ className }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [showAlert, setShowAlert] = useState(false);
  const [currentPhase, setCurrentPhase] = useState(0); // 上传阶段
  const [isUploading, setIsUploading] = useState(false); // 是否正在上传
  const [isError, setIsError] = useState(false); // 是否出错
  const [uploadComplete, setUploadComplete] = useState(false); // 上传是否完成
  const [phaseErrors, setPhaseErrors] = useState<boolean[]>([
    false,
    false,
    false,
    false,
  ]); // 每个阶段的错误状态
  const [errorMsg, setErrorMsg] = useState(""); // 错误消息
  const allowedFileTypes = [".json", ".txt"];
  const maxFileSize = 100 * 1024 * 1024; // 100MB

  const stopAtPhase = 5;

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (showAlert) {
      timer = setTimeout(() => {
        setShowAlert(false);
      }, 2000);
    }
    return () => clearTimeout(timer);
  }, [showAlert]);

  // 模拟文件上传进度和阶段出错
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isUploading && currentPhase <= 3) {
      interval = setInterval(() => {
        setCurrentPhase((prevPhase) => {
          const nextPhase = prevPhase + 1; // 模拟阶段进度 +1

          // 停止阶段
          if (nextPhase === stopAtPhase) {
            setPhaseErrors((errors) => {
              const updatedErrors = [...errors];
              updatedErrors[prevPhase] = true; // 标记当前阶段出错
              return updatedErrors;
            });
            setIsUploading(false); // 停止上传状态
            setIsError(true); // 设置错误状态
            return prevPhase; // 保持当前阶段不变
          }
          return nextPhase;
        });
      }, 1000);
    }

    // 当阶段到达 3 时，设置上传完成
    if (currentPhase > 3) {
      setIsUploading(false); // 停止上传状态
      setUploadComplete(true); // 设置上传完成
      clearInterval(interval!);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isUploading, currentPhase, stopAtPhase]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const fileExtension = file.name.split(".").pop()?.toLowerCase() || "";
      if (!allowedFileTypes.includes(`.${fileExtension}`)) {
        setErrorMsg("Unsupported file type.");
        setShowAlert(true);
        return;
      }
      if (file.size > maxFileSize) {
        setErrorMsg("File size exceeds the limit.");
        setShowAlert(true);
        return;
      }
      setSelectedFile(file);
      setUploadComplete(false); // 重置上传完成状态
      setIsError(false); // 重置错误状态
      setIsUploading(true); // 开始上传
      setShowAlert(false);
      setPhaseErrors([false, false, false, false]); // 重置所有阶段错误
      setCurrentPhase(0); // 重置上传进度
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const file = event.dataTransfer.files?.[0];
    if (file) {
      const fileExtension = file.name.split(".").pop()?.toLowerCase() || "";
      if (!allowedFileTypes.includes(`.${fileExtension}`)) {
        setErrorMsg("Unsupported file type.");
        setShowAlert(true);
        return;
      }
      if (file.size > maxFileSize) {
        setErrorMsg("File size exceeds the limit.");
        setShowAlert(true);
        return;
      }
      setSelectedFile(file);
      setUploadComplete(false); // 重置上传完成状态
      setIsError(false); // 重置错误状态
      setIsUploading(true); // 开始上传
      setShowAlert(false);
      setCurrentPhase(0); // 重置上传进度
    }
  };

  const handleReset = () => {
    setSelectedFile(null); // 清空选中的文件
    setUploadComplete(false); // 重置上传完成状态
    setIsError(false); // 重置错误状态
    setCurrentPhase(0); // 重置上传进度
  };

  return (
    <div className={className}>
      {/* 错误信息提示 */}
      {showAlert && (
        <div className="fixed top-2 right-2 z-50">
          <Alert
            variant="destructive"
            className="flex justify-between items-center"
          >
            <div className="flex items-center">
              <AlertCircle className="h-4 w-4 mr-2" />
              <div>
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{errorMsg}</AlertDescription>
              </div>
            </div>
            <button
              onClick={() => setShowAlert(false)}
              className="absolute bottom-2 left-2 ml-4 transition transform hover:scale-110 active:scale-90"
            >
              <X className="h-4 w-4" />
            </button>
          </Alert>
        </div>
      )}

      {/* 上传进度条显示 */}
      {isUploading || isError ? (
        <UploadProgress currentPhase={currentPhase} phaseErrors={phaseErrors} />
      ) : uploadComplete && selectedFile ? (
        <>
          {/* 上传完成 */}
          <div className="border-2 border-gray-300 p-8 rounded-lg bg-gray-50 cursor-pointer w-full relative text-center flex flex-grow justify-center items-center">
            <div>
              <h2 className="text-2xl font-bold text-gray-600 mb-2">
                Uploaded!
              </h2>
              <div>
                <File className="mx-auto mb-2" size={80} />{" "}
              </div>
              <p className="text-lg font-semibold mt-2">{selectedFile.name}</p>
              <p className="text-sm text-gray-500">
                Your file has been added successfully!
              </p>
              <button
                onClick={handleReset}
                className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-500 transition"
              >
                Start Explaining
              </button>
              <div className="mt-4">
                <button
                  onClick={handleReset}
                  className="flex items-center text-gray-500 hover:text-gray-700 transition mt-4 absolute bottom-2 left-2"
                >
                  <ArrowLeft className="h-4 w-4 mr-1" />
                  <span>Back</span>
                </button>
              </div>
            </div>
          </div>
        </>
      ) : (
        <>
          {/* 上传区域 */}
          <h2 className="text-2xl font-bold">Upload your data</h2>
          <p className="mb-4 text-sm text-gray-500">
            Use the dropzone below to upload your file.
          </p>
          <div
            className="border-2 border-gray-300 p-8 rounded-lg bg-gray-50 cursor-pointer w-full relative text-center flex flex-grow justify-center items-center"
            onDragOver={handleDragOver}
            onDrop={handleDrop}
          >
            <div>
              <CloudUpload className="mx-auto mb-2" size={80} />{" "}
              {/* 设置 CloudUpload 图标大小 */}
              <p className="text-gray-600">
                Drag or{" "}
                <span className="text-blue-600 cursor-pointer">Browse</span>{" "}
                your files
              </p>
              <p className="text-gray-400 mb-2">or</p>
              {/* Sample文件 */}
              <a href="#" className="text-blue-600">
                Use a sample file
              </a>
              <input
                type="file"
                accept="application/json, text/plain"
                onChange={handleFileChange}
                className="top-0 left-0 w-full h-full opacity-0 cursor-pointer absolute"
              />
              <p className="text-sm text-gray-400 mt-4 absolute bottom-2 left-2">
                Supported files: .json, .txt | Upload limit: 100MB
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Uploader;
