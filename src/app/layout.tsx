import type { Metadata, Viewport } from "next";
import { Geist } from "next/font/google";
import "./globals.css";

const geist = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "喵帳島 / MeowBudget Island",
  description: "記帳養成 App，讓每筆記帳都成為島嶼的成長",
  manifest: "/manifest.json",
  appleWebApp: { capable: true, statusBarStyle: "default", title: "喵帳島" },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#4F86C6",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-TW" className={geist.variable}>
      <body className="min-h-dvh bg-amber-50 antialiased">{children}</body>
    </html>
  );
}
