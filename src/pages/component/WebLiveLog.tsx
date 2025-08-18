import { useEffect, useState } from "react";
import BtnDropdown from "../../components/btn/btn-dropdown";

interface WebLogData {
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

const methods = ["GET", "POST", "PUT", "DELETE", "PATCH"];
const protocols = ["HTTP/1.1", "HTTP/2", "HTTP/3"];
const statuses = [200, 301, 400, 401, 403, 404, 500];

export default function WebLiveLog() {
  const [logs, setLogs] = useState<WebLogData[]>(
    Array(12).fill({
      timestamp: "-",
      method: "-",
      protocol: "-",
      size: 0,
      path: "-",
      status: 0,
      referrer: "-",
      userAgent: "-",
      ip: "-",
      aiScore: 0,
    })
  );

  // 더미 로그 생성
  const generateLog = (): WebLogData => {
    const now = new Date();
    return {
      timestamp: now.toISOString().replace("T", " ").slice(0, 19),
      method: methods[Math.floor(Math.random() * methods.length)],
      protocol: protocols[Math.floor(Math.random() * protocols.length)],
      size: Math.floor(Math.random() * 5000),
      path: `/path/${Math.floor(Math.random() * 100)}`,
      status: statuses[Math.floor(Math.random() * statuses.length)],
      referrer: "http://example.com",
      userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
      ip: `192.168.0.${Math.floor(Math.random() * 255)}`,
      aiScore: Math.floor(Math.random() * 100),
    };
  };

  useEffect(() => {
    const interval = setInterval(() => {
      const newLog = generateLog();
      setLogs((prev) => [newLog, ...prev].slice(0, 12));
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full bg-[#0F0F0F] rounded-lg p-2">
      {/* 헤더 */}
      <div className="flex bg-[#171717] rounded-t-lg overflow-hidden">
        {/* Timestamp */}
        <div className="flex h-[36px] px-0 justify-center items-center gap-1 bg-[#232323] rounded-tl-md w-[200px]">
          <span className="text-[14px] text-[#D8D8D8]">Timestamp</span>
          <BtnDropdown />
        </div>
        {/* Method */}
        <div className="flex h-[36px] px-4 justify-center items-center gap-1 bg-[#232323] w-[120px]">
          <span className="text-[14px] text-[#D8D8D8]">Method</span>
          <BtnDropdown />
        </div>
        {/* Protocol */}
        <div className="flex h-[36px] px-4 justify-center items-center gap-1 bg-[#232323] w-[120px]">
          <span className="text-[14px] text-[#D8D8D8]">Protocol</span>
          <BtnDropdown />
        </div>
        {/* Size (드롭다운 X) */}
        <div className="flex h-[36px] px-6 justify-center items-center gap-1 bg-[#232323] w-[100px]">
          <span className="text-[14px] text-[#D8D8D8]">Size</span>
        </div>
        {/* Path (드롭다운 X) */}
        <div className="flex h-[36px] px-0 justify-center items-center gap-1 bg-[#232323] flex-1">
          <span className="text-[14px] text-[#D8D8D8]">Path</span>
        </div>
        {/* Status */}
        <div className="flex h-[36px] px-3 justify-center items-center gap-1 bg-[#232323] w-[100px]">
          <span className="text-[14px] text-[#D8D8D8]">Status</span>
          <BtnDropdown />
        </div>
        {/* Referrer (드롭다운 X) */}
        <div className="flex h-[36px] px-6 justify-center items-center gap-1 bg-[#232323] w-[140px]">
          <span className="text-[14px] text-[#D8D8D8]">Referrer</span>
        </div>
        {/* User-Agent */}
        <div className="flex h-[36px] px-4 justify-center items-center gap-1 bg-[#232323] w-[160px]">
          <span className="text-[14px] text-[#D8D8D8]">User-Agent</span>
          <BtnDropdown />
        </div>
        {/* IP (드롭다운 X) */}
        <div className="flex h-[36px] px-6 justify-center items-center gap-1 bg-[#232323] w-[140px]">
          <span className="text-[14px] text-[#D8D8D8]">IP</span>
        </div>
        {/* AI Score (드롭다운 X) */}
        <div className="flex h-[36px] px-6 justify-center items-center gap-1 bg-[#232323] rounded-tr-md w-[120px]">
          <span className="text-[14px] text-[#D8D8D8]">AI Score</span>
        </div>
      </div>

      {/* 데이터 행 */}
      <div className="flex flex-col">
        {logs.map((row, idx) => (
          <div
            key={idx}
            className="flex border-b border-[#2A2A2A] last:border-none"
          >
            {/* Timestamp */}
            <div className={`flex w-[200px] h-[36px] px-0 justify-center items-center bg-[#171717] ${idx === 11 ? "rounded-bl-md" : ""}`}>
              <span className="text-[#D8D8D8] text-[14px] font-light font-['Geist_Mono']">
                {row.timestamp}
              </span>
            </div>
            {/* Method */}
            <div className="flex w-[120px] h-[36px] px-4 justify-center items-center bg-[#171717]">
              <span className="text-[#D8D8D8] text-[14px]">{row.method}</span>
            </div>
            {/* Protocol */}
            <div className="flex w-[120px] h-[36px] px-4 justify-center items-center bg-[#171717]">
              <span className="text-[#D8D8D8] text-[14px]">{row.protocol}</span>
            </div>
            {/* Size */}
            <div className="flex w-[100px] h-[36px] px-6 justify-center items-center bg-[#171717]">
              <span className="text-[#D8D8D8] text-[14px]">{row.size}</span>
            </div>
            {/* Path */}
            <div className="flex flex-1 h-[36px] px-0 justify-center items-center bg-[#171717]">
              <span className="text-[#D8D8D8] text-[14px] truncate">
                {row.path}
              </span>
            </div>
            {/* Status */}
            <div className="flex w-[100px] h-[36px] px-3 justify-center items-center bg-[#171717]">
              <span className="text-[#D8D8D8] text-[14px]">{row.status}</span>
            </div>
            {/* Referrer */}
            <div className="flex w-[140px] h-[36px] px-6 justify-center items-center bg-[#171717]">
              <span className="text-[#D8D8D8] text-[14px] truncate">
                {row.referrer}
              </span>
            </div>
            {/* User-Agent */}
            <div className="flex w-[160px] h-[36px] px-4 justify-center items-center bg-[#171717]">
              <span className="text-[#D8D8D8] text-[14px] truncate">
                {row.userAgent}
              </span>
            </div>
            {/* IP */}
            <div className="flex w-[140px] h-[36px] px-6 justify-center items-center bg-[#171717]">
              <span className="text-[#D8D8D8] text-[14px]">{row.ip}</span>
            </div>
            {/* AI Score */}
            <div className={`flex w-[120px] h-[36px] px-6 justify-center items-center bg-[#171717] ${idx === 11 ? "rounded-br-md" : ""}`}>
              <span className="text-[#D8D8D8] text-[14px]">{row.aiScore}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
