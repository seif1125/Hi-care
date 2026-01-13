import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

// Explicitly point to the request file
const withNextIntl = createNextIntlPlugin(
  './src/i18n/request.ts'
);

const nextConfig: NextConfig = {
  /* other config options here */
};

export default withNextIntl(nextConfig);
