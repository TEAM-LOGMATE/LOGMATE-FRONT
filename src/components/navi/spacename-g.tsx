import { useState, useEffect } from 'react';

interface SpaceNameGProps {
  name: string;
  isActive: boolean; // 외부에서 활성 상태 받기
  onClick: () => void; // 클릭 시 페이지 이동
  onCancel?: () => void; // 폴더 생성 취소
  onRename?: (newName: string) => void; // 이름 변경 시 호출
}

export default function SpaceNameG({
  name,
  isActive,
  onClick,
  onCancel,
  onRename,
}: SpaceNameGProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [inputValue, setInputValue] = useState(name);

  // name prop이 바뀌면 로컬 state도 반영
  useEffect(() => {
    setInputValue(name);
  }, [name]);

  const finishEditing = () => {
    const trimmed = inputValue.trim();
    if (trimmed === '') {
      onCancel?.();
    } else {
      // 이름 변경이 실제로 부모 상태에도 반영되도록 호출
      if (trimmed !== name) {
        onRename?.(trimmed);
      }
      setIsEditing(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      finishEditing();
    } else if (e.key === 'Escape') {
      setInputValue(name);
      setIsEditing(false);
    }
  };

  return (
    <div
      onClick={() => {
        if (!isEditing) onClick();
      }}
      className={`
        flex items-center flex-shrink-0 cursor-pointer
        w-[220px] h-[48px]
        px-[16px]
        text-[14px] font-normal leading-[145%] font-geist
        transition-colors
        ${isActive ? 'bg-[#222] text-[#4FE75E]' : 'bg-transparent text-[#F2F2F2] hover:bg-[#111]'}
      `}
    >
      {isEditing ? (
        <input
          autoFocus
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onBlur={finishEditing}
          onKeyDown={handleKeyDown}
          maxLength={24}
          className="w-full bg-transparent border-none outline-none text-inherit font-inherit placeholder-[#777] truncate"
          placeholder="새 폴더"
        />
      ) : (
        <span
          className="truncate w-full whitespace-nowrap overflow-hidden"
          onDoubleClick={() => setIsEditing(true)}
        >
          {inputValue}
        </span>
      )}
    </div>
  );
}
