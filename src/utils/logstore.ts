import { create } from "zustand";

// -----------------------------
// 타입 정의
// -----------------------------
export interface AppLog {
  timestamp: string;
  level: string;
  logger: string;
  message: string;
  raw?: string; // UI에서만 사용
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
  raw?: string; // UI에서만 사용
}

interface LogState {
  appLogs: AppLog[];
  webLogs: WebLog[];
  socket: WebSocket | null;
  addAppLog: (log: AppLog) => void;
  addWebLog: (log: WebLog) => void;
  connect: (agentId: string, thNum: string) => void;
  disconnect: () => void;
}

// -----------------------------
// Zustand Store
// -----------------------------
export const useLogStore = create<LogState>((set, get) => ({
  appLogs: [],
  webLogs: [],
  socket: null,

  addAppLog: (log) =>
    set((state) => ({
      appLogs: [log, ...state.appLogs],
    })),

  addWebLog: (log) =>
    set((state) => ({
      webLogs: [log, ...state.webLogs],
    })),

  connect: (agentId, thNum) => {
    const existing = get().socket;
    if (existing) {
      existing.close();
    }

    const wsBaseUrl = import.meta.env.VITE_WS_BASE_URL;
    const ws = new WebSocket(`${wsBaseUrl}/ws/logs/${agentId}/${thNum}`);
    set({ socket: ws });

    ws.onopen = () => console.log("WebSocket 연결 성공");

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);

      if (data.logType === "springboot") {
        set((state) => ({
          appLogs: [
            {
              timestamp: data.log.timestamp,
              level: data.log.level,
              logger: data.log.logger,
              message: data.log.message,
              raw: `[${data.log.timestamp}] ${data.log.level} ${data.log.logger} - ${data.log.message}`, 
            },
            ...state.appLogs,
          ],
        }));
      } else if (data.logType === "tomcat") {
        set((state) => ({
          webLogs: [
            {
              timestamp: data.log.timestamp,
              method: data.log.method,
              protocol: data.log.protocol,
              size: data.log.responseSize,
              path: data.log.url,
              status: data.log.statusCode,
              referrer: data.log.referer,
              userAgent: data.log.userAgent,
              ip: data.log.ip,
              aiScore: data.aiScore,
              raw: `${data.log.ip} - - [${data.log.timestamp}] "${data.log.method} ${data.log.url} ${data.log.protocol}" ${data.log.statusCode} ${data.log.responseSize} "${data.log.referer}" "${data.log.userAgent}"`,
            },
            ...state.webLogs,
          ],
        }));
      }
    };

    ws.onclose = () => console.log("WebSocket 연결 종료");
    ws.onerror = (err) => console.error("WebSocket 에러:", err);
  },

  disconnect: () => {
    const socket = get().socket;
    if (socket) {
      socket.close();
      console.log("WebSocket 수동 해제");
      set({ socket: null });
    }
  },
}));
