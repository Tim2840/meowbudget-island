import { create } from "zustand";

// The tutorial overlay must live at the layout level (TutorialController) so it
// survives client-side navigation between pages. Pages that want to (re)start
// the tutorial — e.g. the "replay" row in Settings — flip this global flag
// instead of rendering their own overlay, which would be destroyed the moment
// the tutorial navigates away from that page.
interface TutorialState {
  isOpen: boolean;
  open: () => void;
  close: () => void;
}

export const useTutorialStore = create<TutorialState>((set) => ({
  isOpen: false,
  open: () => set({ isOpen: true }),
  close: () => set({ isOpen: false }),
}));
