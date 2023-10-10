export const isStringNull = (text: string | null | undefined) =>
  !text ||
  text.toLowerCase() === "null" ||
  text.toLowerCase() === "undefined" ||
  text.trim() === "";

export const capitalizeFirstLetter = (text: string) =>
  text[0].toUpperCase() + text.slice(1);

const ordinalRules = new Intl.PluralRules("en-US", { type: "ordinal" });

export const getOrdinalSuffix = (n: number) =>
  ({
    zero: "th",
    one: "st",
    two: "nd",
    few: "rd",
    many: "th",
    other: "th",
  })[ordinalRules.select(n)];
