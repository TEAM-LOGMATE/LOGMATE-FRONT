import { useState } from 'react';
import BtnAdd from '../btn/btn-add';
import BtnSmallArrow from '../btn/btn-small-arrow';

export default function AddFolding() {
  const [selected, setSelected] = useState(false);

  return (
    <div
      onClick={() => setSelected(!selected)}
      className="flex w-[220px] h-[56px] px-[12px]
                 justify-between items-center
                 flex-shrink-0 border-t border-[#222]
                 cursor-pointer
                 text-[#888] text-center font-suit text-[14px] font-medium
                 leading-[150%] tracking-[-0.4px]"
    >
      {/* 텍스트 */}
      <span className={`pt-[2px] ${selected ? 'text-[#4FE75E]' : 'hover:text-[#F2F2F2]'}`}>
        개인/팀 스페이스
      </span>

      {/* 아이콘 그룹 */}
      <div className="flex items-center gap-[4px] pt-[2px]">
        <BtnAdd />
        <BtnSmallArrow direction="right" />
      </div>
    </div>
  );
}
