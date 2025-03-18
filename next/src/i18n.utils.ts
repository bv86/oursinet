import "server-only";
import type { Locale } from "./config";
import _ from "lodash";

// We enumerate all dictionaries here for better linting and typescript support
// We also get the default import for cleaner types
const dictionaries = {
  en: () => import("./dictionaries/en.json").then((module) => module.default),
  fr: () => import("./dictionaries/fr.json").then((module) => module.default),
};

export const getDictionary = async (locale: Locale) =>
  dictionaries[locale]?.() ?? dictionaries.en();

export const getTranslation = async (locale: Locale, key: string): Promise<string> => {
  const dictionary = await getDictionary(locale);
  return _.get(dictionary, key) ?? (locale !== "en" ? getTranslation("en", key) : key);
}