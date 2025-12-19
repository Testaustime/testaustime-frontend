import { sumBy } from "../../utils/arrayUtils";
import { isStringNull } from "../../utils/stringUtils";

interface TopLanguagesRequirement {
  language: string | undefined | null;
  duration: number;
}

export const getAllTimeTopLanguages = (entries: TopLanguagesRequirement[]) => {
  const byLanguage = Object.groupBy(
    entries,
    (entry) => entry.language ?? "undefined",
  );
  return Object.keys(byLanguage)
    .map((language) => ({
      language: isStringNull(language) ? undefined : language,
      duration: sumBy(byLanguage[language] ?? [], (entry) => entry.duration),
    }))
    .sort((a, b) => b.duration - a.duration);
};
