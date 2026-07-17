type Entry<T> = { value: T; expiresAt?: number };

export class InMemoryCache<T> {
  private cache = new Map<string, Entry<T>>();
  private readonly maxSize: number;
  private readonly defaultTtl: number;

  constructor(options: { maxSize?: number; defaultTtl?: number } = {}) {
    this.maxSize = options.maxSize ?? 100;
    this.defaultTtl = options.defaultTtl ?? 5 * 60 * 1000;
  }

  get(key: string): T | undefined {
    const entry = this.cache.get(key);
    if (!entry) return undefined;
    if (entry.expiresAt && Date.now() > entry.expiresAt) {
      this.cache.delete(key);
      return undefined;
    }
    return entry.value;
  }

  set(key: string, value: T, ttl?: number): void {
    if (this.cache.size >= this.maxSize) {
      const firstKey = this.cache.keys().next().value;
      if (firstKey) this.cache.delete(firstKey);
    }
    this.cache.set(key, {
      value,
      expiresAt: ttl ? Date.now() + ttl : Date.now() + this.defaultTtl,
    });
  }

  has(key: string): boolean {
    return this.get(key) !== undefined;
  }

  clear(): void {
    this.cache.clear();
  }

  delete(key: string): boolean {
    return this.cache.delete(key);
  }

  get size(): number {
    return this.cache.size;
  }
}

export function createSvgCache(): InMemoryCache<string> {
  return new InMemoryCache<string>({ maxSize: 50, defaultTtl: 10 * 60 * 1000 });
}
