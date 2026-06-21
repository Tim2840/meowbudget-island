import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const nextConfig: NextConfig = {
  // PWA is handled by next-pwa; add when ready to configure
  images: {
    remotePatterns: [
      new URL("https://export-download.canva.com/**"),
      new URL("https://design.canva.ai/**"),
      new URL("https://design-manipulation-download.canva.com/**"),
    ],
  },
};

export default withNextIntl(nextConfig);
