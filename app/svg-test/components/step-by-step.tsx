const stepsNum = 5;

function StepByStep() {
  return (
    <div className="relative flex flex-col">
      <div
        className="absolute h-full w-0.5 bg-[#bfbfbf] left-1/2 transform -translate-x-1/2 z-0"
        style={{ top: "20px", height: `${(stepsNum - 1) * 50}px` }}
      />
      {Array.from({ length: stepsNum }, (_, index) => (
        <div
          key={index}
          className="rounded-full bg-[#b3b3b3] w-10 h-10 text-center leading-10 mb-2 cursor-pointer z-10 font-bold"
        >
          {index + 1}
        </div>
      ))}
    </div>
  );
}

export default StepByStep;
