import type { MetadataRoute } from "next";
import { i18n } from "@/i18n-config";
import { SITE_PATHS, absoluteUrl } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const entries: MetadataRoute.Sitemap = [];

  for (const path of SITE_PATHS) {
    const languages: Record<string, string> = {};
    for (const locale of i18n.locales) {
      languages[locale] = absoluteUrl(locale, path);
    }
    languages["x-default"] = absoluteUrl(i18n.defaultLocale, path);

    for (const locale of i18n.locales) {
      entries.push({
        url: absoluteUrl(locale, path),
        lastModified: new Date(),
        changeFrequency: path === "" ? "weekly" : "monthly",
        priority: path === "" ? 1 : path === "/faq" ? 0.8 : 0.7,
        alternates: { languages },
      });
    }
  }

  return entries;
}
