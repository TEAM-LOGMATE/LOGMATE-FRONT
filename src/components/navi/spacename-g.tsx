import { useState } from 'react';

interface SpaceNameGProps {
  onCancel?: () => void;
}

export default function SpaceNameG({ onCancel }: SpaceNameGProps) {
  const [pressed, setPressed] = useState(false);
  const [isEditing, setIsEditing] = useState(true);
  const [name, setName] = useState('');

  const handleBlur = () => {
    if (name.trim() === '') {
      onCancel?.(); // 이름이 없으면 삭제
    } else {
      setIsEditing(false); // 이름이 있으면 편집 종료
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
          value={name}
          onChange={(e) => setName(e.target.value)}
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
        <span className="truncate w-full whitespace-nowrap overflow-hidden">
          {name}
        </span>
      )}
    </div>
  );
}
