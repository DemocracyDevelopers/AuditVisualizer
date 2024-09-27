"use client";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Switch } from "@/components/ui/switch";
import useTreeSettingsStore from "@/store/useTreeSettingStore";
import { ChevronDown } from "lucide-react";

function Dropdown() {
  const { stepByStep, hideAvatar, setHideAvatar, setStepByStep } =
    useTreeSettingsStore();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button className="pr-3">
          Options
          <ChevronDown className="ml-1 h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem asChild>
          <div className="flex justify-between gap-1">
            <div>Step by Step</div>
            <Switch checked={stepByStep} onCheckedChange={setStepByStep} />
          </div>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <div className="flex justify-between">
            <div>Hide Avatar</div>
            <Switch checked={hideAvatar} onCheckedChange={setHideAvatar} />
          </div>
        </DropdownMenuItem>
        <DropdownMenuItem asChild className="justify-center">
          <div>Save</div>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default Dropdown;
