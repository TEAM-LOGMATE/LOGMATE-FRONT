import { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import BtnX from "../../components/btn/btn-x";

interface WebLogDetailPanelProps {
  log: {
    timestamp: string;
    method: string;
    protocol: string;
    size: number;
    userAgent: string;
    path: string;
    status: number;
    referrer: string;
    ip: string;
    aiScore: number;
  } | null;
  onClose: () => void;
}

export default function WebLogDetailPanel({ log, onClose }: WebLogDetailPanelProps) {
  const panelRef = useRef<HTMLDivElement>(null);

  // 패널 외부 클릭 시 닫기
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        onClose();
      }
    }
    if (log) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [log, onClose]);

  if (!log) return null;

  // AI Score 색상 분기
  const getAiScoreColor = (score: number) => {
    if (score < 60) return "text-[#4FE75E] border-[#1F5A05]"; // 초록
    if (score <= 70) return "text-[#FFC107] border-[#806000]"; // 노랑
    return "text-[#F44336] border-[#7A1B1B]"; // 빨강
  };

  const buildRaw = (log: NonNullable<WebLogDetailPanelProps["log"]>) =>
    `${log.ip} - - [${log.timestamp}] "${log.method} ${log.path} ${log.protocol}" ${log.status} ${log.size} "${log.referrer}" "${log.userAgent}"`;

  return (
    <AnimatePresence mode="wait">
      {log && (
        <motion.div
          key={`weblog-overlay-${log.timestamp}-${log.ip}`}
          className="fixed inset-0 z-50 flex justify-end pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* 오른쪽 패널 */}
          <motion.div
            ref={panelRef}
            key={`weblog-panel-${log.timestamp}-${log.ip}`}
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="w-[500px] h-full shadow-lg flex flex-col p-6 overflow-y-auto 
                       border-l border-[#353535] bg-[#222] pointer-events-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* 닫기 버튼 */}
            <div className="flex justify-end">
              <BtnX onClick={onClose} />
            </div>

            {/* Log details 제목 */}
            <h2 className="text-white font-[Geist] text-[20px] font-normal leading-[140%]">
              Log details
            </h2>

            {/* 시간 */}
            <p className="mt-2 text-[#D8D8D8] font-['Geist_Mono'] text-[14px] font-light leading-[150%] text-left">
              {log.timestamp}
            </p>

            {/* 주요 정보 */}
            <div className="mt-6 grid grid-cols-2 gap-y-2 text-[#AEAEAE] font-[Geist] text-[14px] font-normal leading-[145%]">
              <p><b>Method:</b> {log.method}</p>
              <p><b>Path:</b> {log.path}</p>
              <p><b>Protocol:</b> {log.protocol}</p>
              <p><b>Status:</b> {log.status}</p>
              <p><b>Size:</b> {log.size}</p>
              <p>
                <b>Referrer:</b>
                <a
                  href={log.referrer}
                  target="_blank"
                  rel="noreferrer"
                  className="text-blue-400 underline ml-1"
                >
                  {log.referrer}
                </a>
              </p>
              <p><b>User_agent:</b> {log.userAgent}</p>
              <p><b>IP:</b> {log.ip}</p>
            </div>

            {/* Log line + AI Score */}
            <div className="mt-8 flex justify-between items-center">
              <h3 className="text-[#F2F2F2] font-[Geist] text-[20px] font-normal leading-[140%]">
                Log line
              </h3>
              <div
                className={`flex px-3 py-1 justify-center items-center gap-2 rounded-[8px] border ${getAiScoreColor(
                  log.aiScore
                )} bg-[#222]`}
              >
                <span className="text-[14px] font-[Geist]">AI Score: {log.aiScore}</span>
              </div>
            </div>

            {/* Raw 로그 전체 */}
            <div className="mt-3 flex items-start gap-2 p-[19px_16px] rounded-[8px] bg-[#171717] 
                            text-[#D8D8D8] font-[Geist] text-[16px] font-normal leading-[150%] 
                            whitespace-pre-wrap break-words">
              {buildRaw(log)}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
