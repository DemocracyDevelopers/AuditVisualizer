import { TreeNode } from "@/components/tree/helper";

type demoType = {
  winnerInfo: {
    id: number;
    name: string;
  };
  data: {
    type: string;
    process: Array<{
      step: number;
      trees?: TreeNode | null;
      assertion?: string;
      before?: TreeNode | null;
      after?: TreeNode | null;
    }>;
  };
}[];

const demoFromCore: demoType = [
  {
    winnerInfo: {
      id: 0,
      name: "Alice",
    },
    data: {
      type: "step-by-step",
      process: [
        {
          step: 0,
          trees: {
            id: 0,
            name: "Alice",
            children: [
              {
                id: 1,
                name: "Bob",
                children: [
                  {
                    id: 2,
                    name: "Chuan",
                    children: [
                      {
                        id: 3,
                        name: "Diego",
                        children: [],
                      },
                    ],
                  },
                  {
                    id: 3,
                    name: "Diego",
                    children: [
                      {
                        id: 2,
                        name: "Chuan",
                        children: [],
                      },
                    ],
                  },
                ],
              },
              {
                id: 3,
                name: "Diego",
                children: [
                  {
                    id: 1,
                    name: "Bob",
                    children: [
                      {
                        id: 2,
                        name: "Chuan",
                        children: [],
                      },
                    ],
                  },
                  {
                    id: 2,
                    name: "Chuan",
                    children: [
                      {
                        id: 1,
                        name: "Bob",
                        children: [],
                      },
                    ],
                  },
                ],
              },
              {
                id: 2,
                name: "Chuan",
                children: [
                  {
                    id: 1,
                    name: "Bob",
                    children: [
                      {
                        id: 3,
                        name: "Diego",
                        children: [],
                      },
                    ],
                  },
                  {
                    id: 3,
                    name: "Diego",
                    children: [
                      {
                        id: 1,
                        name: "Bob",
                        children: [],
                      },
                    ],
                  },
                ],
              },
            ],
          },
        },
        {
          step: 1,
          assertion: "Chuan beats Bob always",
          before: {
            id: 0,
            name: "Alice",
            children: [
              {
                id: 1,
                name: "Bob",
                children: [
                  {
                    id: 2,
                    name: "Chuan",
                    children: [
                      {
                        id: 3,
                        name: "Diego",
                        children: [],
                      },
                    ],
                  },
                  {
                    id: 3,
                    name: "Diego",
                    children: [
                      {
                        id: 2,
                        name: "Chuan",
                        children: [],
                      },
                    ],
                  },
                ],
              },
              {
                id: 3,
                name: "Diego",
                children: [
                  {
                    id: 1,
                    name: "Bob",
                    children: [
                      {
                        id: 2,
                        name: "Chuan",
                        children: [],
                      },
                    ],
                  },
                  {
                    id: 2,
                    name: "Chuan",
                    children: [
                      {
                        id: 1,
                        name: "Bob",
                        children: [],
                      },
                    ],
                  },
                ],
              },
              {
                id: 2,
                name: "Chuan",
                children: [
                  {
                    id: 1,
                    name: "Bob",
                    children: [
                      {
                        id: 3,
                        name: "Diego",
                        children: [],
                      },
                    ],
                  },
                  {
                    id: 3,
                    name: "Diego",
                    children: [
                      {
                        id: 1,
                        name: "Bob",
                        children: [],
                      },
                    ],
                  },
                ],
              },
            ],
          },
          after: {
            id: 0,
            name: "Alice",
            children: [
              {
                id: 2,
                name: "Chuan",
                children: [
                  {
                    id: 1,
                    name: "Bob",
                    children: [
                      {
                        id: 3,
                        name: "Diego",
                        children: [],
                      },
                    ],
                  },
                  {
                    id: 3,
                    name: "Diego",
                    children: [
                      {
                        id: 1,
                        name: "Bob",
                        children: [],
                      },
                    ],
                  },
                ],
              },
              {
                id: 3,
                name: "Diego",
                children: [
                  {
                    id: 2,
                    name: "Chuan",
                    children: [
                      {
                        id: 1,
                        name: "Bob",
                        children: [],
                      },
                    ],
                  },
                ],
              },
            ],
          },
        },
        {
          step: 2,
          assertion: "Chuan beats Alice if only {Alice,Chuan} remain",
          before: {
            id: 0,
            name: "Alice",
            children: [
              {
                id: 2,
                name: "Chuan",
                children: [
                  {
                    id: 1,
                    name: "Bob",
                    children: [
                      {
                        id: 3,
                        name: "Diego",
                        children: [],
                      },
                    ],
                  },
                  {
                    id: 3,
                    name: "Diego",
                    children: [
                      {
                        id: 1,
                        name: "Bob",
                        children: [],
                      },
                    ],
                  },
                ],
              },
              {
                id: 3,
                name: "Diego",
                children: [
                  {
                    id: 2,
                    name: "Chuan",
                    children: [
                      {
                        id: 1,
                        name: "Bob",
                        children: [],
                      },
                    ],
                  },
                ],
              },
            ],
          },

          after: {
            id: 0,
            name: "Alice",
            children: [
              {
                id: 3,
                name: "Diego",
                children: [
                  {
                    id: 2,
                    name: "Chuan",
                    children: [
                      {
                        id: 1,
                        name: "Bob",
                        children: [],
                      },
                    ],
                  },
                ],
              },
            ],
          },
        },
        {
          step: 3,
          assertion: "Chuan beats Diego if only {Alice,Chuan,Diego} remain",
          before: {
            id: 0,
            name: "Alice",
            children: [
              {
                id: 3,
                name: "Diego",
                children: [
                  {
                    id: 2,
                    name: "Chuan",
                    children: [
                      {
                        id: 1,
                        name: "Bob",
                        children: [],
                      },
                    ],
                  },
                ],
              },
            ],
          },
          after: null,
        },
      ],
    },
  },
  {
    winnerInfo: {
      id: 1,
      name: "Bob",
    },
    data: {
      type: "step-by-step",
      process: [
        {
          step: 0,
          trees: {
            id: 1,
            name: "Bob",
            children: [
              {
                id: 0,
                name: "Alice",
                children: [
                  {
                    id: 2,
                    name: "Chuan",
                    children: [
                      {
                        id: 3,
                        name: "Diego",
                        children: [],
                      },
                    ],
                  },
                  {
                    id: 3,
                    name: "Diego",
                    children: [
                      {
                        id: 2,
                        name: "Chuan",
                        children: [],
                      },
                    ],
                  },
                ],
              },
              {
                id: 3,
                name: "Diego",
                children: [
                  {
                    id: 0,
                    name: "Alice",
                    children: [
                      {
                        id: 2,
                        name: "Chuan",
                        children: [],
                      },
                    ],
                  },
                  {
                    id: 2,
                    name: "Chuan",
                    children: [
                      {
                        id: 0,
                        name: "Alice",
                        children: [],
                      },
                    ],
                  },
                ],
              },
              {
                id: 2,
                name: "Chuan",
                children: [
                  {
                    id: 0,
                    name: "Alice",
                    children: [
                      {
                        id: 3,
                        name: "Diego",
                        children: [],
                      },
                    ],
                  },
                  {
                    id: 3,
                    name: "Diego",
                    children: [
                      {
                        id: 0,
                        name: "Alice",
                        children: [],
                      },
                    ],
                  },
                ],
              },
            ],
          },
        },
        {
          step: 1,
          assertion: "Chuan beats Bob always",
          before: {
            id: 1,
            name: "Bob",
            children: [
              {
                id: 0,
                name: "Alice",
                children: [
                  {
                    id: 2,
                    name: "Chuan",
                    children: [
                      {
                        id: 3,
                        name: "Diego",
                        children: [],
                      },
                    ],
                  },
                  {
                    id: 3,
                    name: "Diego",
                    children: [
                      {
                        id: 2,
                        name: "Chuan",
                        children: [],
                      },
                    ],
                  },
                ],
              },
              {
                id: 3,
                name: "Diego",
                children: [
                  {
                    id: 0,
                    name: "Alice",
                    children: [
                      {
                        id: 2,
                        name: "Chuan",
                        children: [],
                      },
                    ],
                  },
                  {
                    id: 2,
                    name: "Chuan",
                    children: [
                      {
                        id: 0,
                        name: "Alice",
                        children: [],
                      },
                    ],
                  },
                ],
              },
              {
                id: 2,
                name: "Chuan",
                children: [
                  {
                    id: 0,
                    name: "Alice",
                    children: [
                      {
                        id: 3,
                        name: "Diego",
                        children: [],
                      },
                    ],
                  },
                  {
                    id: 3,
                    name: "Diego",
                    children: [
                      {
                        id: 0,
                        name: "Alice",
                        children: [],
                      },
                    ],
                  },
                ],
              },
            ],
          },

          after: null,
        },
      ],
    },
  },
  {
    winnerInfo: {
      id: 2,
      name: "Chuan",
    },
    data: {
      type: "step-by-step",
      process: [
        {
          step: 0,
          trees: {
            id: 2,
            name: "Chuan",
            children: [
              {
                id: 0,
                name: "Alice",
                children: [
                  {
                    id: 1,
                    name: "Bob",
                    children: [
                      {
                        id: 3,
                        name: "Diego",
                        children: [],
                      },
                    ],
                  },
                  {
                    id: 3,
                    name: "Diego",
                    children: [
                      {
                        id: 1,
                        name: "Bob",
                        children: [],
                      },
                    ],
                  },
                ],
              },
              {
                id: 3,
                name: "Diego",
                children: [
                  {
                    id: 0,
                    name: "Alice",
                    children: [
                      {
                        id: 1,
                        name: "Bob",
                        children: [],
                      },
                    ],
                  },
                  {
                    id: 1,
                    name: "Bob",
                    children: [
                      {
                        id: 0,
                        name: "Alice",
                        children: [],
                      },
                    ],
                  },
                ],
              },
              {
                id: 1,
                name: "Bob",
                children: [
                  {
                    id: 0,
                    name: "Alice",
                    children: [
                      {
                        id: 3,
                        name: "Diego",
                        children: [],
                      },
                    ],
                  },
                  {
                    id: 3,
                    name: "Diego",
                    children: [
                      {
                        id: 0,
                        name: "Alice",
                        children: [],
                      },
                    ],
                  },
                ],
              },
            ],
          },
        },
        {
          step: 1,
          assertion: "Chuan beats Bob always",
          before: {
            id: 2,
            name: "Chuan",
            children: [
              {
                id: 0,
                name: "Alice",
                children: [
                  {
                    id: 1,
                    name: "Bob",
                    children: [
                      {
                        id: 3,
                        name: "Diego",
                        children: [],
                      },
                    ],
                  },
                  {
                    id: 3,
                    name: "Diego",
                    children: [
                      {
                        id: 1,
                        name: "Bob",
                        children: [],
                      },
                    ],
                  },
                ],
              },
              {
                id: 3,
                name: "Diego",
                children: [
                  {
                    id: 0,
                    name: "Alice",
                    children: [
                      {
                        id: 1,
                        name: "Bob",
                        children: [],
                      },
                    ],
                  },
                  {
                    id: 1,
                    name: "Bob",
                    children: [
                      {
                        id: 0,
                        name: "Alice",
                        children: [],
                      },
                    ],
                  },
                ],
              },
              {
                id: 1,
                name: "Bob",
                children: [
                  {
                    id: 0,
                    name: "Alice",
                    children: [
                      {
                        id: 3,
                        name: "Diego",
                        children: [],
                      },
                    ],
                  },
                  {
                    id: 3,
                    name: "Diego",
                    children: [
                      {
                        id: 0,
                        name: "Alice",
                        children: [],
                      },
                    ],
                  },
                ],
              },
            ],
          },
          after: {
            id: 2,
            name: "Chuan",
            children: [
              {
                id: 0,
                name: "Alice",
                children: [
                  {
                    id: 1,
                    name: "Bob",
                    children: [
                      {
                        id: 3,
                        name: "Diego",
                        children: [],
                      },
                    ],
                  },
                  {
                    id: 3,
                    name: "Diego",
                    children: [
                      {
                        id: 1,
                        name: "Bob",
                        children: [],
                      },
                    ],
                  },
                ],
              },
              {
                id: 3,
                name: "Diego",
                children: [
                  {
                    id: 0,
                    name: "Alice",
                    children: [
                      {
                        id: 1,
                        name: "Bob",
                        children: [],
                      },
                    ],
                  },
                  {
                    id: 1,
                    name: "Bob",
                    children: [
                      {
                        id: 0,
                        name: "Alice",
                        children: [],
                      },
                    ],
                  },
                ],
              },
              {
                id: 1,
                name: "Bob",
                children: [
                  {
                    id: 0,
                    name: "Alice",
                    children: [
                      {
                        id: 3,
                        name: "Diego",
                        children: [],
                      },
                    ],
                  },
                  {
                    id: 3,
                    name: "Diego",
                    children: [
                      {
                        id: 0,
                        name: "Alice",
                        children: [],
                      },
                    ],
                  },
                ],
              },
            ],
          },
        },
        {
          step: 2,
          assertion: "Chuan beats Alice if only {Alice,Chuan} remain",
          before: {
            id: 2,
            name: "Chuan",
            children: [
              {
                id: 0,
                name: "Alice",
                children: [
                  {
                    id: 1,
                    name: "Bob",
                    children: [
                      {
                        id: 3,
                        name: "Diego",
                        children: [],
                      },
                    ],
                  },
                  {
                    id: 3,
                    name: "Diego",
                    children: [
                      {
                        id: 1,
                        name: "Bob",
                        children: [],
                      },
                    ],
                  },
                ],
              },
              {
                id: 3,
                name: "Diego",
                children: [
                  {
                    id: 0,
                    name: "Alice",
                    children: [
                      {
                        id: 1,
                        name: "Bob",
                        children: [],
                      },
                    ],
                  },
                  {
                    id: 1,
                    name: "Bob",
                    children: [
                      {
                        id: 0,
                        name: "Alice",
                        children: [],
                      },
                    ],
                  },
                ],
              },
              {
                id: 1,
                name: "Bob",
                children: [
                  {
                    id: 0,
                    name: "Alice",
                    children: [
                      {
                        id: 3,
                        name: "Diego",
                        children: [],
                      },
                    ],
                  },
                  {
                    id: 3,
                    name: "Diego",
                    children: [
                      {
                        id: 0,
                        name: "Alice",
                        children: [],
                      },
                    ],
                  },
                ],
              },
            ],
          },
          after: {
            id: 2,
            name: "Chuan",
            children: [
              {
                id: 0,
                name: "Alice",
                children: [
                  {
                    id: 1,
                    name: "Bob",
                    children: [
                      {
                        id: 3,
                        name: "Diego",
                        children: [],
                      },
                    ],
                  },
                  {
                    id: 3,
                    name: "Diego",
                    children: [
                      {
                        id: 1,
                        name: "Bob",
                        children: [],
                      },
                    ],
                  },
                ],
              },
              {
                id: 3,
                name: "Diego",
                children: [
                  {
                    id: 0,
                    name: "Alice",
                    children: [
                      {
                        id: 1,
                        name: "Bob",
                        children: [],
                      },
                    ],
                  },
                  {
                    id: 1,
                    name: "Bob",
                    children: [
                      {
                        id: 0,
                        name: "Alice",
                        children: [],
                      },
                    ],
                  },
                ],
              },
              {
                id: 1,
                name: "Bob",
                children: [
                  {
                    id: 0,
                    name: "Alice",
                    children: [
                      {
                        id: 3,
                        name: "Diego",
                        children: [],
                      },
                    ],
                  },
                  {
                    id: 3,
                    name: "Diego",
                    children: [
                      {
                        id: 0,
                        name: "Alice",
                        children: [],
                      },
                    ],
                  },
                ],
              },
            ],
          },
        },
        {
          step: 3,
          assertion: "Chuan beats Diego if only {Alice,Chuan,Diego} remain",
          before: {
            id: 2,
            name: "Chuan",
            children: [
              {
                id: 0,
                name: "Alice",
                children: [
                  {
                    id: 1,
                    name: "Bob",
                    children: [
                      {
                        id: 3,
                        name: "Diego",
                        children: [],
                      },
                    ],
                  },
                  {
                    id: 3,
                    name: "Diego",
                    children: [
                      {
                        id: 1,
                        name: "Bob",
                        children: [],
                      },
                    ],
                  },
                ],
              },
              {
                id: 3,
                name: "Diego",
                children: [
                  {
                    id: 0,
                    name: "Alice",
                    children: [
                      {
                        id: 1,
                        name: "Bob",
                        children: [],
                      },
                    ],
                  },
                  {
                    id: 1,
                    name: "Bob",
                    children: [
                      {
                        id: 0,
                        name: "Alice",
                        children: [],
                      },
                    ],
                  },
                ],
              },
              {
                id: 1,
                name: "Bob",
                children: [
                  {
                    id: 0,
                    name: "Alice",
                    children: [
                      {
                        id: 3,
                        name: "Diego",
                        children: [],
                      },
                    ],
                  },
                  {
                    id: 3,
                    name: "Diego",
                    children: [
                      {
                        id: 0,
                        name: "Alice",
                        children: [],
                      },
                    ],
                  },
                ],
              },
            ],
          },
          after: {
            id: 2,
            name: "Chuan",
            children: [
              {
                id: 0,
                name: "Alice",
                children: [
                  {
                    id: 1,
                    name: "Bob",
                    children: [
                      {
                        id: 3,
                        name: "Diego",
                        children: [],
                      },
                    ],
                  },
                  {
                    id: 3,
                    name: "Diego",
                    children: [
                      {
                        id: 1,
                        name: "Bob",
                        children: [],
                      },
                    ],
                  },
                ],
              },
              {
                id: 3,
                name: "Diego",
                children: [
                  {
                    id: 0,
                    name: "Alice",
                    children: [
                      {
                        id: 1,
                        name: "Bob",
                        children: [],
                      },
                    ],
                  },
                  {
                    id: 1,
                    name: "Bob",
                    children: [
                      {
                        id: 0,
                        name: "Alice",
                        children: [],
                      },
                    ],
                  },
                ],
              },
              {
                id: 1,
                name: "Bob",
                children: [
                  {
                    id: 0,
                    name: "Alice",
                    children: [
                      {
                        id: 3,
                        name: "Diego",
                        children: [],
                      },
                    ],
                  },
                  {
                    id: 3,
                    name: "Diego",
                    children: [
                      {
                        id: 0,
                        name: "Alice",
                        children: [],
                      },
                    ],
                  },
                ],
              },
            ],
          },
        },
        {
          step: 4,
          assertion: "Alice beats Diego if only {Alice,Chuan,Diego} remain",
          before: {
            id: 2,
            name: "Chuan",
            children: [
              {
                id: 0,
                name: "Alice",
                children: [
                  {
                    id: 1,
                    name: "Bob",
                    children: [
                      {
                        id: 3,
                        name: "Diego",
                        children: [],
                      },
                    ],
                  },
                  {
                    id: 3,
                    name: "Diego",
                    children: [
                      {
                        id: 1,
                        name: "Bob",
                        children: [],
                      },
                    ],
                  },
                ],
              },
              {
                id: 3,
                name: "Diego",
                children: [
                  {
                    id: 0,
                    name: "Alice",
                    children: [
                      {
                        id: 1,
                        name: "Bob",
                        children: [],
                      },
                    ],
                  },
                  {
                    id: 1,
                    name: "Bob",
                    children: [
                      {
                        id: 0,
                        name: "Alice",
                        children: [],
                      },
                    ],
                  },
                ],
              },
              {
                id: 1,
                name: "Bob",
                children: [
                  {
                    id: 0,
                    name: "Alice",
                    children: [
                      {
                        id: 3,
                        name: "Diego",
                        children: [],
                      },
                    ],
                  },
                  {
                    id: 3,
                    name: "Diego",
                    children: [
                      {
                        id: 0,
                        name: "Alice",
                        children: [],
                      },
                    ],
                  },
                ],
              },
            ],
          },
          after: {
            id: 2,
            name: "Chuan",
            children: [
              {
                id: 0,
                name: "Alice",
                children: [
                  {
                    id: 1,
                    name: "Bob",
                    children: [
                      {
                        id: 3,
                        name: "Diego",
                        children: [],
                      },
                    ],
                  },
                  {
                    id: 3,
                    name: "Diego",
                    children: [
                      {
                        id: 1,
                        name: "Bob",
                        children: [],
                      },
                    ],
                  },
                ],
              },
              {
                id: 1,
                name: "Bob",
                children: [
                  {
                    id: 0,
                    name: "Alice",
                    children: [
                      {
                        id: 3,
                        name: "Diego",
                        children: [],
                      },
                    ],
                  },
                  {
                    id: 3,
                    name: "Diego",
                    children: [
                      {
                        id: 0,
                        name: "Alice",
                        children: [],
                      },
                    ],
                  },
                ],
              },
              {
                id: 3,
                name: "Diego",
                children: [
                  {
                    id: 1,
                    name: "Bob",
                    children: [
                      {
                        id: 0,
                        name: "Alice",
                        children: [],
                      },
                    ],
                  },
                ],
              },
            ],
          },
        },
        {
          step: 5,
          assertion: "Alice beats Bob if only {Alice,Bob,Chuan,Diego} remain",
          before: {
            id: 2,
            name: "Chuan",
            children: [
              {
                id: 0,
                name: "Alice",
                children: [
                  {
                    id: 1,
                    name: "Bob",
                    children: [
                      {
                        id: 3,
                        name: "Diego",
                        children: [],
                      },
                    ],
                  },
                  {
                    id: 3,
                    name: "Diego",
                    children: [
                      {
                        id: 1,
                        name: "Bob",
                        children: [],
                      },
                    ],
                  },
                ],
              },
              {
                id: 1,
                name: "Bob",
                children: [
                  {
                    id: 0,
                    name: "Alice",
                    children: [
                      {
                        id: 3,
                        name: "Diego",
                        children: [],
                      },
                    ],
                  },
                  {
                    id: 3,
                    name: "Diego",
                    children: [
                      {
                        id: 0,
                        name: "Alice",
                        children: [],
                      },
                    ],
                  },
                ],
              },
              {
                id: 3,
                name: "Diego",
                children: [
                  {
                    id: 1,
                    name: "Bob",
                    children: [
                      {
                        id: 0,
                        name: "Alice",
                        children: [],
                      },
                    ],
                  },
                ],
              },
            ],
          },
          after: {
            id: 2,
            name: "Chuan",
            children: [
              {
                id: 0,
                name: "Alice",
                children: [
                  {
                    id: 1,
                    name: "Bob",
                    children: [
                      {
                        id: 3,
                        name: "Diego",
                        children: [],
                      },
                    ],
                  },
                  {
                    id: 3,
                    name: "Diego",
                    children: [
                      {
                        id: 1,
                        name: "Bob",
                        children: [],
                      },
                    ],
                  },
                ],
              },
              {
                id: 1,
                name: "Bob",
                children: [
                  {
                    id: 0,
                    name: "Alice",
                    children: [
                      {
                        id: 3,
                        name: "Diego",
                        children: [],
                      },
                    ],
                  },
                ],
              },
            ],
          },
        },
      ],
    },
  },
  {
    winnerInfo: {
      id: 3,
      name: "Diego",
    },
    data: {
      type: "step-by-step",
      process: [
        {
          step: 0,
          trees: {
            id: 3,
            name: "Diego",
            children: [
              {
                id: 0,
                name: "Alice",
                children: [
                  {
                    id: 1,
                    name: "Bob",
                    children: [
                      {
                        id: 2,
                        name: "Chuan",
                        children: [],
                      },
                    ],
                  },
                  {
                    id: 2,
                    name: "Chuan",
                    children: [
                      {
                        id: 1,
                        name: "Bob",
                        children: [],
                      },
                    ],
                  },
                ],
              },
              {
                id: 2,
                name: "Chuan",
                children: [
                  {
                    id: 0,
                    name: "Alice",
                    children: [
                      {
                        id: 1,
                        name: "Bob",
                        children: [],
                      },
                    ],
                  },
                  {
                    id: 1,
                    name: "Bob",
                    children: [
                      {
                        id: 0,
                        name: "Alice",
                        children: [],
                      },
                    ],
                  },
                ],
              },
              {
                id: 1,
                name: "Bob",
                children: [
                  {
                    id: 0,
                    name: "Alice",
                    children: [
                      {
                        id: 2,
                        name: "Chuan",
                        children: [],
                      },
                    ],
                  },
                  {
                    id: 2,
                    name: "Chuan",
                    children: [
                      {
                        id: 0,
                        name: "Alice",
                        children: [],
                      },
                    ],
                  },
                ],
              },
            ],
          },
        },
        {
          step: 1,
          assertion: "Chuan beats Bob always",
          before: {
            id: 3,
            name: "Diego",
            children: [
              {
                id: 0,
                name: "Alice",
                children: [
                  {
                    id: 1,
                    name: "Bob",
                    children: [
                      {
                        id: 2,
                        name: "Chuan",
                        children: [],
                      },
                    ],
                  },
                  {
                    id: 2,
                    name: "Chuan",
                    children: [
                      {
                        id: 1,
                        name: "Bob",
                        children: [],
                      },
                    ],
                  },
                ],
              },
              {
                id: 2,
                name: "Chuan",
                children: [
                  {
                    id: 0,
                    name: "Alice",
                    children: [
                      {
                        id: 1,
                        name: "Bob",
                        children: [],
                      },
                    ],
                  },
                  {
                    id: 1,
                    name: "Bob",
                    children: [
                      {
                        id: 0,
                        name: "Alice",
                        children: [],
                      },
                    ],
                  },
                ],
              },
              {
                id: 1,
                name: "Bob",
                children: [
                  {
                    id: 0,
                    name: "Alice",
                    children: [
                      {
                        id: 2,
                        name: "Chuan",
                        children: [],
                      },
                    ],
                  },
                  {
                    id: 2,
                    name: "Chuan",
                    children: [
                      {
                        id: 0,
                        name: "Alice",
                        children: [],
                      },
                    ],
                  },
                ],
              },
            ],
          },
          after: {
            id: 3,
            name: "Diego",
            children: [
              {
                id: 0,
                name: "Alice",
                children: [
                  {
                    id: 2,
                    name: "Chuan",
                    children: [
                      {
                        id: 1,
                        name: "Bob",
                        children: [],
                      },
                    ],
                  },
                ],
              },
              {
                id: 2,
                name: "Chuan",
                children: [
                  {
                    id: 0,
                    name: "Alice",
                    children: [
                      {
                        id: 1,
                        name: "Bob",
                        children: [],
                      },
                    ],
                  },
                  {
                    id: 1,
                    name: "Bob",
                    children: [
                      {
                        id: 0,
                        name: "Alice",
                        children: [],
                      },
                    ],
                  },
                ],
              },
            ],
          },
        },
        {
          step: 2,
          assertion: "Chuan beats Alice if only {Alice,Chuan} remain",
          before: {
            id: 3,
            name: "Diego",
            children: [
              {
                id: 0,
                name: "Alice",
                children: [
                  {
                    id: 2,
                    name: "Chuan",
                    children: [
                      {
                        id: 1,
                        name: "Bob",
                        children: [],
                      },
                    ],
                  },
                ],
              },
              {
                id: 2,
                name: "Chuan",
                children: [
                  {
                    id: 0,
                    name: "Alice",
                    children: [
                      {
                        id: 1,
                        name: "Bob",
                        children: [],
                      },
                    ],
                  },
                  {
                    id: 1,
                    name: "Bob",
                    children: [
                      {
                        id: 0,
                        name: "Alice",
                        children: [],
                      },
                    ],
                  },
                ],
              },
            ],
          },
          after: {
            id: 3,
            name: "Diego",
            children: [
              {
                id: 0,
                name: "Alice",
                children: [
                  {
                    id: 2,
                    name: "Chuan",
                    children: [
                      {
                        id: 1,
                        name: "Bob",
                        children: [],
                      },
                    ],
                  },
                ],
              },
              {
                id: 2,
                name: "Chuan",
                children: [
                  {
                    id: 0,
                    name: "Alice",
                    children: [
                      {
                        id: 1,
                        name: "Bob",
                        children: [],
                      },
                    ],
                  },
                  {
                    id: 1,
                    name: "Bob",
                    children: [
                      {
                        id: 0,
                        name: "Alice",
                        children: [],
                      },
                    ],
                  },
                ],
              },
            ],
          },
        },
        {
          step: 3,
          assertion: "Chuan beats Diego if only {Alice,Chuan,Diego} remain",
          before: {
            id: 3,
            name: "Diego",
            children: [
              {
                id: 0,
                name: "Alice",
                children: [
                  {
                    id: 2,
                    name: "Chuan",
                    children: [
                      {
                        id: 1,
                        name: "Bob",
                        children: [],
                      },
                    ],
                  },
                ],
              },
              {
                id: 2,
                name: "Chuan",
                children: [
                  {
                    id: 0,
                    name: "Alice",
                    children: [
                      {
                        id: 1,
                        name: "Bob",
                        children: [],
                      },
                    ],
                  },
                  {
                    id: 1,
                    name: "Bob",
                    children: [
                      {
                        id: 0,
                        name: "Alice",
                        children: [],
                      },
                    ],
                  },
                ],
              },
            ],
          },
          after: {
            id: 3,
            name: "Diego",
            children: [
              {
                id: 2,
                name: "Chuan",
                children: [
                  {
                    id: 0,
                    name: "Alice",
                    children: [
                      {
                        id: 1,
                        name: "Bob",
                        children: [],
                      },
                    ],
                  },
                  {
                    id: 1,
                    name: "Bob",
                    children: [
                      {
                        id: 0,
                        name: "Alice",
                        children: [],
                      },
                    ],
                  },
                ],
              },
            ],
          },
        },
        {
          step: 4,
          assertion: "Alice beats Diego if only {Alice,Chuan,Diego} remain",
          before: {
            id: 3,
            name: "Diego",
            children: [
              {
                id: 2,
                name: "Chuan",
                children: [
                  {
                    id: 0,
                    name: "Alice",
                    children: [
                      {
                        id: 1,
                        name: "Bob",
                        children: [],
                      },
                    ],
                  },
                  {
                    id: 1,
                    name: "Bob",
                    children: [
                      {
                        id: 0,
                        name: "Alice",
                        children: [],
                      },
                    ],
                  },
                ],
              },
            ],
          },
          after: {
            id: 3,
            name: "Diego",
            children: [
              {
                id: 2,
                name: "Chuan",
                children: [
                  {
                    id: 1,
                    name: "Bob",
                    children: [
                      {
                        id: 0,
                        name: "Alice",
                        children: [],
                      },
                    ],
                  },
                ],
              },
            ],
          },
        },
        {
          step: 5,
          assertion: "Alice beats Bob if only {Alice,Bob,Chuan,Diego} remain",
          before: {
            id: 3,
            name: "Diego",
            children: [
              {
                id: 2,
                name: "Chuan",
                children: [
                  {
                    id: 1,
                    name: "Bob",
                    children: [
                      {
                        id: 0,
                        name: "Alice",
                        children: [],
                      },
                    ],
                  },
                ],
              },
            ],
          },
          after: null,
        },
      ],
    },
  },
];

export { demoFromCore };
