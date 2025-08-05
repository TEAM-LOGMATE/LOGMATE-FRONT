import React from 'react';

type BtnPointProps = {
  onClick?: () => void;
  children: React.ReactNode;
};

export default function BtnPoint({ onClick, children }: BtnPointProps) {
  return (
    <button
      onClick={onClick}
      className="
        inline-flex
        h-[40px]
        px-[16px] py-[6px]
        justify-center items-center
        gap-[10px]
        flex-shrink-0
        rounded-[8px]
        bg-[#4FE75E]
        text-[#091104]
        text-center
        font-suit text-[16px] font-bold leading-[150%] tracking-[-0.4px]
        hover:bg-[#42FF55] hover:border hover:border-[#2BBD39]
      "
    >
      {children}
    </button>
  );
}
