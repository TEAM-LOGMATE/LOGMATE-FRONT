export default function AgentStatusUnresponsive() {
  return (
    <div
      className="
        inline-flex items-center justify-end gap-[6px]
        h-[20px] px-[4px]
        flex-shrink-0
        rounded-[4px]
        text-[#D46F6F]
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
        <circle cx="3" cy="3" r="3" fill="#D46F6F" />
      </svg>
      에이전트 미응답
    </div>
  );
}
