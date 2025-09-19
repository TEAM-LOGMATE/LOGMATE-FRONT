import { useState, useRef, useEffect } from 'react';

interface SpaceNameSProps {
  name: string;               // 폴더 이름
  isActive?: boolean;         // 선택 상태
  onClick?: () => void;       // 클릭 시 동작
  onCancel?: () => void;      // 취소(삭제) 동작
}

export default function SpaceNameS({
  name,
  isActive = false,
  onClick,
  onCancel,
}: SpaceNameSProps) {
  const [isEditing, setIsEditing] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleBlur = () => {
    if (name.trim() === '') {
      onCancel?.();
    }
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') handleBlur();
  };

  useEffect(() => {
    if (isEditing) inputRef.current?.focus();
  }, [isEditing]);

  return (
    <div
      onClick={() => {
        if (!isEditing) onClick?.();
      }}
      className={`
        flex items-center flex-shrink-0
        w-[220px] h-[48px] px-[16px]
        font-suit text-[14px] font-medium leading-[150%] tracking-[-0.4px]
        cursor-pointer transition-colors
        ${isActive ? 'bg-[#222] text-[#4FE75E]' : 'bg-transparent text-[#F2F2F2] hover:bg-[#353535]'}
      `}
    >
      {isEditing ? (
        <input
          ref={inputRef}
          type="text"
          defaultValue={name}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          maxLength={24}
          placeholder="팀 스페이스 이름"
          className="w-full bg-transparent border-none outline-none text-inherit font-inherit placeholder-[#777] truncate"
        />
      ) : (
        <span className="truncate w-full whitespace-nowrap overflow-hidden">{name}</span>
      )}
    </div>
  );
}
