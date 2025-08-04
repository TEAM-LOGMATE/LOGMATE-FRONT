import React from 'react';

type BtnAddProps = {
  onClick?: () => void;
};

export default function BtnAdd({ onClick }: BtnAddProps) {
  return (
    <div
      className="
        flex w-[32px] h-[32px] p-[5px_4px]
        justify-center items-center flex-shrink-0
      "
    >
      <button
        onClick={onClick}
        className="
          flex w-[24px] h-[22px] p-[6px_7px] gap-[10px]
          justify-center items-center flex-shrink-0
          rounded-[5px] border border-[#353535]
          hover:border-[#D8D8D8] hover:bg-[#222222]
          group transition-all
        "
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="12"
          height="12"
          viewBox="0 0 12 12"
          fill="none"
          className="w-[11px] h-[11px] flex-shrink-0 fill-[#AEAEAE] group-hover:fill-[#F2F2F2]"
        >
          <path d="M6 0.5C6.27614 0.5 6.5 0.723858 6.5 1V5.5H11C11.2761 5.5 11.5 5.72386 11.5 6C11.5 6.27614 11.2761 6.5 11 6.5H6.5V11C6.5 11.2761 6.27614 11.5 6 11.5C5.72386 11.5 5.5 11.2761 5.5 11V6.5H1C0.723858 6.5 0.5 6.27614 0.5 6C0.5 5.72386 0.723858 5.5 1 5.5H5.5V1C5.5 0.723858 5.72386 0.5 6 0.5Z" />
        </svg>
      </button>
    </div>
  );
}