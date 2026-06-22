import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Category, CategoryGroup } from "@/types";
import { DEFAULT_GROUPS, DEFAULT_SUBCATEGORIES } from "@/lib/constants";

interface CategoryState {
  // Only user customizations are persisted; defaults come from constants
  customGroups: CategoryGroup[];
  customSubcategories: Category[];
  hiddenGroupKeys: string[];
  hiddenSubcategoryKeys: string[];

  // Computed selectors
  getGroups: (isIncome: boolean) => CategoryGroup[];
  getSubcategories: (groupKey: string) => Category[];

  // Group CRUD
  addGroup: (g: Omit<CategoryGroup, "userId" | "isCustom">) => void;
  updateGroup: (key: string, updates: Partial<Pick<CategoryGroup, "nameKey" | "emoji" | "color" | "sortOrder">>) => void;
  removeGroup: (key: string) => void;

  // Subcategory CRUD
  addSubcategory: (s: Omit<Category, "userId" | "isCustom">) => void;
  updateSubcategory: (key: string, updates: Partial<Pick<Category, "nameKey" | "emoji" | "bonusCoins" | "resourceAmount">>) => void;
  removeSubcategory: (key: string) => void;

  // Visibility
  hideDefault: (key: string, type: "group" | "subcategory") => void;
  showDefault: (key: string, type: "group" | "subcategory") => void;
}

export const useCategoryStore = create<CategoryState>()(
  persist(
    (set, get) => ({
      customGroups: [],
      customSubcategories: [],
      hiddenGroupKeys: [],
      hiddenSubcategoryKeys: [],

      getGroups: (isIncome) => {
        const state = get();
        const defaults = DEFAULT_GROUPS.filter(
          (g) => g.isIncome === isIncome && !state.hiddenGroupKeys.includes(g.key)
        );
        const customs = state.customGroups.filter((g) => g.isIncome === isIncome);
        return [...defaults, ...customs].sort((a, b) => a.sortOrder - b.sortOrder);
      },

      getSubcategories: (groupKey) => {
        const state = get();
        const defaults = DEFAULT_SUBCATEGORIES.filter(
          (s) => s.groupKey === groupKey && !state.hiddenSubcategoryKeys.includes(s.key)
        );
        const customs = state.customSubcategories.filter((s) => s.groupKey === groupKey);
        return [...defaults, ...customs].sort((a, b) => a.sortOrder - b.sortOrder);
      },

      addGroup: (g) =>
        set((state) => ({
          customGroups: [
            ...state.customGroups,
            { ...g, userId: null, isCustom: true },
          ],
        })),

      updateGroup: (key, updates) =>
        set((state) => ({
          customGroups: state.customGroups.map((g) =>
            g.key === key ? { ...g, ...updates } : g
          ),
        })),

      removeGroup: (key) =>
        set((state) => ({
          customGroups: state.customGroups.filter((g) => g.key !== key),
          customSubcategories: state.customSubcategories.filter((s) => s.groupKey !== key),
        })),

      addSubcategory: (s) =>
        set((state) => ({
          customSubcategories: [
            ...state.customSubcategories,
            { ...s, userId: null, isCustom: true },
          ],
        })),

      updateSubcategory: (key, updates) =>
        set((state) => ({
          customSubcategories: state.customSubcategories.map((s) =>
            s.key === key ? { ...s, ...updates } : s
          ),
        })),

      removeSubcategory: (key) =>
        set((state) => ({
          customSubcategories: state.customSubcategories.filter((s) => s.key !== key),
        })),

      hideDefault: (key, type) =>
        set((state) =>
          type === "group"
            ? { hiddenGroupKeys: [...state.hiddenGroupKeys, key] }
            : { hiddenSubcategoryKeys: [...state.hiddenSubcategoryKeys, key] }
        ),

      showDefault: (key, type) =>
        set((state) =>
          type === "group"
            ? { hiddenGroupKeys: state.hiddenGroupKeys.filter((k) => k !== key) }
            : { hiddenSubcategoryKeys: state.hiddenSubcategoryKeys.filter((k) => k !== key) }
        ),
    }),
    {
      name: "meow_categories",
      partialize: (state) => ({
        customGroups: state.customGroups,
        customSubcategories: state.customSubcategories,
        hiddenGroupKeys: state.hiddenGroupKeys,
        hiddenSubcategoryKeys: state.hiddenSubcategoryKeys,
      }),
    }
  )
);
