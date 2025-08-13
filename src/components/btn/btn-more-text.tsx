import React from 'react';

type BtnMoreTextProps = {
  options: string[];
  selected?: string; // 선택값 없을 수도 있음
  onSelect: (value: string) => void;
  onClose?: () => void; // 선택 후 메뉴 닫기용 (선택 사항)
};

export default function BtnMoreText({
  options,
  selected = '',
  onSelect,
  onClose,
}: BtnMoreTextProps) {
  if (!options || options.length === 0) return null;

  const handleClick = (option: string) => {
    onSelect(option);
    onClose?.(); // 있으면 닫기
  };

  return (
    <div className="flex flex-col w-[120px] rounded-[6px] bg-[#111111] border border-[#222] overflow-hidden">
      {options.map((option) => (
        <button
          key={option}
          onClick={() => handleClick(option)}
          className={`
            w-full text-left px-[12px] py-[10px]
            font-suit text-[14px] leading-[150%]
            ${option === selected
              ? 'text-[#FFD966] font-semibold'
              : 'text-[#F2F2F2]'}
            hover:bg-[#1A1A1A]
          `}
        >
          {option}
        </button>
      ))}
    </div>
  );
}
