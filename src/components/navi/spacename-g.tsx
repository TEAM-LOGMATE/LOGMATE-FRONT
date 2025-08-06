import { useState } from 'react';

export default function SpaceNameG() {
  const [pressed, setPressed] = useState(false);

  return (
    <div
      onClick={() => setPressed(!pressed)}
      className={`
        flex items-center flex-shrink-0 cursor-pointer
        w-[220px] h-[48px]
        px-[32px] pr-[140px] pt-[13px] pb-[15px]
        text-[14px] font-normal leading-[145%] font-geist
        transition-colors
        ${pressed ? 'bg-[#222] text-[#4FE75E]' : 'bg-transparent text-[#F2F2F2] hover:bg-[#111]'}
      `}
    >
      Team 0
    </div>
  );
}
