import { useState } from 'react';
import Input48 from '../../../components/input/48';
import BtnPlus from '../../../components/btn/btn-plus';
import BtnMinus from '../../../components/btn/btn-minus';

export default function MultilineSettings() {
  const [checked, setChecked] = useState(false);
  const [lineCount, setLineCount] = useState("10");

  const handleIncrease = () => {
    setLineCount((prev) => String(Number(prev || "0") + 1));
  };

  const handleDecrease = () => {
    setLineCount((prev) => {
      const next = Number(prev || "0") - 1;
      return String(next > 1 ? next : 1);
    });
  };

  return (
    <div className="flex flex-col gap-4">
      {/* 제목 + 체크박스 */}
      <div
        className="flex items-center gap-3 cursor-pointer"
        onClick={() => setChecked(!checked)}
      >
        <h3
          className="text-[var(--Alert-Yellow,#D4B66F)]
                     font-[Geist] text-[16px] font-normal leading-[150%]"
        >
          Multiline
        </h3>
{checked ? (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
  >
    {/* 배경 네모 (노란색) */}
    <rect
      width="16"
      height="16"
      rx="4"
      fill="var(--Alert-Yellow, #D4B66F)"
    />
    {/* 체크 아이콘 (회색 계열 대신 진회색) */}
    <path
      d="M11.2185 4.40586C11.5635 3.93959 12.1934 3.86391 12.6246 4.23693C13.0559 4.60994 13.1259 5.29105 12.7809 5.75732L8.76166 11.1885C7.9611 12.2705 6.43946 12.2705 5.63886 11.1885L3.21912 7.91966C2.87414 7.4534 2.94413 6.77228 3.37536 6.39927C3.80659 6.02625 4.43652 6.10193 4.7815 6.5682L7.20026 9.83811L11.2185 4.40586Z"
      fill="var(--Gray-800, #171717)"
    />
  </svg>
) : (
  <div className="w-4 h-4 aspect-square rounded-[4px] border border-[var(--Gray-500,#535353)]" />
)}

      </div>

      {/* 최대 병합 줄 수 (체크 시만 표시) */}
      {checked && (
        <div className="flex items-center gap-3">
          <span
            className="flex items-center
                       text-[var(--Gray-300,#AEAEAE)]
                       font-[SUIT] text-[16px] font-medium leading-[150%] tracking-[-0.4px]
                       w-[200px]"
          >
            최대 병합 줄 수
          </span>

          <div className="relative flex-1 h-[48px]">
            <Input48
              value={lineCount}
              onChange={(e) => setLineCount(e.target.value)}
              placeholder="10"
              align="center"
            />
            <div className="absolute left-2 top-1/2 -translate-y-1/2">
              <BtnMinus onClick={handleDecrease} />
            </div>
            <div className="absolute right-2 top-1/2 -translate-y-1/2">
              <BtnPlus onClick={handleIncrease} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
