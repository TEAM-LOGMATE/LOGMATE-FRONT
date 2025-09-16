type ButtonProps = {
  children: React.ReactNode;
  onClick?: () => void;
  isActive?: boolean;
  type?: "button" | "submit" | "reset";
};

export default function BtnSign2({
  children,
  onClick,
  isActive = false,
  type = "button",
}: ButtonProps) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={!isActive} // 엔터도 버튼 활성화 상태일 때만 작동
      className={`
        flex items-center justify-center
        w-[480px] h-[54px]
        px-[239px] py-[15px]
        gap-[10px]
        shrink-0
        rounded-[12px]
        text-center
        font-suit text-base leading-6 tracking-[-0.4px]
        whitespace-nowrap transition-all duration-150
        ${
          isActive
            ? `
              bg-[#4FE75E]
              text-[#184405]
              font-bold
              hover:bg-[#42FF55]
              hover:border hover:border-[#2BBD39]
              hover:text-[#184405]
              cursor-pointer
            `
            : `
              border border-[#1F5A05]
              bg-transparent
              text-[#2BBD39]
              font-medium
              cursor-not-allowed
            `
        }
      `}
    >
      {children}
    </button>
  );
}
