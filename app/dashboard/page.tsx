"use client";
import React, { useState } from "react";
import Card from "./components/card";
import AssertionTable from "./components/assertionTable";
import AssertionsDetailsModal from "./components/AssertionsDetailsModal";
import { FaUserFriends, FaTrophy, FaList } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ChevronRight, FilePenLine } from "lucide-react";
import { useStore } from "@/store/resultDetailStore"; // 引入 zustand store

const Dashboard: React.FC = () => {
  const { candidateList, assertionList } = useStore();

  // 获取带有 name 字段的 assertionList
  const assertionsWithNames = assertionList.map((assertion) => ({
    ...assertion,
    name:
      candidateList.find((candidate) => candidate.id === assertion.winner)
        ?.name || "Unknown",
  }));

  // 获取候选人的数量
  const candidateNum = candidateList.length;

  // 获取胜利者的信息
  const winner = candidateList.find(
    (candidate) => candidate.id === assertionList[0].winner,
  ) || { name: "Unknown" };

  // 获取断言的数量
  const assertionNum = assertionList.length;

  // 计算最大难度和最小差距
  const maxDifficulty = Math.max(...assertionList.map((a) => a.difficulty));
  const minMargin = Math.min(...assertionList.map((a) => a.margin));

  // Modal 状态
  const [isModalOpen, setIsModalOpen] = useState(false);

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
        {/* 左侧: Cards 和 Elimination Tree */}
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

          {/* Elimination Tree 区域 */}
          <div className="border border-gray-300 rounded-lg p-6 h-96">
            <h3 className="text-gray-600 text-lg font-medium">
              Elimination Tree
            </h3>
            <p className="text-gray-400 text-sm">to be updated</p>
          </div>
        </div>

        {/* 右侧：Assertion 表格 */}
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
          <AssertionTable assertions={assertionsWithNames} />
        </div>
      </div>

      {/* Modal 组件 */}
      <AssertionsDetailsModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        assertions={assertionsWithNames}
        maxDifficulty={maxDifficulty}
        minMargin={minMargin}
      />
    </div>
  );
};

export default Dashboard;
