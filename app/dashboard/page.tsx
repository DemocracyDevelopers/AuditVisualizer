"use client";
import React, { useEffect, useState } from "react";
import Card from "./components/card";
import AssertionTable from "./components/assertion-table";
import AssertionsDetailsModal from "./components/assertions-details-modal";
import { FaUserFriends, FaTrophy, FaList } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ChevronRight, FilePenLine } from "lucide-react";
import AuditProgressAnimation from "./components/AuditProgressAnimation"; // Ensure the file name matches the actual file
import EliminationTree from "./components/elimination-tree";
import AvatarAssignColor from "./components/avatar-assign-color"; // 引入 Avatar 组件
import useMultiWinnerDataStore from "@/store/multi-winner-data";
import multiWinnerData from "@/store/multi-winner-data"; // 引入 zustand store
import VerificationProgress from "@/components/verification-progress";

const Dashboard: React.FC = () => {
  const { candidateList, assertionList, winnerInfo } =
    useMultiWinnerDataStore();

  // 将所有 Hooks 移到顶层
  const [isAvatarReady, setIsAvatarReady] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false); // 移到这里

  // Avatar 完成后调用的函数
  const handleAvatarComplete = () => {
    setIsAvatarReady(true);
  };

  const handleViewDetails = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  // 仅在 Avatar 完成时渲染 Dashboard 内容
  if (!isAvatarReady) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <AvatarAssignColor onComplete={handleAvatarComplete} />
        <div className="mt-4">Loading...</div>
      </div>
    );
  }

  // 获取带有 name 字段的 assertionList
  const assertionsWithNames = assertionList.map((assertion) => ({
    ...assertion,
    name:
      candidateList.find((candidate) => candidate.id === assertion.winner)
        ?.name || "Unknown",
  }));

  // 获取候选人的数量
  const candidateNum = candidateList.length;

  // // 获取胜利者的信息
  // const winner =
  //   assertionList.length > 0
  //     ? candidateList.find(
  //         (candidate) => candidate.id === assertionList[0].winner,
  //       ) || {
  //         id: -1,
  //         name: "Unknown",
  //       }
  //     : { id: -1, name: "Unknown" };

  // 获取断言的数量
  const assertionNum = assertionList.length;

  // 计算最大难度和最小差距
  const maxDifficulty = Math.max(...assertionList.map((a) => a.difficulty));
  const minMargin = Math.min(...assertionList.map((a) => a.margin));

  return (
    <div className="p-4">
      {/* 文件上传按钮 */}
      <div className="flex justify-end mb-4 mt-[-20px] pr-6">
        <Link href="/upload">
          <Button size="sm">
            Change File
            <FilePenLine className="ml-2" size={16} />
          </Button>
        </Link>
      </div>

      {/* Grid 布局 */}
      <div className="grid grid-cols-12 gap-6 p-6">
        {/* 左侧区域 */}
        <div className="col-span-12 md:col-span-8 space-y-6">
          {/* 数据卡片 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card
              title="Candidate"
              value={candidateNum}
              icon={<FaUserFriends />}
            />
            <Card
              title="Winner"
              value={winnerInfo ? winnerInfo.name : "Unknown"} // 渲染 winnerInfo 的 name 字段
              icon={<FaTrophy />}
            />
            <Card title="Assertion" value={assertionNum} icon={<FaList />} />
          </div>

          {/* Elimination Tree section */}
          <EliminationTree />
        </div>

        {/* 右侧区域：Assertion 表格 */}
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
      {/* verification */}
      <VerificationProgress />

      {/* Modal 组件 */}
      <AssertionsDetailsModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        assertions={assertionsWithNames}
        maxDifficulty={maxDifficulty}
        minMargin={minMargin}
      />

      <AuditProgressAnimation
        championName={winnerInfo ? winnerInfo.name : "Unknown"}
      />
    </div>
  );
};

export default Dashboard;
