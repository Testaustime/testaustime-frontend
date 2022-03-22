import { getAllTimeTopLanguages } from "./topLanguagesStatistics";

describe("topLanguagesStatistics", () => {
  it("has no items", () => {
    const result = getAllTimeTopLanguages([]);
    expect(result).toEqual([]);
  });

  it("has multiple items of 1 language", () => {
    const result = getAllTimeTopLanguages([
      { language: "ts", duration: 5 },
      { language: "ts", duration: 3 },
      { language: "ts", duration: 12 },
    ]);

    expect(result).toEqual([
      { language: "ts", duration: 20 }
    ]);
  });

  it("has multiple items of 2 languages, where java has more time", () => {
    const result = getAllTimeTopLanguages([
      { language: "ts", duration: 1 },
      { language: "java", duration: 10 },
      { language: "ts", duration: 2 },
      { language: "java", duration: 37 },
      { language: "ts", duration: 30 },
    ]);

    expect(result).toEqual([
      { language: "java", duration: 47 },
      { language: "ts", duration: 33 },
    ]);
  });

  it("has multiple items of 2 languages, where ts has more time", () => {
    const result = getAllTimeTopLanguages([
      { language: "java", duration: 1 },
      { language: "ts", duration: 10 },
      { language: "java", duration: 2 },
      { language: "ts", duration: 37 },
      { language: "java", duration: 30 },
    ]);

    expect(result).toEqual([
      { language: "ts", duration: 47 },
      { language: "java", duration: 33 },
    ]);
  });
});