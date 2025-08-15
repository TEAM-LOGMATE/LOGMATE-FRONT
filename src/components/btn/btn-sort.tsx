import { useState } from 'react';

interface BtnSortProps {
  spaceType?: string; // ← 추가
  onSortChange?: (order: 'newest' | 'oldest') => void;
}

export default function BtnSort({ onSortChange }: BtnSortProps) {
  const [order, setOrder] = useState<'newest' | 'oldest'>('newest');

  const handleClick = () => {
    const newOrder = order === 'newest' ? 'oldest' : 'newest';
    setOrder(newOrder);
    onSortChange?.(newOrder);
  };

  return (
    <button
      onClick={handleClick}
      className="
        inline-flex
        h-[40px]
        px-[16px] py-[6px]
        justify-center
        items-center
        gap-[10px]
        flex-shrink-0
        rounded-[8px]
        border border-[#353535]
        bg-[#111111]
        text-[#F2F2F2]
        text-[14px] font-suit font-bold leading-[150%] tracking-[-0.4px]
        hover:bg-[#1F1F1F] transition
      "
    >
      {order === 'newest' ? '최신순 정렬' : '오래된순 정렬'}
    </button>
  );
}
