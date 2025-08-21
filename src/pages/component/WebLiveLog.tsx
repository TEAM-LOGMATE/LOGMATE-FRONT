import BtnDropdown from "../../components/btn/btn-dropdown";
import { useLogStore } from "../../utils/logstore";

export default function WebLiveLog() {
  const logs = useLogStore((s) => s.webLogs).slice(0, 12); // 최근 12개만 표시

  // AI Score 색상 함수
  const getAiScoreColor = (score: number) => {
    if (score >= 70) return "#F44336"; // 위험
    if (score >= 60) return "#FFC107"; // 경고
    return "#4CAF50"; // 정상
  };

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
        <div className="flex h-[36px] justify-center items-center gap-1 bg-[#232323] flex-1">
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

      {/* 데이터 행 (12줄 고정) */}
      <div className="flex flex-col">
        {Array.from({ length: 12 }).map((_, idx) => {
          const row = logs[idx];
          const aiScore = row?.aiScore ?? null;

          return (
            <div key={idx} className="flex border-b border-[#2A2A2A] last:border-none">
              <div
                className={`flex w-[200px] h-[36px] justify-center items-center bg-[#171717] ${
                  idx === 11 ? "rounded-bl-md" : ""
                }`}
              >
                <span className="text-[#D8D8D8] text-[14px] font-light font-['Geist_Mono']">
                  {row ? row.timestamp : ""}
                </span>
              </div>
              <div className="flex w-[120px] h-[36px] justify-center items-center bg-[#171717]">
                <span className="text-[#D8D8D8] text-[14px]">{row ? row.method : ""}</span>
              </div>
              <div className="flex w-[120px] h-[36px] justify-center items-center bg-[#171717]">
                <span className="text-[#D8D8D8] text-[14px]">{row ? row.protocol : ""}</span>
              </div>
              <div className="flex w-[100px] h-[36px] justify-center items-center bg-[#171717]">
                <span className="text-[#D8D8D8] text-[14px]">{row ? row.size : ""}</span>
              </div>
              <div className="flex flex-1 h-[36px] justify-center items-center bg-[#171717]">
                <span className="text-[#D8D8D8] text-[14px] truncate">{row ? row.path : ""}</span>
              </div>
              <div className="flex w-[100px] h-[36px] justify-center items-center bg-[#171717]">
                <span className="text-[#D8D8D8] text-[14px]">{row ? row.status : ""}</span>
              </div>
              <div className="flex w-[140px] h-[36px] justify-center items-center bg-[#171717]">
                <span className="text-[#D8D8D8] text-[14px] truncate">{row ? row.referrer : ""}</span>
              </div>
              <div className="flex w-[160px] h-[36px] justify-center items-center bg-[#171717]">
                <span className="text-[#D8D8D8] text-[14px] truncate">{row ? row.userAgent : ""}</span>
              </div>
              <div className="flex w-[140px] h-[36px] justify-center items-center bg-[#171717]">
                <span className="text-[#D8D8D8] text-[14px]">{row ? row.ip : ""}</span>
              </div>
              <div
                className={`flex w-[120px] h-[36px] justify-center items-center bg-[#171717] ${
                  idx === 11 ? "rounded-br-md" : ""
                }`}
              >
                <span
                  className="text-[14px] font-bold"
                  style={{ color: aiScore !== null ? getAiScoreColor(aiScore) : "#D8D8D8" }}
                >
                  {aiScore !== null ? aiScore : ""}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
