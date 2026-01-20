import { create } from "zustand";

type SettingsTab = "account" | "subscription" | "billing";

interface SettingsState {
  // Active tab
  activeTab: SettingsTab;
  
  // Actions
  setActiveTab: (tab: SettingsTab) => void;
}

export const useSettingsStore = create<SettingsState>((set) => ({
  activeTab: "account",
  
  setActiveTab: (tab) => set({ activeTab: tab }),
}));
