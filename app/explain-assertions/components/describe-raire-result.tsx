import React from "react";

interface DescribeRaireResultProps {
  data: any;
}

const DescribeRaireResult: React.FC<DescribeRaireResultProps> = ({ data }) => {
  // Render explanation if the solution exists and is marked as "Ok"
  if (data.solution && data.solution.Ok) {
    // Extract relevant solution data
    return <div>{data.solution.Ok.warning_trim_timed_out}</div>;
  } else if (data.solution && data.solution.Err) {
    // Handle and display error messages

    const err = data.solution.Err;
    let errorMessage = `Error: ${JSON.stringify(err)}`;

    // Customize common errors with user-friendly messages
    if (err === "InvalidCandidateNumber") {
      errorMessage =
        "Invalid candidate number in the preference list. Candidate numbers should be 0 to num_candidates-1 inclusive.";
    } else if (err === "InvalidNumberOfCandidates") {
      errorMessage =
        "Invalid number of candidates. There should be at least one candidate.";
    } else if (err === "TimeoutCheckingWinner") {
      errorMessage =
        "Timeout checking winner - either your problem is exceptionally difficult, or your timeout is exceedingly small.";
    } else if (err.hasOwnProperty("TimeoutFindingAssertions")) {
      errorMessage = `Timeout finding assertions - your problem is quite hard. Difficulty when interrupted: ${err.TimeoutFindingAssertions}`;
    } else if (err === "InvalidTimeout") {
      errorMessage =
        "Timeout is not valid. Timeout should be a number greater than zero.";
    } else if (Array.isArray(err.CouldNotRuleOut)) {
      errorMessage =
        "Impossible to audit. Could not rule out the following elimination order:";
      // You can render the list of candidates here if needed
    }

    return (
      <div>
        <p className="error">{errorMessage}</p>
      </div>
    );
  } else {
    // Catch-all for unexpected or malformed output
    return (
      <div>
        <p className="error">Output is wrong format</p>
      </div>
    );
  }
};

export default DescribeRaireResult;
