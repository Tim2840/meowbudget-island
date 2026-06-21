"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Category } from "@/types";
import { todayString } from "@/lib/streakUtils";
import { CategoryName } from "./CategoryName";

interface RecordFormProps {
  categories: Category[];
  onSave: (amount: number, category: Category, date: string, note?: string) => Promise<void>;
  onCancel: () => void;
}

export default function RecordForm({ categories, onSave, onCancel }: RecordFormProps) {
  const t = useTranslations("record");
  const [type, setType] = useState<"expense" | "income">("expense");
  const [amount, setAmount] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [date, setDate] = useState(todayString());
  const [note, setNote] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const filteredCategories = categories.filter((c) => c.isIncome === (type === "income"));

  const handleSave = async () => {
    const numAmount = parseFloat(amount);
    if (!numAmount || !selectedCategory) return;
    setIsSaving(true);
    await onSave(numAmount, selectedCategory, date, note || undefined);
    setIsSaving(false);
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-end">
      <div className="absolute inset-0 bg-black/40" onClick={onCancel} />
      <div className="relative w-full max-w-md mx-auto bg-white rounded-t-3xl shadow-2xl p-6 pb-[calc(env(safe-area-inset-bottom)+1.5rem)] space-y-5 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-800">{t("add")}</h2>
          <button onClick={onCancel} className="p-2 hover:bg-gray-100 rounded-full">
            <X size={20} />
          </button>
        </div>

        {/* Type toggle */}
        <div className="flex rounded-xl bg-gray-100 p-1">
          {(["expense", "income"] as const).map((tp) => (
            <button
              key={tp}
              onClick={() => { setType(tp); setSelectedCategory(null); }}
              className={cn(
                "flex-1 py-2.5 rounded-lg text-base font-semibold transition-all",
                type === tp ? "bg-white shadow text-amber-600" : "text-gray-500"
              )}
            >
              {t(tp === "expense" ? "type_expense" : "type_income")}
            </button>
          ))}
        </div>

        {/* Amount input */}
        <div>
          <label className="text-sm font-medium text-gray-500 mb-1 block">{t("amount")}</label>
          <input
            type="number"
            inputMode="decimal"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0"
            className="w-full text-3xl font-bold text-gray-800 bg-gray-50 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-amber-400 border-none"
          />
        </div>

        {/* Category picker */}
        <div>
          <label className="text-sm font-medium text-gray-500 mb-2 block">{t("category")}</label>
          <div className="grid grid-cols-4 gap-2">
            {filteredCategories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat)}
                className={cn(
                  "flex flex-col items-center gap-1 p-2 rounded-xl border-2 transition-all",
                  selectedCategory?.id === cat.id
                    ? "border-amber-400 bg-amber-50"
                    : "border-transparent bg-gray-50 hover:bg-gray-100"
                )}
              >
                <span className="text-2xl">{cat.emoji}</span>
                <CategoryName
                  nameKey={cat.nameKey}
                  isCustom={cat.isCustom}
                  className="text-xs text-gray-600 text-center leading-tight"
                />
              </button>
            ))}
          </div>
        </div>

        {/* Date + Note */}
        <div className="flex gap-3">
          <div className="flex-1">
            <label className="text-sm font-medium text-gray-500 mb-1 block">{t("date")}</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full bg-gray-50 rounded-xl px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-amber-400"
            />
          </div>
          <div className="flex-1">
            <label className="text-sm font-medium text-gray-500 mb-1 block">{t("note")}</label>
            <input
              type="text"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="w-full bg-gray-50 rounded-xl px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-amber-400"
            />
          </div>
        </div>

        {/* Save button */}
        <button
          onClick={handleSave}
          disabled={!amount || !selectedCategory || isSaving}
          className="w-full bg-amber-500 disabled:bg-gray-200 disabled:text-gray-400 text-white font-bold text-lg rounded-2xl py-4 transition-colors"
        >
          {isSaving ? "..." : t("save")}
        </button>
      </div>
    </div>
  );
}
