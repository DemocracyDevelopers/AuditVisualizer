// components/ExplainAssertionsComponent.tsx

import React, { useState, useEffect } from "react";
import {
  explain,
  all_elimination_orders,
  assertion_all_allowed_suffixes,
} from "../../../lib/explain/prettyprint_assertions_and_pictures";

interface ExplainAssertionsComponentProps {
  inputData: any;
}

const ExplainAssertionsComponent: React.FC<ExplainAssertionsComponentProps> = ({
  inputData,
}) => {
  const [outputData, setOutputData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  // Function to infer the winner from assertions
  const inferWinnerFromAssertions = (
    assertions: any[],
    numCandidates: number,
  ): number | null => {
    // Initialize possible elimination orders
    let eliminationOrders = all_elimination_orders(numCandidates);

    // Apply each assertion to filter the elimination orders
    for (const assertionObj of assertions) {
      const assertion = assertionObj.assertion;
      eliminationOrders = assertion_all_allowed_suffixes(
        assertion,
        eliminationOrders,
        numCandidates,
        false,
      );

      if (eliminationOrders.length === 0) {
        // No valid elimination orders remain, cannot infer a winner
        return null;
      }
    }

    // Collect the set of possible winners
    const possibleWinners = new Set<number>();
    for (const order of eliminationOrders) {
      const winner = order[order.length - 1];
      possibleWinners.add(winner);
    }

    if (possibleWinners.size === 1) {
      // Unique winner inferred
      return possibleWinners.values().next().value;
    } else {
      // Multiple possible winners, cannot determine a unique winner
      return null;
    }
  };

  // JSON validation function
  const validateInputData = (data: any): string | null => {
    // [Existing validation code...]

    // Check if metadata and candidates array are present and valid
    if (!data.metadata || !Array.isArray(data.metadata.candidates)) {
      return "Invalid metadata or candidates field";
    }

    // Check if solution and solution.Ok exist and are valid
    if (!data.solution || !data.solution.Ok) {
      return "Invalid solution structure";
    }

    const solution = data.solution.Ok;

    // Check if difficulty and margin exist in solution.Ok and are valid numbers
    if (typeof solution.difficulty !== "number" || solution.difficulty < 0) {
      return "Invalid or missing 'difficulty' in solution.Ok";
    }

    if (typeof solution.margin !== "number" || solution.margin < 0) {
      return "Invalid or missing 'margin' in solution.Ok";
    }

    // Check if assertions are present and valid as an array
    if (!Array.isArray(solution.assertions)) {
      return "Invalid assertions field";
    }

    // Check if num_candidates matches the length of candidates array
    const numCandidates = data.metadata.candidates.length;
    if (solution.num_candidates !== numCandidates) {
      return "Mismatch between num_candidates and candidates array length";
    }

    // Validate if winner is within the valid range
    if (
      typeof solution.winner !== "number" ||
      solution.winner < 0 ||
      solution.winner >= numCandidates
    ) {
      return "Winner index out of range or invalid";
    }

    // Validate each assertion's completeness and fields
    for (const [index, assertionObj] of solution.assertions.entries()) {
      if (!assertionObj.assertion) {
        return `Assertion at index ${index} missing 'assertion' field`;
      }

      const assertion = assertionObj.assertion;

      // Check if assertion.type exists and is a string
      if (!assertion.type || typeof assertion.type !== "string") {
        return `Assertion at index ${index} missing 'type' field or 'type' is not a string`;
      }

      // Check if assertion.winner and assertion.loser exist and are within valid range
      if (
        typeof assertion.winner !== "number" ||
        assertion.winner < 0 ||
        assertion.winner >= numCandidates
      ) {
        return `Invalid or missing 'winner' index in assertion at index ${index}`;
      }

      if (
        typeof assertion.loser !== "number" ||
        assertion.loser < 0 ||
        assertion.loser >= numCandidates
      ) {
        return `Invalid or missing 'loser' index in assertion at index ${index}`;
      }

      // Check if assertionObj.difficulty exists and is a valid number
      if (
        typeof assertionObj.difficulty !== "number" ||
        assertionObj.difficulty < 0
      ) {
        return `Invalid or missing 'difficulty' in assertion at index ${index}`;
      }

      // Check if assertionObj.margin exists and is a valid number
      if (typeof assertionObj.margin !== "number" || assertionObj.margin < 0) {
        return `Invalid or missing 'margin' in assertion at index ${index}`;
      }

      // For assertions of type 'NEN', check if the continuing array is valid
      if (assertion.type === "NEN") {
        if (!Array.isArray(assertion.continuing)) {
          return `Assertion of type 'NEN' at index ${index} missing 'continuing' array`;
        }

        // Check if the continuing array indices are valid
        for (const [i, candidateIndex] of assertion.continuing.entries()) {
          if (
            typeof candidateIndex !== "number" ||
            candidateIndex < 0 ||
            candidateIndex >= numCandidates
          ) {
            return `Invalid index in 'continuing' array at position ${i} in assertion at index ${index}`;
          }
        }
      } else if (assertion.type !== "NEB") {
        return `Unknown assertion type '${assertion.type}' at index ${index}`;
      }
    }

    // At the end of validation, infer the winner and compare
    const inferredWinner = inferWinnerFromAssertions(
      solution.assertions,
      numCandidates,
    );

    if (inferredWinner === null) {
      return "Unable to infer a unique winner from the assertions.";
    }

    if (inferredWinner !== solution.winner) {
      const winnerName = data.metadata.candidates[inferredWinner];
      const expectedWinnerName = data.metadata.candidates[solution.winner];
      return `Inferred winner (${winnerName}) does not match the winner in the JSON data (${expectedWinnerName}).`;
    }

    return null; // All validations passed
  };

  useEffect(() => {
    // Validate input data before calling explain
    const validationError = validateInputData(inputData);

    if (validationError) {
      setError(`Invalid JSON input: ${validationError}`); // Set error message
      setOutputData(null); // Clear output data
      return;
    }

    // If validation passes, call explain function
    const multiWinnerData = explain(
      inputData.solution.Ok.assertions.map((a: any) => a.assertion),
      inputData.metadata.candidates,
      /* expand_fully_at_start */ true,
      /* hide_winner */ false,
      inputData.solution.Ok.winner,
    );

    // Set the output data
    setOutputData(multiWinnerData);
    setError(null); // Clear error message
  }, [inputData]);

  return (
    <div>
      <h2>Explanation Results</h2>
      {error ? (
        <p className="error">{error}</p> // Display error message
      ) : (
        <pre>{JSON.stringify(outputData, null, 2)}</pre> // Display output data
      )}
    </div>
  );
};

export default ExplainAssertionsComponent;
