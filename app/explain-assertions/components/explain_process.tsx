// utils/explainAssertions.ts

import {
  explain,
  all_elimination_orders,
  assertion_all_allowed_suffixes,
} from "../../../lib/explain/prettyprint_assertions_and_pictures";

// Function to infer the winner from assertions
const inferWinnerFromAssertions = (
  assertions: any[],
  numCandidates: number,
): number | null => {
  // Initialize possible elimination orders
  let eliminationOrders = all_elimination_orders(numCandidates);

  // Apply each assertion to filter the elimination orders
  for (let i = 0; i < assertions.length; i++) {
    const assertionObj = assertions[i];
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
  const possibleWinners: number[] = [];
  for (let i = 0; i < eliminationOrders.length; i++) {
    const order = eliminationOrders[i];
    const winner = order[order.length - 1];
    if (!possibleWinners.includes(winner)) {
      possibleWinners.push(winner);
    }
  }

  if (possibleWinners.length === 1) {
    // Unique winner inferred
    return possibleWinners[0];
  } else {
    // Multiple possible winners, cannot determine a unique winner
    return null;
  }
};

// JSON validation function
const validateInputData = (
  data: any,
): { error_message: string; state: number } | null => {
  // Check if metadata and candidates array are present and valid
  if (!data.metadata || !Array.isArray(data.metadata.candidates)) {
    return { error_message: "Invalid metadata or candidates field", state: 0 };
  }

  // Check if solution and solution.Ok exist and are valid
  if (!data.solution || !data.solution.Ok) {
    return { error_message: "Invalid solution structure", state: 0 };
  }

  const solution = data.solution.Ok;

  // Check if difficulty and margin exist in solution.Ok and are valid numbers
  if (typeof solution.difficulty !== "number" || solution.difficulty < 0) {
    return {
      error_message: "Invalid or missing 'difficulty' in solution.Ok",
      state: 0,
    };
  }

  if (typeof solution.margin !== "number" || solution.margin < 0) {
    return {
      error_message: "Invalid or missing 'margin' in solution.Ok",
      state: 0,
    };
  }

  // Check if assertions are present and valid as an array
  if (!Array.isArray(solution.assertions)) {
    return { error_message: "Invalid assertions field", state: 0 };
  }

  // Check if num_candidates matches the length of candidates array
  const numCandidates = data.metadata.candidates.length;
  if (solution.num_candidates !== numCandidates) {
    return {
      error_message:
        "Mismatch between num_candidates and candidates array length",
      state: 0,
    };
  }

  // Validate if winner is within the valid range
  if (
    typeof solution.winner !== "number" ||
    solution.winner < 0 ||
    solution.winner >= numCandidates
  ) {
    return { error_message: "Winner index out of range or invalid", state: 0 };
  }

  // Validate each assertion's completeness and fields
  for (let index = 0; index < solution.assertions.length; index++) {
    const assertionObj = solution.assertions[index];
    if (!assertionObj.assertion) {
      return {
        error_message: `Assertion at index ${index} missing 'assertion' field`,
        state: 0,
      };
    }

    const assertion = assertionObj.assertion;

    // Check if assertion.type exists and is a string
    if (!assertion.type || typeof assertion.type !== "string") {
      return {
        error_message: `Assertion at index ${index} missing 'type' field or 'type' is not a string`,
        state: 0,
      };
    }

    // Check if assertion.winner and assertion.loser exist and are within valid range
    if (
      typeof assertion.winner !== "number" ||
      assertion.winner < 0 ||
      assertion.winner >= numCandidates
    ) {
      return {
        error_message: `Invalid or missing 'winner' index in assertion at index ${index}`,
        state: 0,
      };
    }

    if (
      typeof assertion.loser !== "number" ||
      assertion.loser < 0 ||
      assertion.loser >= numCandidates
    ) {
      return {
        error_message: `Invalid or missing 'loser' index in assertion at index ${index}`,
        state: 0,
      };
    }

    // Check if assertionObj.difficulty exists and is a valid number
    if (
      typeof assertionObj.difficulty !== "number" ||
      assertionObj.difficulty < 0
    ) {
      return {
        error_message: `Invalid or missing 'difficulty' in assertion at index ${index}`,
        state: 0,
      };
    }

    // Check if assertionObj.margin exists and is a valid number
    if (typeof assertionObj.margin !== "number" || assertionObj.margin < 0) {
      return {
        error_message: `Invalid or missing 'margin' in assertion at index ${index}`,
        state: 0,
      };
    }

    // For assertions of type 'NEN', check if the continuing array is valid
    if (assertion.type === "NEN") {
      if (!Array.isArray(assertion.continuing)) {
        return {
          error_message: `Assertion of type 'NEN' at index ${index} missing 'continuing' array`,
          state: 0,
        };
      }

      // Check if the continuing array indices are valid
      for (let i = 0; i < assertion.continuing.length; i++) {
        const candidateIndex = assertion.continuing[i];
        if (
          typeof candidateIndex !== "number" ||
          candidateIndex < 0 ||
          candidateIndex >= numCandidates
        ) {
          return {
            error_message: `Invalid index in 'continuing' array at position ${i} in assertion at index ${index}`,
            state: 0,
          };
        }
      }
    } else if (assertion.type !== "NEB") {
      return {
        error_message: `Unknown assertion type '${assertion.type}' at index ${index}`,
        state: 0,
      };
    }
  }

  // At the end of validation, infer the winner and compare
  const inferredWinner = inferWinnerFromAssertions(
    solution.assertions,
    numCandidates,
  );

  if (inferredWinner === null) {
    return {
      error_message: "Unable to infer a unique winner from the assertions.",
      state: 1,
    };
  }

  if (inferredWinner !== solution.winner) {
    const winnerName = data.metadata.candidates[inferredWinner];
    const expectedWinnerName = data.metadata.candidates[solution.winner];
    return {
      error_message: `Inferred winner (${winnerName}) does not match the winner in the JSON data (${expectedWinnerName}).`,
      state: 1,
    };
  }

  return null; // All validations passed
};

// Function to mark cut nodes in the 'before' tree by comparing with 'after' tree
const markCutNodes = (beforeTrees: any[], afterTrees: any[]) => {
  // Helper function to get all paths from a tree
  const getPaths = (node: any, path: number[] = []): Set<string> => {
    const paths = new Set<string>();
    const currentPath = [...path, node.id];
    paths.add(currentPath.join("-"));
    if (node.children) {
      for (let i = 0; i < node.children.length; i++) {
        const child = node.children[i];
        const childPaths = getPaths(child, currentPath);
        childPaths.forEach((p) => {
          paths.add(p);
        });
      }
    }
    return paths;
  };

  // Get all paths from afterTrees
  const afterPaths = new Set<string>();
  for (let i = 0; i < afterTrees.length; i++) {
    const tree = afterTrees[i];
    const paths = getPaths(tree);
    paths.forEach((p) => {
      afterPaths.add(p);
    });
  }

  // Function to mark cuts in beforeTrees
  const markCuts = (node: any, path: number[] = []): boolean => {
    const currentPath = [...path, node.id];
    const pathStr = currentPath.join("-");

    // Check if current path exists in afterPaths
    const existsInAfter = afterPaths.has(pathStr);

    let hasValidChild = false;

    if (node.children && node.children.length > 0) {
      for (let i = 0; i < node.children.length; i++) {
        const child = node.children[i];
        const childValid = markCuts(child, currentPath);
        if (childValid) {
          hasValidChild = true;
        }
      }
    }

    if (
      !existsInAfter ||
      (!hasValidChild && node.children && node.children.length > 0)
    ) {
      node.cut = true;
      return false;
    }

    return true;
  };

  // Mark cuts in beforeTrees
  for (let i = 0; i < beforeTrees.length; i++) {
    const tree = beforeTrees[i];
    markCuts(tree);
  }
};

// Main function to process inputText and return the outputData
export function explainAssertions(inputText: string): any {
  // 在此处解析 JSON
  let inputData;
  try {
    inputData = JSON.parse(inputText);
  } catch (e) {
    return {
      success: false,
      state: 0,
      error_message: "Invalid JSON input",
    };
  }

  // 验证输入数据
  const validationResult = validateInputData(inputData);

  if (validationResult) {
    // 存在错误
    return {
      success: false,
      error_message: validationResult.error_message,
      state: validationResult.state,
    };
  }

  try {
    // 如果验证通过，调用 explain 函数
    const multiWinnerData = explain(
      inputData.solution.Ok.assertions.map((a: any) => a.assertion),
      inputData.metadata.candidates,
      /* expand_fully_at_start */ true,
      /* hide_winner */ false,
      inputData.solution.Ok.winner,
    );

    // 处理 multiWinnerData 以标记 'cut' 节点
    if (multiWinnerData && Array.isArray(multiWinnerData)) {
      for (let i = 0; i < multiWinnerData.length; i++) {
        const winnerData = multiWinnerData[i];
        const process = winnerData.data.process;
        if (process && Array.isArray(process)) {
          for (let j = 0; j < process.length; j++) {
            const step = process[j];
            if (step.before && step.after) {
              markCutNodes(step.before, step.after);
            }
          }
        }
      }
    }

    // 返回输出数据
    return {
      success: true,
      data: multiWinnerData,
    };
  } catch (error) {
    // 处理任何意外错误
    let errorMessage = "An unexpected error occurred.";
    if (error instanceof Error) {
      errorMessage = error.message;
    }

    return {
      success: false,
      error_message: errorMessage,
    };
  }
}
