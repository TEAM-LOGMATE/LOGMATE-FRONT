type ButtonProps = {
  children: React.ReactNode;
  onClick?: () => void;
  isActive?: boolean;
};

export default function BtnSign2Small({
  children,
  onClick,
  isActive = false,
}: ButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`
        flex items-center justify-center
        w-[200px] h-[48px] px-[15px]
        gap-[10px]
        shrink-0
        rounded-[12px]
        text-center
        font-suit text-base leading-6 tracking-[-0.4px]
        whitespace-nowrap transition-all duration-150
        pointer-events-auto
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
