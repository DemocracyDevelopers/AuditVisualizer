import React, { useState, useEffect } from "react";
import { AlertCircle, X, CloudUpload } from "lucide-react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const Uploader: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [showAlert, setShowAlert] = useState(false);
  const allowedFileTypes = [".json", ".txt"]; // Allowed file extensions
  const maxFileSize = 100 * 1024 * 1024; // 100MB

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (showAlert) {
      timer = setTimeout(() => {
        setShowAlert(false);
      }, 2000);
    }
    return () => clearTimeout(timer);
  }, [showAlert]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && allowedFileTypes.includes(file.name.split(".").pop() || "")) {
      setSelectedFile(file);
      setShowAlert(false);
    } else {
      setShowAlert(true);
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const file = event.dataTransfer.files?.[0];
    if (
      file &&
      allowedFileTypes.includes(file.name.split(".").pop() || "") &&
      file.size <= maxFileSize
    ) {
      setSelectedFile(file);
      setShowAlert(false);
    } else {
      setShowAlert(true);
    }
  };

  return (
    <div>
      {showAlert && (
        <div
          style={{
            position: "fixed",
            top: "10px",
            right: "10px",
            zIndex: 1000,
          }}
        >
          <Alert
            variant="destructive"
            className="flex justify-between items-center"
          >
            <div className="flex items-center">
              <AlertCircle className="h-4 w-4 mr-2" />
              <div>
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>
                  Invalid file type or file size exceeds the limit.
                </AlertDescription>
              </div>
            </div>
            <button
              onClick={() => setShowAlert(false)}
              className="ml-4 transition transform hover:scale-110 active:scale-90"
            >
              <X className="h-4 w-4" />
            </button>
          </Alert>
        </div>
      )}

      <div className="uploader-container text-left p-4 mx-auto">
        <h2 className="text-2xl font-bold">Upload your data</h2>
        <p className="mb-4 text-sm text-gray-500">
          Use the dropzone below to upload your file.
        </p>

        <div
          className="dropzone"
          style={{
            border: "2px solid gray",
            padding: "2rem",
            borderRadius: "8px",
            backgroundColor: "#f9f9f9",
            cursor: "pointer",
            margin: "auto",
            position: "relative",
            textAlign: "center",
          }}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
        >
          <CloudUpload className="mx-auto mb-2" size={80} />
          <p className="text-gray-600">
            Drag or <span className="text-blue-600 cursor-pointer">Browse</span>{" "}
            your files
          </p>
          <p className="text-gray-400 mb-2">or</p>
          <a href="#" className="text-blue-600">
            Use a sample file
          </a>

          <input
            type="file"
            accept=".json, .txt"
            onChange={handleFileChange}
            style={{
              opacity: 0,
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              cursor: "pointer",
            }}
          />
          <p
            className="text-sm text-gray-400 mt-4"
            style={{
              position: "absolute",
              bottom: "10px",
              left: "10px",
            }}
          >
            Supported files: raire-rs in .json, .txt | Upload limit: 100MB
          </p>
        </div>

        {selectedFile && (
          <div className="mt-4">
            <p>Selected file: {selectedFile.name}</p>
            <p>File type: {selectedFile.type}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Uploader;
