"use client";
import { useState } from "react"; // added useState
import Card from "./components/card";
import AssertionTable from "./components/assertionTable";
import AssertionsDetailsModal from "./components/AssertionsDetailsModal"; //import new Modal
import { FaUserFriends, FaTrophy, FaList } from "react-icons/fa"; // Example icons
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ChevronRight, FilePenLine } from "lucide-react";

import { mockData } from "@/utils/data";
import EliminationTree from "./components/elimination-tree";

//add an interface of Assertion
interface Assertion {
  // do we need a unique id here?
  index: number;
  name: string; // winner name
  // avatarSrc: string;
  content: string;
  type: string;
  difficulty: number;
  margin: number;
}

interface ResultDetails {
  winner: Candidate;
  candidateNum: number;
  assertionNum: number;
  candidates: Candidate[];
}

interface Candidate {
  id: number;
  name: string;
}

export interface ApiResponse {
  resultDetails: ResultDetails;
  assertions: Assertion[];
}

// const assertionsData: Assertion[] = [
//   {
//     index: 1,
//     name: "Chuan",
//     // avatarSrc: "/path-to-avatar-image/chuan.png",
//     content: "Chuan NEB Diego",
//     type: "NEB",
//     difficulty: 3.375,
//     margin: 4000,
//   },
//   {
//     index: 2,
//     name: "Alice",
//     // avatarSrc: "/path-to-avatar-image/alice.png",
//     content: "Alice > Diego if only {Alice, Bob, Chuan, Diego} remain",
//     type: "NEN",
//     difficulty: 27,
//     margin: 500,
//   },
// we can add new assertions here
//just using for test
//];
const Dashboard: React.FC = () => {
  //mock data test here
  const { resultDetails, assertions } = mockData;
  const { candidates, winner, candidateNum, assertionNum } = resultDetails;
  const assertionsData = assertions;

  // add state to manage the modal
  const [isModalOpen, setIsModalOpen] = useState(false);

  //calculate the max difficulty and min margin
  const maxDifficulty = Math.max(...assertionsData.map((a) => a.difficulty));
  const minMargin = Math.min(...assertionsData.map((a) => a.margin));

  const handleViewDetails = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="p-4">
      <div className="flex justify-end mb-4 mt-[-20px] pr-6">
        <Link href="/upload">
          <Button size="sm">
            Change File
            <FilePenLine className="ml-2" size={16} />
          </Button>
        </Link>
      </div>
      <div className="grid grid-cols-12 gap-6 p-6">
        {/* Left Side: Cards and Elimination Tree */}
        <div className="col-span-8 space-y-6">
          <div className="grid grid-cols-3 gap-6">
            <Card
              title="Candidate"
              value={candidateNum}
              icon={<FaUserFriends />}
            />
            <Card title="Winner" value={winner.name} icon={<FaTrophy />} />
            <Card title="Assertion" value={assertionNum} icon={<FaList />} />
          </div>

          {/* Elimination Tree section */}
          <EliminationTree />
        </div>

        {/* Right Side：Assertion Table */}
        <div className="border border-gray-300 col-span-12 md:col-span-4 shadow-md rounded-lg p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold text-gray-600">The Assertions</h3>
            <div className="text-right">
              <Button size="sm" onClick={handleViewDetails}>
                View Details <ChevronRight className="ml-2" size={16} />
              </Button>
            </div>
          </div>
          <p className="text-sm text-gray-500 mb-4">
            Parse from your uploaded file
          </p>
          <AssertionTable assertions={assertionsData} />
        </div>
      </div>

      {/* Model Component */}
      <AssertionsDetailsModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        assertions={assertionsData}
        maxDifficulty={maxDifficulty}
        minMargin={minMargin}
      />
    </div>
  );
};

export default Dashboard;
