import Svg from "./components/svg";
import { testData } from "./constants";

function SvgTest() {
  return (
    <div>
      page
      <Svg data={testData} />
    </div>
  );
}

export default SvgTest;
