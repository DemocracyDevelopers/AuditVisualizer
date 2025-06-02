import React, { useState, useEffect, useCallback } from "react";
import { CloudUpload, File, ArrowLeft, Link } from "lucide-react";
import CustomAlertDialog from "./alert-dialog";
import UploadProgress from "./progress";
import useMultiWinnerDataStore from "../../../store/multi-winner-data";
import { validateInputData } from "../../explain-assertions/components/explain-process";
import { useRouter } from "next/navigation";
import { useFileDataStore } from "../../../store/fileData";
import { getContentFromAssertion } from "../../../utils/candidateTools";
import { Assertion } from "@/lib/explain/prettyprint_assertions_and_pictures";

interface UploaderProps {
  className?: string;
}

const Uploader: React.FC<UploaderProps> = ({ className }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [showAlert, setShowAlert] = useState(false);
  const [currentPhase, setCurrentPhase] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [uploadComplete, setUploadComplete] = useState(false);
  const [phaseErrors, setPhaseErrors] = useState<boolean[]>([
    false,
    false,
    false,
    false,
  ]);
  const [errorTitle, setErrorTitle] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const allowedFileTypes = [".json", ".txt"];
  const maxFileSize = 100 * 1024 * 1024; // 100MB
  const router = useRouter();

  const startGuide = () => {
    sessionStorage.setItem("startTour", "true");
    router.push("/dashboard");
  };

  const {
    setMultiWinner,
    clearMultiWinner,
    setCandidateList,
    clearCandidateList,
    setAssertionList,
    clearAssertionList,
    setWinnerInfo,
    clearWinnerInfo,
  } = useMultiWinnerDataStore();

  const simulateProgress = useCallback(
    (state: number, success: boolean, errorMsg: string) => {
      setIsUploading(true);
      setCurrentPhase(0);
      setPhaseErrors([false, false, false, false]);

      let phase = 0;
      let interval: NodeJS.Timeout | null = null;

      if (success) {
        interval = setInterval(() => {
          setCurrentPhase((prevPhase) => {
            const nextPhase = prevPhase + 1;

            if (nextPhase > 3) {
              clearInterval(interval!);
              setIsUploading(false);
              setUploadComplete(true);
            }
            return nextPhase;
          });
        }, 1000);
      } else {
        interval = setInterval(() => {
          setCurrentPhase((prevPhase) => {
            const nextPhase = prevPhase + 1;

            if (prevPhase === state) {
              setPhaseErrors((errors) => {
                const updatedErrors = [...errors];
                updatedErrors[prevPhase] = true;
                return updatedErrors;
              });
              setIsUploading(false);
              setIsError(true);
              setErrorTitle("Error Occurred");
              setErrorMsg(errorMsg);
              setShowAlert(true);

              clearInterval(interval!);
              return prevPhase;
            }

            if (nextPhase > 3) {
              clearInterval(interval!);
              setIsUploading(false);
              setUploadComplete(true);
              return prevPhase;
            }

            return nextPhase;
          });
        }, 1000);
      }

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
      setPhaseErrors,
    ],
  );

  useEffect(() => {
    if (selectedFile) {
      const reader = new FileReader();

      reader.onload = (e) => {
        const result = e.target?.result;

        if (typeof result === "string") {
          useFileDataStore.setState({ fileData: result });

          const response = validateInputData(result);
          if (response.success) {
            const jsonData = JSON.parse(result);
            const candidateList = jsonData.metadata.candidates.map(
              (name: string, index: number) => ({
                id: index,
                name: name,
              }),
            );

            setCandidateList(candidateList);

            const assertions = jsonData.solution.Ok.assertions;

            const assertionList = assertions.map(
              (
                assertionObj: {
                  assertion: Assertion;
                  difficulty: number;
                  margin: number;
                },
                idx: number,
              ) => {
                const { assertion, difficulty, margin } = assertionObj;
                const { type, winner } = assertion;

                return {
                  index: idx + 1,
                  winner: winner,
                  content: getContentFromAssertion({
                    assertion,
                    candidateList,
                  }).text,
                  type,
                  difficulty,
                  margin,
                };
              },
            );
            setAssertionList(assertionList);

            const winnerId = jsonData.solution.Ok.winner;
            const winnerName = jsonData.metadata.candidates[winnerId];
            setWinnerInfo({ id: winnerId, name: winnerName });

            simulateProgress(response.state, true, "");
          } else {
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
      clearWinnerInfo();
      clearMultiWinner();
      clearCandidateList();
      clearAssertionList();
      setUploadComplete(false);
      setIsError(false);
      setIsUploading(true);
      setShowAlert(false);
      setPhaseErrors([false, false, false, false]);
      setCurrentPhase(0);
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
      clearMultiWinner();
      clearCandidateList();
      clearAssertionList();
      setUploadComplete(false);
      setIsError(false);
      setIsUploading(true);
      setShowAlert(false);
      setCurrentPhase(0);
    }
  };

  const handleBrowseClick = () => {
    document.getElementById("file-input")?.click();
  };

  const handleReset = () => {
    setSelectedFile(null);
    clearMultiWinner();
    clearCandidateList();
    clearAssertionList();
    setUploadComplete(false);
    setIsError(false);
    setCurrentPhase(0);
  };

  return (
    <div className={className}>
      <CustomAlertDialog
        open={showAlert}
        onClose={() => setShowAlert(false)}
        title={errorTitle}
        description={errorMsg}
      />
      {(isUploading || isError) && selectedFile ? (
        <UploadProgress
          currentPhase={currentPhase}
          phaseErrors={phaseErrors}
          fileName={selectedFile.name}
        />
      ) : uploadComplete && selectedFile ? (
        <>
          <div className="border-2 border-gray-300 p-8 rounded-lg bg-muted cursor-pointer w-full relative text-center flex flex-grow justify-center items-center">
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
              <div className="mt-4 flex justify-center gap-4">
                <button
                  type="button"
                  onClick={startGuide}
                  className="w-40 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-500 transition"
                >
                  Start Guide
                </button>
                <button
                  type="button"
                  onClick={() => router.push("/dashboard")}
                  className="w-40 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-500 transition"
                >
                  Start Explaining
                </button>
              </div>
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
          <h2 className="text-2xl font-bold">Upload your data</h2>
          <p className="mb-4 text-sm text-gray-500">
            Use the dropzone below to upload your file.
          </p>
          <div
            className="h-[calc(100vh-400px)] border-2 border-gray-300 p-8 rounded-lg bg-neutral cursor-pointer w-full relative text-center flex flex-grow justify-center items-center"
            onDragOver={handleDragOver}
            onDrop={handleDrop}
          >
            <div>
              <CloudUpload className="mx-auto mb-2" size={80} />{" "}
              <p className="text-gray-600">
                Drag or{" "}
                <span
                  className="text-blue-600 cursor-pointer hover:underline"
                  onClick={handleBrowseClick}
                >
                  Browse
                </span>{" "}
                your files
              </p>
              <p className="text-gray-400 mb-2">or</p>
              <button
                onClick={() => router.push("/sample")}
                className="text-blue-600 hover:underline"
              >
                Use a sample file
              </button>
              <input
                id="file-input"
                type="file"
                accept="application/json, text/plain"
                onChange={handleFileChange}
                className="top-0 left-0 w-full h-full opacity-0 cursor-pointer absolute"
                style={{ display: "none" }}
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
