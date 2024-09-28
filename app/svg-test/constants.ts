// const testData = {
//   name: "Root",
//   children: [
//     {
//       name: "Child 1",
//       children: [
//         {
//           name: "Grandchild 1.1",
//         },
//         {
//           name: "Grandchild 1.2",
//         },
//       ],
//     },
//     {
//       name: "Child 2",
//       children: [
//         {
//           name: "Grandchild 2.1",
//           children: [
//             {
//               name: "Great-Grandchild 2.1.1",
//             },
//           ],
//         },
//       ],
//     },
//   ],
// };
const testData = {
  name: "Alice",
  children: [
    {
      name: "Bob",
    },
    {
      name: "Chuan",
      children: [
        {
          name: "Diego",
        },
      ],
    },
  ],
};

const dataOneTree = {
  id: 1, // winnerId
  name: "Alice",
  children: [
    {
      id: 2,
      name: "Bob",
    },
    {
      id: 3,
      name: "Chuan",
      children: [
        {
          id: 4,
          name: "Diego",
        },
      ],
    },
  ],
};
const dataOneTree2 =
  // name: "root",
  // children: [
  {
    name: "Alice",
    children: [
      {
        name: "Bob",
        children: [
          {
            name: "Chuan",
            children: [
              {
                name: "Diego",
              },
            ],
          },
          {
            name: "Diego",
            children: [
              {
                name: "Chuan",
              },
            ],
          },
        ],
      },
      {
        name: "Chuan",
        children: [
          {
            name: "Bob",
            children: [
              {
                name: "Diego",
              },
            ],
          },
          {
            name: "Diego",
            children: [
              {
                name: "Bob",
              },
            ],
          },
        ],
      },
      {
        name: "Diego",
        children: [
          {
            name: "Bob",
            children: [
              {
                name: "Chuan",
              },
            ],
          },
          {
            name: "Chuan",
            children: [
              {
                name: "Bob",
              },
            ],
          },
        ],
      },
    ],
  };

// step by step
const dataStepByStep = {
  type: "step-by-step",
  process: [
    {
      step: 0, // initial state
      trees: [
        // oneTree * 4
        // 多个类似oneTree的结构放在这
        dataOneTree,
        // dataTreeTwo,
      ],
    },
    {
      step: 1,
      assertion: "", // 目前就采用纯文本的方式吧,后续如果有更多要求这个可能会变成一个object
      // Chuan beats Alice if only {Alice,Chuan} remain
      before: [
        // assertion应用之前
        // oneTree * 4
        // 多个类似oneTree的结构放在这
        dataOneTree,
      ],
      after: [
        // assertion应用之后
        // oneTree * 4
        // 多个类似oneTree的结构放在这
        dataOneTree,
      ],
    },
    {
      step: 2,
      assertion: "", // 目前就采用纯文本的方式吧,后续如果有更多要求这个可能会变成一个object
      // Chuan beats Alice if only {Alice,Chuan} remain
      before: [
        // assertion应用之前
        // oneTree * 4
        // 多个类似oneTree的结构放在这
        dataOneTree,
      ],
      after: [
        // assertion应用之后
        // oneTree * 4
        // 多个类似oneTree的结构放在这
        dataOneTree,
      ],
    },
  ],
};

// multi-winner
const dataMultiWinner = [
  {
    winnerInfo: {
      // 这里要存一份,方便切换
      id: 2, // winnerId
      name: "xxx",
    },
    data: {
      // stepByStep
    },
  },
  {
    winnerInfo: {
      // 这里要存一份,方便切换
      id: 2, // winnerId
      name: "xxx",
    },
    data: {
      // stepByStep
    },
  },
];

type Candidate = {
  id: number;
  name: string;
  avatar: string;
};
const candidateList: Candidate[] = [
  {
    id: 1,
    name: "Alice",
    avatar: "",
  },
  {
    id: 2,
    name: "Bob",
    avatar: "",
  },
  {
    id: 3,
    name: "Chuan",
    avatar: "",
  },
  {
    id: 4,
    name: "Diego",
    avatar: "",
  },
];

export type { Candidate };

export {
  testData,
  dataOneTree,
  dataStepByStep,
  dataMultiWinner,
  dataOneTree2,
  candidateList,
};
