"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { X, Plus, Eye, EyeOff, Pencil, Trash2, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { useCategoryStore } from "@/stores/useCategoryStore";
import { DEFAULT_GROUPS, DEFAULT_SUBCATEGORIES } from "@/lib/constants";
import type { CategoryGroup, Category } from "@/types";

interface CategoryManagerProps {
  onClose: () => void;
}

export default function CategoryManager({ onClose }: CategoryManagerProps) {
  const t = useTranslations("settings");
  const tc = useTranslations("category");
  const store = useCategoryStore();

  const [tab, setTab] = useState<"expense" | "income">("expense");
  const [expandedGroupKey, setExpandedGroupKey] = useState<string | null>(null);

  // Add group form
  const [showAddGroup, setShowAddGroup] = useState(false);
  const [newGroupEmoji, setNewGroupEmoji] = useState("🏷️");
  const [newGroupName, setNewGroupName] = useState("");

  // Add subcategory form (per group)
  const [addingSubFor, setAddingSubFor] = useState<string | null>(null);
  const [newSubEmoji, setNewSubEmoji] = useState("✏️");
  const [newSubName, setNewSubName] = useState("");

  // Edit form
  const [editingKey, setEditingKey] = useState<string | null>(null);
  const [editEmoji, setEditEmoji] = useState("");
  const [editName, setEditName] = useState("");

  const groups = store.getGroups(tab === "income");
  const allGroups = [...DEFAULT_GROUPS.filter((g) => g.isIncome === (tab === "income")), ...store.customGroups.filter((g) => g.isIncome === (tab === "income"))];

  const isGroupHidden = (key: string) => store.hiddenGroupKeys.includes(key);
  const isSubHidden = (key: string) => store.hiddenSubcategoryKeys.includes(key);

  const getGroupName = (g: CategoryGroup) =>
    g.isCustom ? g.nameKey : tc(g.nameKey.replace("category.", "") as Parameters<typeof tc>[0]);

  const getSubName = (s: Category) => {
    if (s.isCustom) return s.nameKey;
    return tc(s.nameKey.replace("category.", "") as Parameters<typeof tc>[0]);
  };

  const handleAddGroup = () => {
    if (!newGroupName.trim()) return;
    store.addGroup({
      key: `custom_group_${Date.now()}`,
      nameKey: newGroupName.trim(),
      emoji: newGroupEmoji,
      color: "#A0AEC0",
      isIncome: tab === "income",
      sortOrder: 999,
    });
    setNewGroupName("");
    setNewGroupEmoji("🏷️");
    setShowAddGroup(false);
  };

  const handleAddSub = (groupKey: string) => {
    if (!newSubName.trim()) return;
    const group = allGroups.find((g) => g.key === groupKey);
    if (!group) return;
    const refSub = DEFAULT_SUBCATEGORIES.find((s) => s.groupKey === groupKey);
    store.addSubcategory({
      key: `custom_${Date.now()}`,
      groupKey,
      nameKey: newSubName.trim(),
      emoji: newSubEmoji,
      color: group.color,
      resourceType: refSub?.resourceType ?? "coins",
      resourceAmount: refSub?.resourceAmount ?? 0,
      bonusCoins: refSub?.bonusCoins ?? 5,
      isIncome: group.isIncome,
      sortOrder: 999,
    });
    setNewSubName("");
    setNewSubEmoji("✏️");
    setAddingSubFor(null);
  };

  const startEdit = (key: string, emoji: string, name: string) => {
    setEditingKey(key);
    setEditEmoji(emoji);
    setEditName(name);
  };

  const commitEdit = (type: "group" | "sub") => {
    if (!editingKey || !editName.trim()) return;
    if (type === "group") {
      store.updateGroup(editingKey, { nameKey: editName.trim(), emoji: editEmoji });
    } else {
      store.updateSubcategory(editingKey, { nameKey: editName.trim(), emoji: editEmoji });
    }
    setEditingKey(null);
  };

  return (
    <div className="fixed inset-0 z-[60] flex flex-col bg-white">
      {/* Header */}
      <div className="flex items-center justify-between px-4 pt-safe-top pt-5 pb-3 border-b border-gray-100">
        <h2 className="text-xl font-bold text-gray-800">{t("manage_categories")}</h2>
        <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full">
          <X size={20} />
        </button>
      </div>

      {/* Tab toggle */}
      <div className="flex rounded-xl bg-gray-100 m-4 p-1">
        {(["expense", "income"] as const).map((tp) => (
          <button
            key={tp}
            onClick={() => { setTab(tp); setExpandedGroupKey(null); setShowAddGroup(false); }}
            className={cn(
              "flex-1 py-2 rounded-lg text-sm font-semibold transition-all",
              tab === tp ? "bg-white shadow text-amber-600" : "text-gray-500"
            )}
          >
            {tp === "expense" ? "支出" : "收入"}
          </button>
        ))}
      </div>

      {/* Group list */}
      <div className="flex-1 overflow-y-auto px-4 pb-4 space-y-2">
        {allGroups.map((group) => {
          const hidden = isGroupHidden(group.key);
          const expanded = expandedGroupKey === group.key;
          const subs = DEFAULT_SUBCATEGORIES.filter((s) => s.groupKey === group.key)
            .concat(store.customSubcategories.filter((s) => s.groupKey === group.key));

          return (
            <div key={group.key} className={cn("bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden", hidden && "opacity-50")}>
              {/* Group row */}
              <div className="flex items-center gap-3 px-4 py-3">
                <button
                  onClick={() => setExpandedGroupKey(expanded ? null : group.key)}
                  className="flex-1 flex items-center gap-3 min-w-0"
                >
                  <span className="text-xl">{group.emoji}</span>
                  {editingKey === group.key ? (
                    <div className="flex items-center gap-2 flex-1" onClick={(e) => e.stopPropagation()}>
                      <input value={editEmoji} onChange={(e) => setEditEmoji(e.target.value)} maxLength={4}
                        className="w-10 text-center border border-gray-200 rounded-lg py-1 outline-none text-sm" />
                      <input value={editName} onChange={(e) => setEditName(e.target.value)}
                        className="flex-1 border border-gray-200 rounded-lg px-2 py-1 text-sm outline-none" />
                      <button onClick={() => commitEdit("group")} className="text-amber-500"><Check size={16} /></button>
                      <button onClick={() => setEditingKey(null)} className="text-gray-400"><X size={16} /></button>
                    </div>
                  ) : (
                    <span className="text-base font-medium text-gray-700 truncate">{getGroupName(group)}</span>
                  )}
                </button>

                {/* Actions */}
                <div className="flex items-center gap-1 shrink-0">
                  {group.isCustom && editingKey !== group.key && (
                    <>
                      <button onClick={() => startEdit(group.key, group.emoji, group.isCustom ? group.nameKey : getGroupName(group))}
                        className="p-1.5 text-gray-400 hover:text-amber-500">
                        <Pencil size={15} />
                      </button>
                      <button onClick={() => store.removeGroup(group.key)}
                        className="p-1.5 text-gray-400 hover:text-red-500">
                        <Trash2 size={15} />
                      </button>
                    </>
                  )}
                  {!group.isCustom && (
                    <button
                      onClick={() => hidden ? store.showDefault(group.key, "group") : store.hideDefault(group.key, "group")}
                      className={cn("p-1.5", hidden ? "text-amber-500" : "text-gray-300 hover:text-amber-400")}
                    >
                      {hidden ? <Eye size={15} /> : <EyeOff size={15} />}
                    </button>
                  )}
                  <span className="text-gray-300 text-xs ml-1">{expanded ? "▲" : "▼"}</span>
                </div>
              </div>

              {/* Subcategory list */}
              {expanded && (
                <div className="border-t border-gray-50 px-4 py-2 space-y-1">
                  {subs.map((sub) => {
                    const subHidden = isSubHidden(sub.key);
                    return (
                      <div key={sub.key} className={cn("flex items-center gap-2 py-1.5", subHidden && "opacity-40")}>
                        <span className="text-lg w-7 text-center">{sub.emoji}</span>
                        {editingKey === sub.key ? (
                          <div className="flex items-center gap-2 flex-1">
                            <input value={editEmoji} onChange={(e) => setEditEmoji(e.target.value)} maxLength={4}
                              className="w-10 text-center border border-gray-200 rounded-lg py-1 outline-none text-sm" />
                            <input value={editName} onChange={(e) => setEditName(e.target.value)}
                              className="flex-1 border border-gray-200 rounded-lg px-2 py-1 text-sm outline-none" />
                            <button onClick={() => commitEdit("sub")} className="text-amber-500"><Check size={16} /></button>
                            <button onClick={() => setEditingKey(null)} className="text-gray-400"><X size={16} /></button>
                          </div>
                        ) : (
                          <span className="flex-1 text-sm text-gray-600">{getSubName(sub)}</span>
                        )}
                        <div className="flex items-center gap-1">
                          {sub.isCustom && editingKey !== sub.key && (
                            <>
                              <button onClick={() => startEdit(sub.key, sub.emoji, sub.nameKey)}
                                className="p-1 text-gray-300 hover:text-amber-500">
                                <Pencil size={13} />
                              </button>
                              <button onClick={() => store.removeSubcategory(sub.key)}
                                className="p-1 text-gray-300 hover:text-red-500">
                                <Trash2 size={13} />
                              </button>
                            </>
                          )}
                          {!sub.isCustom && (
                            <button
                              onClick={() => subHidden ? store.showDefault(sub.key, "subcategory") : store.hideDefault(sub.key, "subcategory")}
                              className={cn("p-1", subHidden ? "text-amber-500" : "text-gray-300 hover:text-amber-400")}
                            >
                              {subHidden ? <Eye size={13} /> : <EyeOff size={13} />}
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}

                  {/* Add subcategory */}
                  {addingSubFor === group.key ? (
                    <div className="flex items-center gap-2 pt-1">
                      <input value={newSubEmoji} onChange={(e) => setNewSubEmoji(e.target.value)} maxLength={4}
                        className="w-10 text-center border border-gray-200 rounded-lg py-1 outline-none text-sm" />
                      <input value={newSubName} onChange={(e) => setNewSubName(e.target.value)}
                        placeholder="子類名稱" autoFocus
                        className="flex-1 border border-gray-200 rounded-lg px-2 py-1.5 text-sm outline-none focus:border-amber-400" />
                      <button onClick={() => handleAddSub(group.key)} disabled={!newSubName.trim()}
                        className="p-1.5 bg-amber-500 disabled:bg-gray-200 text-white rounded-lg">
                        <Check size={14} />
                      </button>
                      <button onClick={() => setAddingSubFor(null)} className="p-1.5 bg-gray-100 rounded-lg">
                        <X size={14} />
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => { setAddingSubFor(group.key); setNewSubName(""); setNewSubEmoji("✏️"); }}
                      className="flex items-center gap-1.5 text-xs text-amber-500 font-medium py-1 hover:opacity-70"
                    >
                      <Plus size={13} />
                      {t("category_add_sub")}
                    </button>
                  )}
                </div>
              )}
            </div>
          );
        })}

        {/* Add custom group */}
        {showAddGroup ? (
          <div className="bg-amber-50 rounded-2xl p-4 space-y-3">
            <p className="text-sm font-semibold text-gray-700">{t("category_add_group")}</p>
            <div className="flex gap-2">
              <input value={newGroupEmoji} onChange={(e) => setNewGroupEmoji(e.target.value)} maxLength={4}
                className="w-12 text-2xl text-center bg-white rounded-xl border border-gray-200 py-2 outline-none focus:ring-2 focus:ring-amber-400" />
              <input value={newGroupName} onChange={(e) => setNewGroupName(e.target.value)}
                placeholder="大類名稱" autoFocus
                className="flex-1 bg-white rounded-xl border border-gray-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-amber-400" />
            </div>
            <div className="flex gap-2">
              <button onClick={handleAddGroup} disabled={!newGroupName.trim()}
                className="flex-1 py-2.5 bg-amber-500 disabled:bg-gray-200 disabled:text-gray-400 text-white font-semibold rounded-xl text-sm">
                新增
              </button>
              <button onClick={() => setShowAddGroup(false)}
                className="flex-1 py-2.5 bg-gray-100 text-gray-600 font-semibold rounded-xl text-sm">
                取消
              </button>
            </div>
          </div>
        ) : (
          <button
            onClick={() => setShowAddGroup(true)}
            className="w-full flex items-center justify-center gap-2 py-3 border-2 border-dashed border-gray-300 rounded-2xl text-gray-500 hover:border-amber-300 hover:text-amber-500 transition-colors text-sm font-medium"
          >
            <Plus size={16} />
            {t("category_add_group")}
          </button>
        )}
      </div>
    </div>
  );
}
