"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { X } from "lucide-react";
import { useBudgetStore } from "@/stores/useBudgetStore";
import { useCategoryStore } from "@/stores/useCategoryStore";
import { useAuthStore } from "@/stores/useAuthStore";
import type { CategoryGroup } from "@/types";

interface BudgetManagerProps {
  yearMonth: string; // "YYYY-MM"
  onClose: () => void;
}

export default function BudgetManager({ yearMonth, onClose }: BudgetManagerProps) {
  const t = useTranslations("budget");
  const tc = useTranslations("category");
  const { user } = useAuthStore();
  const userId = user?.id ?? "local-user";

  const store = useBudgetStore();
  const { getGroups } = useCategoryStore();
  const expenseGroups = getGroups(false);

  const [totalInput, setTotalInput] = useState(() => {
    const b = store.getTotalBudget(yearMonth);
    return b ? String(b.amount) : "";
  });

  const [groupInputs, setGroupInputs] = useState<Record<string, string>>(() => {
    const result: Record<string, string> = {};
    expenseGroups.forEach((g) => {
      const b = store.getGroupBudget(yearMonth, g.key);
      result[g.key] = b ? String(b.amount) : "";
    });
    return result;
  });

  const getGroupName = (g: CategoryGroup) => {
    if (g.isCustom) return g.nameKey;
    return tc(g.nameKey.replace("category.", "") as Parameters<typeof tc>[0]);
  };

  const handleSave = () => {
    const totalAmount = parseInt(totalInput) || 0;
    if (totalAmount > 0) {
      store.setBudget(userId, yearMonth, null, totalAmount);
    } else {
      store.removeBudget(yearMonth, null);
    }

    expenseGroups.forEach((g) => {
      const amount = parseInt(groupInputs[g.key] ?? "") || 0;
      if (amount > 0) {
        store.setBudget(userId, yearMonth, g.key, amount);
      } else {
        store.removeBudget(yearMonth, g.key);
      }
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-[60] flex flex-col justify-end">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-white rounded-t-3xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-5 pt-5 pb-3 border-b border-gray-100">
          <div>
            <h2 className="text-lg font-bold text-gray-800">{t("title")}</h2>
            <p className="text-xs text-gray-400">{yearMonth}</p>
          </div>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100 active:bg-gray-200 transition-colors">
            <X size={20} className="text-gray-500" />
          </button>
        </div>

        {/* Scrollable content */}
        <div className="flex-1 min-h-0 overflow-y-auto px-5 py-4 space-y-4">
          {/* Total budget */}
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
              {t("monthly_total")}
            </p>
            <div className="bg-amber-50 rounded-2xl px-4 py-3 flex items-center gap-3">
              <span className="text-2xl">💰</span>
              <span className="flex-1 text-sm font-semibold text-amber-700">{t("monthly_total")}</span>
              <input
                type="number"
                inputMode="numeric"
                placeholder={t("not_set")}
                value={totalInput}
                onChange={(e) => setTotalInput(e.target.value)}
                className="w-32 text-right text-sm font-semibold text-gray-700 bg-white border border-amber-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-400"
                min="0"
              />
            </div>
          </div>

          {/* Group budgets */}
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
              {t("by_category")}
            </p>
            <div className="space-y-2">
              {expenseGroups.map((g) => (
                <div
                  key={g.key}
                  className="bg-white border border-gray-100 rounded-2xl px-4 py-3 flex items-center gap-3 shadow-sm"
                >
                  <span className="text-xl">{g.emoji}</span>
                  <span className="flex-1 text-sm font-medium text-gray-700">{getGroupName(g)}</span>
                  <input
                    type="number"
                    inputMode="numeric"
                    placeholder={t("not_set")}
                    value={groupInputs[g.key] ?? ""}
                    onChange={(e) =>
                      setGroupInputs((prev) => ({ ...prev, [g.key]: e.target.value }))
                    }
                    className="w-32 text-right text-sm font-semibold text-gray-700 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-400"
                    min="0"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 pt-3 pb-[calc(env(safe-area-inset-bottom)+1rem)] border-t border-gray-100">
          <button
            onClick={handleSave}
            className="w-full py-4 rounded-2xl bg-amber-500 text-white font-semibold text-base active:scale-95 transition-transform"
          >
            {t("save")}
          </button>
        </div>
      </div>
    </div>
  );
}
