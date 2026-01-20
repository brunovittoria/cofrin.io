import { create } from "zustand";
import { persist } from "zustand/middleware";

interface SidebarState {
  // Custom sidebar preferences (in addition to shadcn's sidebar)
  isPinned: boolean;
  width: number;
  
  // Actions
  setIsPinned: (pinned: boolean) => void;
  setWidth: (width: number) => void;
  resetSidebarPreferences: () => void;
}

const DEFAULT_SIDEBAR_WIDTH = 256; // 16rem

export const useSidebarStore = create<SidebarState>()(
  persist(
    (set) => ({
      isPinned: false,
      width: DEFAULT_SIDEBAR_WIDTH,
      
      setIsPinned: (pinned) => set({ isPinned: pinned }),
      setWidth: (width) => set({ width }),
      resetSidebarPreferences: () => set({ isPinned: false, width: DEFAULT_SIDEBAR_WIDTH }),
    }),
    {
      name: "cofrin-sidebar-storage",
    }
  )
);
