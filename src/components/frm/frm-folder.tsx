import { useState, useEffect, useRef } from 'react';
import BtnMore from '../btn/btn-more';

interface FrmFolderProps {
  name: string;
  onRename: (newName: string) => void;
  onCancel?: () => void;
  onDraftChange?: (value: string) => void;
  containerRef?: React.Ref<HTMLDivElement>;
}

export default function FrmFolder({
  name,
  onRename,
  onCancel,
  onDraftChange,
  containerRef,
}: FrmFolderProps) {
  const [isEditing, setIsEditing] = useState(name === '새 폴더');
  const [inputValue, setInputValue] = useState(name);
  const inputRef = useRef<HTMLInputElement>(null);

  // 부모가 이름을 바꾸면 입력값도 동기화
  useEffect(() => {
    setInputValue(name);
  }, [name]);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  const tryConfirm = () => {
    const trimmed = inputValue.trim();
    // 빈 값이면 취소
    if (trimmed === '') {
      onCancel?.();
      setIsEditing(false);
      return;
    }
    // '새 폴더'는 유효하지 않으므로 편집 유지 (부모도 동일 정책)
    if (trimmed === '새 폴더') {
      return; // 편집 유지
    }
    // 정상 확정
    onRename(trimmed);
    setIsEditing(false);
  };

  const handleBlur = () => {
    // blur에서도 동일 정책
    const trimmed = inputValue.trim();
    if (trimmed === '') {
      onCancel?.();
      setIsEditing(false);
      return;
    }
    if (trimmed === '새 폴더') {
      return; // 편집 유지
    }
    onRename(trimmed);
    setIsEditing(false);
  };

  return (
    <div
      ref={containerRef}
      className="w-[340px] h-[300px] flex flex-col items-start gap-[12px] font-suit text-white"
    >
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
