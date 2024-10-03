"use client";
// pages/explain-assertions.tsx

import React, { useState } from "react";
import ExplainAssertionsComponent from "./components/ExplainAssertionsComponent";

const ExplainAssertionsPage = () => {
  const [inputText, setInputText] = useState("");
  const [inputData, setInputData] = useState<any | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputText(event.target.value);
  };

  const handleExplain = () => {
    try {
      const parsedInput = JSON.parse(inputText);
      setInputData(parsedInput);
      setError(null);
    } catch (e) {
      setError("Invalid JSON input");
      setInputData(null);
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
      {inputData && <ExplainAssertionsComponent inputData={inputData} />}
    </div>
  );
};

export default ExplainAssertionsPage;
