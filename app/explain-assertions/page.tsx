"use client";
// pages/explain-assertions.tsx

import React, { useState } from "react";
import { explainAssertions } from "./components/explain_process";

const ExplainAssertionsPage = () => {
  const [inputText, setInputText] = useState("");
  const [outputData, setOutputData] = useState<any | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputText(event.target.value);
  };

  const handleExplain = () => {
    try {
      const parsedInput = JSON.parse(inputText);

      // 调用 explainAssertions 方法
      const result = explainAssertions(parsedInput);

      if (result.success) {
        setOutputData(result.data);
        setError(null);
      } else {
        setError(result.error_message);
        setOutputData(null);
      }
    } catch (e) {
      setError("Invalid JSON input");
      setOutputData(null);
    }
  };

  return (
    <div>
      <h1>Explain Assertions</h1>
      <textarea
        value={inputText}
        onChange={handleInputChange}
        rows={10}
        cols={80}
        placeholder="Paste your JSON input here"
      />
      <br />
      <button onClick={handleExplain}>Explain Assertions</button>
      {error && <p className="error">{error}</p>}
      {outputData && (
        <div>
          <h2>Result</h2>
          <pre>{JSON.stringify(outputData, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};

export default ExplainAssertionsPage;
