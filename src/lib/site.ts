import { i18n, type Locale } from "@/i18n-config";

export const SITE_URL = "https://sumerplus.com";

export const SITE = {
  url: SITE_URL,
  name: "SumerPlus",
  legalName: "SumerPlus Business Services and Insurance Agency",
  email: "info@sumerplus.com",
  phone: "321-353-1287",
  phoneTel: "+13213531287",
  instagramUrl: "https://www.instagram.com/sumer.plus/",
  instagramHandle: "sumer.plus",
  logoPath: "/brand/logo-512.webp",
  ogImagePath: "/brand/og-default.png",
  address: {
    streetAddress: "555 Winderley Place, Suite 300",
    addressLocality: "Maitland",
    addressRegion: "FL",
    postalCode: "32751",
    addressCountry: "US",
  },
  locales: i18n.locales,
  defaultLocale: i18n.defaultLocale,
} as const;

export function formatSiteAddress(multiline = false): string {
  const { streetAddress, addressLocality, addressRegion, postalCode } =
    SITE.address;
  const cityLine = `${addressLocality}, ${addressRegion} ${postalCode}`;
  return multiline
    ? `${streetAddress}\n${cityLine}`
    : `${streetAddress}, ${cityLine}`;
}

export const OG_LOCALE: Record<Locale, string> = {
  en: "en_US",
  es: "es_ES",
  ru: "ru_RU",
};

/** Public marketing paths without locale prefix (leading slash, no trailing slash except root). */
export const SITE_PATHS = [
  "",
  "/services",
  "/insurance",
  "/about",
  "/contact",
  "/book",
  "/calculator",
  "/leakage",
  "/faq",
  "/personal-tax",
  "/corporate-tax",
] as const;

export function localePath(lang: string, path = ""): string {
  const normalized = path === "/" ? "" : path;
  return `/${lang}${normalized}`;
}

export function absoluteUrl(lang: string, path = ""): string {
  return `${SITE_URL}${localePath(lang, path)}`;
}
