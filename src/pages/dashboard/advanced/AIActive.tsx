import { useState } from "react";

export default function AIActive() {
  const [active, setActive] = useState(false);

  return (
    <div className="flex items-center justify-center gap-3">
      {/* 텍스트 */}
      <span
        className="
          text-[var(--Gray-300,#AEAEAE)]
          font-[SUIT] text-[16px] font-medium
          leading-[150%] tracking-[-0.4px]
        "
      >
        AI 이상탐지 활성화
      </span>

      {/* 토글 버튼 */}
      <button
        onClick={() => setActive(!active)}
        className="focus:outline-none bg-transparent p-0 border-0"
      >
        {active ? (
          // ON 상태
          <svg xmlns="http://www.w3.org/2000/svg" width="22" height="12" viewBox="0 0 22 12" fill="none">
            <rect y="1" width="22" height="10" rx="5" fill="#6B4E0C" />
            <circle cx="16" cy="6" r="6" fill="#D4B66F" />
          </svg>
        ) : (
          // OFF 상태
          <svg xmlns="http://www.w3.org/2000/svg" width="22" height="12" viewBox="0 0 22 12" fill="none">
            <rect y="1" width="22" height="10" rx="5" fill="#535353" />
            <circle cx="6" cy="6" r="6" fill="#888888" />
          </svg>
        )}
      </button>
    </div>
  );
}
