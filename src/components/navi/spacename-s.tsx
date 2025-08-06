import { useState } from 'react';

export default function SpaceNameS() {
  const [selected, setSelected] = useState(false);

  return (
    <div
      onClick={() => setSelected(!selected)}
      className={`
        flex items-center flex-shrink-0
        w-[220px] h-[48px] px-[32px] pr-[125px] pt-[13px] pb-[14px]
        font-suit text-[14px] font-medium leading-[150%] tracking-[-0.4px]
        cursor-pointer
        ${selected
          ? 'bg-[#222] text-[#4FE75E]'
          : 'bg-transparent text-[#F2F2F2] hover:bg-[#111]'}
      `}
    >
      팀 프로젝트
    </div>
  );
}
