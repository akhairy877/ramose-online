import { useCallback, useMemo, useSyncExternalStore } from "react";
import { safeLocalStorage } from "./persist";

const CONTENT_KEY = "contentOverridesV1";

export type ContentKey =
  | "home.title"
  | "home.subtitle"
  | "home.helpCta"
  | "home.subjectsHeader"
  | "home.lessonsLabel"
  | "home.currentWeek"
  | "home.progress"
  | "home.week.past"
  | "home.week.current"
  | "home.week.future"
  | "home.legend.passed"
  | "home.legend.retry"
  | "home.legend.failed"
  | "home.legend.inprogress"
  | "home.legend.notstarted"
  | "home.teacherCta"
  | "home.adminCta"
  | "login.teacher.title"
  | "login.teacher.subtitle"
  | "login.admin.title"
  | "login.admin.subtitle";

export const defaultContent: Record<ContentKey, string> = {
  "home.title": "🌟 Grade 1 Vision Boards 🌟",
  "home.subtitle": "Track your journey to achieving your career dreams!",
  "home.helpCta": "🤝 Help students worldwide",
  "home.subjectsHeader": "Subjects",
  "home.lessonsLabel": "36 Lessons",
  "home.currentWeek": "Current Week:",
  "home.progress": "Progress:",
  "home.week.past": "Past",
  "home.week.current": "Current",
  "home.week.future": "Future",
  "home.legend.passed": "Passed",
  "home.legend.retry": "Can Retry",
  "home.legend.failed": "Failed (3 attempts)",
  "home.legend.inprogress": "In Progress",
  "home.legend.notstarted": "Not Started",
  "home.teacherCta": "🏫 Teacher Dashboard",
  "home.adminCta": "🔐 Admin Dashboard",
  "login.teacher.title": "🏫 Teacher Portal",
  "login.teacher.subtitle": "Access your student management dashboard",
  "login.admin.title": "🔐 Admin Portal",
  "login.admin.subtitle": "System Administration Access",
};

let contentCache: Record<string, string> | null = null;

function ensureCache() {
  if (!contentCache) {
    contentCache = safeLocalStorage.get<Record<string, string>>(
      CONTENT_KEY,
      {},
    );
  }
  return contentCache;
}

function subscribe(callback: () => void) {
  const handler = (e: StorageEvent) => {
    if (e.key === CONTENT_KEY) {
      contentCache = safeLocalStorage.get<Record<string, string>>(
        CONTENT_KEY,
        {},
      );
      callback();
    }
  };
  window.addEventListener("storage", handler);
  return () => window.removeEventListener("storage", handler);
}

function getSnapshot() {
  return ensureCache();
}

export function useContent(key: ContentKey) {
  const store = useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
  const value = (store[key] as string | undefined) ?? defaultContent[key];

  const setValue = useCallback(
    (next: string) => {
      const current = ensureCache();
      const nextStore = { ...current, [key]: next };
      contentCache = nextStore;
      safeLocalStorage.set(CONTENT_KEY, nextStore);
      // Trigger subscribers in same tab
      window.dispatchEvent(new StorageEvent("storage", { key: CONTENT_KEY }));
    },
    [key],
  );

  return [value, setValue] as const;
}

export function getAllContent() {
  const overrides = ensureCache();
  return { overrides, defaults: defaultContent };
}

export function resetAllContent() {
  contentCache = {};
  safeLocalStorage.remove(CONTENT_KEY);
  window.dispatchEvent(new StorageEvent("storage", { key: CONTENT_KEY }));
}
