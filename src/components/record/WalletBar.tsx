"use client";

import { useTranslations } from "next-intl";
import { Flame } from "lucide-react";
import GameIcon from "@/components/ui/GameIcon";
import { RESOURCE_ICON_MAP } from "@/lib/iconMap";

interface WalletBarProps {
  wallet: { coins: number; wood: number; fabric: number; fish: number };
  streak: number;
}

const resources = ["coins", "wood", "fabric", "fish"] as const;

export default function WalletBar({ wallet, streak }: WalletBarProps) {
  const t = useTranslations("resource");

  return (
    <div
      data-tutorial="wallet-bar"
      className="bg-white border-b border-amber-100 px-4 py-2.5 flex items-center gap-3 overflow-x-auto scrollbar-none"
    >
      {resources.map((key) => (
        <div key={key} className="flex items-center gap-1.5 shrink-0">
          <GameIcon icon={RESOURCE_ICON_MAP[key]} size={20} />
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
