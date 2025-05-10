import { Candidate } from "@/app/dashboard/components/elimination-tree/constants";
import { Assertion } from "@/lib/explain/prettyprint_assertions_and_pictures";

const getContentFromAssertion = ({
  assertion,
  candidateList,
}: {
  assertion: Assertion;
  candidateList: Candidate[];
}) => {
  const { type, winner, loser, continuing } = assertion;
  const winnerName = candidateList[winner].name;
  const loserName = candidateList[loser].name;
  let content = "";
  if (type === "NEN") {
    const continuingNames = continuing!
      .map((id) => candidateList[id].name)
      .join(", ");
    content = `${winnerName} > ${loserName} if only {${continuingNames}} remain`;
  } else if (type === "NEB") {
    content = `${winnerName} NEB ${loserName}`;
  }
  return content;
};
export { getContentFromAssertion };
