import BtnAdd from '../btn/btn-add';
import BtnBigArrow from '../btn/btn-big-arrow';

type AddFoldingProps = {
  onAdd?: () => void;
  label?: string;
  isOpen: boolean;
  toggleOpen: () => void;
  onLabelClick?: () => void;
  labelClassName?: string; // Bar.tsx에서 직접 스타일 줄 때 사용
  active?: boolean;        // true면 활성화 색상 적용
};

export default function AddFolding({
  onAdd,
  label = '개인/팀 스페이스',
  isOpen,
  toggleOpen,
  onLabelClick,
  labelClassName,
  active = false,
}: AddFoldingProps) {
  const handleLabelKeyDown = (e: React.KeyboardEvent<HTMLSpanElement>) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onLabelClick?.();
    }
  };

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
        onKeyDown={handleLabelKeyDown}
        className={`pt-[2px] ${
          labelClassName
            ? labelClassName
            : active
              ? 'text-[#4FE75E]'
              : 'text-[#888] hover:text-[#F2F2F2]'
        }`}
        role="button"
        tabIndex={0}
        aria-current={active ? 'page' : undefined}
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
          role="button"
          tabIndex={0}
        >
          <BtnAdd />
        </div>

        <div
          onClick={(e) => {
            e.stopPropagation();
            toggleOpen();
          }}
          className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
          role="button"
          tabIndex={0}
        >
          <BtnBigArrow direction="up" />
        </div>
      </div>
    </div>
  );
}
