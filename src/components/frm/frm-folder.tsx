import { useState, useEffect, useRef } from 'react';
import BtnMore from '../btn/btn-more';
import BtnMoreText from '../btn/btn-more-text';

interface FrmFolderProps {
  name: string;
  onRename?: (newName: string) => void;
  onDelete?: () => void;
  onCancel?: () => void;
  onDraftChange?: (value: string) => void;
  containerRef?: React.Ref<HTMLDivElement>;
  onClickName?: () => void;
}

export default function FrmFolder({
  name,
  onRename,
  onDelete,
  onCancel,
  onDraftChange,
  containerRef,
  onClickName,
}: FrmFolderProps) {
  const [isEditing, setIsEditing] = useState(name === '새 폴더');
  const [inputValue, setInputValue] = useState(name);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setInputValue(name);
  }, [name]);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsMenuOpen(false);
      }
    }
    if (isMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMenuOpen]);

  const tryConfirm = () => {
    const trimmed = inputValue.trim();
    if (trimmed === '') {
      onCancel?.();
      setIsEditing(false);
      return;
    }
    if (trimmed === '새 폴더') return;
    onRename?.(trimmed);
    setIsEditing(false);
  };

  const handleBlur = () => {
    const trimmed = inputValue.trim();
    if (trimmed === '') {
      onCancel?.();
      setIsEditing(false);
      return;
    }
    if (trimmed === '새 폴더') return;
    onRename?.(trimmed);
    setIsEditing(false);
  };

  const handleMenuSelect = (option: string) => {
    setIsMenuOpen(false);
    if (option === '폴더 이름 바꾸기') {
      setIsEditing(true);
    } else if (option === '폴더 삭제') {
      onDelete?.();
    }
  };

  return (
    <div
      ref={containerRef}
      className="w-[340px] h-[300px] flex flex-col items-start gap-[12px] font-suit text-white relative"
    >
      {/* 썸네일 */}
      <div className="flex-1 w-full grid grid-cols-2 grid-rows-2 gap-[12px] p-[12px] bg-[#222] rounded-[12px] overflow-hidden">
        <div className="flex-1 rounded-[4px] bg-[#171717]" />
        <div className="flex-1 rounded-[4px] bg-[#171717]" />
        <div className="flex-1 rounded-[4px] bg-[#171717]" />
        <div className="flex-1 rounded-[4px] bg-[#171717]" />
      </div>

      {/* 폴더 정보 */}
      <div className="w-full bg-[#0F0F0F] px-[12px] pt-[8px] pb-[16px] rounded-b-[12px]">
        <div className="flex justify-between items-start relative">
          <div className="flex flex-col items-start gap-[4px]">
            {isEditing ? (
              <input
                ref={inputRef}
                className="text-[16px] font-bold leading-[24px] text-[#F2F2F2] bg-transparent border-none outline-none"
                value={inputValue}
                onChange={(e) => {
                  setInputValue(e.target.value);
                  onDraftChange?.(e.target.value);
                }}
                onBlur={handleBlur}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') tryConfirm();
                  if (e.key === 'Escape') {
                    onCancel?.();
                    setIsEditing(false);
                  }
                }}
                placeholder="폴더 이름을 입력하세요"
                spellCheck={false}
              />
            ) : (
              <span
                className="text-[16px] font-bold leading-[24px] text-[#F2F2F2] cursor-pointer"
                onClick={onClickName}
              >
                {name}
              </span>
            )}
            <span className="text-[14px] leading-[21px] text-[#AEAEAE]">
              <span className="font-[Geist] font-light">Edited </span>
              <span className="font-['Geist_Mono'] font-light">0000.00.00</span>
            </span>
          </div>
          {/* 더보기 버튼 */}
          <div className="relative">
            <BtnMore onClick={() => setIsMenuOpen((prev) => !prev)} />
            {isMenuOpen && (
              <div ref={menuRef} className="absolute top-full right-0 mt-1 z-10">
                <BtnMoreText
                  options={['폴더 이름 바꾸기', '폴더 삭제']}
                  selected=""
                  onSelect={handleMenuSelect}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
