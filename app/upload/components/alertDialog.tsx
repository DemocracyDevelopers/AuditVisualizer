import React from "react";
import { AlertCircle } from "lucide-react";
import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
  CardDescription,
} from "@/components/ui/card"; // 根据你的项目路径引入 shadcn 的组件
import { Button } from "@/components/ui/button"; // 根据你的项目路径引入 shadcn 的组件

interface CustomAlertDialogProps {
  open: boolean;
  onClose: () => void;
  title: string;
  description: string;
}
const CustomAlertDialog: React.FC<CustomAlertDialogProps> = ({
  open,
  onClose,
  title,
  description,
}) => {
  if (!open) return null; // 如果 open 为 false，则不显示该组件

  // 封装跳转函数
  const handleTryAgain = () => {
    onClose(); // 关闭弹窗
    window.location.reload(); // 强制刷新当前页面
  };

  return (
    <div className="fixed top-2 right-2 z-50">
      {/* 设置右上角位置 */}
      <Card className="shadow-lg border border-gray-200 max-w-xl min-w-96">
        <CardHeader className="flex items-center flex-row">
          <AlertCircle className="text-red-500 h-5 w-5 mr-2" /> {/* 警告图标 */}
          <CardTitle>{title}</CardTitle> {/* 自定义标题 */}
        </CardHeader>
        <CardContent className="flex flex-col items-end">
          <CardDescription className="text-left w-full text-gray-500 mb-4">
            {description} {/* 自定义描述 */}
          </CardDescription>
          <Button
            className="bg-black text-white hover:bg-gray-800 w-3/12"
            onClick={handleTryAgain}
          >
            Try Again
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default CustomAlertDialog;
