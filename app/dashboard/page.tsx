"use client";
import { FC, useEffect, useState } from "react";
import Card from "./components/card";
import AssertionTable from "./components/assertion-table";
import AssertionsDetailsModal from "./components/assertions-details-modal";
import { FaUserFriends, FaTrophy, FaList } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ChevronRight, FilePenLine } from "lucide-react";
import EliminationTree from "./components/elimination-tree";
import useMultiWinnerDataStore from "@/store/multi-winner-data";
import {
  AssertionInternal,
  verifyWinnerByDP,
} from "@/lib/explain/judge_winner";

import { useTour } from "@reactour/tour";

import { Workflow } from "lucide-react";
import { useSelectFirstNonWinner } from "@/hooks/useSelectFirstNonWinner";

const Dashboard: FC = () => {
  const { candidateList, assertionList, winnerInfo } =
    useMultiWinnerDataStore();

  const { setIsOpen } = useTour();

  const selectFirstNonWinner = useSelectFirstNonWinner();

  const startTour = () => {
    if (setIsOpen) {
      const candidateCount = candidateList.length;
      const judge_select_new_tree = candidateCount >= 6;
      if (judge_select_new_tree) {
        selectFirstNonWinner();
      }
      setIsOpen(true);
    }
  };

  const tour = useTour();

  useEffect(() => {
    const shouldStart = sessionStorage.getItem("startTour");
    if (shouldStart === "true" && tour.setIsOpen) {
      tour.setCurrentStep(0);
      tour.setIsOpen(true);

      const candidateCount = candidateList.length;
      const judge_select_new_tree = candidateCount >= 6;
      if (judge_select_new_tree) {
        setTimeout(() => {
          selectFirstNonWinner();
        }, 100);
      }

      sessionStorage.removeItem("startTour");
    }
  }, [tour]);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const names = candidateList.map((c) => c.name);

  const internalAssertions: AssertionInternal[] = assertionList.map((a) => {
    const high = names[a.winner];
    let low: string;
    let context: string[];

    if (a.type === "NEB") {
      const parts = a.content.split(" NEB ");
      low = parts[1].trim();
      context = [...names];
    } else {
      const beforeIf = a.content.split(" if only")[0];
      low = beforeIf.split(" > ")[1].trim();

      const m = a.content.match(/\{([^}]+)\}/);
      context = m ? m[1].split(",").map((s: string) => s.trim()) : [];
    }

    return { high, low, context };
  });

  const result = winnerInfo
    ? verifyWinnerByDP(internalAssertions, names, winnerInfo.name)
    : null;
  const isValid = result !== null;

  const handleViewDetails = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const assertionsWithNames = assertionList.map((assertion) => ({
    ...assertion,
    name:
      candidateList.find((candidate) => candidate.id === assertion.winner)
        ?.name ?? "Unknown",
  }));

  const candidateNum = candidateList.length;

  const assertionNum = assertionList.length;

  const maxDifficulty = Math.max(...assertionList.map((a) => a.difficulty));
  const minMargin = Math.min(...assertionList.map((a) => a.margin));

  return (
    <div className="p-4">
      <div className="grid grid-cols-12 gap-6">
        <div className="absolute right-10 top-7 col-span-12 flex justify-end gap-4 mb-2 pr-6">
          <Link href="/upload">
            <Button size="sm">
              Change File
              <FilePenLine className="ml-2" size={16} />
            </Button>
          </Link>
          <Button size="sm" onClick={startTour}>
            Tour
            <Workflow className="ml-2" size={16} />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-6 p-6 items-stretch">
        <div className="col-span-12 md:col-span-8 flex flex-col space-y-6">
          <div className="w-full overflow-x-auto" data-tour="first-step">
            <div className="flex flex-nowrap gap-2 md:gap-6 min-w-full pb-2">
              <div className="flex-1 min-w-max">
                <Card
                  title="Candidate"
                  value={candidateNum}
                  icon={<FaUserFriends />}
                />
              </div>
              <div className="flex-1 min-w-max">
                <Card
                  title="Winner"
                  value={winnerInfo ? winnerInfo.name : "Unknown"}
                  icon={<FaTrophy />}
                />
              </div>
              <div className="flex-1 min-w-max">
                <Card
                  title="Assertion"
                  value={assertionNum}
                  icon={<FaList />}
                />
              </div>
            </div>
          </div>

          <div
            data-tour="tree"
            className="flex-1 flex flex-col border border-gray-300 shadow-md rounded-lg p-4"
          >
            <EliminationTree />
          </div>
        </div>

        <div
          data-tour="second-step"
          className="col-span-12 md:col-span-4 flex flex-col border border-gray-300 shadow-md rounded-lg p-6"
        >
          <div className="flex-1 flex flex-col">
            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold text-gray-600">
                  The Assertions
                </h3>
                <div className="text-right" data-tour="third-step">
                  <Button size="sm" onClick={handleViewDetails}>
                    View Details <ChevronRight className="ml-2" size={16} />
                  </Button>
                </div>
              </div>
              <p className="text-sm text-gray-500 mb-4">
                Parse from your uploaded file
              </p>
            </div>

            <div className="flex-1">
              <AssertionTable
                assertions={assertionsWithNames}
                winnerName={winnerInfo ? winnerInfo.name : "Unknown"}
                isValid={isValid}
              />
            </div>
          </div>
        </div>
      </div>
      <AssertionsDetailsModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        assertions={assertionsWithNames}
        maxDifficulty={maxDifficulty}
        minMargin={minMargin}
        candidates={candidateList}
      />
    </div>
  );
};

export default Dashboard;
