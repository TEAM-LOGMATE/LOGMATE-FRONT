type BtnMoreTextProps = {
  options: string[];
  selected?: string;
  onSelect: (value: string) => void;
  onClose?: () => void;
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
    onClose?.();
  };

  return (
    <div className="flex flex-col w-[120px] rounded-[6px] bg-[#111111] overflow-hidden">
      {options.map((option) => (
        <button
          key={option}
          onClick={() => handleClick(option)}
          className={`
            w-full text-left h-[40px] px-[12px]
            flex items-center gap-[10px]
            font-suit text-[14px] leading-[150%]
            bg-transparent
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
