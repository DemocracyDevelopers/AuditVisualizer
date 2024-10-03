import { GitBranch, X } from "lucide-react";

function InnerComponent() {
  return (
    <div>
      <div>InnerComponent</div>
      {/* 图标一般就用 https://lucide.dev/icons/*/}
      <div className="flex w-2/3 justify-between">
        <X />
        <GitBranch />
      </div>
    </div>
  );
}

export default InnerComponent;
