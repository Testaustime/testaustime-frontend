export function sumBy<T>(array: T[], predicate: (elem: T) => number) {
  return array.reduce((prev, curr) => prev + predicate(curr), 0);
}
