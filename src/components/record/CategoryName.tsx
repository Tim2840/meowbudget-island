"use client";

import { useTranslations } from "next-intl";

interface CategoryNameProps {
  nameKey: string;
  isCustom: boolean;
  className?: string;
}

/** Renders a translated category name, or raw string for custom categories. */
export function CategoryName({ nameKey, isCustom, className }: CategoryNameProps) {
  const t = useTranslations("category");
  if (isCustom) return <span className={className}>{nameKey}</span>;
  const key = nameKey.replace("category.", "");
  return <span className={className}>{t(key as Parameters<typeof t>[0])}</span>;
}

/** Pure string — for cases where you can't use JSX (e.g. aria-label). */
export function useCategoryName() {
  const t = useTranslations("category");
  return (nameKey: string, isCustom: boolean): string => {
    if (isCustom) return nameKey;
    return t(nameKey.replace("category.", "") as Parameters<typeof t>[0]);
  };
}
