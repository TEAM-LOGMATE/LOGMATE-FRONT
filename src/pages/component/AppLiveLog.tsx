import { useRef, useState, useMemo } from "react";
import BtnDropdown from "../../components/btn/btn-dropdown";
import SearchRefresh from "./searchrefresh";
import { useLogStore } from "../../utils/logstore";

interface AppLiveLogProps {
  onSelectLog?: (log: any) => void; // 로그 선택 이벤트
}

export default function AppLiveLog({ onSelectLog }: AppLiveLogProps) {
  const logs = useLogStore((s) => s.appLogs);
  const containerRef = useRef<HTMLDivElement>(null);

  // --- 검색 상태 ---
  const [keyword, setKeyword] = useState("");

  // --- 필터 상태 ---
  const [levelFilter, setLevelFilter] = useState<string | null>(null);
  const [loggerFilter, setLoggerFilter] = useState<string | null>(null);

  // --- 정렬 상태 (Timestamp 전용) ---
  const [sortAsc, setSortAsc] = useState(false);

  // 새로고침 → 검색 + 필터 초기화
  const handleRefresh = () => {
    setKeyword("");
    setLevelFilter(null);
    setLoggerFilter(null);
  };

  // --- 드롭다운 옵션 (로그 들어왔을 때만 생성) ---
  const uniqueLevels = useMemo(
    () =>
      logs.length > 0
        ? Array.from(new Set(logs.map((l) => l.level).filter(Boolean)))
        : [],
    [logs]
  );

  const uniqueLoggers = useMemo(
    () =>
      logs.length > 0
        ? Array.from(new Set(logs.map((l) => l.logger).filter(Boolean)))
        : [],
    [logs]
  );

  // --- 필터링 로직 ---
  const filteredLogs = useMemo(() => {
    return logs.filter((log) => {
      const matchesKeyword =
        keyword.trim() === "" ||
        Object.values(log).some((value) =>
          String(value).toLowerCase().includes(keyword.toLowerCase())
        );

      const matchesLevel = !levelFilter || log.level === levelFilter;
      const matchesLogger = !loggerFilter || log.logger === loggerFilter;

      return matchesKeyword && matchesLevel && matchesLogger;
    });
  }, [logs, keyword, levelFilter, loggerFilter]);

  // --- 정렬 (Timestamp 전용) ---
  const visibleLogs = useMemo(() => {
    const sorted = [...filteredLogs];
    sorted.sort((a, b) => {
      const t1 = new Date(a.timestamp).getTime();
      const t2 = new Date(b.timestamp).getTime();
      return sortAsc ? t1 - t2 : t2 - t1;
    });
    return sorted;
  }, [filteredLogs, sortAsc]);

  return (
    <div className="w-full">
      {/* 검색 + 새로고침 */}
      <SearchRefresh onSearch={setKeyword} onRefresh={handleRefresh} />

      <div className="mt-2 bg-[#0F0F0F] rounded-lg p-2">
        {/* 헤더 */}
        <div className="flex bg-[#171717] rounded-t-lg overflow-visible">
          {/* Timestamp 헤더 (정렬 토글) */}
          <div
            className="flex w-[200px] h-[36px] justify-center items-center gap-1 bg-[#232323] rounded-tl-md cursor-pointer"
            onClick={() => setSortAsc((prev) => !prev)}
          >
            <span className="text-[14px] text-[#D8D8D8]">Timestamp</span>
            <button
              className="w-[24px] h-[24px] flex items-center justify-center p-0 bg-transparent border-none"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                className={`w-6 h-6 transform transition-transform duration-200 ${
                  sortAsc ? "rotate-180" : ""
                }`}
                fill="none"
              >
                <path
                  d="M11.7474 16.1399L6.95119 10.6585C6.38543 10.0119 6.84461 9 7.70377 9H17.2962C18.1554 9 18.6146 10.0119 18.0488 10.6585L13.2526 16.1399C12.8542 16.5952 12.1458 16.5952 11.7474 16.1399Z"
                  fill="#AEAEAE"
                />
              </svg>
            </button>
          </div>

          {/* Level */}
          <div className="flex w-[140px] h-[36px] justify-center items-center bg-[#232323]">
            <span className="text-[14px] text-[#D8D8D8]">Level</span>
            <BtnDropdown
              options={uniqueLevels}
              selected={levelFilter}
              onSelect={(opt) => setLevelFilter(opt)}
            />
          </div>

          {/* Logger */}
          <div className="flex w-[140px] h-[36px] justify-center items-center bg-[#232323]">
            <span className="text-[14px] text-[#D8D8D8]">Logger</span>
            <BtnDropdown
              options={uniqueLoggers}
              selected={loggerFilter}
              onSelect={(opt) => setLoggerFilter(opt)}
            />
          </div>

          {/* Message */}
          <div className="flex flex-1 h-[36px] justify-center items-center bg-[#232323] rounded-tr-md">
            <span className="text-[14px] text-[#D8D8D8]">Message</span>
          </div>
        </div>

        {/* 데이터 행 (스크롤 가능, 높이 12줄 고정) */}
        <div className="flex flex-col h-[432px] overflow-y-auto" ref={containerRef}>
          {visibleLogs.map((row, idx) => {
            const isLast = idx === visibleLogs.length - 1;
            return (
              <div
                key={idx}
                onClick={() => onSelectLog?.(row)}
                className="flex border-b border-[#2A2A2A] last:border-none cursor-pointer hover:bg-[#1F1F1F]"
              >
                {/* Timestamp */}
                <div
                  className={`flex w-[200px] h-[36px] justify-center items-center bg-[#171717] 
                  ${isLast ? "rounded-bl-md" : ""}`}
                >
                  <span className="text-[#D8D8D8] text-[14px] font-light font-['Geist_Mono']">
                    {row?.timestamp || ""}
                  </span>
                </div>

                {/* Level */}
                <div className="flex w-[140px] h-[36px] justify-center items-center bg-[#171717]">
                  <span className="text-[#D8D8D8] text-[14px]">{row?.level || ""}</span>
                </div>

                {/* Logger */}
                <div className="flex w-[140px] h-[36px] justify-center items-center bg-[#171717]">
                  <span
                    className="text-[#D8D8D8] text-[14px] truncate max-w-[120px]"
                    title={row?.logger || ""}
                  >
                    {row?.logger || ""}
                  </span>
                </div>

                {/* Message */}
                <div
                  className={`flex flex-1 h-[36px] justify-center items-center bg-[#171717] 
                  ${isLast ? "rounded-br-md" : ""}`}
                >
                  <span
                    className="text-[#D8D8D8] text-[14px] truncate max-w-[600px] text-center px-2"
                    title={row?.message || ""}
                  >
                    {row?.message || ""}
                  </span>
                </div>
              </div>
            );
          })}

          {/* 로그가 아예 없을 때 */}
          {keyword.trim() === "" && visibleLogs.length === 0 && (
            <div className="flex justify-center items-center h-full text-[#888] text-[14px]">
              아직 수집된 로그가 없습니다.
            </div>
          )}

          {/* 검색 결과 없을 때 */}
          {keyword.trim() !== "" && visibleLogs.length === 0 && (
            <div className="flex justify-center items-center h-full text-[#888] text-[14px]">
              검색된 로그가 없습니다.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
