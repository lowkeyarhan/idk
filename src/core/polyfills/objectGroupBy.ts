type GroupByFn = <T>(
  items: Iterable<T>,
  callbackFn: (item: T, index: number) => PropertyKey,
) => Record<string, T[]>;

const objectConstructor = Object as typeof Object & {
  groupBy?: GroupByFn;
};

if (typeof objectConstructor.groupBy !== "function") {
  objectConstructor.groupBy = function groupBy<T>(
    items: Iterable<T>,
    callbackFn: (item: T, index: number) => PropertyKey,
  ): Record<string, T[]> {
    const result: Record<string, T[]> = {};
    let index = 0;

    for (const item of items) {
      const key = String(callbackFn(item, index++));
      if (!result[key]) {
        result[key] = [];
      }
      result[key].push(item);
    }

    return result;
  };
}
