import { useState, useEffect } from 'react';

interface SpaceNameGProps {
  name: string;
  onCancel?: () => void;
}

export default function SpaceNameG({ name, onCancel }: SpaceNameGProps) {
  const [pressed, setPressed] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [inputValue, setInputValue] = useState(name);

  useEffect(() => {
    // name prop이 바뀔 때 내부 inputValue도 갱신
    setInputValue(name);
  }, [name]);

  const handleBlur = () => {
    if (inputValue.trim() === '') {
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

  return (
    <div
      onClick={() => {
        if (!isEditing) setPressed(!pressed);
      }}
      className={`
        flex items-center flex-shrink-0 cursor-pointer
        w-[220px] h-[48px]
        px-[16px]
        text-[14px] font-normal leading-[145%] font-geist
        transition-colors
        ${pressed ? 'bg-[#222] text-[#4FE75E]' : 'bg-transparent text-[#F2F2F2] hover:bg-[#111]'}
      `}
    >
      {isEditing ? (
        <input
          autoFocus
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          maxLength={24}
          className="
            w-full bg-transparent border-none outline-none
            text-inherit font-inherit
            placeholder-[#777]
            truncate
          "
          placeholder="새 폴더"
        />
      ) : (
        <span
          className="truncate w-full whitespace-nowrap overflow-hidden"
          onDoubleClick={() => setIsEditing(true)} // 더블 클릭 시 이름 수정 가능
        >
          {inputValue}
        </span>
      )}
    </div>
  );
}
