type ButtonProps = {
  children: React.ReactNode;
  onClick?: () => void;
  isActive?: boolean;
};

export default function BtnSign({
  children,
  onClick,
  isActive = true,
}: ButtonProps) {
  return (
    <button
      onClick={onClick}
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
            cursor-default
          `
        }
      `}
    >
      {children}
    </button>
  );
}
