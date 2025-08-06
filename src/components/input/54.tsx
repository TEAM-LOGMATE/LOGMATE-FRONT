import React from 'react';
import IconBlind from '../icon/icon-blind';

interface Input54Props {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  done?: boolean;
  onDone?: () => void;
}

export default function Input54({
  value,
  onChange,
  placeholder,
  done = false,
  onDone,
}: Input54Props) {
  const textColor = done ? '#F2F2F2' : '#888888';
  const iconColor = done ? '#F2F2F2' : '#535353';

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      onDone?.(); // ✅ 부모에게 done 상태 알려주기
    }
  };

  return (
    <div
      className="
        flex justify-between items-center
        w-[520px] h-[54px] px-[16px] py-[15px] pl-[20px]
        rounded-[8px] border border-[#222222]
        bg-[#171717]
        font-[Geist] text-[16px] leading-[145%]
      "
    >
      <input
        type="text"
        value={value}
        onChange={onChange}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        className="bg-transparent outline-none placeholder-[#888888] flex-1"
        style={{ color: textColor }}
      />

      <IconBlind fill={iconColor} />
    </div>
  );
}
