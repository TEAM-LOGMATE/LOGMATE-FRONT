import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import Input48 from '../../components/input/48';
import BtnSmallArrow from '../../components/btn/btn-small-arrow';
import BtnSign2Small from '../../components/btn/btn-sign-2-small';
import BtnDropdown from '../../components/btn/btn-dropdown';
import AdvancedSettings, { type AdvancedSettingsProps } from './advancedsetting';
import {
  updateDashboard,
  updateDashboardConfig,
  getDashboards,
  getDashboardConfigs,
} from '../../api/dashboard';
import { p } from 'framer-motion/client';

interface DashboardEditProps {
  folderId: number;
  boardId: number;
  initialName: string;
  initialLogPath: string;
  initialAdvancedConfig: any;
  initialAgentId?: string;
  initialLogType?: string;
  initialTimezone?: string;
  onClose?: () => void;
  onUpdated?: (updated: any) => void;
}

const logTypes = ['springboot', 'tomcat'] as const;
const timezones = ['Asia/Seoul', 'UTC'];

const defaultConfigs: Record<
  (typeof logTypes)[number],
  NonNullable<AdvancedSettingsProps['value']>
> = {
  springboot: {
    tailer: { readIntervalMs: 300, metaDataFilePathPrefix: '/spring/logs' },
    multiline: { enabled: false, maxLines: 200 },
    exporter: { compressEnabled: true, retryIntervalSec: 5, maxRetryCount: 3 },
    filter: {
      allowedLevels: ['ERROR', 'WARN'],
      requiredKeywords: ['Exception', 'DB'],
    },
  },
  tomcat: {
    tailer: { readIntervalMs: 500, metaDataFilePathPrefix: '/tomcat/logs' },
    multiline: { enabled: false, maxLines: 50 },
    exporter: { compressEnabled: false, retryIntervalSec: 10, maxRetryCount: 1 },
    filter: {
      allowedMethods: ['GET', 'POST'],
      requiredKeywords: ['login', 'error'],
    },
  },
};

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
  const [useAgentId, setUseAgentId] = useState(!!initialAgentId);

  const [isLogTypeOpen, setIsLogTypeOpen] = useState(false);
  const [isTimezoneOpen, setIsTimezoneOpen] = useState(false);

  const logTypeRef = useRef<HTMLDivElement>(null);
  const timezoneRef = useRef<HTMLDivElement>(null);

  const [advancedConfigs, setAdvancedConfigs] = useState<
    Record<(typeof logTypes)[number], NonNullable<AdvancedSettingsProps["value"]>>
  >({
    springboot: deepClone(defaultConfigs.springboot),
    tomcat: deepClone(defaultConfigs.tomcat),
  });

  // 서버에서 기본정보 + 고급설정 불러오기
  useEffect(() => {
    const fetchConfig = async () => {
      try {
        // 기본 정보 조회
        const dashboardsRes = await getDashboards(folderId);
        const dashboard = (dashboardsRes.data || []).find(
          (d: any) => d.id === boardId
        );

        if (dashboard) {
          setBoardName(dashboard.name || "");
          setLogPath(dashboard.logPath || "");
        }

        // 고급 정보 조회
        const configsRes = await getDashboardConfigs(folderId);
        const matched = (configsRes.data || []).find(
          (c: any) => c.dashboardId === boardId
        );

        // 대소문자 불일치 대응
        const rawConfigs =
          matched?.logPipelineConfigs || matched?.logpipelineConfigs;
        const pullerConfig = matched?.pullerConfig || { intervalSec: 5 };  

        if (rawConfigs) {
          const configs = Array.isArray(rawConfigs)
            ? rawConfigs
            : [rawConfigs];

          configs.forEach((serverConfig: any) => {
            const typeKey = serverConfig.parser?.type as (typeof logTypes)[number];
            if (!typeKey) return;

            const normalizedConfig = {
              ...serverConfig,
              parserType: serverConfig.parser?.type,
              parser: {
                timezone: serverConfig.parser?.config?.timezone ?? "Asia/Seoul",
              },
              puller: pullerConfig,
            };

            setAdvancedConfigs((prev) => ({
              ...prev,
              [typeKey]: {
                ...deepClone(defaultConfigs[typeKey]),
                ...deepClone(normalizedConfig),
              },
            }));

            if (serverConfig.parser?.type) {
              setLogType(serverConfig.parser.type as (typeof logTypes)[number]);
            }
            if (serverConfig.parser?.config?.timezone) {
              setTimezone(serverConfig.parser.config.timezone);
            }
          });
        } else if (initialAdvancedConfig) {
          setAdvancedConfigs((prev) => ({
            ...prev,
            [initialLogType as (typeof logTypes)[number]]: {
              ...deepClone(defaultConfigs[initialLogType as (typeof logTypes)[number]]),
              ...deepClone(initialAdvancedConfig),
            },
          }));
        }
      } catch (err) {
        console.error("대시보드 기본/고급정보 불러오기 실패:", err);
      }
    };

    fetchConfig();
  }, [folderId, boardId, initialAdvancedConfig, initialLogType]);

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

  const isFormValid = logPath.trim() !== "" && boardName.trim() !== "";

  const handleSave = async () => {
    if (!isFormValid) return;
    try {
      await updateDashboard(folderId, boardId, {
        name: boardName,
        logPath,
      });

      const currentConfig = advancedConfigs[logType];

      const body: any = {
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
          filter: currentConfig.filter ?? {
            allowedLevels: [],
            requiredKeywords: [],
          },
        },
        puller: { intervalSec: currentConfig.puller?.intervalSec ?? 5 }
      };

      if (useAgentId && agentId.trim()) {
        body.agentId = agentId;
      }

      const res = await updateDashboardConfig(folderId, boardId, body);

      onUpdated?.({
        id: boardId,
        name: boardName,
        logPath,
        advancedConfig: body.logPipelineConfig,
        pullerConfig: body.pullerConfig,
        agentId: res.data?.agentId ?? (useAgentId ? agentId : ''),
      });

      onClose?.();
    } catch (err) {
      console.error('대시보드 수정 실패:', err);
    }
  };

  return (
    <motion.div
      className="relative flex flex-col items-center w-[840px] px-0 py-10 gap-6 rounded-[24px] border border-[#353535] bg-[#111]"
      initial={{ opacity: 0, scale: 0.95, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95, y: 20 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      onClick={(e) => e.stopPropagation()}
    >
      <h2 className="text-center text-[28px] font-bold leading-[135%] tracking-[-0.4px] text-[var(--Gray-100,#F2F2F2)] font-[SUIT]">
        보드 설정
      </h2>

      <div className="flex flex-col w-[86%]">
        {/* 로그 파일 경로 */}
        <label className="mb-2 flex items-center gap-1">
          <span className="text-[16px] font-medium text-[var(--Gray-200,#D8D8D8)] font-[SUIT]">
            로그 파일 경로
          </span>
          <span className="text-[16px] font-medium text-[var(--Alert-Red,#D46F6F)] font-[SUIT]">
            *
          </span>
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
            <span className="text-[16px] font-medium text-[var(--Alert-Red,#D46F6F)] font-[SUIT]">
              *
            </span>
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
              className="flex items-center justify-between h-[48px] px-[20px] pr-[12px] py-[11px] rounded-[12px] bg-[var(--Gray-700,#222)]"
              style={{ cursor: "default" }}
            >
              <span className="text-[var(--Gray-100,#F2F2F2)] font-[SUIT]">
                {logType}
              </span>
            </div>
          </div>

          {/* 타임존 */}
          <div className="flex-1 relative" ref={timezoneRef}>
            <label className="mb-2 flex items-center gap-1">
              <span className="text-[16px] font-medium text-[var(--Gray-200,#D8D8D8)] font-[SUIT]">
                타임존
              </span>
            </label>
            <div
              className="flex items-center justify-between h-[48px] px-[20px] pr-[12px] py-[11px] rounded-[12px] bg-[var(--Gray-700,#222)] cursor-pointer"
              onClick={() => setIsTimezoneOpen((prev) => !prev)}
            >
              <span className="text-[var(--Gray-100,#F2F2F2)] font-[SUIT]">
                {timezone}
              </span>
              <BtnDropdown />
            </div>
            {isTimezoneOpen && (
              <ul className="absolute z-10 mt-0.5 w-full rounded-[12px] overflow-hidden bg-[var(--Gray-600,#353535)] border border-[#444]">
                {timezones.map((tz) => (
                  <li
                    key={tz}
                    className="flex h-[48px] items-center px-[20px] text-[var(--Gray-100,#F2F2F2)] hover:bg-[var(--Gray-500,#535353)] cursor-pointer"
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
          <div
            className="cursor-pointer hover:opacity-80"
            onClick={() => setIsAdvancedOpen((prev) => !prev)}
          >
            <BtnSmallArrow direction={isAdvancedOpen ? "up" : "down"} />
          </div>
        </div>

        {isAdvancedOpen && (
          <div className="mt-4 w-full mx-auto max-h-[300px] overflow-y-auto pr-2">
            {/* Agent ID */}
            <div className="mb-2 flex items-center gap-2">
              <span
                className="font-[Geist]"
                style={{
                  color: "var(--Alert-Yellow, #D4B66F)",
                  fontSize: "16px",
                  fontWeight: 400,
                  lineHeight: "150%",
                }}
              >
                Agent ID
              </span>
              <input
                type="checkbox"
                checked={useAgentId}
                onChange={(e) => {
                  setUseAgentId(e.target.checked);
                  if (!e.target.checked) setAgentId("");
                }}
                className="cursor-pointer accent-[#D4B66F]"
              />
            </div>

            {useAgentId && (
              <div className="mb-6 flex items-center gap-3">
                <span className="w-[200px] whitespace-nowrap text-[var(--Gray-300,#AEAEAE)] font-[Geist] text-[16px] font-normal leading-[150%]">
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

            <AdvancedSettings
              key={logType}
              logType={logType}
              value={advancedConfigs[logType]}
              onChange={(v) =>
                setAdvancedConfigs((prev) => ({
                  ...prev,
                  [logType]: {
                    ...prev[logType],
                    ...v,
                    pullerConfig: v?.puller ?? prev[logType]?.pullerConfig,
                  },
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
