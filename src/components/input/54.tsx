import React from 'react';
import IconBlind from '../icon/icon-blind';
import IconSign from '../icon/icon-sign';

interface Input54Props {
  type?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  done?: boolean;
  onDone?: (state: boolean) => void;
  showIcon?: boolean; 
}

export default function Input54({
  type = 'text',
  value,
  onChange,
  placeholder,
  done = false,
  onDone,
  showIcon = false, 
}: Input54Props) {
  const textColor = done ? 'text-[#F2F2F2]' : 'text-[#888888]';
  const iconColor = done ? '#F2F2F2' : '#535353';

  const handleMouseDown = () => onDone?.(true);
  const handleMouseUpOrLeave = () => onDone?.(false);

  return (
    <div
      className="
        flex items-center justify-between
        w-[480px] h-[54px] px-[16px] py-[15px]
        rounded-[12px] border border-[#222222]
        bg-[#171717]
        font-[Geist] text-[16px] leading-[145%]
      "
    >
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`flex-1 min-w-0 bg-transparent outline-none placeholder-[#888888] ${textColor}`}
      />

      {showIcon && (
        <button
          type="button"
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUpOrLeave}
          onMouseLeave={handleMouseUpOrLeave}
          className="w-[24px] h-[24px] flex-shrink-0 flex items-center justify-center bg-transparent"
        >
          {done ? <IconSign fill={iconColor} /> : <IconBlind fill={iconColor} />}
        </button>
      )}
    </div>
  );
}
