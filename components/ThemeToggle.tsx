"use client";
import { useTheme } from "@/app/_lib/theme-context";
import { Sun, Moon } from "lucide-react";

const ThemeToggle: React.FC = () => {
  const { theme, toggle } = useTheme();

  return (
    <button
      onClick={toggle}
      className="inline-flex items-center gap-1 border border-border dark:border-border/60
                 rounded-md px-3 py-1 shadow hover:bg-muted/60 dark:hover:bg-muted/30
                 transition-colors"
    >
      {theme === "light" ? <Moon size={16} /> : <Sun size={16} />}
      {theme === "light" ? "Dark Mode" : "Light Mode"}
    </button>
  );
};

export default ThemeToggle;
