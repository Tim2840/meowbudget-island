"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { X, Plus, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { todayString } from "@/lib/streakUtils";
import { useCategoryStore } from "@/stores/useCategoryStore";
import { DEFAULT_SUBCATEGORIES } from "@/lib/constants";
import type { Category, CategoryGroup } from "@/types";
import { CategoryName } from "./CategoryName";
import { EmojiIcon } from "@/components/ui/EmojiIcon";

interface RecordFormProps {
  onSave: (
    amount: number,
    subcategory: Category,
    group: CategoryGroup,
    date: string,
    note?: string
  ) => Promise<void>;
  onCancel: () => void;
}

export default function RecordForm({ onSave, onCancel }: RecordFormProps) {
  const t = useTranslations("record");
  const tc = useTranslations("category");
  const { getGroups, getSubcategories, addSubcategory } = useCategoryStore();

  const [type, setType] = useState<"expense" | "income">("expense");
  const [selectedGroupKey, setSelectedGroupKey] = useState<string | null>(null);
  const [selectedSubcategory, setSelectedSubcategory] = useState<Category | null>(null);
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState(todayString());
  const [note, setNote] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  // Quick-add custom subcategory
  const [addingCustom, setAddingCustom] = useState(false);
  const [customEmoji, setCustomEmoji] = useState("✏️");
  const [customName, setCustomName] = useState("");

  const groups = getGroups(type === "income");
  const selectedGroup = groups.find((g) => g.key === selectedGroupKey) ?? null;
  const subcategories = selectedGroupKey ? getSubcategories(selectedGroupKey) : [];

  const handleTypeSwitch = (tp: "expense" | "income") => {
    setType(tp);
    setSelectedGroupKey(null);
    setSelectedSubcategory(null);
    setAddingCustom(false);
  };

  const handleGroupClick = (groupKey: string) => {
    if (selectedGroupKey === groupKey) return;
    setSelectedGroupKey(groupKey);
    setSelectedSubcategory(null);
    setAddingCustom(false);
  };

  const handleAddCustom = () => {
    if (!customName.trim() || !selectedGroupKey || !selectedGroup) return;
    const key = `custom_${Date.now()}`;
    const refSub = DEFAULT_SUBCATEGORIES.find((s) => s.groupKey === selectedGroupKey);
    const sub: Omit<Category, "userId" | "isCustom"> = {
      key,
      groupKey: selectedGroupKey,
      nameKey: customName.trim(),
      emoji: customEmoji,
      color: selectedGroup.color,
      resourceType: refSub?.resourceType ?? "coins",
      resourceAmount: refSub?.resourceAmount ?? 0,
      bonusCoins: refSub?.bonusCoins ?? 5,
      isIncome: selectedGroup.isIncome,
      sortOrder: 999,
    };
    addSubcategory(sub);
    setSelectedSubcategory({ ...sub, userId: null, isCustom: true });
    setAddingCustom(false);
    setCustomName("");
    setCustomEmoji("✏️");
  };

  const handleSave = async () => {
    const numAmount = parseFloat(amount);
    if (!numAmount || !selectedSubcategory || !selectedGroup) return;
    setIsSaving(true);
    await onSave(numAmount, selectedSubcategory, selectedGroup, date, note || undefined);
    setIsSaving(false);
  };

  return (
    // z-[60] keeps this sheet ABOVE the bottom nav (BottomNav is z-50); at the
    // same z-index the nav paints over the pinned save button and hides it.
    <div className="fixed inset-0 z-[60] flex items-end">
      <div className="absolute inset-0 bg-black/40" onClick={onCancel} />
      <div className="relative w-full max-w-md mx-auto bg-white rounded-t-3xl shadow-2xl max-h-[90vh] flex flex-col">
        {/* Scrollable body — holds EVERYTHING except the save button. The
            save button lives in the pinned footer below, so it can never be
            pushed off-screen no matter how tall this form grows (more
            categories / fields). Keep it that way: do NOT move the save
            button back inside this scroll box. min-h-0 lets the flex child
            actually shrink so overflow-y works. */}
        <div className="flex-1 min-h-0 overflow-y-auto p-5 space-y-4">
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
                onClick={() => handleTypeSwitch(tp)}
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

          {/* ── 大類 chips（橫向捲動）── */}
          <div>
            <label className="text-sm font-medium text-gray-500 mb-2 block">{t("category")}</label>
            <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none -mx-1 px-1">
              {groups.map((g) => (
                <button
                  key={g.key}
                  onClick={() => handleGroupClick(g.key)}
                  className={cn(
                    "flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full border-2 text-sm font-semibold transition-all whitespace-nowrap",
                    selectedGroupKey === g.key
                      ? "border-amber-400 bg-amber-50 text-amber-700"
                      : "border-gray-200 bg-white text-gray-600 hover:bg-gray-50"
                  )}
                >
                  <EmojiIcon emoji={g.emoji} size={16} />
                  <span>
                    {g.isCustom
                      ? g.nameKey
                      : tc(g.nameKey.replace("category.", "") as Parameters<typeof tc>[0])}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* ── 子類 grid ── */}
          {selectedGroupKey && (
            <div>
              <div className="grid grid-cols-4 gap-2">
                {subcategories.map((sub) => (
                  <button
                    key={sub.key}
                    onClick={() => setSelectedSubcategory(sub)}
                    className={cn(
                      "flex flex-col items-center gap-1 p-2 rounded-xl border-2 transition-all",
                      selectedSubcategory?.key === sub.key
                        ? "border-amber-400 bg-amber-50"
                        : "border-transparent bg-gray-50 hover:bg-gray-100"
                    )}
                  >
                    <EmojiIcon emoji={sub.emoji} size={28} />
                    <CategoryName
                      nameKey={sub.nameKey}
                      isCustom={sub.isCustom}
                      className="text-xs text-gray-600 text-center leading-tight line-clamp-2"
                    />
                  </button>
                ))}

                {/* ＋ 自訂 tile */}
                {!addingCustom && (
                  <button
                    onClick={() => setAddingCustom(true)}
                    className="flex flex-col items-center gap-1 p-2 rounded-xl border-2 border-dashed border-gray-300 text-gray-400 hover:bg-gray-50 transition-all"
                  >
                    <Plus size={22} />
                    <span className="text-xs text-center leading-tight">自訂</span>
                  </button>
                )}
              </div>

              {/* 快速新增自訂子類表單 */}
              {addingCustom && (
                <div className="mt-3 bg-amber-50 rounded-2xl p-3 flex items-center gap-2">
                  <input
                    type="text"
                    maxLength={4}
                    value={customEmoji}
                    onChange={(e) => setCustomEmoji(e.target.value)}
                    className="w-12 text-2xl text-center bg-white rounded-xl border border-gray-200 py-1.5 outline-none focus:ring-2 focus:ring-amber-400"
                  />
                  <input
                    type="text"
                    value={customName}
                    onChange={(e) => setCustomName(e.target.value)}
                    placeholder="子類名稱"
                    autoFocus
                    className="flex-1 bg-white rounded-xl border border-gray-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-amber-400"
                  />
                  <button
                    onClick={handleAddCustom}
                    disabled={!customName.trim()}
                    className="p-2 bg-amber-500 disabled:bg-gray-200 text-white rounded-xl"
                  >
                    <Check size={18} />
                  </button>
                  <button onClick={() => setAddingCustom(false)} className="p-2 bg-gray-100 rounded-xl">
                    <X size={18} />
                  </button>
                </div>
              )}
            </div>
          )}

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

        </div>

        {/* Pinned footer — keeps the primary action reachable regardless of
            body height; pb includes the mobile safe-area inset so the button
            clears the home indicator / browser bottom bar. */}
        <div className="border-t border-gray-100 p-4 pb-[calc(env(safe-area-inset-bottom)+1rem)]">
          <button
            onClick={handleSave}
            disabled={!amount || !selectedSubcategory || isSaving}
            className="w-full bg-amber-500 disabled:bg-gray-200 disabled:text-gray-400 text-white font-bold text-lg rounded-2xl py-4 transition-colors"
          >
            {isSaving ? "..." : t("save")}
          </button>
        </div>
      </div>
    </div>
  );
}
