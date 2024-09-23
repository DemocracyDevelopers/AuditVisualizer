import Svg from "./components/svg";
import { dataOneTree, dataOneTree2, testData } from "./constants";

function SvgTest() {
  return (
    <div>
      page
      {/* <Svg data={testData} /> */}
      <Svg data={dataOneTree2} />
    </div>
  );
}

export default SvgTest;
