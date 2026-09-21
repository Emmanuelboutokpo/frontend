import { create } from "zustand";

export type ViewMode = "list" | "map";

interface UIState {
  explorerViewMode: ViewMode;
  setExplorerViewMode: (mode: ViewMode) => void;
  toggleExplorerViewMode: () => void;
}

export const useUIStore = create<UIState>((set, get) => ({
  explorerViewMode: "list",

  setExplorerViewMode: (mode) => set({ explorerViewMode: mode }),

  toggleExplorerViewMode: () =>
    set({
      explorerViewMode: get().explorerViewMode === "list" ? "map" : "list",
    }),
}));