import React from "react";
import { AlertCircle } from "lucide-react";
import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

/**
 * CustomAlertDialog
 * A dismissible alert card that appears at the top-right corner.
 * Typically used for error or warning messages.
 */
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
  if (!open) return null;

  const handleTryAgain = () => {
    onClose();
    window.location.reload();
  };

  return (
    <div className="fixed top-2 right-2 z-50">
      {/* Alert container anchored to top-right corner */}
      <Card className="shadow-lg border border-gray-200 max-w-xl min-w-96">
        <CardHeader className="flex items-center flex-row">
          {/* Alert icon and title */}
          <AlertCircle className="text-red-500 h-5 w-5 mr-2" />
          <CardTitle>{title}</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-end">
          {/* Description text */}
          <CardDescription className="text-left w-full text-gray-500 mb-4">
            {description}
          </CardDescription>
          {/* Retry button */}
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
