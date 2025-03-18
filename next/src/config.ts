export const defaultLocale = "en" as const;
export const locales = ["en", "fr"] as const;

export type Locale = (typeof locales)[number];

export const pathnames = {};
export const localePrefix = "always";

export const port = process.env.PORT || 3000;
export const host = process.env.WEBSITE_URL
  ? `https://${process.env.WEBSITE_URL}`
  : `http://localhost:${port}`;

export const STRAPI_BASE_URL = process.env.STRAPI_BASE_URL || "http://127.0.0.1:1337";
export const S3_BASE_URL = process.env.S3_BASE_URL || "https://s3.oursi.net"
