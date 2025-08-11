interface BtnSortProps {
  onClick?: () => void;
  children?: React.ReactNode;
}

export default function BtnSort({ onClick, children = '최신순 정렬' }: BtnSortProps) {
  return (
    <button
      onClick={onClick}
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
      {children}
    </button>
  );
}
