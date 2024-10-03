// components/DescribeRaireResult.tsx

import React from "react";
import {
  assertion_description_with_triangles,
  Assertion,
} from "../../../lib/explain/prettyprint_assertions_and_pictures";
// ... import other necessary functions ...

interface DescribeRaireResultProps {
  data: any;
}

const DescribeRaireResult: React.FC<DescribeRaireResultProps> = ({ data }) => {
  // Helper functions adjusted to work within the component
  const candidate_name = (id: number): string => {
    if (data.metadata && Array.isArray(data.metadata.candidates)) {
      const name = data.metadata.candidates[id];
      if (name) {
        return name;
      }
    }
    return `Candidate ${id}`;
  };

  const candidate_name_list = (ids: number[]): string => {
    return ids.map(candidate_name).join(",");
  };

  const describe_time = (
    what: string,
    time_taken: { seconds: number; work: number },
  ) => {
    if (time_taken) {
      const time_desc =
        time_taken.seconds > 0.1
          ? `${Number(time_taken.seconds).toFixed(1)} seconds`
          : `${Number(time_taken.seconds * 1000).toFixed(2)} milliseconds`;
      return (
        <p>
          Time to {what}: {time_desc} ({time_taken.work} operations)
        </p>
      );
    }
    return null;
  };

  // Now, handle the rendering logic based on `data`
  if (data.solution && data.solution.Ok) {
    // Extract data for rendering
    const { assertions, winner, num_candidates } = data.solution.Ok;
    const candidate_names =
      data.metadata && data.metadata.candidates
        ? data.metadata.candidates
        : Array.from({ length: num_candidates }, (_, i) => `Candidate ${i}`);

    // Prepare the assertion elements
    const assertionElements = assertions.map((av: any, index: number) => {
      const a = av.assertion as Assertion;

      let description: JSX.Element;
      if (a.type === "NEN") {
        description = (
          <>
            NEN: {candidate_name(a.winner)} &gt; {candidate_name(a.loser)} if
            only {"{"}
            {candidate_name_list(a.continuing!)}
            {"}"} remain
          </>
        );
      } else if (a.type === "NEB") {
        description = (
          <>
            {candidate_name(a.winner)} NEB {candidate_name(a.loser)}
          </>
        );
      } else {
        description = <>Unknown assertion type</>;
      }

      return (
        <div key={index}>
          {/* Render risk, difficulty, margin, etc., if available */}
          <span>{description}</span>
        </div>
      );
    });

    return (
      <div>
        {data.solution.Ok.warning_trim_timed_out && (
          <p className="warning">
            Warning: Trimming timed out. Some assertions may be redundant.
          </p>
        )}
        {describe_time(
          "determine winners",
          data.solution.Ok.time_to_determine_winners,
        )}
        {describe_time(
          "find assertions",
          data.solution.Ok.time_to_find_assertions,
        )}
        {describe_time(
          "trim assertions",
          data.solution.Ok.time_to_trim_assertions,
        )}
        <h3>Assertions</h3>
        {assertionElements}
        {/* If you need to include the explanation, you can render another component here */}
        {/* For example: */}
        {/* <ExplanationComponent data={data} candidateNames={candidate_names} /> */}
      </div>
    );
  } else if (data.solution && data.solution.Err) {
    // Handle error cases
    const err = data.solution.Err;
    let errorMessage = `Error: ${JSON.stringify(err)}`;

    // Customize error messages based on the error type
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
    } else if (Array.isArray(err.TiedWinners)) {
      errorMessage = `Audit not possible as ${candidate_name_list(err.TiedWinners)} are tied IRV winners and a one vote difference would change the outcome.`;
    } else if (Array.isArray(err.WrongWinner)) {
      errorMessage = `The votes are not consistent with the provided winner. Perhaps ${candidate_name_list(err.WrongWinner)}?`;
    }

    return (
      <div>
        <p className="error">{errorMessage}</p>
      </div>
    );
  } else {
    return (
      <div>
        <p className="error">Output is wrong format</p>
      </div>
    );
  }
};

export default DescribeRaireResult;
