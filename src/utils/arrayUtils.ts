export function groupBy<T>(
  array: T[],
  predicate: (elem: T) => string | number | symbol | undefined | null,
) {
  return array.reduce<Record<string | number | symbol, T[]>>((b, e) => {
    const k = predicate(e);
    const key = k ?? "undefined";
    if (key in b) {
      b[key].push(e);
    } else {
      b[key] = [e];
    }
    return b;
  }, {});
}

export function sumBy<T>(array: T[], predicate: (elem: T) => number) {
  return array.reduce((prev, curr) => prev + predicate(curr), 0);
}
