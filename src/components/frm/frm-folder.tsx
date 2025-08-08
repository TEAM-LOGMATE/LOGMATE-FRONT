import { useState, useEffect, useRef } from 'react';
import BtnMore from '../btn/btn-more';

interface FrmFolderProps {
  name: string;
  onRename: (newName: string) => void;
  onCancel?: () => void;
}

export default function FrmFolder({ name, onRename, onCancel }: FrmFolderProps) {
  const [isEditing, setIsEditing] = useState(name === '새 폴더');
  const [inputValue, setInputValue] = useState(name);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  const handleBlur = () => {
    const trimmed = inputValue.trim();
    if (trimmed === '') {
      onCancel?.();
    } else {
      onRename(trimmed);
    }
    setIsEditing(false);
  };

  return (
    <div className="w-[340px] h-[300px] flex flex-col items-start gap-[12px] font-suit text-white">
      {/* 썸네일 + 전체 배경 박스 */}
      <div className="flex-1 w-full grid grid-cols-2 grid-rows-2 gap-[12px] p-[12px] bg-[#222] rounded-[12px] overflow-hidden">
        <div className="flex-1 rounded-[4px] bg-[#171717]" />
        <div className="flex-1 rounded-[4px] bg-[#171717]" />
        <div className="flex-1 rounded-[4px] bg-[#171717]" />
        <div className="flex-1 rounded-[4px] bg-[#171717]" />
      </div>

      {/* 텍스트 영역 */}
      <div className="w-full bg-[#0F0F0F] px-[12px] pt-[8px] pb-[16px] rounded-b-[12px]">
        <div className="flex justify-between items-start">
          <div className="flex flex-col items-start gap-[4px]">
            {isEditing ? (
              <input
                ref={inputRef}
                className="text-[16px] font-bold leading-[24px] text-[#F2F2F2] bg-transparent border-none focus:ring-0 focus:outline-none outline-none"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onBlur={handleBlur}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleBlur();
                }}
              />
            ) : (
              <span
                className="text-[16px] font-bold leading-[24px] text-[#F2F2F2] cursor-pointer"
                onClick={() => setIsEditing(true)}
              >
                {name}
              </span>
            )}
            <span className="text-[14px] leading-[21px] text-[#AEAEAE]">
              <span className="font-[Geist] font-light">Edited </span>
              <span className="font-['Geist_Mono'] font-light">0000.00.00</span>
            </span>
          </div>
          <BtnMore />
        </div>
      </div>
    </div>
  );
}
