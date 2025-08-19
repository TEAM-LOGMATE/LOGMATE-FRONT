import { useState } from 'react';
import Input48 from '../../components/input/48';
import BtnSmallArrow from '../../components/btn/btn-small-arrow';
import BtnSign2Small from '../../components/btn/btn-sign-2-small';
import BtnDropdown from '../../components/btn/btn-dropdown';
import AdvancedSettings from './advancedsetting';

interface DashboardMakeProps {
  onClose?: () => void;
  onCreate?: (board: { id: number; name: string; logPath: string }) => void;
}

export default function DashboardMake({ onClose, onCreate }: DashboardMakeProps) {
  const [logPath, setLogPath] = useState('');
  const [boardName, setBoardName] = useState('');

  const [isAdvancedOpen, setIsAdvancedOpen] = useState(false); 

  const isFormValid = logPath.trim() !== '' && boardName.trim() !== '';

  const handleCreate = () => {
    if (!isFormValid) return;
    const newBoard = {
      id: Date.now(),
      name: boardName,
      logPath,
    };
    onCreate?.(newBoard);
    onClose?.();
  };

  return (
    <div
      className="
        relative flex flex-col items-center
        w-[840px] px-0 py-10
        gap-6
        rounded-[24px]
        border border-[#353535]
        bg-[#111]
      "
      onClick={(e) => e.stopPropagation()}
    >
      {/* 제목 */}
      <h2
        className="
          text-center text-[28px] font-bold leading-[135%] tracking-[-0.4px]
          text-[var(--Gray-100,#F2F2F2)] font-[SUIT]
        "
      >
        새로운 대시보드
      </h2>

      {/* 입력 영역 */}
      <div className="flex flex-col w-[86%]">
        {/* 로그 파일 경로 */}
        <label className="mb-2 flex items-center gap-1">
          <span className="text-[16px] font-medium text-[var(--Gray-200,#D8D8D8)] font-[SUIT]">
            로그 파일 경로
          </span>
          <span className="text-[16px] font-medium text-[var(--Alert-Red,#D46F6F)] font-[SUIT]">*</span>
        </label>
        <Input48
          value={logPath}
          onChange={(e) => setLogPath(e.target.value)}
          placeholder="/placeholdertext"
        />

        {/* 보드 이름 */}
        <div className="mt-6">
          <label className="mb-2 flex items-center gap-1">
            <span className="text-[16px] font-medium text-[var(--Gray-200,#D8D8D8)] font-[SUIT]">
              보드 이름
            </span>
            <span className="text-[16px] font-medium text-[var(--Alert-Red,#D46F6F)] font-[SUIT]">*</span>
          </label>
          <Input48
            value={boardName}
            onChange={(e) => setBoardName(e.target.value)}
            placeholder="보드 이름"
          />
        </div>

        {/* 로그 유형 + 타임존 */}
        <div className="mt-6 flex gap-4">
          {/* 로그 유형 */}
          <div className="flex-1">
            <label className="mb-2 flex items-center gap-1">
              <span className="text-[16px] font-medium text-[var(--Gray-200,#D8D8D8)] font-[SUIT]">
                로그 유형
              </span>
              <span className="text-[16px] font-medium text-[var(--Alert-Red,#D46F6F)] font-[SUIT]">*</span>
            </label>
            <div
              className="flex items-center justify-between h-[48px] px-[20px] pr-[12px] py-[11px] 
              rounded-[12px] bg-[var(--Gray-700,#222)] cursor-pointer"
            >
              <span className="text-[#F2F2F2] font-[SUIT]">springboot</span>
              <BtnDropdown />
            </div>
          </div>

          {/* 타임존 */}
          <div className="flex-1">
            <label className="mb-2 flex items-center gap-1">
              <span className="text-[16px] font-medium text-[var(--Gray-200,#D8D8D8)] font-[SUIT]">
                타임존
              </span>
              <span className="text-[16px] font-medium text-[var(--Alert-Red,#D46F6F)] font-[SUIT]">*</span>
            </label>
            <div
              className="flex items-center justify-between h-[48px] px-[20px] pr-[12px] py-[11px] 
              rounded-[12px] bg-[var(--Gray-700,#222)] cursor-pointer"
            >
              <span className="text-[#F2F2F2] font-[SUIT]">Asia/Seoul</span>
              <BtnDropdown />
            </div>
          </div>
        </div>

        {/* 고급 설정 버튼 */}
        <div
          className="mt-4 flex items-center justify-center gap-1 cursor-pointer"
          onClick={() => setIsAdvancedOpen((prev) => !prev)} // 토글
        >
          <span className="text-[#888] font-[SUIT] font-medium text-[16px] leading-[150%] tracking-[-0.4px]">
            고급 설정
          </span>
          <BtnSmallArrow direction={isAdvancedOpen ? 'up' : 'down'} />
        </div>

        {/* 고급 설정 컴포넌트 */}
        {isAdvancedOpen && (
          <div className="mt-4 w-full mx-auto max-h-[300px] overflow-y-auto pr-2">
            <AdvancedSettings />
          </div>
        )}
      </div>

      {/* 보드 만들기 버튼 */}
      <div>
        <BtnSign2Small isActive={isFormValid} onClick={handleCreate}>
          보드 만들기
        </BtnSign2Small>
      </div>
    </div>
  );
}
