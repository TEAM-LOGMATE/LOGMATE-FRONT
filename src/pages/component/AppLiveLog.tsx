import { useRef } from "react";
import BtnDropdown from "../../components/btn/btn-dropdown";
import { useLogStore } from "../../utils/logstore";

interface AppLiveLogProps {
  keyword: string;
  onSelectLog?: (log: any) => void; // ✅ 로그 선택 이벤트 추가
}

export default function AppLiveLog({ keyword, onSelectLog }: AppLiveLogProps) {
  const logs = useLogStore((s) => s.appLogs);
  const containerRef = useRef<HTMLDivElement>(null);

  // 검색어 있으면 필터링, 없으면 전체 로그
  const filteredLogs =
    keyword.trim() === ""
      ? logs
      : logs.filter((log) =>
          Object.values(log).some((value) =>
            String(value).toLowerCase().includes(keyword.toLowerCase())
          )
        );

  // 최신 로그가 위에 오도록 reverse()
  const visibleLogs = [...filteredLogs].reverse();

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

      {/* 데이터 행 (스크롤 가능, 높이 12줄 고정) */}
      <div className="flex flex-col h-[432px] overflow-y-auto" ref={containerRef}>
        {visibleLogs.map((row, idx) => {
          const isLast = idx === visibleLogs.length - 1;
          return (
            <div
              key={idx}
              onClick={() => onSelectLog?.(row)} // ✅ 클릭 시 부모로 row 전달
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
  );
}
