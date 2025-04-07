// import {
//   Tooltip,
//   TooltipContent,
//   TooltipProvider,
// } from "@/components/ui/tooltip";
// import { Crown } from "lucide-react";
// import { Candidate } from "./constants";
// import SearchDropdown from "./search-dropdown";
// import { TooltipTrigger } from "@radix-ui/react-tooltip";
// import { useEffect, useRef } from "react";
// import useMultiWinnerDataStore from "@/store/multi-winner-data";
// import { getSmartDisplayName } from "@/components/ui/avatar"; // 或 "@/lib/name-utils"，看你放哪
//
// type CandidateListBarProps = {
//   selectedWinnerId: number | null;
//   handleSelectWinner: (id: number) => void;
//   useAvatar: boolean;
//   candidateList: Candidate[];
// };
//
// function CandidateListBar({
//   selectedWinnerId,
//   handleSelectWinner,
//   // useAvatar,
//   candidateList,
// }: CandidateListBarProps) {
//   const { winnerInfo } = useMultiWinnerDataStore();
//   const scrollContainerRef = useRef<HTMLDivElement | null>(null); // Ref for the scroll container
//   useEffect(() => {
//     const el = scrollContainerRef.current;
//     if (!el) return;
//     const handleWheel = (e: WheelEvent) => {
//       e.preventDefault();
//       el.scrollLeft += e.deltaX;
//     };
//     el.addEventListener("wheel", handleWheel, { passive: false });
//     return () => {
//       el.removeEventListener("wheel", handleWheel);
//     };
//   }, []);
//
//   const handleCandidateSelect = (candidateId: number) => {
//     // setSelectedCandidateId(candidateId);
//     handleSelectWinner(candidateId); // Call to display the tree or other action
//   };
//   return (
//     <div className="flex justify-center mb-5 gap-10">
//       <div
//         className="flex gap-2 rounded-md w-[220px] px-2 overflow-x-scroll" // so the space can show the 4 candidates
//         ref={scrollContainerRef}
//       >
//         {candidateList.map((candidate) => {
//           const { shortName, explanation } = getSmartDisplayName(candidate.id, candidateList);
//
//           return (
//               <div
//                   key={candidate.id}
//                   className="flex flex-col items-center w-12 flex-shrink-0"
//               >
//                 <div className="h-5 mb-1 flex items-center justify-center">
//                   {winnerInfo?.id === candidate.id ? (
//                       <Crown className="text-yellow-500 h-5 w-5" />
//                   ) : (
//                       <div className="h-5 w-5 opacity-0" />
//                   )}
//                 </div>
//                 <TooltipProvider>
//                   <Tooltip>
//                     <TooltipTrigger
//                         onClick={() => handleCandidateSelect(candidate.id)}
//                         className={`leading-9 w-10 h-10 rounded-full cursor-pointer text-center border-2 text-xs overflow-hidden whitespace-nowrap text-ellipsis ${
//                             selectedWinnerId === candidate.id
//                                 ? "border-blue-500"
//                                 : "border-black"
//                         }`}
//                     >
//                       {shortName}
//                     </TooltipTrigger>
//                     <TooltipContent>{explanation || candidate.name}</TooltipContent>
//                   </Tooltip>
//                 </TooltipProvider>
//               </div>
//           );
//         })}
//
//         {/*{candidateList.map((candidate) => (*/}
//         {/*  <div*/}
//         {/*    key={candidate.id}*/}
//         {/*    className="flex flex-col items-center w-12 flex-shrink-0"*/}
//         {/*  >*/}
//         {/*    <div className="h-5 mb-1 flex items-center justify-center">*/}
//         {/*      {winnerInfo?.id === candidate.id ? (*/}
//         {/*        <Crown className="text-yellow-500 h-5 w-5" />*/}
//         {/*      ) : (*/}
//         {/*        <div className="h-5 w-5 opacity-0" />*/}
//         {/*      )}*/}
//         {/*    </div>*/}
//         {/*    <TooltipProvider>*/}
//         {/*      <Tooltip>*/}
//         {/*        /!*<TooltipTrigger*!/*/}
//         {/*        /!*  onClick={() => handleSelectWinner(candidate.id)}*!/*/}
//         {/*        /!*  className="leading-9 w-10 h-10 rounded-full cursor-pointer text-center border-2 border-black text-xs overflow-hidden whitespace-nowrap text-ellipsis"*!/*/}
//         {/*        /!*>*!/*/}
//         {/*        /!*  {candidate.name}*!/*/}
//         {/*        /!*</TooltipTrigger>*!/*/}
//
//         {/*        <TooltipTrigger*/}
//         {/*          onClick={() => handleCandidateSelect(candidate.id)}*/}
//         {/*          className={`leading-9 w-10 h-10 rounded-full cursor-pointer text-center border-2 text-xs overflow-hidden whitespace-nowrap text-ellipsis ${*/}
//         {/*            selectedWinnerId === candidate.id*/}
//         {/*              ? "border-blue-500" // Outer blue circle when selected*/}
//         {/*              : "border-black"*/}
//         {/*          }`}*/}
//         {/*        >*/}
//         {/*          {candidate.name}*/}
//         {/*        </TooltipTrigger>*/}
//         {/*        <TooltipContent>{candidate.name}</TooltipContent>*/}
//         {/*      </Tooltip>*/}
//         {/*    </TooltipProvider>*/}
//         {/*  </div>*/}
//         {/*))}*/}
//       </div>
//       {/*<SearchDropdown candidateList={candidateList} />*/}
//       <SearchDropdown
//         candidateList={candidateList}
//         onSelect={handleCandidateSelect}
//       />
//     </div>
//   );
// }
//
// export default CandidateListBar;
"use client";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
} from "@/components/ui/tooltip";
import { TooltipTrigger } from "@radix-ui/react-tooltip";
import { Crown } from "lucide-react";
import { Candidate } from "./constants";
import SearchDropdown from "./search-dropdown";
import { useEffect, useRef } from "react";
import useMultiWinnerDataStore from "@/store/multi-winner-data";
import { getSmartDisplayName } from "@/components/ui/avatar";

type CandidateListBarProps = {
  selectedWinnerId: number | null;
  handleSelectWinner: (id: number) => void;
  useAvatar: boolean;
  candidateList: Candidate[];
};

function CandidateListBar({
  selectedWinnerId,
  handleSelectWinner,
  candidateList,
}: CandidateListBarProps) {
  const { winnerInfo } = useMultiWinnerDataStore();
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = scrollContainerRef.current;
    if (!el) return;
    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      el.scrollLeft += e.deltaX;
    };
    el.addEventListener("wheel", handleWheel, { passive: false });
    return () => {
      el.removeEventListener("wheel", handleWheel);
    };
  }, []);

  const handleCandidateSelect = (candidateId: number) => {
    handleSelectWinner(candidateId);
  };

  return (
    <div className="flex justify-center mb-5 gap-10">
      <div
        className="flex gap-2 rounded-md w-[220px] px-2 overflow-x-scroll"
        ref={scrollContainerRef}
      >
        {candidateList.map((candidate) => {
          const { shortName, explanation } = getSmartDisplayName(
            candidate.id,
            candidateList,
          );

          return (
            <div
              key={candidate.id}
              className="flex flex-col items-center w-12 flex-shrink-0"
            >
              <div className="h-5 mb-1 flex items-center justify-center">
                {winnerInfo?.id === candidate.id ? (
                  <Crown className="text-yellow-500 h-5 w-5" />
                ) : (
                  <div className="h-5 w-5 opacity-0" />
                )}
              </div>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger
                    onClick={() => handleCandidateSelect(candidate.id)}
                    className={`flex items-center justify-center rounded-full cursor-pointer 
                                border-2 text-[10px] leading-tight text-center font-bold px-1 
                                w-10 h-10
                                ${selectedWinnerId === candidate.id ? "border-blue-500" : "border-black"}`}
                  >
                    {shortName}
                  </TooltipTrigger>
                  <TooltipContent>
                    {explanation || candidate.name}
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          );
        })}
      </div>

      <SearchDropdown
        candidateList={candidateList}
        onSelect={handleCandidateSelect}
      />
    </div>
  );
}

export default CandidateListBar;
