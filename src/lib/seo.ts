import type { Metadata } from "next";
import { i18n, type Locale } from "@/i18n-config";
import {
  SITE,
  OG_LOCALE,
  absoluteUrl,
  localePath,
} from "@/lib/site";

type BuildPageMetadataArgs = {
  lang: string;
  path?: string;
  title: string;
  description: string;
};

function resolveLocale(lang: string): Locale {
  return (i18n.locales as readonly string[]).includes(lang)
    ? (lang as Locale)
    : i18n.defaultLocale;
}

export function buildPageMetadata({
  lang,
  path = "",
  title,
  description,
}: BuildPageMetadataArgs): Metadata {
  const locale = resolveLocale(lang);
  const canonicalPath = localePath(locale, path);
  const url = absoluteUrl(locale, path);

  const languages: Record<string, string> = {};
  for (const loc of i18n.locales) {
    languages[loc] = absoluteUrl(loc, path);
  }
  languages["x-default"] = absoluteUrl(i18n.defaultLocale, path);

  return {
    metadataBase: new URL(SITE.url),
    title,
    description,
    alternates: {
      canonical: canonicalPath,
      languages,
    },
    openGraph: {
      type: "website",
      locale: OG_LOCALE[locale],
      url,
      siteName: SITE.name,
      title,
      description,
      images: [
        {
          url: SITE.ogImagePath,
          width: 1200,
          height: 630,
          alt: SITE.name,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [SITE.ogImagePath],
    },
  };
}
