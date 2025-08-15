import React, { useState } from 'react';

interface Input48Props {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  disabled?: boolean;
  readOnly?: boolean;
}

export default function Input48({
  value,
  onChange,
  placeholder,
  disabled = false,
  readOnly = false,
}: Input48Props) {
  const [isDone, setIsDone] = useState(false);
  const locked = disabled || readOnly;

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (locked) return;
    if (e.key === 'Enter') setIsDone(true);
  };

  const textColor = isDone ? '#F2F2F2' : '#888888';

  return (
    <div
      className={`
        flex items-center h-[48px] px-[20px] flex-shrink-0
        ${
          locked
            ? 'rounded-[12px] border border-[var(--Gray-700,#222)] bg-[#171717]'
            : 'rounded-[8px]  border border-[#222222] bg-[var(--Gray-700,#222)]'
        }
        font-[SUIT] text-[16px] font-medium leading-[150%] tracking-[-0.4px]
        w-full
      `}
      style={{ color: textColor }}
    >
      <input
        type="text"
        value={value}
        onChange={onChange}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        disabled={disabled}
        readOnly={readOnly}
        className="bg-transparent outline-none w-full placeholder-[#888888]"
        style={{ color: textColor }}
      />
    </div>
  );
}
