import React, { useState, useEffect } from "react";
import { explain } from "../../../lib/explain/prettyprint_assertions_and_pictures";

interface ExplainAssertionsComponentProps {
  inputData: any;
}

const ExplainAssertionsComponent: React.FC<ExplainAssertionsComponentProps> = ({
  inputData,
}) => {
  const [outputData, setOutputData] = useState<any>(null);

  useEffect(() => {
    // Call the explain function and get the data
    const multiWinnerData = explain(
      inputData.solution.Ok.assertions.map((a: any) => a.assertion),
      inputData.metadata.candidates,
      /* expand_fully_at_start */ true,
      /* hide_winner */ false,
      inputData.solution.Ok.winner,
    );

    // Set the output data
    setOutputData(multiWinnerData);
  }, [inputData]);

  return (
    <div>
      <h2>Explanation Results</h2>
      <pre>{JSON.stringify(outputData, null, 2)}</pre>
    </div>
  );
};

export default ExplainAssertionsComponent;
