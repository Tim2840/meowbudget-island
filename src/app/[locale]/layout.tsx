import { NextIntlClientProvider } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { routing } from "@/i18n/routing";
import { notFound } from "next/navigation";
import BottomNav from "@/components/layout/BottomNav";
import AppInitializer from "@/components/layout/AppInitializer";
import TutorialController from "@/components/onboarding/TutorialController";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!routing.locales.includes(locale as "zh-TW" | "en")) {
    notFound();
  }

  // Must be called before any i18n server API — enables static rendering
  setRequestLocale(locale);

  const messages = await getMessages();

  return (
    <NextIntlClientProvider messages={messages}>
      <AppInitializer />
      <TutorialController />
      <main className="flex-1 pb-20 max-w-md mx-auto w-full">
        {children}
      </main>
      <BottomNav />
    </NextIntlClientProvider>
  );
}
