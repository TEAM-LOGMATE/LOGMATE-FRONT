import React, { useState } from 'react';

interface Input48Props {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
}

export default function Input48({ value, onChange, placeholder }: Input48Props) {
  const [isDone, setIsDone] = useState(false);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      setIsDone(true);
    }
  };

  const textColor = isDone ? '#F2F2F2' : '#888888';

  return (
    <div
      className="
        flex items-center
        w-[417px] h-[48px]
        px-[20px] pr-[267px] pt-[13px] pb-[11px]
        flex-shrink-0
        rounded-[8px]
        border border-[#222222]
        bg-[#171717]
        font-[SUIT] text-[16px] font-medium
        leading-[150%] tracking-[-0.4px]
      "
      style={{ color: textColor }}
    >
      <input
        type="text"
        value={value}
        onChange={onChange}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        className="bg-transparent outline-none w-full placeholder-[#888888]"
        style={{ color: textColor }}
      />
    </div>
  );
}
