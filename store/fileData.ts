import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

type FileDataStore = {
  fileData: string;
  setFileData: (data: string) => void;
};

export const useFileDataStore = create<FileDataStore>()(
  persist(
    (set, _) => ({
      fileData: "",
      setFileData: (data: string) => set({ fileData: data }),
    }),
    {
      name: "file-data",
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
