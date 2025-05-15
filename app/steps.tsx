import { TourNavButtons } from "@/components/TourNavButtons";
import useTreeTabStore from "@/store/use-tree-tab-store";

export const getSteps = (candidateCount: number) => {
  const excludeStepByStep = candidateCount >= 6;

  const steps = [
    {
      selector: "[data-tour='first-step']",
      content: ({
        setCurrentStep,
      }: {
        setCurrentStep: (step: number) => void;
      }) => (
        <div className="text-black">
          {"We have "}
          <strong className="text-blue-600 font-semibold">
            Candidate Number, Winner Name and Assertion Number
          </strong>
          {" here!"}
          <TourNavButtons next={1} setCurrentStep={setCurrentStep} />
        </div>
      ),
    },
    {
      selector: "[data-tour='second-step']",
      content: ({
        setCurrentStep,
      }: {
        setCurrentStep: (step: number) => void;
      }) => (
        <div className="">
          {"This is the "}
          <strong className="text-blue-600 font-semibold">
            Assertions List
          </strong>
          {" with "}
          <strong className="text-blue-600 font-semibold">
            Audit Progress Verification
          </strong>
          <TourNavButtons back={0} next={2} setCurrentStep={setCurrentStep} />
        </div>
      ),
    },
    {
      selector: "[data-tour='third-step']",
      content: ({
        setCurrentStep,
      }: {
        setCurrentStep: (step: number) => void;
      }) => (
        <div>
          {"Click the "}
          <strong className="text-blue-600 font-semibold">
            View Details Button
          </strong>
          {" to view details in a modal!"}
          <TourNavButtons back={1} next={3} setCurrentStep={setCurrentStep} />
        </div>
      ),
    },
    {
      selector: "[data-tour='tree']",
      content: ({
        setCurrentStep,
      }: {
        setCurrentStep: (step: number) => void;
      }) => (
        <div>
          {"This is where our "}
          <strong className="text-blue-600 font-semibold">
            Elimination Tree
          </strong>
          {" lives."}
          <TourNavButtons back={2} next={4} setCurrentStep={setCurrentStep} />
        </div>
      ),
    },
    {
      selector: "[data-tour='fifth-step']",
      content: ({
        setCurrentStep,
      }: {
        setCurrentStep: (step: number) => void;
      }) => (
        <div>
          {"This bar shows all candidates and the "}
          <strong className="text-blue-600 font-semibold">
            Winner has a Crown
          </strong>
          {
            "! You can click a name to highlight and view elimination path here."
          }
          <TourNavButtons
            back={3}
            next={5}
            nextSwitchTo="default"
            setCurrentStep={setCurrentStep}
          />
        </div>
      ),
    },
    {
      selector: "[data-tour='expand-all-button']",
      content: ({
        setCurrentStep,
      }: {
        setCurrentStep: (step: number) => void;
      }) => (
        <div>
          {"Click "}
          <strong className="text-blue-600 font-semibold">Expand All</strong>
          {" to see the full tree!"}
          <TourNavButtons
            back={4}
            next={6}
            nextSwitchTo="default"
            nextLabel="Simulate Expand All"
            setCurrentStep={setCurrentStep}
          />
        </div>
      ),
    },
    {
      selector: "[data-tour='tree']",
      content: ({
        setCurrentStep,
      }: {
        setCurrentStep: (step: number) => void;
      }) => (
        <div>
          {"In default mode, you’ll see the full elimination tree:"}
          <br />
          <strong className="text-gray-500">Gray branches</strong> are cut by
          assertions (scissors here),{" "}
          <strong className="text-yellow-500">Yellow ones</strong> survive.
          <br />
          {"If someone wins, they’ve got "}
          <strong className="text-blue-600"> at least one yellow path</strong>
          {" reaching the top—no cuts, no doubts!"}
          <TourNavButtons
            back={5}
            next={7}
            backSwitchTo="default"
            nextSwitchTo="step-by-step"
            setCurrentStep={setCurrentStep}
          />
        </div>
      ),
    },
    !excludeStepByStep && {
      selector: "[data-tour='step-by-step-button']",
      content: ({
        setCurrentStep,
      }: {
        setCurrentStep: (step: number) => void;
      }) => (
        <div>
          {"Then, let’s explore the "}
          <strong className="text-blue-600 font-semibold">Step By Step</strong>
          {" mode."}
          <TourNavButtons
            back={6}
            next={8}
            backSwitchTo="default"
            nextSwitchTo="step-by-step"
            setCurrentStep={setCurrentStep}
          />
        </div>
      ),
    },
    !excludeStepByStep && {
      selector: "[data-tour='tree']",
      content: ({
        setCurrentStep,
      }: {
        setCurrentStep: (step: number) => void;
      }) => (
        <div>
          {
            "Step-by-Step mode lets you see how candidates get knocked out, one assertion at a time."
          }
          <TourNavButtons
            back={7}
            next={9}
            backSwitchTo="step-by-step"
            nextSwitchTo="step-by-step"
            setCurrentStep={setCurrentStep}
          />
        </div>
      ),
    },
    !excludeStepByStep && {
      selector: "[data-tour='sixth-step']",
      content: ({
        setCurrentStep,
      }: {
        setCurrentStep: (step: number) => void;
      }) => (
        <div>
          {"This is the "}
          <strong className="text-blue-600 font-semibold">
            Step-by-Step Bar
          </strong>
          {". Click each step to explore assertions individually."}
          <TourNavButtons
            back={8}
            next={10}
            backSwitchTo="step-by-step"
            setCurrentStep={setCurrentStep}
          />
        </div>
      ),
    },
    !excludeStepByStep && {
      selector: "[data-tour='ninth-step']",
      content: ({ setCurrentStep, setIsOpen }: any) => (
        <div>
          {"This section displays the currently "}
          <strong className="text-blue-600 font-semibold">
            Applied Assertion
          </strong>
          {" at the selected step."}
          <TourNavButtons
            back={9}
            next={11}
            backSwitchTo="step-by-step"
            setCurrentStep={setCurrentStep}
          />
        </div>
      ),
    },
    {
      selector: "[data-tour='tree']",
      content: ({ setCurrentStep, setIsOpen }: any) => (
        <div>
          <strong className="text-blue-600 font-semibold">
            Tour complete! Time to explore on your own.
          </strong>
          <div className="mt-4 flex space-x-2">
            <button
              onClick={() => setCurrentStep(0)}
              className="bg-gray-600 text-white px-4 py-2 rounded"
            >
              Watch Again
            </button>
            <button
              onClick={() => setIsOpen(false)}
              className="bg-blue-600 text-white px-4 py-2 rounded"
            >
              Explore Now
            </button>
          </div>
        </div>
      ),
    },
  ];

  return steps.filter(Boolean);
};
