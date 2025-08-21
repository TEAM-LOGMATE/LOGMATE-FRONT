import type { AppLog, WebLog } from "./logstore";
import { useLogStore } from "./logstore";

// -----------------------------
// 확률 기반 선택 함수
// -----------------------------
function pickWeighted<T>(items: [T, number][]): T {
  const total = items.reduce((sum, [, w]) => sum + w, 0);
  let r = Math.random() * total;
  for (const [item, weight] of items) {
    if (r < weight) return item;
    r -= weight;
  }
  return items[0][0];
}

// -----------------------------
// App 로그 생성 (offsetMinutes 지원)
// -----------------------------
export const generateAppLog = (offsetMinutes = 0): AppLog => {
  const loggers = ["AuthController", "UserService", "PaymentService", "FileService"];

  const messagesByLogger: Record<string, [string, number][]> = {
    AuthController: [
      ["POST /api/v1/auth/login - 200 OK", 50],
      ["Refreshing access token", 30],
      ["User logged out successfully", 20],
      ["POST /api/v1/auth/login - 401 Unauthorized", 5],
      ["Invalid session token from 203.0.113.54", 3],
    ],
    UserService: [
      ["User profile updated successfully", 40],
      ["Fetched user details (id=42)", 40],
      ["DB connection failed", 5],
      ["User not found (id=42)", 5],
    ],
    PaymentService: [
      ["Payment request processed", 40],
      ["Payment approved (user=1001)", 30],
      ["Refund completed", 20],
      ["Payment gateway timeout", 5],
      ["Card declined for user=1001", 5],
    ],
    FileService: [
      ["File upload completed (user=123)", 50],
      ["File downloaded /uploads/img.png", 30],
      ["File deleted (user=456)", 10],
      ["File not found /uploads/img.png", 5],
      ["Disk quota exceeded", 5],
    ],
  };

  const levels: [string, number][] = [
    ["INFO", 60],
    ["WARN", 20],
    ["ERROR", 15],
    ["FATAL", 5],
  ];

  const logger = loggers[Math.floor(Math.random() * loggers.length)];
  const message = pickWeighted(messagesByLogger[logger]);
  const level = pickWeighted(levels);

  const ts = new Date(Date.now() - offsetMinutes * 60000);

  return {
    timestamp: ts.toISOString().replace("T", " ").slice(0, 19),
    level,
    logger,
    message,
  };
};

// -----------------------------
// Web 로그 생성 (offsetMinutes 지원)
// -----------------------------
export const generateWebLog = (offsetMinutes = 0): WebLog => {
  const methods = ["GET", "POST", "PUT", "DELETE"];
  const protocols = ["HTTP/1.1", "HTTP/2"];
  const statuses: [number, number][] = [
    [200, 70],
    [301, 10],
    [400, 5],
    [401, 3],
    [403, 3],
    [404, 7],
    [500, 2],
  ];
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

  const status = pickWeighted(statuses);

  let aiScore = 0;
  if (status < 300) aiScore = Math.floor(Math.random() * 30);
  else if (status < 500) aiScore = Math.floor(Math.random() * 40) + 30;
  else aiScore = Math.floor(Math.random() * 30) + 70;

  const ts = new Date(Date.now() - offsetMinutes * 60000);

  return {
    timestamp: ts.toISOString().replace("T", " ").slice(0, 19),
    method: methods[Math.floor(Math.random() * methods.length)],
    protocol: protocols[Math.floor(Math.random() * protocols.length)],
    size: Math.floor(Math.random() * 10000) + 200,
    path: paths[Math.floor(Math.random() * paths.length)],
    status,
    referrer: referrers[Math.floor(Math.random() * referrers.length)],
    userAgent: userAgents[Math.floor(Math.random() * userAgents.length)],
    ip: `203.0.113.${Math.floor(Math.random() * 255)}`,
    aiScore,
  };
};

// -----------------------------
// 실시간 Mock 실행기
// -----------------------------
export const startMockLogs = () => {
  setInterval(() => {
    useLogStore.getState().addAppLog(generateAppLog());
    useLogStore.getState().addWebLog(generateWebLog());
  }, 2000);
};

// -----------------------------
// 시드 데이터 (테스트용: 1분 단위로 균등)
// -----------------------------
export const seedLogs = (count = 12, stepMinutes = 1) => {
  for (let i = 0; i < count; i++) {
    const offset = (count - 1 - i) * stepMinutes;
    useLogStore.getState().addAppLog(generateAppLog(offset));
    useLogStore.getState().addWebLog(generateWebLog(offset));
  }
};
