"use client";
import { FC, useEffect, useState } from "react";
import Card from "./components/card";
import AssertionTable from "./components/assertion-table";
import AssertionsDetailsModal from "./components/assertions-details-modal";
import { FaUserFriends, FaTrophy, FaList } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ChevronRight, FilePenLine } from "lucide-react";
import AuditProgressAnimation from "./components/audit-progress-animation"; // Ensure the file name matches the actual file
import EliminationTree from "./components/elimination-tree";
import useMultiWinnerDataStore from "@/store/multi-winner-data";
import {
  // inferEliminationPathWithDetails,
  AssertionInternal,
  verifyWinnerByDP,
} from "@/lib/explain/judge_winner";
// import multiWinnerData from "@/store/multi-winner-data"; // 引入 zustand store

import { useTour } from "@reactour/tour";

import { Workflow } from "lucide-react";
import { useFileDataStore } from "@/store/fileData";
import {
  explainAssertions,
  getAssertions,
} from "../explain-assertions/components/explain-process";
import { useRouter } from "next/navigation";

import useTreeTabStore from "@/store/use-tree-tab-store";

const Dashboard: FC = () => {
  const { setIsOpen } = useTour();

  const startStepByStepTab = () => {
    useTreeTabStore.getState().setCurrentTab("step-by-step");
  };

  const storeTabState = () => {
    useTreeTabStore.getState().backupTab();
  };

  const startTour = () => {
    if (setIsOpen) {
      storeTabState();
      startStepByStepTab();
      setIsOpen(true);
    }
  };
  const fileData = useFileDataStore((state) => state.fileData);

  const tour = useTour();

  useEffect(() => {
    const shouldStart = sessionStorage.getItem("startTour");
    if (shouldStart === "true" && tour.setIsOpen) {
      startStepByStepTab();
      tour.setIsOpen(true);
      sessionStorage.removeItem("startTour");
    }
  }, [tour]);

  const { candidateList, assertionList, winnerInfo } =
    useMultiWinnerDataStore();

  // Ensure hooks are always called in the same order
  const [isAvatarReady, setIsAvatarReady] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // 1. 拿到 name 列表，等价于 metadata.candidates
  const names = candidateList.map((c) => c.name);

  // 2. 利用 content 字符串解析 loser & context
  const internalAssertions: AssertionInternal[] = assertionList.map((a) => {
    const high = names[a.winner];
    let low: string;
    let context: string[];

    if (a.type === "NEB") {
      // 格式: "WinnerName NEB LoserName"
      const parts = a.content.split(" NEB ");
      low = parts[1].trim();
      context = [...names];
    } else {
      // 格式: "WinnerName > LoserName if only {A, B, ...} remain"
      // 先提取 "WinnerName > LoserName"
      const beforeIf = a.content.split(" if only")[0];
      low = beforeIf.split(" > ")[1].trim();

      // 再提取花括号内的名字列表
      const m = a.content.match(/\{([^}]+)\}/);
      context = m ? m[1].split(",").map((s: string) => s.trim()) : []; // 如果解析失败，就空数组
    }

    return { high, low, context };
  });

  // 3. 真正的冠军名字
  const trueWinner = winnerInfo?.name ?? "Unknown";

  // 4. 推导并验证
  const result = winnerInfo
    ? verifyWinnerByDP(internalAssertions, names, winnerInfo.name)
    : null;
  const isValid = result !== null;

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

  // 获取带有 name 字段的 assertionList
  const assertionsWithNames = assertionList.map((assertion) => ({
    ...assertion,
    name:
      candidateList.find((candidate) => candidate.id === assertion.winner)
        ?.name ?? "Unknown",
  }));

  // 获取候选人的数量
  const candidateNum = candidateList.length;

  // 获取断言的数量
  const assertionNum = assertionList.length;

  // 计算最大难度和最小差距
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

      {/* Grid 布局 */}
      <div className="grid grid-cols-12 gap-6 p-6 items-stretch">
        {/* 左侧区域 */}
        <div className="col-span-12 md:col-span-8 flex flex-col space-y-6">
          {/* 数据卡片 */}
          <div className="w-full overflow-x-auto">
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

          {/* Elimination Tree */}
          <div
            data-tour="fourth-step"
            className="flex-1 flex flex-col border border-gray-300 shadow-md rounded-lg p-4"
          >
            <EliminationTree />
          </div>
        </div>

        {/* 右侧区域 */}
        {/* 右侧区域 */}
        {/* 右侧区域 */}
        <div
          data-tour="second-step"
          className="col-span-12 md:col-span-4 flex flex-col border border-gray-300 shadow-md rounded-lg p-6"
        >
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold text-gray-500">The Assertions</h3>
            <div className="text-right" data-tour="third-step">
              <Button size="sm" onClick={handleViewDetails}>
                View Details <ChevronRight className="ml-2" size={16} />
              </Button>
            </div>
          </div>
          <p className="text-sm text-gray-500 mb-4">
            Parse from your uploaded file
          </p>
          <AssertionTable assertions={assertionsWithNames} />

          <AuditProgressAnimation
            championName={winnerInfo ? winnerInfo.name : "Unknown"}
            isValid={isValid}
          />
        </div>
      </div>

      {/* verification */}
      {/* <VerificationProgress /> */}

      {/* Modal 组件 */}
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
