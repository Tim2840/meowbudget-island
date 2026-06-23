"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter, usePathname } from "next/navigation";
import { Globe, Volume2, Zap, Bell, BookOpen, LogOut, LogIn, LayoutList, Wallet } from "lucide-react";
import { useAuthStore } from "@/stores/useAuthStore";
import { useTutorialStore } from "@/stores/useTutorialStore";
import { formatYearMonth } from "@/lib/streakUtils";
import CategoryManager from "./CategoryManager";
import BudgetManager from "./BudgetManager";

export default function SettingsPage() {
  const t = useTranslations("settings");
  const router = useRouter();
  const pathname = usePathname();
  const { user, isAnonymous, signInWithGoogle, signOut } = useAuthStore();
  const openTutorial = useTutorialStore((s) => s.open);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [showCategoryManager, setShowCategoryManager] = useState(false);
  const [showBudgetManager, setShowBudgetManager] = useState(false);

  const currentLocale = pathname.startsWith("/en") ? "en" : "zh-TW";

  const switchLanguage = () => {
    const newLocale = currentLocale === "zh-TW" ? "en" : "zh-TW";
    const newPath = pathname.replace(/^\/(zh-TW|en)/, `/${newLocale}`);
    router.replace(newPath);
  };

  const handleLogout = async () => {
    await signOut();
    setShowLogoutConfirm(false);
    router.refresh();
  };

  return (
    <div className="flex flex-col min-h-full px-4 pt-5 pb-4">
      <h1 className="text-xl font-bold text-gray-800 mb-5">{t("title")}</h1>

      {/* Account section */}
      <section className="mb-6">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">{t("account")}</p>
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden divide-y divide-gray-50">
          {isAnonymous || !user ? (
            <>
              <SettingRow icon={<LogIn size={18} />} label={t("login_google")} onClick={signInWithGoogle} />
            </>
          ) : (
            <div className="px-4 py-3">
              <p className="text-sm text-gray-600">{user.email ?? "匿名帳號"}</p>
            </div>
          )}
          {user && !isAnonymous && (
            <SettingRow
              icon={<LogOut size={18} className="text-red-400" />}
              label={<span className="text-red-500">{t("logout")}</span>}
              onClick={() => setShowLogoutConfirm(true)}
            />
          )}
        </div>
      </section>

      {/* Preferences */}
      <section className="mb-6">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">偏好設定</p>
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden divide-y divide-gray-50">
          <SettingRow
            icon={<Globe size={18} />}
            label={t("language")}
            value={currentLocale === "zh-TW" ? t("language_zh") : t("language_en")}
            onClick={switchLanguage}
          />
          <SettingRow
            icon={<LayoutList size={18} />}
            label={t("manage_categories")}
            onClick={() => setShowCategoryManager(true)}
          />
          <SettingRow
            icon={<Wallet size={18} />}
            label={t("manage_budget")}
            onClick={() => setShowBudgetManager(true)}
          />
          <SettingRow icon={<Volume2 size={18} />} label={t("sound")} toggle />
          <SettingRow icon={<Zap size={18} />} label={t("animations")} toggle defaultToggled />
          <SettingRow icon={<Bell size={18} />} label={t("notifications")} toggle />
        </div>
      </section>

      {/* Tutorial */}
      <section>
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">說明</p>
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <SettingRow
            icon={<BookOpen size={18} />}
            label={t("replay_tutorial")}
            onClick={openTutorial}
          />
        </div>
      </section>

      {/* Category Manager */}
      {showCategoryManager && <CategoryManager onClose={() => setShowCategoryManager(false)} />}

      {/* Budget Manager */}
      {showBudgetManager && (
        <BudgetManager
          yearMonth={formatYearMonth()}
          onClose={() => setShowBudgetManager(false)}
        />
      )}

      {/* Logout confirm */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 p-6">
          <div className="bg-white rounded-3xl p-6 w-full max-w-xs max-h-[90vh] overflow-y-auto">
            <p className="text-base font-semibold text-gray-800 mb-4 text-center">{t("logout_confirm")}</p>
            <div className="flex gap-3">
              <button onClick={() => setShowLogoutConfirm(false)} className="flex-1 py-3 rounded-xl bg-gray-100 text-gray-600 font-medium">取消</button>
              <button onClick={handleLogout} className="flex-1 py-3 rounded-xl bg-red-500 text-white font-medium">{t("logout")}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function SettingRow({
  icon,
  label,
  value,
  onClick,
  toggle,
  defaultToggled,
}: {
  icon: React.ReactNode;
  label: React.ReactNode;
  value?: string;
  onClick?: () => void;
  toggle?: boolean;
  defaultToggled?: boolean;
}) {
  const [toggled, setToggled] = useState(defaultToggled ?? false);

  return (
    <button
      onClick={toggle ? () => setToggled((v) => !v) : onClick}
      className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 active:bg-gray-100 transition-colors text-left"
    >
      <span className="text-gray-500">{icon}</span>
      <span className="flex-1 text-sm text-gray-700">{label}</span>
      {value && <span className="text-sm text-gray-400">{value}</span>}
      {toggle && (
        <div className={`w-11 h-6 rounded-full transition-colors ${toggled ? "bg-amber-500" : "bg-gray-200"}`}>
          <div className={`w-5 h-5 bg-white rounded-full shadow mt-0.5 transition-transform ${toggled ? "translate-x-5.5" : "translate-x-0.5"}`} />
        </div>
      )}
    </button>
  );
}
