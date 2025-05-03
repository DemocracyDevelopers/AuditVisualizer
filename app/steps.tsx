export const steps = [
  {
    selector: "[data-tour='first-step']",
    content: () => (
      <div>
        {"We have "}
        <strong className="text-green-600 font-semibold">
          {"Candidate Number, Winner Name and Assertion Number"}
        </strong>
        {" here!"}
      </div>
    ),
  },
  {
    selector: "[data-tour='second-step']",
    content: () => (
      <div>
        {"This is the "}
        <strong className="text-green-600 font-semibold">
          {"Assertions List"}
        </strong>
        {" with "}
        <strong className="text-green-600 font-semibold">
          {"Audit Progress Verification"}
        </strong>
      </div>
    ),
  },
  {
    selector: "[data-tour='third-step']",
    content: () => (
      <div>
        {"Click the "}
        <strong className="text-green-600 font-semibold">
          {"View Details Button"}
        </strong>
        {" to view details in a modal!"}
      </div>
    ),
  },
  {
    selector: "[data-tour='fourth-step']",
    content: () => (
      <div>
        {"This is the "}
        <strong className="text-green-600 font-semibold">
          {"Elimination Tree"}
        </strong>
        {" showing candidate elimination path!"}
      </div>
    ),
  },
  {
    selector: "[data-tour='fifth-step']",
    content: () => (
      <div>
        {"This bar shows all candidates and the "}
        <strong className="text-green-600 font-semibold">
          {"Winner has a Crown"}
        </strong>
        {"! Click a name to highlight and view elimination path."}
      </div>
    ),
  },
  {
    selector: "[data-tour='sixth-step']",
    content: () => (
      <div>
        {"This is the "}
        <strong className="text-green-600 font-semibold">
          {"Step-by-Step Bar"}
        </strong>
        {". Click each step to explore assertions individually."}
      </div>
    ),
  },
  {
    selector: "[data-tour='seventh-step']",
    content: () => (
      <div>
        {"This is the "}
        <strong className="text-green-600 font-semibold">
          {"Elimination Tree"}
        </strong>
        {"!"}
      </div>
    ),
  },
  {
    selector: "[data-tour='ninth-step']",
    content: ({ setCurrentStep, setIsOpen }: any) => (
      <div>
        {"This section displays the currently "}
        <strong className="text-green-600 font-semibold">
          {"Applied Assertion"}
        </strong>
        {
          " at the selected step. You can also revert it to view the tree before the assertion was applied."
        }
        <div className="mt-4 flex space-x-2">
          <button
            onClick={() => setCurrentStep(0)}
            className="px-4 py-2 bg-gray-600 text-white rounded"
          >
            Watch Again
          </button>
          <button
            onClick={() => setIsOpen(false)}
            className="px-4 py-2 bg-blue-600 text-white rounded"
          >
            Explore Now
          </button>
        </div>
      </div>
    ),
  },
];
