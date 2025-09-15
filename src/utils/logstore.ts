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
  socket: WebSocket | null; // WebSocket 객체 보관
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
    // 기존 연결이 있으면 닫기
    const existing = get().socket;
    if (existing) {
      existing.close();
    }

    // .env에서 WebSocket Base URL 불러오기
    const wsBaseUrl = import.meta.env.VITE_WS_BASE_URL;

    const ws = new WebSocket(
      `${wsBaseUrl}/ws/logs/${agentId}/${thNum}`
    );

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
      console.log("🔌 WebSocket 수동 해제");
      set({ socket: null });
    }
  },
}));
