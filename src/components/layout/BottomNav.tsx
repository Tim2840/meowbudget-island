"use client";

import { Link, usePathname } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { BookOpen, BarChart2, MapPin, Cat, Settings } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useSettingsStore } from "@/stores/useSettingsStore";

const navItems = [
  { key: "record", icon: BookOpen, href: "/" },
  { key: "reports", icon: BarChart2, href: "/reports" },
  { key: "island", icon: MapPin, href: "/island" },
  { key: "cats", icon: Cat, href: "/cats" },
  { key: "settings", icon: Settings, href: "/settings" },
] as const;

export default function BottomNav() {
  const t = useTranslations("nav");
  const pathname = usePathname();
  const { animationsEnabled } = useSettingsStore();

  return (
    <nav className="fixed bottom-0 inset-x-0 z-50 bg-white border-t border-amber-100 safe-area-bottom">
      <div className="max-w-md mx-auto flex">
        {navItems.map(({ key, icon: Icon, href }) => {
          const isActive = href === "/" ? pathname === "/" : pathname.startsWith(href);
          const linkEl = (
            <Link
              key={key}
              href={href}
              data-tutorial={key === "island" ? "nav-island" : undefined}
              className={cn(
                "flex-1 flex flex-col items-center justify-center gap-0.5 py-3 min-h-[56px] transition-colors",
                isActive ? "text-amber-600" : "text-gray-400 hover:text-gray-600"
              )}
            >
              <Icon size={22} strokeWidth={isActive ? 2.5 : 1.8} />
              <span className="text-[11px] font-medium">{t(key)}</span>
            </Link>
          );

          if (!animationsEnabled) return linkEl;

          return (
            <motion.div
              key={key}
              className="flex-1"
              whileTap={{ scale: 0.85 }}
              transition={{ type: "spring", stiffness: 400, damping: 20 }}
            >
              {linkEl}
            </motion.div>
          );
        })}
      </div>
    </nav>
  );
}
