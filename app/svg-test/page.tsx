import Tree from "../../components/Tree";
import Dropdown from "./components/dropdown";
import { dataOneTree, dataOneTree2, testData } from "./constants";

function SvgTest() {
  return (
    <div>
      <div>page</div>
      <div className="flex justify-center">
        <Dropdown />
      </div>

      {/* <Svg data={testData} /> */}
      <Tree data={dataOneTree2} />
    </div>
  );
}

export default SvgTest;
