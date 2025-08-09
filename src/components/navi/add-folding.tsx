// AddFolding.tsx
import BtnAdd from '../btn/btn-add';
import BtnBigArrow from '../btn/btn-big-arrow';

type AddFoldingProps = {
  onAdd?: () => void;
  label?: string;
  isOpen: boolean;
  toggleOpen: () => void;
  onLabelClick?: () => void;
  labelClassName?: string;
};

export default function AddFolding({
  onAdd,
  label = '개인/팀 스페이스',
  isOpen,
  toggleOpen,
  onLabelClick,
  labelClassName,
}: AddFoldingProps) {
  return (
    <div
      className="flex w-[220px] h-[56px] px-[12px] justify-between items-center
                 flex-shrink-0 border-t border-[#222] cursor-pointer
                 text-center font-suit text-[14px] font-medium
                 leading-[150%] tracking-[-0.4px] ml-[5px]"
    >
      {/* 라벨 */}
      <span
        onClick={(e) => {
          e.stopPropagation();
          onLabelClick?.();
        }}
        className={`pt-[2px] hover:text-[#F2F2F2] ${labelClassName || 'text-[#888]'}`}
        role="button"
        tabIndex={0}
      >
        {label}
      </span>

      {/* 아이콘 그룹 */}
      <div className="flex items-center gap-[4px] pt-[2px]">
        <div
          onClick={(e) => {
            e.stopPropagation();
            onAdd?.();
          }}
        >
          <BtnAdd />
        </div>

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
