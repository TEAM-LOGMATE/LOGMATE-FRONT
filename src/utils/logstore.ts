import { create } from "zustand";

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
  addAppLog: (log: AppLog) => void;
  addWebLog: (log: WebLog) => void;
  reset: () => void;
}

export const useLogStore = create<LogState>((set) => ({
  appLogs: [],
  webLogs: [],
  addAppLog: (log) =>
    set((state) => ({ appLogs: [log, ...state.appLogs].slice(0, 50) })), // 최근 50개만 유지
  addWebLog: (log) =>
    set((state) => ({ webLogs: [log, ...state.webLogs].slice(0, 50) })),
  reset: () => set({ appLogs: [], webLogs: [] }),
}));
