import { useState } from 'react';
import BtnSmallArrow from '../btn/btn-small-arrow';

export default function MyPage() {
  const [selected, setSelected] = useState(false);
  const [hovered, setHovered] = useState(false); // hover 상태 추가

  return (
    <div
      onClick={() => setSelected(!selected)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={`
        w-[220px] h-[56px] border-t border-[#222] px-[12px]
        flex items-center justify-between flex-shrink-0
        cursor-pointer
        ${selected ? 'text-[#4FE75E]' : 'text-[#888] hover:bg-[#171717]'}
      `}
    >
      {/* 텍스트 */}
      <span
        className={`
          pt-[2px]
          text-center font-suit text-[14px] font-medium
          leading-[150%] tracking-[-0.4px]
          ${selected ? 'text-[#4FE75E]' : 'hover:text-[#F2F2F2]'}
        `}
      >
        기본 정보
      </span>

      {/* 화살표 */}
      <div className="w-[32px] h-[32px] flex items-center justify-center">
        <BtnSmallArrow direction="right" selected={selected || hovered} />
      </div>
    </div>
  );
}
