import { useState, useEffect, useRef } from 'react';

interface SpaceNameSProps {
  onCancel?: () => void;
}

export default function SpaceNameS({ onCancel }: SpaceNameSProps) {
  const [selected, setSelected] = useState(false);
  const [isEditing, setIsEditing] = useState(true);
  const [name, setName] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const handleBlur = () => {
    if (name.trim() === '') {
      onCancel?.();
    } else {
      setIsEditing(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleBlur();
    }
  };

  useEffect(() => {
    if (isEditing) {
      inputRef.current?.focus();
    }
  }, [isEditing]);

  return (
    <div
      onClick={() => {
        if (!isEditing) setSelected(!selected);
      }}
      className={`
        flex items-center flex-shrink-0
        w-[220px] h-[48px] px-[16px]
        font-suit text-[14px] font-medium leading-[150%] tracking-[-0.4px]
        cursor-pointer transition-colors
        ${selected ? 'bg-[#222] text-[#4FE75E]' : 'bg-transparent text-[#F2F2F2] hover:bg-[#111]'}
      `}
    >
      {isEditing ? (
        <input
          ref={inputRef}
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          maxLength={24}
          placeholder="팀 스페이스 이름"
          className="
            w-full bg-transparent border-none outline-none
            text-inherit font-inherit
            placeholder-[#777]
            truncate
          "
        />
      ) : (
        <span className="truncate w-full whitespace-nowrap overflow-hidden">
          {name}
        </span>
      )}
    </div>
  );
}
