export const steps = [
  {
    selector: "[data-tour='first-step']",
    content: () => (
      <div>
        {"This is the "}
        <strong>{"first Step"}</strong>
      </div>
    ),
  },
  {
    selector: "[data-tour='second-step']",
    content: "Here is the assertion table with parsed data",
  },
  {
    selector: "[data-tour='third-step']",
    content: "Click this button to view assertion details in a modal",
  },
  {
    selector: "[data-tour='fourth-step']",
    content: "This is the Elimination Tree showing candidate elimination path",
  },
  {
    selector: "[data-tour='fifth-step']",
    content:
      "This bar shows all candidates. Click a name to highlight and view elimination path.",
  },
  {
    selector: "[data-tour='sixth-step']",
    content:
      "This is a step-by-step bar. Click each step to explore assertions individually.",
  },
  {
    selector: "[data-tour='seventh-step']",
    content: "This is our elimination tree!",
  },
  {
    selector: "[data-tour='ninth-step']",
    content:
      "This section displays the currently applied assertion at the selected step. You can also revert it to view the tree before the assertion was applied.",
  },
];
