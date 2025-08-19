import { useState } from "react";
import Input48 from "../../../components/input/48";

const levels = ["INFO", "WARN", "ERROR", "TRACE", "DEBUG", "FATAL"];

export default function FilterSettings() {
  const [selectedLevels, setSelectedLevels] = useState<string[]>([]);
  const [keyword, setKeyword] = useState("");
  const [startTime, setStartTime] = useState("");

  const toggleLevel = (level: string) => {
    setSelectedLevels((prev) =>
      prev.includes(level) ? prev.filter((l) => l !== level) : [...prev, level]
    );
  };

  return (
    <div className="flex flex-col gap-4">
      {/* 제목 */}
      <h3 className="text-[var(--Alert-Yellow,#D4B66F)] font-[Geist] text-[16px] font-normal leading-[150%]">
        Filter
      </h3>

      {/* 허용 로그 레벨 */}
      <div className="flex items-center gap-3">
        <span className="w-[200px] whitespace-nowrap text-[var(--Gray-300,#AEAEAE)] font-[SUIT] text-[16px] font-medium leading-[150%]">
          허용 로그 레벨:
        </span>
        <div className="flex gap-1">
          {levels.map((level) => (
            <button
              key={level}
              onClick={() => toggleLevel(level)}
              className={`flex h-[44px] px-4 justify-center items-center rounded-[12px] border border-[var(--Gray-600,#353535)] font-[Geist] text-[16px] leading-[150%] whitespace-nowrap
                ${
                  selectedLevels.includes(level)
                    ? "bg-[var(--Gray-600,#353535)] text-[var(--Alert-Yellow,#D4B66F)]"
                    : "text-[var(--Gray-300,#AEAEAE)]"
                }`}
            >
              {level}
            </button>
          ))}
        </div>
      </div>

      {/* 포함 키워드 */}
      <div className="flex items-center gap-3">
        <span className="w-[200px] whitespace-nowrap text-[var(--Gray-300,#AEAEAE)] font-[SUIT] text-[16px] font-medium leading-[150%]">
          포함 키워드:
        </span>
        <div className="flex-1">
          <Input48
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder="placeholder"
            className="w-full"
            align="center"  
          />
        </div>
      </div>

      {/* 필터링 시작 시각 */}
      <div className="flex items-center gap-3">
        <span className="w-[200px] whitespace-nowrap text-[var(--Gray-300,#AEAEAE)] font-[SUIT] text-[16px] font-medium leading-[150%]">
          필터링 시작 시각:
        </span>
        <div className="flex-1">
          <Input48
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            placeholder="YYYY-MM-DDTHH:mm:ss"
            className="w-full"
            align="center"  
          />
        </div>
      </div>
    </div>
  );
}
