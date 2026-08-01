import "server-only";
import type { Locale } from "../i18n-config";
import { i18n } from "../i18n-config";

const dictionaries = {
  en: () => import("../dictionaries/en.json").then((module) => module.default),
  es: () => import("../dictionaries/es.json").then((module) => module.default),
  ru: () => import("../dictionaries/ru.json").then((module) => module.default),
};

export type Dictionary = Awaited<ReturnType<(typeof dictionaries)["en"]>>;

function resolveLocale(locale: string): Locale {
  return (i18n.locales as readonly string[]).includes(locale)
    ? (locale as Locale)
    : i18n.defaultLocale;
}

export const getDictionary = async (locale: string): Promise<Dictionary> => {
  return dictionaries[resolveLocale(locale)]();
};
