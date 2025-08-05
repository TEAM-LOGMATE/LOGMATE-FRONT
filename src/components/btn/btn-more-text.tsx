import React from 'react';

interface BtnMoreTextProps {
  children: React.ReactNode;
  onClick?: () => void;
}

export default function BtnMoreText({ children, onClick }: BtnMoreTextProps) {
  return (
    <button
      onClick={onClick}
      className="
        flex w-[118px] h-[40px] px-[12px] items-center gap-[10px] flex-shrink-0
        border-b border-[#353535] bg-[#222]
        text-[#D8D8D8] font-[500] text-[14px] leading-[150%] tracking-[-0.4px]
        font-suit
        hover:bg-[#353535]
      "
      style={{
        fontStyle: 'normal',
      }}
    >
      {children}
    </button>
  );
}
