import type { AppLog, WebLog } from "./logstore";
import { useLogStore } from "./logstore";

// App 로그 생성
export const generateAppLog = (): AppLog => {
  const now = new Date();
  const levels = ["INFO", "WARN", "ERROR"];
  const loggers = ["AuthController", "UserService", "PaymentService", "SessionManager", "FileService", "ApiGateway"];
  const messages = [
    "GET /home 200",
    "POST /api/v1/auth/login - 401 Unauthorized",
    "Invalid session token from 203.0.113.54",
    "DB connection failed",
    "GET /api/v1/posts?page=2 200",
    "File upload completed (user=123)",
    "Payment gateway timeout",
    "Refreshing access token",
    "User profile updated successfully",
    "Too many requests from 198.51.100.12",
  ];

  return {
    timestamp: now.toISOString().replace("T", " ").slice(0, 19),
    level: levels[Math.floor(Math.random() * levels.length)],
    logger: loggers[Math.floor(Math.random() * loggers.length)],
    message: messages[Math.floor(Math.random() * messages.length)],
  };
};

// Web 로그 생성
export const generateWebLog = (): WebLog => {
  const now = new Date();
  const methods = ["GET", "POST", "PUT", "DELETE"];
  const protocols = ["HTTP/1.1", "HTTP/2"];
  const statuses = [200, 301, 400, 401, 403, 404, 500];
  const paths = [
    "/", "/home", "/login", "/signup", "/dashboard",
    "/api/v1/users", "/api/v1/posts", "/api/v1/uploads",
    "/static/js/app.js", "/static/css/main.css",
    "/admin", "/phpMyAdmin/", "/wp-login.php"
  ];
  const referrers = [
    "-", "https://www.google.com/", "https://m.naver.com/",
    "https://app.example.com/dashboard"
  ];
  const userAgents = [
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/139.0.0.0 Safari/537.36",
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 14_5) Safari/605.1.15",
    "Mozilla/5.0 (X11; Ubuntu; Linux x86_64) Firefox/128.0",
    "curl/8.5.0",
    "python-requests/2.31.0"
  ];

  const status = statuses[Math.floor(Math.random() * statuses.length)];

  return {
    timestamp: now.toISOString().replace("T", " ").slice(0, 19),
    method: methods[Math.floor(Math.random() * methods.length)],
    protocol: protocols[Math.floor(Math.random() * protocols.length)],
    size: Math.floor(Math.random() * 100000) + 500,
    path: paths[Math.floor(Math.random() * paths.length)],
    status,
    referrer: referrers[Math.floor(Math.random() * referrers.length)],
    userAgent: userAgents[Math.floor(Math.random() * userAgents.length)],
    ip: `203.0.113.${Math.floor(Math.random() * 255)}`,
    aiScore: status >= 400 ? Math.floor(Math.random() * 40) + 60 : Math.floor(Math.random() * 50),
  };
};

// Mock 실행기 (나중에 WebSocket 데이터로 교체 가능)
export const startMockLogs = () => {
  setInterval(() => {
    useLogStore.getState().addAppLog(generateAppLog());
    useLogStore.getState().addWebLog(generateWebLog());
  }, 2000);
};
