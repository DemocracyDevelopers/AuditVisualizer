import React, { useState } from "react";
import Image from "next/image";
import useMultiWinnerDataStore from "../../../store/multi-winner-data";
import {
  explainAssertions,
  validateInputData,
} from "../../explain-assertions/components/explain-process";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useFileDataStore } from "@/store/fileData";

type SampleFile = {
  name: string;
  description: string;
  imageUrl: string;
  fileUrl: string;
};

const sampleFiles: SampleFile[] = [
  {
    name: "NEB Assertion",
    description: "NEB assertions example",
    imageUrl: "/sample-images/img.png",
    fileUrl: "/sample-jsons/a_guide_to_RAIRE_eg_NEB_assertions.json",
  },
  {
    name: "One candidate dominates example",
    description: "One candidate dominates example",
    imageUrl: "/sample-images/img-removebg.png",
    fileUrl: "/sample-jsons/a_guide_to_RAIRE_eg_one_candidate_dominates.json",
  },
  {
    name: "Two leading candidates example",
    description: "Two leading candidates example ",
    imageUrl: "/sample-images/img-removebg.png",
    fileUrl: "/sample-jsons/a_guide_to_RAIRE_eg_two_leading_candidates.json",
  },
];

const SampleSelector = () => {
  const {
    setCandidateList,
    setAssertionList,
    setWinnerInfo,
    clearAssertionList,
    clearCandidateList,
    clearMultiWinner,
    clearWinnerInfo,
  } = useMultiWinnerDataStore();

  const router = useRouter();
  const [isConfirming, setIsConfirming] = useState(false);
  const [selectedSample, setSelectedSample] = useState<SampleFile | null>(null);

  const handleSampleClick = async (sample: SampleFile) => {
    try {
      setSelectedSample(sample);
      clearMultiWinner();
      clearCandidateList();
      clearAssertionList();
      clearWinnerInfo();

      const response = await fetch(sample.fileUrl);
      if (!response.ok) {
        throw new Error("Failed to fetch the sample file");
      }

      const blob = await response.blob();
      const reader = new FileReader();

      reader.onload = (e) => {
        const result = e.target?.result;

        if (typeof result === "string") {
          useFileDataStore.setState({ fileData: result });
          const response = validateInputData(result);
          console.log("response", response);
          if (response.success) {
            const jsonData = JSON.parse(result);
            const candidateList = jsonData.metadata.candidates.map(
              (name: string, index: number) => ({
                id: index,
                name: name,
              }),
            );

            setCandidateList(candidateList);

            const candidateMap = candidateList.reduce(
              (
                acc: { [key: number]: string },
                candidate: { id: number; name: string; color: string },
              ) => {
                acc[candidate.id] = candidate.name;
                return acc;
              },
              {} as { [key: number]: string },
            );

            const assertions = jsonData.solution.Ok.assertions;

            const assertionList = assertions.map(
              (
                assertionObj: {
                  assertion: {
                    type: string;
                    winner: number;
                    loser: number;
                    continuing: number[];
                  };
                  difficulty: number;
                  margin: number;
                },
                index: number,
              ) => {
                const { assertion, difficulty, margin } = assertionObj;
                const { type, winner, loser, continuing } = assertion;

                const winnerName = candidateMap[winner];
                const loserName = candidateMap[loser];

                let content = "";
                if (type === "NEN") {
                  const continuingNames = continuing
                    .map((id) => candidateMap[id])
                    .join(", ");
                  content = `${winnerName} > ${loserName} if only {${continuingNames}} remain`;
                } else if (type === "NEB") {
                  content = `${winnerName} NEB ${loserName}`;
                }

                return {
                  index: index + 1,
                  winner: winner,
                  content,
                  type,
                  difficulty,
                  margin,
                };
              },
            );
            setAssertionList(assertionList);

            const winnerId = jsonData.solution.Ok.winner;
            const winnerName = jsonData.metadata.candidates[winnerId];
            setWinnerInfo({ id: winnerId, name: winnerName });
          } else {
            console.error("Error:", response);
          }
        }
      };

      reader.readAsText(blob);
    } catch (error) {
      console.error("Error fetching or processing the sample file:", error);
    }
  };

  const handleProceedToDashboard = () => {
    setIsConfirming(true); // Start loading
    setTimeout(() => {
      setIsConfirming(false);
      router.push("/dashboard");
    }, 2000); // 2-second delay before redirecting
  };
  return (
    <div>
      <h2 className="text-2xl font-bold mb-2">Choose a sample file</h2>
      <p className="text-sm text-gray-500 mb-6">
        Click on the example assertion name
      </p>

      {/* Image section with sample examples */}
      <div className="border-2 border-gray-300 p-8 rounded-lg grid grid-cols-3 gap-8">
        {sampleFiles.map((sample) => (
          <div
            key={sample.name}
            className="cursor-pointer text-center"
            onClick={() => handleSampleClick(sample)}
          >
            <h3 className="text-lg mb-2 text-center">{sample.name}</h3>
            <div className="flex justify-center">
              <Image
                src={sample.imageUrl}
                alt={sample.name}
                width={200}
                height={120}
                className="rounded"
              />
            </div>
          </div>
        ))}
      </div>

      {/* Modal to show selected sample info */}
      {selectedSample && (
        <Dialog
          open={!!selectedSample}
          onOpenChange={() => setSelectedSample(null)}
        >
          <DialogTrigger />
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Confirm Selection</DialogTitle>
              <DialogDescription>
                You selected <b>{selectedSample?.name}</b>. Would you like to
                proceed?
              </DialogDescription>
            </DialogHeader>
            <div className="flex justify-end space-x-4 mt-4">
              <Button
                variant="secondary"
                onClick={() => setSelectedSample(null)}
              >
                Cancel
              </Button>
              <Button
                onClick={handleProceedToDashboard}
                disabled={isConfirming}
              >
                {isConfirming ? (
                  <span className="flex items-center">
                    <span className="loader mr-2" />
                    Proceeding...
                  </span>
                ) : (
                  "Confirm"
                )}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default SampleSelector;
