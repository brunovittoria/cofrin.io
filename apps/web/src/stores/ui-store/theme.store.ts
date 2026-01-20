import { create } from "zustand";

type Theme = "light" | "dark";

interface ThemeState {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
}

const getInitialTheme = (): Theme => {
  if (typeof window === "undefined") return "light";
  const savedTheme = localStorage.getItem("cofrin-theme");
  return (savedTheme as Theme) || "light";
};

const applyThemeToDocument = (theme: Theme) => {
  if (typeof window === "undefined") return;
  const root = window.document.documentElement;
  root.classList.remove("light", "dark");
  root.classList.add(theme);
};

// Initialize theme on store creation
const initialTheme = getInitialTheme();
applyThemeToDocument(initialTheme);

export const useThemeStore = create<ThemeState>((set) => ({
  theme: initialTheme,
  
  toggleTheme: () => {
    set((state) => {
      const newTheme = state.theme === "light" ? "dark" : "light";
      applyThemeToDocument(newTheme);
      localStorage.setItem("cofrin-theme", newTheme);
      return { theme: newTheme };
    });
  },
  
  setTheme: (theme: Theme) => {
    applyThemeToDocument(theme);
    localStorage.setItem("cofrin-theme", theme);
    set({ theme });
  },
}));
