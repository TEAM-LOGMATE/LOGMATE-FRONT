import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import Input48 from '../../components/input/48';
import BtnSmallArrow from '../../components/btn/btn-small-arrow';
import BtnSign2Small from '../../components/btn/btn-sign-2-small';
import BtnDropdown from '../../components/btn/btn-dropdown';
import AdvancedSettings, { type AdvancedSettingsProps } from './advancedsetting';
import { updateDashboard, updateDashboardConfig } from '../../api/dashboard';

interface DashboardEditProps {
  folderId: number;
  boardId: number;
  initialName: string;
  initialLogPath: string;
  initialAdvancedConfig: any; // 서버에서 내려온 초기값
  initialAgentId?: string;
  initialLogType?: string;
  initialTimezone?: string;
  onClose?: () => void;
  onUpdated?: (updated: any) => void;
}

const logTypes = ['springboot', 'tomcat'] as const;
const timezones = ['Asia/Seoul', 'UTC'];

// logType별 기본값
const defaultConfigs: Record<
  (typeof logTypes)[number],
  NonNullable<AdvancedSettingsProps['value']>
> = {
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

// 깊은 복사 유틸
const deepClone = <T,>(obj: T): T => JSON.parse(JSON.stringify(obj));

export default function DashboardEdit({
  folderId,
  boardId,
  initialName,
  initialLogPath,
  initialAdvancedConfig,
  initialAgentId = '',
  initialLogType = 'springboot',
  initialTimezone = 'Asia/Seoul',
  onClose,
  onUpdated,
}: DashboardEditProps) {
  const [logPath, setLogPath] = useState(initialLogPath || '');
  const [boardName, setBoardName] = useState(initialName || '');
  const [isAdvancedOpen, setIsAdvancedOpen] = useState(false);

  const [logType, setLogType] = useState<(typeof logTypes)[number]>(
    initialLogType as (typeof logTypes)[number]
  );
  const [timezone, setTimezone] = useState(initialTimezone);
  const [agentId, setAgentId] = useState(initialAgentId);

  const [isLogTypeOpen, setIsLogTypeOpen] = useState(false);
  const [isTimezoneOpen, setIsTimezoneOpen] = useState(false);

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

  // logType별 고급설정 상태
  const [advancedConfigs, setAdvancedConfigs] = useState<
    Record<(typeof logTypes)[number], NonNullable<AdvancedSettingsProps['value']>>
  >({
    springboot: deepClone(defaultConfigs.springboot),
    tomcat: deepClone(defaultConfigs.tomcat),
  });

  // 서버에서 받은 초기 config 반영
  useEffect(() => {
    if (initialAdvancedConfig) {
      setAdvancedConfigs((prev) => ({
        ...prev,
        [initialLogType as (typeof logTypes)[number]]: {
          ...deepClone(defaultConfigs[initialLogType as (typeof logTypes)[number]]),
          ...deepClone(initialAdvancedConfig),
        },
      }));
    }
  }, [initialLogType, initialAdvancedConfig]);

  const isFormValid =
    logPath.trim() !== '' && boardName.trim() !== '' && agentId.trim() !== '';

  const handleSave = async () => {
    if (!isFormValid) return;
    try {
      await updateDashboard(folderId, boardId, {
        name: boardName,
        logPath,
      });

      const currentConfig = advancedConfigs[logType];

      const body = {
        agentId,
        targetFilePath: logPath,
        logPipelineConfig: {
          parserType: logType,
          parser: { timezone },
          tailer: {
            filePath: logPath,
            readIntervalMs: currentConfig.tailer?.readIntervalMs ?? 1000,
            metaDataFilePathPrefix:
              currentConfig.tailer?.metaDataFilePathPrefix ?? '/tmp/meta',
          },
          multiline: {
            enabled: currentConfig.multiline?.enabled ?? false,
            maxLines: currentConfig.multiline?.maxLines ?? 1,
          },
          exporter: {
            compressEnabled: currentConfig.exporter?.compressEnabled ?? false,
            retryIntervalSec: currentConfig.exporter?.retryIntervalSec ?? 5,
            maxRetryCount: currentConfig.exporter?.maxRetryCount ?? 3,
          },
          filter: currentConfig.filter ?? { allowedLevels: [], requiredKeywords: [] },
        },
      };

      const res = await updateDashboardConfig(folderId, boardId, body);

      onUpdated?.({
        id: boardId,
        name: boardName,
        logPath,
        advancedConfig: body.logPipelineConfig,
        agentId: res.data?.agentId ?? agentId,
      });

      onClose?.();
    } catch (err) {
      console.error('대시보드 수정 실패:', err);
    }
  };

  return (
    <motion.div
      className="relative flex flex-col items-center
                 w-[840px] px-0 py-10 gap-6
                 rounded-[24px] border border-[#353535] bg-[#111]"
      initial={{ opacity: 0, scale: 0.95, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95, y: 20 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
      onClick={(e) => e.stopPropagation()}
    >
      <h2
        className="text-center text-[28px] font-bold leading-[135%] tracking-[-0.4px]
                   text-[var(--Gray-100,#F2F2F2)] font-[SUIT]"
      >
        보드 설정
      </h2>

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
          <div className="flex-1 relative" ref={logTypeRef}>
            <label className="mb-2 flex items-center gap-1">
              <span className="text-[16px] font-medium text-[var(--Gray-200,#D8D8D8)] font-[SUIT]">
                로그 유형
              </span>
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
              <ul
                className="absolute z-10 mt-0.5 w-full rounded-[12px] overflow-hidden
                           bg-[var(--Gray-600,#353535)] border border-[#444]"
              >
                {logTypes.map((type) => (
                  <li
                    key={type}
                    className={`flex h-[48px] items-center px-[20px] cursor-pointer
                      ${
                        logType === type
                          ? 'bg-[#222] text-[var(--Gray-100,#F2F2F2)]'
                          : 'text-[var(--Gray-100,#F2F2F2)] hover:bg-[var(--Gray-500,#535353)]'
                      }`}
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
              <ul
                className="absolute z-10 mt-0.5 w-full rounded-[12px] overflow-hidden
                           bg-[var(--Gray-600,#353535)] border border-[#444]"
              >
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

        {/* Agent ID */}
        <div className="mt-6">
          <label className="mb-2 flex items-center gap-2">
            <span
              className="text-[16px] font-[Geist] font-normal leading-[150%]"
              style={{ color: 'var(--Alert-Yellow, #D4B66F)' }}
            >
              Agent ID (필수)
            </span>
          </label>
          <Input48
            value={agentId}
            onChange={(e) => setAgentId(e.target.value)}
            placeholder="Agent ID를 입력하세요"
          />
        </div>

        {/* 고급 설정 */}
        <div className="mt-4 flex items-center justify-center gap-1">
          <span
            className="text-[#888] font-[SUIT] font-medium text-[16px] leading-[150%] tracking-[-0.4px] cursor-pointer hover:text-[#aaa]"
            onClick={() => setIsAdvancedOpen((prev) => !prev)}
          >
            고급 설정
          </span>
          <div
            className="cursor-pointer hover:opacity-80"
            onClick={() => setIsAdvancedOpen((prev) => !prev)}
          >
            <BtnSmallArrow direction={isAdvancedOpen ? 'up' : 'down'} />
          </div>
        </div>

        {isAdvancedOpen && (
          <div className="mt-4 w-full mx-auto max-h-[300px] overflow-y-auto pr-2">
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
        <BtnSign2Small isActive={isFormValid} onClick={handleSave}>
          저장하기
        </BtnSign2Small>
      </div>
    </motion.div>
  );
}
