"use client";

import { useTranslations } from "next-intl";
import { Flame, Coins, Fish, TreePine, Scissors } from "lucide-react";
import type { LucideProps } from "lucide-react";

interface WalletBarProps {
  wallet: { coins: number; wood: number; fabric: number; fish: number };
  streak: number;
}

const resources: {
  key: "coins" | "wood" | "fabric" | "fish";
  Icon: React.ComponentType<LucideProps>;
  color: string;
}[] = [
  { key: "coins", Icon: Coins, color: "#F59E0B" },
  { key: "wood", Icon: TreePine, color: "#78350F" },
  { key: "fabric", Icon: Scissors, color: "#7C3AED" },
  { key: "fish", Icon: Fish, color: "#0891B2" },
];

export default function WalletBar({ wallet, streak }: WalletBarProps) {
  const t = useTranslations("resource");

  return (
    <div
      data-tutorial="wallet-bar"
      className="bg-white border-b border-amber-100 px-4 py-2 flex items-center gap-3 overflow-x-auto scrollbar-none"
    >
      {resources.map(({ key, Icon, color }) => (
        <div key={key} className="flex items-center gap-1 shrink-0">
          <Icon size={14} color={color} strokeWidth={2} />
          <span className="text-sm font-semibold text-gray-700">{wallet[key].toLocaleString()}</span>
        </div>
      ))}
      {streak > 0 && (
        <div className="ml-auto flex items-center gap-1 shrink-0">
          <Flame size={16} className="text-orange-500" />
          <span className="text-sm font-bold text-orange-500">{streak}</span>
        </div>
      )}
    </div>
  );
}
