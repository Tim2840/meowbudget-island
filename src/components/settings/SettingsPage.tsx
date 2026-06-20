"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter, usePathname } from "next/navigation";
import { Globe, Volume2, Zap, Bell, BookOpen, LogOut, LogIn } from "lucide-react";
import { useAuthStore } from "@/stores/useAuthStore";
import { useSettingsStore } from "@/stores/useSettingsStore";
import TutorialOverlay from "@/components/onboarding/TutorialOverlay";

export default function SettingsPage() {
  const t = useTranslations("settings");
  const router = useRouter();
  const pathname = usePathname();
  const { user, isAnonymous, signInWithGoogle, signOut } = useAuthStore();
  const { soundEnabled, animationsEnabled, notificationsEnabled, setSetting } = useSettingsStore();
  const [showTutorial, setShowTutorial] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const uid = user?.id ?? "local";

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
      <h1 className="text-2xl font-bold text-gray-800 mb-6">{t("title")}</h1>

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
              <p className="text-sm text-gray-600">{user.email ?? t("anonymous_account")}</p>
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
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">{t("preferences")}</p>
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden divide-y divide-gray-50">
          <SettingRow
            icon={<Globe size={18} />}
            label={t("language")}
            value={currentLocale === "zh-TW" ? t("language_zh") : t("language_en")}
            onClick={switchLanguage}
          />
          <SettingRow
            icon={<Volume2 size={18} />}
            label={t("sound")}
            toggle
            toggled={soundEnabled}
            onToggle={(v) => setSetting(uid, "soundEnabled", v)}
          />
          <SettingRow
            icon={<Zap size={18} />}
            label={t("animations")}
            toggle
            toggled={animationsEnabled}
            onToggle={(v) => setSetting(uid, "animationsEnabled", v)}
          />
          <SettingRow
            icon={<Bell size={18} />}
            label={t("notifications")}
            toggle
            toggled={notificationsEnabled}
            onToggle={(v) => setSetting(uid, "notificationsEnabled", v)}
          />
        </div>
      </section>

      {/* Tutorial */}
      <section>
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">{t("help")}</p>
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <SettingRow
            icon={<BookOpen size={18} />}
            label={t("replay_tutorial")}
            onClick={() => setShowTutorial(true)}
          />
        </div>
      </section>

      {/* Logout confirm */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-6">
          <div className="bg-white rounded-3xl p-6 w-full max-w-xs">
            <p className="text-base font-semibold text-gray-800 mb-4 text-center">{t("logout_confirm")}</p>
            <div className="flex gap-3">
              <button onClick={() => setShowLogoutConfirm(false)} className="flex-1 py-3 rounded-xl bg-gray-100 text-gray-600 font-medium">{t("cancel")}</button>
              <button onClick={handleLogout} className="flex-1 py-3 rounded-xl bg-red-500 text-white font-medium">{t("logout")}</button>
            </div>
          </div>
        </div>
      )}

      {/* Tutorial overlay */}
      {showTutorial && <TutorialOverlay onComplete={() => setShowTutorial(false)} />}
    </div>
  );
}

function SettingRow({
  icon,
  label,
  value,
  onClick,
  toggle,
  toggled,
  onToggle,
}: {
  icon: React.ReactNode;
  label: React.ReactNode;
  value?: string;
  onClick?: () => void;
  toggle?: boolean;
  toggled?: boolean;
  onToggle?: (value: boolean) => void;
}) {
  return (
    <button
      onClick={toggle ? () => onToggle?.(!toggled) : onClick}
      className="w-full flex items-center gap-3 px-4 py-3.5 hover:bg-gray-50 active:bg-gray-100 transition-colors text-left"
    >
      <span className="text-gray-500">{icon}</span>
      <span className="flex-1 text-base text-gray-700">{label}</span>
      {value && <span className="text-sm text-gray-400">{value}</span>}
      {toggle && (
        <div className={`w-11 h-6 rounded-full transition-colors ${toggled ? "bg-amber-500" : "bg-gray-200"}`}>
          <div className={`w-5 h-5 bg-white rounded-full shadow mt-0.5 transition-transform ${toggled ? "translate-x-5.5" : "translate-x-0.5"}`} />
        </div>
      )}
    </button>
  );
}
