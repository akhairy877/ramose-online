export const safeLocalStorage = {
  get<T>(key: string, fallback: T): T {
    try {
      const raw = localStorage.getItem(key);
      if (!raw) return fallback;
      return JSON.parse(raw) as T;
    } catch {
      return fallback;
    }
  },
  set<T>(key: string, value: T): void {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // ignore quota or serialization errors
    }
  },
  remove(key: string): void {
    try {
      localStorage.removeItem(key);
    } catch {
      // ignore
    }
  },
};

export function persistState<T>(key: string, initial: T) {
  let state = safeLocalStorage.get<T>(key, initial);
  const get = () => state;
  const set = (next: T) => {
    state = next;
    safeLocalStorage.set(key, state);
  };
  return { get, set };
}
