type ButtonProps = {
  children: React.ReactNode;
  onClick?: () => void;
  isActive?: boolean; // true면 활성화된 버튼
};

export default function BtnSign2({
  children,
  onClick,
  isActive = false,
}: ButtonProps) {
  return (
    <button
      onClick={onClick} // 항상 클릭 가능해야 함
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
        pointer-events-auto // 비활성 상태에서도 클릭되도록
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
              cursor-pointer
            `
        }
      `}
    >
      {children}
    </button>
  );
}
