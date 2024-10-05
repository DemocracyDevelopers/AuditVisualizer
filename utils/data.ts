import { ApiResponse } from "@/app/dashboard/page";

export const mockData: ApiResponse = {
  resultDetails: {
    winner: {
      id: 1,
      name: "Alice",
    },
    candidateNum: 3,
    assertionNum: 2,
    candidates: [
      { id: 1, name: "Alice" },
      { id: 2, name: "Bob" },
      { id: 3, name: "Charlie" },
    ],
  },
  assertions: [
    {
      index: 1,
      name: "Alice",
      content: "Alice secured the highest votes by a significant margin.",
      type: "Majority",
      difficulty: 5,
      margin: 15,
    },
    {
      index: 2,
      name: "Alice",
      content: "Alice's campaign strategy was highly effective.",
      type: "Strategy",
      difficulty: 3,
      margin: 10,
    },
  ],
};
