import { Candidate } from "@/app/dashboard/components/elimination-tree/constants";
import { Assertion } from "@/lib/explain/prettyprint_assertions_and_pictures";

type assertionTypes = {
  text: string;
  idx: number;
};
const getContentFromAssertion = ({
  assertion,
  candidateList,
}: {
  assertion: Assertion;
  candidateList: Candidate[];
}): assertionTypes => {
  const { type, winner, loser, continuing, assertion_index } = assertion;
  const winnerName = candidateList[winner]?.name || "";
  const loserName = candidateList[loser]?.name || "";
  let content: assertionTypes = {
    text: "",
    idx: assertion_index,
  };
  if (type === "NEN") {
    const continuingNames = continuing!
      .map((id) => candidateList[id]?.name || "")
      .join(", ");
    content.text = `${winnerName} > ${loserName} if only {${continuingNames}} remain`;
  } else {
    //  (type === "NEB")
    content.text = ` ${winnerName} NEB ${loserName}`;
  }
  return content;
};
export { getContentFromAssertion };
