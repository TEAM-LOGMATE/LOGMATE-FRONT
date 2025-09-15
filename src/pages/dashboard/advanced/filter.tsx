import Input48 from "../../../components/input/48";

const levels = ["INFO", "WARN", "ERROR", "TRACE", "DEBUG", "FATAL"];

interface FilterSettingsProps {
  value: {
    allowedLevels: string[];
    requiredKeywords: string[];
    after: string; // ISO datetime string
  };
  onChange: (newValue: FilterSettingsProps["value"]) => void;
}

export default function FilterSettings({ value, onChange }: FilterSettingsProps) {
  const toggleLevel = (level: string) => {
    const newLevels = value.allowedLevels.includes(level)
      ? value.allowedLevels.filter((l) => l !== level)
      : [...value.allowedLevels, level];

    onChange({ ...value, allowedLevels: newLevels });
  };

  const handleKeywordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const keywords = e.target.value
      .split(",")
      .map((k) => k.trim())
      .filter((k) => k.length > 0);

    onChange({ ...value, requiredKeywords: keywords });
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
        <div className="flex gap-1 flex-wrap">
          {levels.map((level) => (
            <button
              key={level}
              type="button"
              onClick={() => toggleLevel(level)}
              className={`flex h-[44px] px-4 justify-center items-center rounded-[12px] border border-[var(--Gray-600,#353535)] font-[Geist] text-[16px] leading-[150%] whitespace-nowrap
                ${
                  value.allowedLevels.includes(level)
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
            value={value.requiredKeywords.join(", ")}
            onChange={handleKeywordChange}
            placeholder="Exception, DB"
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
            value={value.after}
            onChange={(e) => onChange({ ...value, after: e.target.value })}
            placeholder="YYYY-MM-DDTHH:mm:ss"
            className="w-full"
            align="center"
          />
        </div>
      </div>
    </div>
  );
}
