import { groupBy, sumBy } from "../../utils/arrayUtils";
import { isStringNull } from "../../utils/stringUtils";

export interface TopLanguagesRequirement {
  language?: string,
  duration: number
}

export const getAllTimeTopLanguages = (entries: TopLanguagesRequirement[]) => {
  const byLanguage = groupBy(entries, entry => entry.language);
  return Object.keys(byLanguage).map(language => ({
    language: isStringNull(language) ? undefined : language,
    duration: sumBy(byLanguage[language], entry => entry.duration)
  })).sort((a, b) => b.duration - a.duration);
};
