import { useState, useEffect, useRef } from 'react';
import Input48 from '../../components/input/48';
import BtnSmallArrow from '../../components/btn/btn-small-arrow';
import BtnSign2Small from '../../components/btn/btn-sign-2-small';
import BtnDropdown from '../../components/btn/btn-dropdown';
import AdvancedSettings from './advancedsetting';

export interface DashboardFormData {
  name: string;
  logPath: string;
  advancedConfig: any;
  agentId?: string;
  logType: string;
  timezone: string;
}

interface DashboardMakeProps {
  folderId: number;
  onClose?: () => void;
  onCreate?: (board: DashboardFormData) => void;
}

const logTypes = ['springboot', 'tomcat'] as const;
const timezones = ['Asia/Seoul', 'UTC'];

// logType별 기본 고급설정
const defaultConfigs: Record<(typeof logTypes)[number], any> = {
  springboot: {
    tailer: { readIntervalMs: 300, metaDataFilePathPrefix: '/spring/logs' },
    multiline: { enabled: false, maxLines: 200 },
    exporter: { compressEnabled: true, retryIntervalSec: 5, maxRetryCount: 3 },
    filter: { allowedLevels: ['ERROR', 'WARN'], requiredKeywords: ['Exception', 'DB'] },
  },
  tomcat: {
    tailer: { readIntervalMs: 500, metaDataFilePathPrefix: '/tomcat/logs' },
    multiline: { enabled: false, maxLines: 50 },
    exporter: { compressEnabled: false, retryIntervalSec: 10, maxRetryCount: 1 },
    filter: { allowedMethods: ['GET', 'POST'], requiredKeywords: ['login', 'error'] },
  },
};

const deepClone = <T,>(obj: T): T => JSON.parse(JSON.stringify(obj));

export default function DashboardMake({ folderId, onClose, onCreate }: DashboardMakeProps) {
  const [logPath, setLogPath] = useState('');
  const [boardName, setBoardName] = useState('');
  const [isAdvancedOpen, setIsAdvancedOpen] = useState(false);
  const [logType, setLogType] = useState<(typeof logTypes)[number]>('springboot');
  const [timezone, setTimezone] = useState('Asia/Seoul');
  const [isLogTypeOpen, setIsLogTypeOpen] = useState(false);
  const [isTimezoneOpen, setIsTimezoneOpen] = useState(false);

  // Agent ID 상태
  const [useAgentId, setUseAgentId] = useState(false);
  const [agentId, setAgentId] = useState('');

  const logTypeRef = useRef<HTMLDivElement>(null);
  const timezoneRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (logTypeRef.current && !logTypeRef.current.contains(event.target as Node)) {
        setIsLogTypeOpen(false);
      }
      if (timezoneRef.current && !timezoneRef.current.contains(event.target as Node)) {
        setIsTimezoneOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const [advancedConfigs, setAdvancedConfigs] = useState<Record<(typeof logTypes)[number], any>>({
    springboot: deepClone(defaultConfigs.springboot),
    tomcat: deepClone(defaultConfigs.tomcat),
  });

  const isFormValid = logPath.trim() !== '' && boardName.trim() !== '';

  const handleCreate = () => {
    if (!isFormValid) return;

    const formData: DashboardFormData = {
      name: boardName,
      logPath,
      advancedConfig: advancedConfigs[logType],
      logType,
      timezone,
      ...(useAgentId && agentId.trim() ? { agentId } : {}), // 체크박스 켜져있고 값이 있으면 최상위에 포함
    };

    onCreate?.(formData);
    onClose?.();
  };

  return (
    <div
      className="relative flex flex-col items-center
                 w-[840px] px-0 py-10 gap-6
                 rounded-[24px] border border-[#353535] bg-[#111]"
      onClick={(e) => e.stopPropagation()}
    >
      <h2 className="text-center text-[28px] font-bold leading-[135%] tracking-[-0.4px]
                     text-[var(--Gray-100,#F2F2F2)] font-[SUIT]">
        새로운 대시보드
      </h2>

      <div className="flex flex-col w-[86%]">
        {/* 로그 파일 경로 */}
        <label className="mb-2 flex items-center gap-1">
          <span className="text-[16px] font-medium text-[var(--Gray-200,#D8D8D8)] font-[SUIT]">
            로그 파일 경로
          </span>
          <span className="text-[16px] font-medium text-[var(--Alert-Red,#D46F6F)] font-[SUIT]">*</span>
        </label>
        <Input48 value={logPath} onChange={(e) => setLogPath(e.target.value)} placeholder="/placeholdertext" />

        {/* 보드 이름 */}
        <div className="mt-6">
          <label className="mb-2 flex items-center gap-1">
            <span className="text-[16px] font-medium text-[var(--Gray-200,#D8D8D8)] font-[SUIT]">
              보드 이름
            </span>
            <span className="text-[16px] font-medium text-[var(--Alert-Red,#D46F6F)] font-[SUIT]">*</span>
          </label>
          <Input48 value={boardName} onChange={(e) => setBoardName(e.target.value)} placeholder="보드 이름" />
        </div>

        {/* 로그 유형 + 타임존 */}
        <div className="mt-6 flex gap-4">
          {/* 로그 유형 */}
          <div className="flex-1 relative" ref={logTypeRef}>
            <label className="mb-2 flex items-center gap-1">
              <span className="text-[16px] font-medium text-[var(--Gray-200,#D8D8D8)] font-[SUIT]">
                로그 유형
              </span>
              <span className="text-[16px] font-medium text-[var(--Alert-Red,#D46F6F)] font-[SUIT]">*</span>
            </label>
            <div
              className="flex items-center justify-between h-[48px] px-[20px] pr-[12px] py-[11px]
                        rounded-[12px] bg-[var(--Gray-700,#222)] cursor-pointer"
              onClick={() => setIsLogTypeOpen((prev) => !prev)}
            >
              <span className="text-[var(--Gray-100,#F2F2F2)] font-[SUIT]">{logType}</span>
              <BtnDropdown />
            </div>

            {isLogTypeOpen && (
              <ul className="absolute z-10 mt-0.5 w-full rounded-[12px] overflow-hidden
                          bg-[var(--Gray-600,#353535)] border border-[#444]">
                {logTypes.map((type) => (
                  <li
                    key={type}
                    className={`flex h-[48px] items-center px-[20px] cursor-pointer
                      ${logType === type
                        ? 'bg-[#222] text-[var(--Gray-100,#F2F2F2)]'
                        : 'text-[var(--Gray-100,#F2F2F2)] hover:bg-[var(--Gray-500,#535353)]'}`}
                    onClick={() => {
                      setLogType(type);
                      setIsLogTypeOpen(false);
                    }}
                  >
                    {type}
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* 타임존 */}
          <div className="flex-1 relative" ref={timezoneRef}>
            <label className="mb-2 flex items-center gap-1">
              <span className="text-[16px] font-medium text-[var(--Gray-200,#D8D8D8)] font-[SUIT]">
                타임존
              </span>
              <span className="text-[16px] font-medium text-[var(--Alert-Red,#D46F6F)] font-[SUIT]">*</span>
            </label>
            <div
              className="flex items-center justify-between h-[48px] px-[20px] pr-[12px] py-[11px]
                         rounded-[12px] bg-[var(--Gray-700,#222)] cursor-pointer"
              onClick={() => setIsTimezoneOpen((prev) => !prev)}
            >
              <span className="text-[var(--Gray-100,#F2F2F2)] font-[SUIT]">{timezone}</span>
              <BtnDropdown />
            </div>

            {isTimezoneOpen && (
              <ul className="absolute z-10 mt-0.5 w-full rounded-[12px] overflow-hidden
                             bg-[var(--Gray-600,#353535)] border border-[#444]">
                {timezones.map((tz) => (
                  <li
                    key={tz}
                    className="flex h-[48px] items-center px-[20px] text-[var(--Gray-100,#F2F2F2)] 
                               hover:bg-[var(--Gray-500,#535353)] cursor-pointer"
                    onClick={() => {
                      setTimezone(tz);
                      setIsTimezoneOpen(false);
                    }}
                  >
                    {tz}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* 고급 설정 */}
        <div className="mt-4 flex items-center justify-center gap-1">
          <span
            className="text-[#888] font-[SUIT] font-medium text-[16px] leading-[150%] tracking-[-0.4px] cursor-pointer hover:text-[#aaa]"
            onClick={() => setIsAdvancedOpen((prev) => !prev)}
          >
            고급 설정
          </span>
          <div className="cursor-pointer hover:opacity-80" onClick={() => setIsAdvancedOpen((prev) => !prev)}>
            <BtnSmallArrow direction={isAdvancedOpen ? 'up' : 'down'} />
          </div>
        </div>

        {isAdvancedOpen && (
          <div className="mt-4 w-full mx-auto max-h-[300px] overflow-y-auto pr-2">
            {/* Agent ID 제목 + 체크박스 */}
            <div className="mb-2 flex items-center gap-2">
              <span
                className="font-[Geist]"
                style={{
                  color: 'var(--Alert-Yellow, #D4B66F)',
                  fontSize: '16px',
                  fontWeight: 400,
                  lineHeight: '150%',
                }}
              >
                Agent ID
              </span>
              <input
                type="checkbox"
                checked={useAgentId}
                onChange={(e) => {
                  setUseAgentId(e.target.checked);
                  if (!e.target.checked) setAgentId('');
                }}
                className="cursor-pointer accent-[#D4B66F]"
              />
            </div>

            {/* Agent ID : 라벨 + Input */}
            {useAgentId && (
              <div className="mb-6 flex items-center gap-3">
                <span
                  className="w-[200px] whitespace-nowrap text-[var(--Gray-300,#AEAEAE)] font-[Geist] text-[16px] font-normal leading-[150%]"
                >
                  Agent ID :
                </span>
                <div className="flex-1">
                  <Input48
                    value={agentId}
                    onChange={(e) => setAgentId(e.target.value)}
                    placeholder="Agent ID를 입력하세요"
                    className="w-full"
                    align="center"
                  />
                </div>
              </div>
            )}

            {/* AdvancedSettings 컴포넌트 */}
            <AdvancedSettings
              key={logType}
              logType={logType}
              value={advancedConfigs[logType]}
              onChange={(v) =>
                setAdvancedConfigs((prev) => ({
                  ...prev,
                  [logType]: v!,
                }))
              }
            />
          </div>
        )}
      </div>

      {/* 버튼 */}
      <div>
        <BtnSign2Small isActive={isFormValid} onClick={handleCreate}>
          보드 만들기
        </BtnSign2Small>
      </div>
    </div>
  );
}
