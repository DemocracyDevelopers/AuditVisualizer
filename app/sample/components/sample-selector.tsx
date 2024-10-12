import React from "react";
import Image from "next/image";
import useMultiWinnerDataStore from "../../../store/multi-winner-data";
import { AvatarColor } from "@/utils/avatar-color";
import { explainAssertions } from "../../explain-assertions/components/explain-process";
import { useRouter } from "next/navigation";

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
    // fileUrl: "/sample-jsons/a_guide_to_RAIRE_eg_NEB_assertions.json",
    fileUrl: "/sample-jsons/a_guide_to_RAIRE_eg_NEB_assertions.json",
  },
  {
    name: "One candidate dominates example",
    description: "One candidate dominates example",
    imageUrl: "/sample-images/img.png",
    // fileUrl: "/sample-jsons/a_guide_to_RAIRE_eg_one_candidate_dominates.json",
    fileUrl: "/sample-jsons/Singleton Mayoral.json",
  },
  {
    name: "Two leading candidates example",
    description: "Two leading candidates example ",
    imageUrl: "/sample-images/img.png",
    // fileUrl: "/sample-jsons/a_guide_to_RAIRE_eg_two_leading_candidates.json",
    fileUrl: "/sample-jsons/test.json",
  },
];

const SampleSelector = () => {
  const {
    setMultiWinner,
    setCandidateList,
    setAssertionList,
    setWinnerInfo,
    clearAssertionList,
    clearCandidateList,
    clearMultiWinner,
    clearWinnerInfo,
  } = useMultiWinnerDataStore(); // 使用全局状态

  const avatarColor = new AvatarColor();
  const router = useRouter();

  const handleSampleClick = async (fileUrl: string) => {
    try {
      clearMultiWinner();
      clearCandidateList();
      clearAssertionList();
      clearWinnerInfo();

      // 使用 fetch 获取样例文件
      const response = await fetch(fileUrl);
      if (!response.ok) {
        throw new Error("Failed to fetch the sample file");
      }

      // 将样例文件转换为 Blob 对象
      const blob = await response.blob();
      const reader = new FileReader();

      // 使用 FileReader 读取 Blob 的内容
      reader.onload = (e) => {
        const result = e.target?.result;

        if (typeof result === "string") {
          // 解析文件内容并调用核心库进行校验和解析
          const response = explainAssertions(result);
          console.log("response", response);
          if (response.success) {
            // 成功解析，将数据存储到全局状态中
            setMultiWinner(response.data);
            const jsonData = JSON.parse(result);

            // 处理候选人列表
            const candidateList = jsonData.metadata.candidates.map(
              (name: string, index: number) => ({
                id: index,
                name: name,
                color: avatarColor.getColor(index),
              }),
            );
            console.log("candidateList", candidateList);
            setCandidateList(candidateList);

            // 将候选人列表转换为字典，便于后续查找
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

            // 提取 assertions 并生成 assertionList
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

                // 获取 winner 和 loser 的名字
                const winnerName = candidateMap[winner];
                const loserName = candidateMap[loser];

                // 根据不同类型生成 content 字段
                let content = "";
                if (type === "NEN") {
                  const continuingNames = continuing
                    .map((id) => candidateMap[id])
                    .join(", ");
                  content = `${winnerName} > ${loserName} if only {${continuingNames}} remain`;
                } else if (type === "NEB") {
                  content = `${winnerName} NEB ${loserName}`;
                }

                // 返回 assertionList 的每一项
                return {
                  index: index + 1, // index 从 1 开始
                  winner: winner, // 将 winner 转化为名字
                  content, // 生成的内容
                  type, // 保持 type 不变
                  difficulty, // 保持 difficulty 不变
                  margin, // 保持 margin 不变
                };
              },
            );
            console.log("assertionList", assertionList);
            setAssertionList(assertionList);
            console.log(
              "Successfully processed and stored the sample file data",
            );

            const winnerId = jsonData.solution.Ok.winner;
            const winnerName = jsonData.metadata.candidates[winnerId];
            setWinnerInfo({ id: winnerId, name: winnerName });

            router.push("/dashboard");
          } else {
            console.error("Failed to explain assertions", response.error);
          }
        }
      };

      // 读取 Blob 内容为文本
      reader.readAsText(blob);
    } catch (error) {
      console.error("Error fetching or processing the sample file:", error);
    }
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
            onClick={() => handleSampleClick(sample.fileUrl)}
          >
            {/* Display name first */}
            <h3 className="text-lg mb-2 text-center">{sample.name}</h3>

            {/* Display image below the name */}
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
    </div>
  );
};

export default SampleSelector;
