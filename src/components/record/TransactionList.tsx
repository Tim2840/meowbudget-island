"use client";

import { useTranslations } from "next-intl";
import { ClipboardList } from "lucide-react";
import type { Transaction } from "@/types";
import { cn } from "@/lib/utils";
import { useCategoryName } from "./CategoryName";
import { EmojiIcon } from "@/components/ui/EmojiIcon";

interface TransactionListProps {
  transactions: Transaction[];
  date: string;
}

export default function TransactionList({ transactions, date }: TransactionListProps) {
  const t = useTranslations("reports");
  const getCategoryName = useCategoryName();

  if (transactions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-gray-400">
        <ClipboardList size={44} className="mb-3 text-gray-300" />
        <p className="text-base">{t("no_data")}</p>
      </div>
    );
  }

  const total = transactions.reduce(
    (acc, tx) => ({
      income: acc.income + (tx.type === "income" ? tx.amount : 0),
      expense: acc.expense + (tx.type === "expense" ? tx.amount : 0),
    }),
    { income: 0, expense: 0 }
  );

  return (
    <div className="space-y-3">
      {/* Day summary */}
      <div className="flex items-center justify-between text-sm text-gray-500 mb-1">
        <span>{date}</span>
        <div className="flex gap-3">
          <span className="text-green-600 font-medium">+{total.income.toLocaleString()}</span>
          <span className="text-red-500 font-medium">-{total.expense.toLocaleString()}</span>
        </div>
      </div>

      {/* Transactions */}
      {transactions.map((tx) => {
        const subName = getCategoryName(tx.categorySnapshot.nameKey, tx.categorySnapshot.isCustom);
        const groupName = tx.categorySnapshot.groupNameKey
          ? getCategoryName(tx.categorySnapshot.groupNameKey, false)
          : null;
        return (
          <div key={tx.id} className="flex items-center gap-3 bg-white rounded-2xl px-4 py-3 shadow-sm">
            <EmojiIcon emoji={tx.categorySnapshot.emoji} size={28} />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-700 truncate">{subName}</p>
              {groupName && groupName !== subName && (
                <p className="text-xs text-gray-400 truncate">{groupName}</p>
              )}
              {tx.note && <p className="text-xs text-gray-400 truncate">{tx.note}</p>}
            </div>
            <span className={cn(
              "text-base font-bold",
              tx.type === "income" ? "text-green-600" : "text-red-500"
            )}>
              {tx.type === "income" ? "+" : "-"}{tx.amount.toLocaleString()}
            </span>
          </div>
        );
      })}
    </div>
  );
}
