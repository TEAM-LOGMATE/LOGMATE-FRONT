import { useRef } from "react";
import BtnDropdown from "../../components/btn/btn-dropdown";
import { useLogStore } from "../../utils/logstore";

interface WebLiveLogProps {
  keyword: string;
}

export default function WebLiveLog({ keyword }: WebLiveLogProps) {
  const { webLogs } = useLogStore();
  const containerRef = useRef<HTMLDivElement>(null);

  // AI Score 색상 함수
  const getAiScoreColor = (score: number) => {
    if (score >= 70) return "#F44336"; // 위험
    if (score >= 60) return "#FFC107"; // 경고
    return "#4CAF50"; // 정상
  };

  // 검색어 있으면 필터링, 없으면 전체 로그
  const filteredLogs =
    keyword.trim() === ""
      ? webLogs
      : webLogs.filter((log) =>
          Object.values(log).some((value) =>
            String(value).toLowerCase().includes(keyword.toLowerCase())
          )
        );

  // 최신 로그가 위쪽에 오도록 reverse()
  const visibleLogs = [...filteredLogs].reverse();

  return (
    <div className="w-full bg-[#0F0F0F] rounded-lg p-2">
      {/* 헤더 */}
      <div className="flex bg-[#171717] rounded-t-lg overflow-hidden">
        <div className="flex h-[36px] justify-center items-center gap-1 bg-[#232323] rounded-tl-md w-[200px]">
          <span className="text-[14px] text-[#D8D8D8]">Timestamp</span>
          <BtnDropdown />
        </div>
        <div className="flex h-[36px] justify-center items-center gap-1 bg-[#232323] w-[120px]">
          <span className="text-[14px] text-[#D8D8D8]">Method</span>
          <BtnDropdown />
        </div>
        <div className="flex h-[36px] justify-center items-center gap-1 bg-[#232323] w-[120px]">
          <span className="text-[14px] text-[#D8D8D8]">Protocol</span>
          <BtnDropdown />
        </div>
        <div className="flex h-[36px] justify-center items-center gap-1 bg-[#232323] w-[100px]">
          <span className="text-[14px] text-[#D8D8D8]">Size</span>
        </div>
        <div className="flex h-[36px] justify-center items-center gap-1 bg-[#232323] w-[300px]">
          <span className="text-[14px] text-[#D8D8D8]">Path</span>
        </div>
        <div className="flex h-[36px] justify-center items-center gap-1 bg-[#232323] w-[100px]">
          <span className="text-[14px] text-[#D8D8D8]">Status</span>
          <BtnDropdown />
        </div>
        <div className="flex h-[36px] justify-center items-center gap-1 bg-[#232323] w-[140px]">
          <span className="text-[14px] text-[#D8D8D8]">Referrer</span>
        </div>
        <div className="flex h-[36px] justify-center items-center gap-1 bg-[#232323] w-[160px]">
          <span className="text-[14px] text-[#D8D8D8]">User-Agent</span>
          <BtnDropdown />
        </div>
        <div className="flex h-[36px] justify-center items-center gap-1 bg-[#232323] w-[140px]">
          <span className="text-[14px] text-[#D8D8D8]">IP</span>
        </div>
        <div className="flex h-[36px] justify-center items-center gap-1 bg-[#232323] rounded-tr-md w-[120px]">
          <span className="text-[14px] text-[#D8D8D8]">AI Score</span>
        </div>
      </div>

      {/* 데이터 행 (12줄 높이 고정 + 스크롤) */}
      <div className="flex flex-col h-[432px] overflow-y-auto" ref={containerRef}>
        {visibleLogs.map((row, idx) => {
          const aiScore = row?.aiScore ?? null;
          const isLast = idx === visibleLogs.length - 1;

          return (
            <div
              key={idx}
              className="flex border-b border-[#2A2A2A] last:border-none"
            >
              <div
                className={`flex w-[200px] h-[36px] justify-center items-center bg-[#171717] ${
                  isLast ? "rounded-bl-md" : ""
                }`}
              >
                <span className="text-[#D8D8D8] text-[14px] font-light font-['Geist_Mono']">
                  {row?.timestamp ?? ""}
                </span>
              </div>
              <div className="flex w-[120px] h-[36px] justify-center items-center bg-[#171717]">
                <span className="text-[#D8D8D8] text-[14px]">{row?.method ?? ""}</span>
              </div>
              <div className="flex w-[120px] h-[36px] justify-center items-center bg-[#171717]">
                <span className="text-[#D8D8D8] text-[14px]">{row?.protocol ?? ""}</span>
              </div>
              <div className="flex w-[100px] h-[36px] justify-center items-center bg-[#171717]">
                <span className="text-[#D8D8D8] text-[14px]">{row?.size ?? ""}</span>
              </div>
              {/* Path */}
              <div className="flex w-[300px] h-[36px] items-center bg-[#171717] px-2">
                <span
                  className="text-[#D8D8D8] text-[14px] truncate w-full"
                  title={row?.path ?? ""}
                >
                  {row?.path ?? ""}
                </span>
              </div>
              <div className="flex w-[100px] h-[36px] justify-center items-center bg-[#171717]">
                <span className="text-[#D8D8D8] text-[14px]">{row?.status ?? ""}</span>
              </div>
              {/* Referrer */}
              <div className="flex w-[140px] h-[36px] items-center bg-[#171717] px-2">
                <span
                  className="text-[#D8D8D8] text-[14px] truncate w-full"
                  title={row?.referrer ?? ""}
                >
                  {row?.referrer ?? ""}
                </span>
              </div>
              {/* User-Agent */}
              <div className="flex w-[160px] h-[36px] items-center bg-[#171717] px-2">
                <span
                  className="text-[#D8D8D8] text-[14px] truncate w-full"
                  title={row?.userAgent ?? ""}
                >
                  {row?.userAgent ?? ""}
                </span>
              </div>
              {/* IP */}
              <div className="flex w-[140px] h-[36px] items-center bg-[#171717] px-2">
                <span
                  className="text-[#D8D8D8] text-[14px] truncate w-full"
                  title={row?.ip ?? ""}
                >
                  {row?.ip ?? ""}
                </span>
              </div>
              {/* AI Score */}
              <div
                className={`flex w-[120px] h-[36px] justify-center items-center bg-[#171717] ${
                  isLast ? "rounded-br-md" : ""
                }`}
              >
                <span
                  className="text-[14px] font-bold"
                  style={{
                    color: aiScore !== null ? getAiScoreColor(aiScore) : "#D8D8D8",
                  }}
                >
                  {aiScore !== null ? aiScore : ""}
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
