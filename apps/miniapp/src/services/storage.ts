export interface StorageAdapter {
  get<T>(key: string): T | null;
  set<T>(key: string, value: T): void;
  remove(key: string): void;
}

export function createMemoryStorage(): StorageAdapter {
  const map = new Map<string, string>();

  return {
    get<T>(key: string) {
      const raw = map.get(key);
      return raw ? (JSON.parse(raw) as T) : null;
    },
    set<T>(key: string, value: T) {
      map.set(key, JSON.stringify(value));
    },
    remove(key: string) {
      map.delete(key);
    }
  };
}
