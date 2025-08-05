import React from 'react';

export default function AgentStatusCollecting() {
  return (
    <div
      className="
        inline-flex items-center justify-end gap-[6px]
        h-[20px] px-[4px]
        flex-shrink-0
        rounded-[4px]
        text-[#6FD4A5]
        font-[SUIT] text-[14px] font-medium
        leading-[150%] tracking-[-0.4px]
        text-right
      "
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="6"
        height="6"
        viewBox="0 0 6 6"
        fill="none"
      >
        <circle cx="3" cy="3" r="3" fill="#6FD4A5" />
      </svg>
      로그 수집중
    </div>
  );
}
