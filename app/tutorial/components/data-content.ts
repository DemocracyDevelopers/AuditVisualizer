/**
 * contentData defines the hierarchical structure of tutorial pages.
 * Each item represents a top-level section with an associated route and optional subtopics.
 */
export const contentData = [
  {
    title: "Getting Started",
    path: "/tutorial",
  },
  {
    title: "Introduction: IRV RLAs with RAIRE",
    path: "/tutorial/introduction",
    subItems: ["The Audit Process from Beginning to End"],
  },
  {
    title: "IRV elections and Visualising Outcomes",
    path: "/tutorial/outcomes",
    subItems: ["How IRV Counts Work"],
  },
  {
    title: "Assertions for IRV winners",
    path: "/tutorial/assertion",
    subItems: [
      "Not Eliminated Before (NEB) Assertions",
      "Not Eliminated Next (NEN) Assertions",
      "Simple assertions sometimes work",
      "One candidate dominates",
      "Two leading candidates",
      "Visualising assertions",
    ],
  },
  {
    title: "Risk Limiting Audits",
    path: "/tutorial/risk",
    subItems: [
      "What is an RLA?",
      "Main Steps in Conducting an RLA",
      "Understanding Margin and Difficulty in RLAs",
    ],
  },
  {
    title: "Using assertions to audit IRV outcomes",
    path: "/tutorial/usingassertion",
    subItems: ["NEB Assertions", "NEN Assertions", "Assertion scoring summary"],
  },
  {
    title: "Margin and Difficulty",
    path: "/tutorial/margin",
  },
];
