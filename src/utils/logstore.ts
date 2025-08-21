import { create } from "zustand";

// -----------------------------
// 타입 정의
// -----------------------------
export interface AppLog {
  timestamp: string;
  level: string;
  logger: string;
  message: string;
}

export interface WebLog {
  timestamp: string;
  method: string;
  protocol: string;
  size: number;
  path: string;
  status: number;
  referrer: string;
  userAgent: string;
  ip: string;
  aiScore: number;
}

interface LogState {
  appLogs: AppLog[];
  webLogs: WebLog[];
  addAppLog: (log: Omit<AppLog, "timestamp">) => void;
  addWebLog: (log: Omit<WebLog, "timestamp">) => void;
  reset: () => void;
}

// -----------------------------
// 로그 제너레이터 import
// -----------------------------
import { generateAppLog, generateWebLog } from "./mockGenerator";

// -----------------------------
// 초기 시드 데이터
// -----------------------------
const now = new Date();

// 현재 시간 기준 12개
const currentAppLogs: AppLog[] = Array.from({ length: 12 }, () => ({
  ...generateAppLog(),
  timestamp: new Date().toISOString(),
}));
const currentWebLogs: WebLog[] = Array.from({ length: 12 }, () => ({
  ...generateWebLog(),
  timestamp: new Date().toISOString(),
}));

// 과거 시간 기준 50개 (1분 간격)
const pastAppLogs: AppLog[] = Array.from({ length: 50 }, (_, i) => {
  const pastTime = new Date(now.getTime() - (50 - i) * 60 * 1000);
  return { ...generateAppLog(), timestamp: pastTime.toISOString() };
});
const pastWebLogs: WebLog[] = Array.from({ length: 50 }, (_, i) => {
  const pastTime = new Date(now.getTime() - (50 - i) * 60 * 1000);
  return { ...generateWebLog(), timestamp: pastTime.toISOString() };
});

// 합치기
const initialAppLogs = [...pastAppLogs, ...currentAppLogs];
const initialWebLogs = [...pastWebLogs, ...currentWebLogs];

// -----------------------------
// Zustand Store
// -----------------------------
export const useLogStore = create<LogState>((set) => ({
  appLogs: initialAppLogs,
  webLogs: initialWebLogs,

  addAppLog: (log) =>
    set((state) => {
      const newLog = { ...log, timestamp: new Date().toISOString() };
      return {
        appLogs: [newLog, ...state.appLogs], // 🔥 cutoff 필터 제거
      };
    }),

  addWebLog: (log) =>
    set((state) => {
      const newLog = { ...log, timestamp: new Date().toISOString() };
      return {
        webLogs: [newLog, ...state.webLogs], // 🔥 cutoff 필터 제거
      };
    }),

  reset: () => {
    const now = new Date();

    const currentAppLogs: AppLog[] = Array.from({ length: 12 }, () => ({
      ...generateAppLog(),
      timestamp: new Date().toISOString(),
    }));
    const currentWebLogs: WebLog[] = Array.from({ length: 12 }, () => ({
      ...generateWebLog(),
      timestamp: new Date().toISOString(),
    }));

    const pastAppLogs: AppLog[] = Array.from({ length: 50 }, (_, i) => {
      const pastTime = new Date(now.getTime() - (50 - i) * 60 * 1000);
      return { ...generateAppLog(), timestamp: pastTime.toISOString() };
    });
    const pastWebLogs: WebLog[] = Array.from({ length: 50 }, (_, i) => {
      const pastTime = new Date(now.getTime() - (50 - i) * 60 * 1000);
      return { ...generateWebLog(), timestamp: pastTime.toISOString() };
    });

    return {
      appLogs: [...pastAppLogs, ...currentAppLogs],
      webLogs: [...pastWebLogs, ...currentWebLogs],
    };
  },
}));
