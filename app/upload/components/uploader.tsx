import React, { useState, useEffect, useCallback } from "react";
import { CloudUpload, File, ArrowLeft } from "lucide-react";
import CustomAlertDialog from "./alertDialog";
import UploadProgress from "./progress";
import useMultiWinnerDataStore from "../../../store/MultiWinnerData";
import { explainAssertions } from "../../explain-assertions/components/explain_process";
import { useRouter } from "next/navigation";

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
  const [errorTitle, setErrorTitle] = useState(""); // 错误标题
  const [errorMsg, setErrorMsg] = useState(""); // 错误消息
  const allowedFileTypes = [".json", ".txt"];
  const maxFileSize = 100 * 1024 * 1024; // 100MB
  const router = useRouter();

  const { setMultiWinner, clearMultiWinner } = useMultiWinnerDataStore(); // 使用全局状态

  const simulateProgress = useCallback(
    (state: number, success: boolean, errorMsg: string) => {
      console.log("Simulating progress...");
      console.log("State: ", state);
      console.log("Success: ", success);
      console.log("Error message: ", errorMsg);

      // 设置初始状态
      setIsUploading(true);
      setCurrentPhase(0);
      setPhaseErrors([false, false, false, false]); // 初始化阶段错误状态

      let phase = 0;
      let interval: NodeJS.Timeout | null = null;

      // 如果 success 为 true，直接跳到最后阶段
      if (success) {
        interval = setInterval(() => {
          setCurrentPhase((prevPhase) => {
            const nextPhase = prevPhase + 1;

            // 完成所有阶段
            if (nextPhase > 3) {
              clearInterval(interval!);
              setIsUploading(false);
              setUploadComplete(true);
              console.log("Upload complete");
            }
            return nextPhase;
          });
        }, 1000);
      } else {
        // 如果 success 为 false，逐个阶段处理，直到达到传递过来的 state 阶段
        interval = setInterval(() => {
          setCurrentPhase((prevPhase) => {
            console.log("Current phase: ", prevPhase);
            const nextPhase = prevPhase + 1;

            // 检查是否达到传递过来的失败阶段 state
            if (prevPhase === state) {
              setPhaseErrors((errors) => {
                const updatedErrors = [...errors];
                updatedErrors[prevPhase] = true; // 标记当前阶段出错
                return updatedErrors;
              });
              setIsUploading(false);
              setIsError(true);
              setErrorTitle("Error Occurred"); // 设置错误标题
              setErrorMsg(errorMsg); // 设置错误消息
              setShowAlert(true); // 显示错误提示

              clearInterval(interval!); // 停止 interval
              return prevPhase; // 保持当前阶段不变
            }

            // 如果阶段达到 3（即最后阶段），标记为上传完成
            if (nextPhase > 3) {
              clearInterval(interval!);
              setIsUploading(false);
              setUploadComplete(true);
              return prevPhase; // 保持当前阶段不变
            }

            return nextPhase; // 继续增加阶段
          });
        }, 1000);
      }

      // 清理 interval
      return () => {
        if (interval) clearInterval(interval);
      };
    },
    [
      setCurrentPhase,
      setIsUploading,
      setUploadComplete,
      setIsError,
      setErrorTitle,
      setErrorMsg,
      setShowAlert,
    ],
  );

  useEffect(() => {
    if (selectedFile) {
      const reader = new FileReader();

      reader.onload = (e) => {
        // 获取文件内容
        const result = e.target?.result;

        if (typeof result === "string") {
          console.log("File content: ", result);
          // 调用核心库中的 explainAssertions 函数进行解析和校验
          const response = explainAssertions(result); // 直接将文件内容传递给核心库
          console.log("Response: ", response);
          // 根据核心库返回的 response 进行处理
          if (response.success) {
            // 成功解析并校验，将数据存储到全局状态中
            setMultiWinner(response.data);
            // 根据返回的 state 模拟进度条
            simulateProgress(response.state, true, "");
          } else {
            // 如果解析或校验失败，调用 simulateProgress 并显示错误消息
            simulateProgress(response.state, false, response.error_message);
          }
        }
      };

      reader.readAsText(selectedFile);
    }
  }, [selectedFile, setMultiWinner, simulateProgress]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const fileExtension = file.name.split(".").pop()?.toLowerCase() || "";
      if (!allowedFileTypes.includes(`.${fileExtension}`)) {
        setErrorTitle("Unsupported file type");
        setErrorMsg(
          "It seems that the file you uploaded is not supported, please check if your file is a raier-rs JSON file.",
        );
        setShowAlert(true);
        return;
      }
      if (file.size > maxFileSize) {
        setErrorTitle("File size exceeds the limit");
        setErrorMsg(
          "File size exceeds the allowable limit(100MB). Please upload a smaller file.",
        );
        setShowAlert(true);
        return;
      }
      setSelectedFile(file);
      clearMultiWinner(); // 清空全局状态中的 JSON 数据
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
        setErrorTitle("Unsupported file type");
        setErrorMsg(
          "It seems that the file you uploaded is not supported, please check if your file is a raier-rs JSON file.",
        );
        setShowAlert(true);
        return;
      }
      if (file.size > maxFileSize) {
        setErrorTitle("File size exceeds the limit");
        setErrorMsg(
          "File size exceeds the allowable limit(100MB). Please upload a smaller file.",
        );
        setShowAlert(true);
        return;
      }
      setSelectedFile(file);
      clearMultiWinner(); // 清空全局状态中的 JSON 数据
      setUploadComplete(false); // 重置上传完成状态
      setIsError(false); // 重置错误状态
      setIsUploading(true); // 开始上传
      setShowAlert(false);
      setCurrentPhase(0); // 重置上传进度
    }
  };

  const handleReset = () => {
    setSelectedFile(null); // 清空选中的文件
    clearMultiWinner(); // 清空全局状态中的 JSON 数据
    setUploadComplete(false); // 重置上传完成状态
    setIsError(false); // 重置错误状态
    setCurrentPhase(0); // 重置上传进度
  };

  return (
    <div className={className}>
      {/* 错误信息提示 */}
      <CustomAlertDialog
        open={showAlert}
        onClose={() => setShowAlert(false)} // 点击按钮关闭 AlertDialog
        title={errorTitle}
        description={errorMsg}
      />
      {/* 上传进度条显示 */}
      {(isUploading || isError) && selectedFile ? (
        <UploadProgress
          currentPhase={currentPhase}
          phaseErrors={phaseErrors}
          fileName={selectedFile.name}
        />
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
                type="button"
                onClick={() => router.push("/dashboard")} // 跳转到解析页面
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
              {/* Sample文件 TODO */}
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
