import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

// 定义带有 setter 和 getter 的 store 类型
type FileDataStore = {
  fileData: string;
  setFileData: (data: string) => void;
};

export const useFileDataStore = create<FileDataStore>()(
  persist(
    (set, get) => ({
      fileData: "",
      setFileData: (data: string) => set({ fileData: data }),
    }),
    {
      name: "file-data",
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
