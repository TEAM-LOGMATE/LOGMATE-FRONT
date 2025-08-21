import BtnDropdown from "../../components/btn/btn-dropdown";
import { useLogStore } from "../../utils/logstore";

export default function AppLiveLog() {
  const logs = useLogStore((s) => s.appLogs).slice(0, 12); // 최근 12개만 표시

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
        {Array.from({ length: 12 }).map((_, idx) => {
          const row = logs[idx]; // 로그가 있으면 값 채우고, 없으면 undefined
          return (
            <div key={idx} className="flex border-b border-[#2A2A2A] last:border-none">
              <div
                className={`flex w-[200px] h-[36px] justify-center items-center bg-[#171717] 
                ${idx === 11 ? "rounded-bl-md" : ""}`}
              >
                <span className="text-[#D8D8D8] text-[14px] font-light font-['Geist_Mono']">
                  {row ? row.timestamp : ""}
                </span>
              </div>
              <div className="flex w-[140px] h-[36px] justify-center items-center bg-[#171717]">
                <span className="text-[#D8D8D8] text-[14px]">{row ? row.level : ""}</span>
              </div>
              <div className="flex w-[140px] h-[36px] justify-center items-center bg-[#171717]">
                <span className="text-[#D8D8D8] text-[14px]">{row ? row.logger : ""}</span>
              </div>
              <div
                className={`flex flex-1 h-[36px] justify-center items-center bg-[#171717] 
                ${idx === 11 ? "rounded-br-md" : ""}`}
              >
                <span className="text-[#D8D8D8] text-[14px] truncate">
                  {row ? row.message : ""}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
