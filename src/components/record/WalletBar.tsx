"use client";

import { useTranslations } from "next-intl";
import { Flame } from "lucide-react";
import { GameResourceIcon } from "@/components/ui/GameResourceIcon";
import type { ResourceType } from "@/types";

interface WalletBarProps {
  wallet: { coins: number; wood: number; fabric: number; fish: number };
  streak: number;
}

const RESOURCE_KEYS: ResourceType[] = ["coins", "wood", "fabric", "fish"];

export default function WalletBar({ wallet, streak }: WalletBarProps) {
  const t = useTranslations("resource");

  return (
    <div
      data-tutorial="wallet-bar"
      className="bg-white border-b border-amber-100 px-4 py-2 flex items-center gap-3 overflow-x-auto scrollbar-none"
    >
      {RESOURCE_KEYS.map((key) => (
        <div key={key} className="flex items-center gap-1 shrink-0">
          <GameResourceIcon type={key} size={15} />
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
