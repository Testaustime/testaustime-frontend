export function groupBy<T>(array: T[], predicate: (elem: T) => string | number | symbol | undefined) {
  return array.reduce<Record<string | number | symbol, T[]>>((b, e) => {
    const k = predicate(e);
    if (!b[k ?? "undefined"]) {
      b[k ?? "undefined"] = [];
    }
    b[k ?? "undefined"].push(e);
    return b;
  }, {});
}

export function sumBy<T>(array: T[], predicate: (elem: T) => number) {
  return array.reduce((prev, curr) => prev + predicate(curr), 0);
}