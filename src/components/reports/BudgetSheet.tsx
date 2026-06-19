"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { X } from "lucide-react";
import { DEFAULT_CATEGORIES } from "@/lib/constants";
import { useAuthStore } from "@/stores/useAuthStore";
import { useBudgetStore } from "@/stores/useBudgetStore";
import { CategoryName } from "@/components/record/CategoryName";

interface BudgetSheetProps {
  yearMonth: string; // 'YYYY-MM'
  onClose: () => void;
}

// Expense categories with the same ids RecordPage assigns (default-${i}).
const EXPENSE_CATEGORIES = DEFAULT_CATEGORIES.map((c, i) => ({
  ...c,
  id: `default-${i}`,
  isCustom: false,
})).filter((c) => !c.isIncome);

export default function BudgetSheet({ yearMonth, onClose }: BudgetSheetProps) {
  const t = useTranslations("reports");
  const { user } = useAuthStore();
  const { getBudget, setBudget } = useBudgetStore();

  const initial = (categoryId: string | null) => {
    const b = getBudget(categoryId, yearMonth);
    return b ? String(b.amount) : "";
  };

  const [total, setTotal] = useState(() => initial(null));
  const [values, setValues] = useState<Record<string, string>>(() =>
    Object.fromEntries(EXPENSE_CATEGORIES.map((c) => [c.id, initial(c.id)]))
  );
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    if (!user) return;
    setIsSaving(true);
    await setBudget(user.id, null, parseFloat(total) || 0, yearMonth);
    for (const cat of EXPENSE_CATEGORIES) {
      await setBudget(user.id, cat.id, parseFloat(values[cat.id]) || 0, yearMonth);
    }
    setIsSaving(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative w-full max-w-md mx-auto bg-white rounded-t-3xl shadow-2xl p-6 max-h-[85vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-800">{t("set_budget")}</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full">
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto space-y-5 scrollbar-none">
          {/* Monthly total */}
          <div>
            <label className="text-sm font-semibold text-gray-600 mb-1 block">
              {t("monthly_total")}
            </label>
            <div className="flex items-center bg-amber-50 rounded-xl px-4 py-3">
              <span className="text-gray-400 mr-2">$</span>
              <input
                type="number"
                inputMode="decimal"
                value={total}
                onChange={(e) => setTotal(e.target.value)}
                placeholder={t("amount_placeholder")}
                className="flex-1 text-2xl font-bold text-gray-800 bg-transparent outline-none"
              />
            </div>
          </div>

          {/* Per-category budgets */}
          <div>
            <label className="text-sm font-semibold text-gray-600 mb-2 block">
              {t("category_budgets")}
            </label>
            <div className="space-y-2">
              {EXPENSE_CATEGORIES.map((cat) => (
                <div key={cat.id} className="flex items-center gap-3">
                  <span className="text-xl w-7 text-center">{cat.emoji}</span>
                  <CategoryName
                    nameKey={cat.nameKey}
                    isCustom={cat.isCustom}
                    className="text-sm text-gray-600 flex-1"
                  />
                  <div className="flex items-center bg-gray-50 rounded-lg px-3 py-1.5 w-32">
                    <span className="text-gray-400 text-sm mr-1">$</span>
                    <input
                      type="number"
                      inputMode="decimal"
                      value={values[cat.id]}
                      onChange={(e) =>
                        setValues((v) => ({ ...v, [cat.id]: e.target.value }))
                      }
                      placeholder="0"
                      className="w-full text-right text-sm font-semibold text-gray-700 bg-transparent outline-none"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Save */}
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="mt-4 w-full bg-amber-500 disabled:bg-gray-200 text-white font-bold text-lg rounded-2xl py-4 transition-colors"
        >
          {isSaving ? "..." : t("save")}
        </button>
      </div>
    </div>
  );
}
