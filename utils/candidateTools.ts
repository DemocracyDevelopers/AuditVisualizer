import { Candidate } from "@/app/dashboard/components/elimination-tree/constants";
import { Assertion } from "@/lib/explain/prettyprint_assertions_and_pictures";

const getContentFromAssertion = ({
  assertion,
  candidateList,
}: {
  assertion: Assertion;
  candidateList: Candidate[];
}) => {
  const { type, winner, loser, continuing, assertion_index } = assertion;
  const winnerName = candidateList[winner].name;
  const loserName = candidateList[loser].name;
  let content = "";
  if (type === "NEN") {
    const continuingNames = continuing!
      .map((id) => candidateList[id].name)
      .join(", ");
    content = `[${assertion_index}] ${winnerName} > ${loserName} if only {${continuingNames}} remain`;
  } else if (type === "NEB") {
    content = `[${assertion_index}] ${winnerName} NEB ${loserName}`;
  }
  return content;
};
export { getContentFromAssertion };
