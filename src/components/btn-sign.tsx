type ButtonProps = {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
};

export default function BtnSign({
  children,
  onClick,
  disabled = false,
}: ButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        flex items-center justify-center
        w-[520px] h-[54px]
        px-[239px] py-[15px]
        gap-[10px]
        shrink-0
        rounded-[12px]
        text-center
        font-suit text-base leading-6 tracking-[-0.4px]
        whitespace-nowrap transition-all duration-150
        ${
          disabled
            ? `
            border border-[#1F5A05]
            bg-transparent
            text-[#2BBD39]
            font-medium
            cursor-not-allowed
          `
            : `
            bg-[#4FE75E]
            text-[#184405]
            font-bold
            hover:bg-[#42FF55]
            hover:border hover:border-[#2BBD39]
            hover:text-[#184405]
          `
        }
      `}
    >
      {children}
    </button>
  );
}
