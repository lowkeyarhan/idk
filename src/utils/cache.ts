import { logger } from "./logger";

export class WeakCache<K extends object, V> {
  private cache: WeakMap<K, V>;

  constructor() {
    this.cache = new WeakMap();
    logger.info("WeakCache initialized for optimized memory management.");
  }

  set(key: K, value: V): void {
    this.cache.set(key, value);
  }

  get(key: K): V | undefined {
    return this.cache.get(key);
  }

  has(key: K): boolean {
    return this.cache.has(key);
  }
}
