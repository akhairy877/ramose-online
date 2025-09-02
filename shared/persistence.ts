import { VisionBoardData } from "./types";

const DATA_KEY = "visionBoardDataV1";

export const DataStorage = {
  load(): VisionBoardData | null {
    try {
      const raw = localStorage.getItem(DATA_KEY);
      return raw ? (JSON.parse(raw) as VisionBoardData) : null;
    } catch {
      return null;
    }
  },
  save(data: VisionBoardData) {
    try {
      localStorage.setItem(DATA_KEY, JSON.stringify(data));
    } catch {
      // ignore quota errors
    }
  },
  reset() {
    try {
      localStorage.removeItem(DATA_KEY);
    } catch {
      // ignore
    }
  },
};
