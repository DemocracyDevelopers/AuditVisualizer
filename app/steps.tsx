import { TourNavButtons } from "@/components/TourNavButtons";

/**
 * Generates an array of tour steps for the guided walkthrough,
 * customized based on the number of candidates in the election.
 *
 * @param candidateCount - The number of candidates; determines whether Step-by-Step mode is included.
 * @returns Array of step configurations for the Reactour tour.
 */
export const getSteps = (candidateCount: number) => {
  const excludeStepByStep = candidateCount >= 6;

  const Brown = ({ children }: { children: React.ReactNode }) => (
    <span className="text-amber-700">{children}</span>
  );

  // Define the array of tour steps
  const steps = [
    {
      selector: "[data-tour='first-step']",
      content: ({
        setCurrentStep,
      }: {
        setCurrentStep: (step: number) => void;
      }) => (
        <div>
          <Brown>We have </Brown>
          <strong className="text-blue-600 font-semibold">
            Candidate Number, Winner Name and Assertion Number
          </strong>
          <Brown> here!</Brown>
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
        <div>
          <Brown>This is the </Brown>
          <strong className="text-blue-600 font-semibold">
            Assertions List
          </strong>
          <Brown> with </Brown>
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
          <Brown>Click the </Brown>
          <strong className="text-blue-600 font-semibold">
            View Details Button
          </strong>
          <Brown> to view details in a modal!</Brown>
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
          <Brown>This is where our </Brown>
          <strong className="text-blue-600 font-semibold">
            Elimination Tree
          </strong>
          <Brown> lives.</Brown>
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
          <Brown>This bar shows all candidates and the </Brown>
          <strong className="text-blue-600 font-semibold">
            Winner has a Crown
          </strong>
          <Brown>
            ! You can click a name to highlight and view elimination path here.
          </Brown>
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
          <Brown>Click </Brown>
          <strong className="text-blue-600 font-semibold">Expand All</strong>
          <Brown> to see the full tree!</Brown>
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
          <Brown>In default mode, you’ll see the full elimination tree:</Brown>
          <br />
          <strong className="text-gray-500">Gray branches</strong>
          <Brown> are cut by assertions (scissors here), </Brown>
          <strong className="text-yellow-500">Yellow ones</strong>
          <Brown> survive.</Brown>
          <br />
          <Brown>If someone wins, they’ve got </Brown>
          <strong className="text-blue-600"> at least one yellow path</strong>
          <Brown> reaching the top - no cuts, no doubts!</Brown>
          <TourNavButtons
            back={5}
            next={7}
            backSwitchTo="default"
            nextSwitchTo={excludeStepByStep ? "default" : "step-by-step"}
            setCurrentStep={setCurrentStep}
          />
        </div>
      ),
    },

    // Step-by-step mode: only included for elections with fewer than 6 candidates
    !excludeStepByStep && {
      selector: "[data-tour='step-by-step-button']",
      content: ({
        setCurrentStep,
      }: {
        setCurrentStep: (step: number) => void;
      }) => (
        <div>
          <Brown>Then, let’s explore the </Brown>
          <strong className="text-blue-600 font-semibold">Step By Step</strong>
          <Brown> mode.</Brown>
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
          <Brown>
            Step-by-Step mode lets you see how candidates get knocked out, one
            assertion at a time.
          </Brown>
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
          <Brown>This is the </Brown>
          <strong className="text-blue-600 font-semibold">
            Step-by-Step Bar
          </strong>
          <Brown>. Click each step to explore assertions individually.</Brown>
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
          <Brown>This section displays the currently </Brown>
          <strong className="text-blue-600 font-semibold">
            Applied Assertion
          </strong>
          <Brown> at the selected step.</Brown>
          <TourNavButtons
            back={9}
            next={11}
            backSwitchTo="step-by-step"
            setCurrentStep={setCurrentStep}
          />
        </div>
      ),
    },
    // Final step: End of the tour
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
  // Filter out null values (when step-by-step is excluded)
  return steps.filter(Boolean);
};
