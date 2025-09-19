import Input48 from "../../../components/input/48";

const methods = ["GET", "POST", "HEAD", "PUT", "DELETE", "OPTIONS", "TRACE"];

interface FilterWebProps {
  value: {
    allowedMethods: string[];
    requiredKeywords: string[];
  };
  onChange: (newValue: FilterWebProps["value"]) => void;
}

export default function FilterWeb({ value, onChange }: FilterWebProps) {
  const toggleMethod = (method: string) => {
    const newMethods = value.allowedMethods.includes(method)
      ? value.allowedMethods.filter((m) => m !== method)
      : [...value.allowedMethods, method];

    onChange({ ...value, allowedMethods: newMethods });
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

      {/* 허용 메소드 */}
      <div className="flex items-center gap-3">
        <span className="w-[280px] whitespace-nowrap text-[var(--Gray-300,#AEAEAE)] font-[SUIT] text-[16px] font-medium leading-[150%]">
          허용 메소드:
        </span>
        <div className="flex gap-2 flex-wrap">
          {methods.map((method) => (
            <button
              key={method}
              type="button"
              onClick={() => toggleMethod(method)}
              className={`flex h-[44px] min-w-[90px] px-4 justify-center items-center
                rounded-[12px] border border-[var(--Gray-600,#353535)] 
                font-[Geist] text-[15px] leading-[150%] whitespace-nowrap
                ${
                  value.allowedMethods.includes(method)
                    ? "bg-[var(--Gray-600,#353535)] text-[var(--Alert-Yellow,#D4B66F)]"
                    : "text-[var(--Gray-300,#AEAEAE)]"
                }`}
            >
              {method}
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
            placeholder="GET, POST"
            className="w-full"
            align="center"
          />
        </div>
      </div>
    </div>
  );
}
