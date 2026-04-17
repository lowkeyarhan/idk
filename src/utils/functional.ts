export const partial =
  <A extends unknown[], B extends unknown[], R>(
    fn: (...args: [...A, ...B]) => R,
    ...presetArgs: A
  ) =>
  (...laterArgs: B): R =>
    fn(...presetArgs, ...laterArgs);

export function curry<A, B, R>(fn: (a: A, b: B) => R): (a: A) => (b: B) => R;
export function curry<A, B, C, R>(
  fn: (a: A, b: B, c: C) => R,
): (a: A) => (b: B) => (c: C) => R;
export function curry<A, B, C, D, R>(
  fn: (a: A, b: B, c: C, d: D) => R,
): (a: A) => (b: B) => (c: C) => (d: D) => R;
export function curry(fn: (...args: unknown[]) => unknown) {
  const curried = (...args: unknown[]): unknown => {
    if (args.length >= fn.length) {
      return fn(...args);
    }

    return (...nextArgs: unknown[]) => curried(...args, ...nextArgs);
  };

  return curried;
}
