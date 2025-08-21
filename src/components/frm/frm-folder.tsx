import { useState, useEffect, useRef, useMemo } from 'react';
import BtnMore from '../btn/btn-more';
import BtnMoreText from '../btn/btn-more-text';
import { AnimatePresence, motion } from 'framer-motion';

type BoardStatus = 'collecting' | 'unresponsive' | 'before';

interface TileBoardRaw {
  id?: number | string;
  name?: string;
  lastEdited?: string;
  statusType?: BoardStatus | 'idle';
  status?: BoardStatus | 'idle';
}

interface FrmFolderProps {
  name: string;
  boards?: TileBoardRaw[];
  spaceType?: 'personal' | 'team';
  onClickName?: () => void;
  containerRef?: React.Ref<HTMLDivElement>;
  onDraftChange?: (value: string) => void;
  onCancel?: () => void;
  onAddBoard?: () => void;
  onRename?: (newName: string) => void;
  onDelete?: () => void;
  onOpenTeamSettings?: () => void;
  onLeaveTeam?: () => void;
  sortOrder?: 'newest' | 'oldest';
}

export default function FrmFolder({
  name,
  boards = [],
  spaceType = 'personal',
  onRename,
  onDelete,
  onCancel,
  onDraftChange,
  containerRef,
  onClickName,
  onOpenTeamSettings,
  onLeaveTeam,
  onAddBoard,
  sortOrder = 'newest',
}: FrmFolderProps) {
  const [isEditing, setIsEditing] = useState(name === '새 폴더' || name === '새 팀');
  const [inputValue, setInputValue] = useState(name);
  const [errorMessage, setErrorMessage] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [modifiedAt, setModifiedAt] = useState<Date>(new Date());
  const inputRef = useRef<HTMLInputElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const mode: 'personal' | 'team' = spaceType === 'team' ? 'team' : 'personal';

  useEffect(() => setInputValue(name), [name]);
  useEffect(() => { if (isEditing && inputRef.current) inputRef.current.focus(); }, [isEditing]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (!isEditing) return;
      const target = e.target as Node;
      if (menuRef.current?.contains(target)) return;
      if (inputRef.current?.contains(target)) return;

      const trimmed = inputValue.trim();
      if (!trimmed || trimmed === '새 폴더' || trimmed === '새 팀') {
        onCancel?.();
        setIsEditing(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isEditing, inputValue, onCancel]);

  useEffect(() => {
    function handleClickOutsideMenu(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setIsMenuOpen(false);
    }
    if (isMenuOpen) document.addEventListener('mousedown', handleClickOutsideMenu);
    return () => document.removeEventListener('mousedown', handleClickOutsideMenu);
  }, [isMenuOpen]);

  const validateName = (value: string) => {
    if (value.trim().length < 2 || value.trim().length > 20) {
      setErrorMessage('*2자~20자 내로 입력해주세요.');
      return false;
    }
    setErrorMessage('');
    return true;
  };

  const tryConfirm = () => {
    const trimmed = inputValue.trim();
    if (!trimmed || trimmed === '새 폴더' || trimmed === '새 팀') {
      onCancel?.();
      setIsEditing(false);
      return;
    }
    if (!validateName(trimmed)) return;
    onRename?.(trimmed);
    setModifiedAt(new Date());
    setIsEditing(false);
  };

  const formatDate = (date: Date) => {
    if (isNaN(date.getTime())) return '----.--.--';
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}.${m}.${d}`;
  };

  // ---------- 상태 동기화 ----------
  const [statusTick, setStatusTick] = useState(0);
  useEffect(() => {
    const onCustom = (e: Event) => {
      const detail = (e as CustomEvent)?.detail;
      if (detail?.boardId != null) setStatusTick((t) => t + 1);
    };
    const onStorage = (e: StorageEvent) => {
      if (e.key && e.key.startsWith('statusType-')) setStatusTick((t) => t + 1);
    };
    window.addEventListener('boardStatusChange', onCustom as EventListener);
    window.addEventListener('storage', onStorage);
    return () => {
      window.removeEventListener('boardStatusChange', onCustom as EventListener);
      window.removeEventListener('storage', onStorage);
    };
  }, []);
  // ---------- 상태 동기화 끝 ----------

  // 정규화
  const normalizeBoard = (b: TileBoardRaw) => {
    const id = Number(b?.id);
    const propStatus = (b?.statusType ?? b?.status ?? 'before') as BoardStatus | 'idle';
    let status: BoardStatus = propStatus === 'idle' ? 'before' : (propStatus as BoardStatus);

    if (id) {
      const raw = localStorage.getItem(`statusType-${id}`);
      if (raw === 'collecting' || raw === 'unresponsive' || raw === 'before') status = raw as BoardStatus;
      else if (raw === 'collection') status = 'collecting';
    }
    return { id, name: b?.name ?? '', lastEdited: b?.lastEdited, statusType: status as BoardStatus };
  };

  // 색상
  const getBadgeClasses = (s: BoardStatus) => {
    switch (s) {
      case 'collecting':   return 'bg-[#0C2A1A]/80 text-[#34D399] border border-[#14532D]';
      case 'unresponsive': return 'bg-[#2A0C0C]/80 text-[#F87171] border border-[#7F1D1D]';
      default:             return 'bg-[#2A240C]/80 text-[#FBBF24] border border-[#78350F]';
    }
  };
  const getDotClass = (s: BoardStatus) =>
    s === 'collecting' ? 'text-[#34D399]' : s === 'unresponsive' ? 'text-[#F87171]' : 'text-[#FBBF24]';
  const getLabel = (s: BoardStatus) =>
    s === 'collecting' ? '로그 수집중' : s === 'unresponsive' ? '에이전트 미응답' : '대시보드 준비 중';

  // TeamPage와 정렬 일치
  const sortedBoards = useMemo(() => {
    const list = (boards || []).map(normalizeBoard);
    list.sort((a, b) => {
      const aTime = a.lastEdited ? new Date(a.lastEdited).getTime() : 0;
      const bTime = b.lastEdited ? new Date(b.lastEdited).getTime() : 0;
      return sortOrder === 'newest' ? bTime - aTime : aTime - bTime;
    });
    return list;
  }, [boards, sortOrder, statusTick]);

  return (
    <div ref={containerRef} className="w-[340px] flex flex-col items-start gap-[12px] font-suit text-white relative">
      {/* 미니 타일 2×2 */}
      <div className="w-full h-[200px] grid grid-cols-2 grid-rows-2 gap-[12px] p-[12px] bg-[#222] rounded-[12px] overflow-hidden">
        {[...sortedBoards.slice(0, 3), { __add: true } as any].map((board: any, idx) => {
          // ➕ 추가 타일: 아이콘 X, 텍스트 "+"만, 원래 폰트로 중앙 배치
          if (board?.__add) {
            return (
              <button
                key={`add-${idx}`}
                type="button"
                onClick={onAddBoard}
                aria-label={mode === 'team' ? '팀 보드 연결하기' : '새로운 대시보드 연결하기'}
                className="
                  relative w-full h-full rounded-[8px] bg-[#171717]
                  grid place-items-center
                  font-suit text-[18px] font-medium tracking-[-0.4px]
                  text-[#8B8B8B] hover:text-[#F2F2F2]
                  transition-colors select-none
                "
                title={mode === 'team' ? '팀 보드 연결하기' : '새로운 대시보드 연결하기'}
              >
                +
              </button>
            );
          }

          const s: BoardStatus = board.statusType;
          const label = getLabel(s);
          const badge = getBadgeClasses(s);
          const dot = getDotClass(s);

          return (
            <div
              key={board.id ?? idx}
              className="relative w-full h-full rounded-[8px] bg-[#171717] overflow-hidden"
              data-tick={statusTick}
            >
              {/* (옵션) 미니 썸네일 자리 */}
              <div className="absolute inset-0" />

              {/* 상태 뱃지: 타일 정중앙 */}
              <div className="absolute inset-0 grid place-items-center pointer-events-none">
                <div
                  className={
                    `px-2 py-1 rounded-[6px] text-[11px] font-medium ` +
                    `flex items-center gap-[6px] shadow-sm ` + badge
                  }
                >
                  <span className={`text-[10px] leading-none ${dot}`}>●</span>
                  {label}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* 폴더 정보 */}
      <div className="w-full bg-[#0F0F0F] px-[12px] pt-[8px] pb-[16px] rounded-b-[12px]">
        <div className="flex justify-between items-start relative">
          <div className="flex flex-col items-start gap-[4px]">
            {isEditing ? (
              <div className="flex flex-col">
                <input
                  ref={inputRef}
                  className="text-[16px] font-bold leading-[24px] text-[#F2F2F2] bg-transparent border-none outline-none"
                  value={inputValue}
                  onChange={(e) => {
                    const value = e.target.value;
                    setInputValue(value);
                    onDraftChange?.(value);
                    validateName(value);
                  }}
                  onBlur={tryConfirm}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') tryConfirm();
                    if (e.key === 'Escape') { onCancel?.(); setIsEditing(false); }
                  }}
                  placeholder={mode === 'team' ? '팀 이름을 입력하세요' : '폴더 이름을 입력하세요'}
                  spellCheck={false}
                />
                <AnimatePresence>
                  {errorMessage && (
                    <motion.span
                      key="error"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="text-[14px] leading-[21px] text-red-500 mt-1"
                    >
                      {errorMessage}
                    </motion.span>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <span className="text-[16px] font-bold leading-[24px] text-[#F2F2F2] cursor-pointer" onClick={onClickName}>
                {name}
              </span>
            )}
            <span className="text-[14px] leading-[21px] text-[#AEAEAE]">
              <span className="font-[Geist] font-light">Edited </span>
              <span className="font-['Geist_Mono'] font-light">{formatDate(modifiedAt)}</span>
            </span>
          </div>

          {/* 더보기 버튼 + 메뉴 */}
          <div className="relative">
            <BtnMore onClick={() => setIsMenuOpen((prev) => !prev)} />
            {isMenuOpen && (
              <div ref={menuRef} className="absolute top-full right-0 mt-1 z-10">
                <BtnMoreText
                  options={mode === 'personal' ? ['폴더 이름 바꾸기', '폴더 삭제'] : ['팀설정 변경', '팀 나가기']}
                  selected=""
                  onSelect={(option) => {
                    setIsMenuOpen(false);
                    if (mode === 'personal') {
                      if (option === '폴더 이름 바꾸기') setIsEditing(true);
                      if (option === '폴더 삭제') onDelete?.();
                    } else {
                      if (option === '팀설정 변경') onOpenTeamSettings?.();
                      if (option === '팀 나가기') onLeaveTeam?.();
                    }
                  }}
                  onClose={() => setIsMenuOpen(false)}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
