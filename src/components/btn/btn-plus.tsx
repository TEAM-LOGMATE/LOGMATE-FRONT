interface BtnPlusProps {
  onClick?: () => void;
  className?: string;
}

export default function BtnPlus({ onClick }: BtnPlusProps) {
  return (
    <button
      onClick={onClick}
      className="
        flex justify-center items-center flex-shrink-0
        w-[44px] h-[44px]
        bg-transparent hover:bg-[#353535]
        transition-colors
        rounded-none
        outline-none focus:outline-none
        border-0 border-l border-[#353535]
      "
    >
      <div className="relative w-[24px] h-[24px]">
        {/* 안쪽 + 아이콘 (그대로 유지) */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="2"
          height="14"
          viewBox="0 0 2 14"
          fill="none"
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
          style={{
            strokeWidth: "1px",
            stroke: "var(--Gray-300, #AEAEAE)",
            flexShrink: 0,
          }}
        >
          <path d="M1 0.00488281L0.999999 14.0049" />
        </svg>

        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="14"
          height="2"
          viewBox="0 0 14 2"
          fill="none"
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
          style={{
            strokeWidth: "1px",
            stroke: "var(--Gray-300, #AEAEAE)",
            flexShrink: 0,
          }}
        >
          <path d="M0 1.00488H14" />
        </svg>
      </div>
    </button>
  );
}
