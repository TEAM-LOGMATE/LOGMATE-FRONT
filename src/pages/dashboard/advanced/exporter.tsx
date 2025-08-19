import { useState } from "react";
import Input48 from "../../../components/input/48";
import BtnPlus from "../../../components/btn/btn-plus";
import BtnMinus from "../../../components/btn/btn-minus";

export default function ExporterSettings() {
  const [interval, setInterval] = useState("5");
  const [retryCount, setRetryCount] = useState("3");
  const [useCompression, setUseCompression] = useState(false);

  const handleChange = (
    setter: React.Dispatch<React.SetStateAction<string>>,
    delta: number
  ) => {
    setter((prev) => {
      const next = Number(prev || "0") + delta;
      return String(next > 0 ? next : 0);
    });
  };

  return (
    <div className="flex flex-col gap-4">
      {/* 제목 + 압축 사용 */}
      <div className="flex items-center justify-between">
        <h3
          className="text-[var(--Alert-Yellow,#D4B66F)]
                     font-[Geist] text-[16px] font-normal leading-[150%]"
        >
          Exporter
        </h3>
        <label
          className="flex items-center gap-2 cursor-pointer select-none"
          onClick={() => setUseCompression((prev) => !prev)}
        >
          <span
            className="text-[var(--Gray-300,#AEAEAE)]
                       font-[SUIT] text-[14px] font-bold leading-[150%] tracking-[-0.4px]"
          >
            압축 사용
          </span>

          {/* 커스텀 체크박스 */}
          <div className="w-4 h-4 flex items-center justify-center">
            {useCompression ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
              >
                {/* 배경 네모 */}
                <rect
                  width="16"
                  height="16"
                  rx="4"
                  fill="var(--Alert-Yellow, #D4B66F)"
                />
                {/* 체크 아이콘 */}
                <path
                  d="M11.2185 4.40586C11.5635 3.93959 12.1934 3.86391 12.6246 4.23693C13.0559 4.60994 13.1259 5.29105 12.7809 5.75732L8.76166 11.1885C7.9611 12.2705 6.43946 12.2705 5.63886 11.1885L3.21912 7.91966C2.87414 7.4534 2.94413 6.77228 3.37536 6.39927C3.80659 6.02625 4.43652 6.10193 4.7815 6.5682L7.20026 9.83811L11.2185 4.40586Z"
                  fill="var(--Gray-800, #171717)"
                />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
              >
                <rect
                  x="0.5"
                  y="0.5"
                  width="15"
                  height="15"
                  rx="3.5"
                  stroke="#535353"
                />
              </svg>
            )}
          </div>
        </label>
      </div>

      {/* 재시도 간격 */}
      <div className="flex items-center gap-3">
        <span
          className="w-[200px] text-[var(--Gray-300,#AEAEAE)]
                     font-[SUIT] text-[16px] font-medium leading-[150%] tracking-[-0.4px]"
        >
          재시도 간격(초):
        </span>
        <div className="relative flex-1 h-[48px]">
          <Input48
            value={interval}
            onChange={(e) => setInterval(e.target.value)}
            placeholder="5"
            align="center"
            className="w-full h-full pl-[40px] pr-[40px]"
          />
          <div className="absolute left-2 top-1/2 -translate-y-1/2">
            <BtnMinus onClick={() => handleChange(setInterval, -1)} />
          </div>
          <div className="absolute right-2 top-1/2 -translate-y-1/2">
            <BtnPlus onClick={() => handleChange(setInterval, +1)} />
          </div>
        </div>
      </div>

      {/* 최대 재시도 횟수 */}
      <div className="flex items-center gap-3">
        <span
          className="w-[200px] text-[var(--Gray-300,#AEAEAE)]
                     font-[SUIT] text-[16px] font-medium leading-[150%] tracking-[-0.4px]"
        >
          최대 재시도 횟수:
        </span>
        <div className="relative flex-1 h-[48px]">
          <Input48
            value={retryCount}
            onChange={(e) => setRetryCount(e.target.value)}
            placeholder="3"
            align="center"
            className="w-full h-full pl-[40px] pr-[40px]"
          />
          <div className="absolute left-2 top-1/2 -translate-y-1/2">
            <BtnMinus onClick={() => handleChange(setRetryCount, -1)} />
          </div>
          <div className="absolute right-2 top-1/2 -translate-y-1/2">
            <BtnPlus onClick={() => handleChange(setRetryCount, +1)} />
          </div>
        </div>
      </div>
    </div>
  );
}
