import { Dispatch, SetStateAction } from "react";

type StepByStepProps = {
  stepSize?: number;
  selectedStep: number;
  setSelectedStep: Dispatch<SetStateAction<number>>;
};
function StepByStep({
  stepSize = 5,
  selectedStep,
  setSelectedStep,
}: StepByStepProps) {
  return (
    <div className="relative flex flex-col">
      <div
        className="absolute h-full w-0.5 bg-[#bfbfbf] left-1/2 transform -translate-x-1/2 z-0"
        style={{ top: "20px", height: `${(stepSize - 1) * 50}px` }}
      />
      {Array.from({ length: stepSize }, (_, index) => (
        <div
          key={index}
          onClick={() => setSelectedStep(index + 1)}
          className={`rounded-full w-10 h-10 text-center leading-10 mb-2 cursor-pointer z-10 font-bold ${selectedStep === index + 1 ? "bg-[#18a0fb]" : "bg-[#b3b3b3]"}`}
        >
          {index + 1}
        </div>
      ))}
    </div>
  );
}

export default StepByStep;
