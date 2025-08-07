import { useState } from 'react';
import BtnAdd from '../btn/btn-add';
import BtnBigArrow from '../btn/btn-big-arrow';

type AddFoldingProps = {
  onAdd?: () => void;
  label?: string;
  isOpen: boolean;
  toggleOpen: () => void;
};

export default function AddFolding({
  onAdd,
  label = '개인/팀 스페이스',
  isOpen,
  toggleOpen,
}: AddFoldingProps) {
  const [selected, setSelected] = useState(false); // 텍스트 클릭 여부만 따짐

  return (
    <div
      className="flex w-[220px] h-[56px] px-[12px]
                 justify-between items-center
                 flex-shrink-0 border-t border-[#222]
                 cursor-pointer
                 text-[#888] text-center font-suit text-[14px] font-medium
                 leading-[150%] tracking-[-0.4px]
                 ml-[5px]"
    >
      {/* 텍스트 클릭 시 selected 활성화 */}
      <span
        onClick={(e) => {
          e.stopPropagation();
          setSelected(!selected);
        }}
        className={`pt-[2px] ${selected ? 'text-[#4FE75E]' : 'hover:text-[#F2F2F2]'}`}
      >
        {label}
      </span>

      {/* 아이콘 그룹 */}
      <div className="flex items-center gap-[4px] pt-[2px]">
        {/* + 버튼 */}
        <div
          onClick={(e) => {
            e.stopPropagation();
            onAdd?.();
          }}
        >
          <BtnAdd />
        </div>

        {/* 화살표 버튼만 회전 */}
        <div
          onClick={(e) => {
            e.stopPropagation();
            toggleOpen();
          }}
          className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
        >
          <BtnBigArrow direction="up" />
        </div>
      </div>
    </div>
  );
}
