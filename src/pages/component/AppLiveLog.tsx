import { useEffect, useState } from "react";
import BtnDropdown from "../../components/btn/btn-dropdown";

interface LogData {
  timestamp: string;
  level: string;
  logger: string;
  message: string;
}

const levels = ["GET", "POST", "PUT", "DELETE", "PATCH"];
const loggers = ["WebLogger", "AuthLogger", "UserLogger", "AdminLogger"];

export default function AppLiveLog() {
  const [logs, setLogs] = useState<LogData[]>(Array(12).fill({
    timestamp: "-",
    level: "-",
    logger: "-",
    message: "-"
  }));

  // 더미 로그 생성 함수
  const generateLog = (): LogData => {
    const now = new Date();
    return {
      timestamp: now.toISOString().replace("T", " ").slice(0, 19),
      level: levels[Math.floor(Math.random() * levels.length)],
      logger: loggers[Math.floor(Math.random() * loggers.length)],
      message: `/path/${Math.floor(Math.random() * 100)}`
    };
  };

  useEffect(() => {
    const interval = setInterval(() => {
      const newLog = generateLog();
      setLogs((prev) => [newLog, ...prev].slice(0, 12)); 
      // 항상 12개 유지
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full bg-[#0F0F0F] rounded-lg p-2">
      {/* 헤더 */}
      <div className="flex bg-[#171717] rounded-t-lg overflow-hidden">
        <div className="flex w-[200px] h-[36px] justify-center items-center bg-[#232323] rounded-tl-md">
          <span className="text-[14px] text-[#D8D8D8]">Timestamp</span>
          <BtnDropdown />
        </div>
        <div className="flex w-[140px] h-[36px] justify-center items-center bg-[#232323]">
          <span className="text-[14px] text-[#D8D8D8]">Level</span>
          <BtnDropdown />
        </div>
        <div className="flex w-[140px] h-[36px] justify-center items-center bg-[#232323]">
          <span className="text-[14px] text-[#D8D8D8]">Logger</span>
          <BtnDropdown />
        </div>
        <div className="flex flex-1 h-[36px] justify-center items-center bg-[#232323] rounded-tr-md">
          <span className="text-[14px] text-[#D8D8D8]">Message</span>
        </div>
      </div>

      {/* 데이터 행 (12줄 고정) */}
      <div className="flex flex-col">
        {logs.map((row, idx) => (
          <div
            key={idx}
            className="flex border-b border-[#2A2A2A] last:border-none"
          >
            <div className={`flex w-[200px] h-[36px] justify-center items-center bg-[#171717] 
              ${idx === 11 ? "rounded-bl-md" : ""}`}>
              <span className="text-[#D8D8D8] text-[14px] font-light font-['Geist_Mono']">
                {row.timestamp}
              </span>
            </div>
            <div className="flex w-[140px] h-[36px] justify-center items-center bg-[#171717]">
              <span className="text-[#D8D8D8] text-[14px]">{row.level}</span>
            </div>
            <div className="flex w-[140px] h-[36px] justify-center items-center bg-[#171717]">
              <span className="text-[#D8D8D8] text-[14px]">{row.logger}</span>
            </div>
            <div className={`flex flex-1 h-[36px] justify-center items-center bg-[#171717] 
              ${idx === 11 ? "rounded-br-md" : ""}`}>
              <span className="text-[#D8D8D8] text-[14px] truncate">
                {row.message}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
