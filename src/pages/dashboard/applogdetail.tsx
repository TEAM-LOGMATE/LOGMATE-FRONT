import { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import BtnX from "../../components/btn/btn-x";

interface AppLogDetailPanelProps {
  log: {
    timestamp: string;
    level: string;
    logger: string;
    message: string;
  } | null;
  onClose: () => void;
}

export default function AppLogDetailPanel({ log, onClose }: AppLogDetailPanelProps) {
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

  const buildRaw = (log: AppLogDetailPanelProps["log"]) =>
    `[${log?.timestamp}] ${log?.level} ${log?.logger} - ${log?.message}`;

  return (
    <AnimatePresence>
      {log && (
        <motion.div
          key={log.timestamp}
          className="fixed inset-0 z-50 flex justify-end pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* 오른쪽 패널 */}
          <motion.div
            ref={panelRef}
            key={`${log.timestamp}-panel`}
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

            {/* 라벨/로거 정보 */}
            <div className="mt-6 space-y-2 text-[#AEAEAE] font-[Geist] text-[14px] font-normal leading-[145%]">
              <p><b>Level:</b> {log.level}</p>
              <p><b>Logger:</b> {log.logger}</p>
            </div>

            {/* Log line 섹션 */}
            <h3 className="mt-8 text-[#F2F2F2] font-[Geist] text-[20px] font-normal leading-[140%]">
              Log line
            </h3>

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
