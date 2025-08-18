// src/utils/mock.ts

export const mockAppDashboard = {
  logCount: {
    total: 12345,
    today: 123,
  },
  logLevelRatio: {
    info: 320,
    warning: 50,
    error: 45,
  },
  logByEndpoint: [
    { endpoint: "/home", count: 500 },
    { endpoint: "/login", count: 123 },
    { endpoint: "/user", count: 75 },
  ],
  realtimeLogs: [
    {
      timestamp: "2025-08-18T17:35:22Z",
      level: "INFO",
      logger: "AuthController",
      message: "GET /home",
    },
    {
      timestamp: "2025-08-18T17:36:10Z",
      level: "ERROR",
      logger: "UserService",
      message: "POST /login - DB connection failed",
    },
    {
      timestamp: "2025-08-18T17:36:45Z",
      level: "WARN",
      logger: "SessionManager",
      message: "Invalid session token",
    },
  ],
  anomalyTimeline: [
    { time: "2025-08-18T00:00:00Z", count: 0 },
    { time: "2025-08-18T06:00:00Z", count: 3 },
    { time: "2025-08-18T12:00:00Z", count: 1 },
  ],
  logsByTime: [
    { time: "2025-08-18T00:00:00Z", count: 50 },
    { time: "2025-08-18T06:00:00Z", count: 120 },
    { time: "2025-08-18T12:00:00Z", count: 300 },
  ],
};
