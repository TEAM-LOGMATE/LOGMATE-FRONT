import TailerSettings from './advanced/tailer';
import MultilineSettings from './advanced/multiline';
import ExporterSettings from './advanced/exporter';
import FilterSettings from './advanced/filter';      // Spring Boot용
import FilterWeb from './advanced/filterweb';        // Tomcat용
import ConfigurationPuller from './advanced/configurationpuller';

export interface SpringBootFilter {
  allowedLevels: string[];
  requiredKeywords: string[];
}

export interface TomcatFilter {
  allowedMethods: string[];
  requiredKeywords: string[];
}

export interface AdvancedSettingsProps {
  logType: 'springboot' | 'tomcat';
  value?: {
    puller?: { intervalSec: number };
    pullerConfig?: { intervalSec: number };
    tailer?: {
      readIntervalMs: number;
      metaDataFilePathPrefix: string;
    };
    multiline?: {
      enabled: boolean;
      maxLines: number;
    };
    exporter?: {
      compressEnabled: boolean;
      retryIntervalSec: number;
      maxRetryCount: number;
    };
    filter?: SpringBootFilter | TomcatFilter;
  };
  onChange: (newValue: AdvancedSettingsProps["value"]) => void;
}

// 기본값 정의 (logType 별)
const defaultConfigs = {
  springboot: {
    puller: { intervalSec: 5 },
    tailer: {
      readIntervalMs: 1000,
      metaDataFilePathPrefix: '/tmp/meta',
    },
    multiline: {
      enabled: false,
      maxLines: 1,
    },
    exporter: {
      compressEnabled: false,
      retryIntervalSec: 5,
      maxRetryCount: 3,
    },
    filter: {
      allowedLevels: [] as string[],
      requiredKeywords: [] as string[],
    } as SpringBootFilter,
  },
  tomcat: {
    puller: { intervalSec: 5 },
    tailer: {
      readIntervalMs: 1000,
      metaDataFilePathPrefix: '/tmp/meta',
    },
    multiline: {
      enabled: false,
      maxLines: 1,
    },
    exporter: {
      compressEnabled: false,
      retryIntervalSec: 5,
      maxRetryCount: 3,
    },
    filter: {
      allowedMethods: [] as string[],
      requiredKeywords: [] as string[],
    } as TomcatFilter,
  },
};

// filter 정규화 함수 (null/undefined 안전 처리)
function normalizeFilter(logType: 'springboot' | 'tomcat', filter: any) {
  if (logType === 'springboot') {
    return {
      allowedLevels: filter?.allowedLevels ?? [],
      requiredKeywords: filter?.requiredKeywords ?? [],
    } as SpringBootFilter;
  }
  return {
    allowedMethods: filter?.allowedMethods ?? [],
    requiredKeywords: filter?.requiredKeywords ?? [],
  } as TomcatFilter;
}

export default function AdvancedSettings({ logType, value, onChange }: AdvancedSettingsProps) {
  const base = defaultConfigs[logType];

  // pullerConfig 반영 순서 수정 (서버 값 우선, 사용자 값 최종)
  const safeValue = {
    ...base,
    ...value,
    puller: {
      ...base.puller,                   
      ...(value?.pullerConfig || {}),   
      ...(value?.puller || {}),        
    },
    tailer: { ...base.tailer, ...(value?.tailer || {}) },
    multiline: { ...base.multiline, ...(value?.multiline || {}) },
    exporter: { ...base.exporter, ...(value?.exporter || {}) },
    filter: normalizeFilter(logType, value?.filter),
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Puller 설정 */}
      <ConfigurationPuller
        value={safeValue.puller}
        onChange={(puller) => onChange({ ...safeValue, puller,pullerConfig: puller })}
      />
      <TailerSettings
        value={safeValue.tailer}
        onChange={(tailer) => onChange({ ...safeValue, tailer })}
      />
      <MultilineSettings
        value={safeValue.multiline}
        onChange={(multiline) => onChange({ ...safeValue, multiline })}
      />
      <ExporterSettings
        value={safeValue.exporter}
        onChange={(exporter) => onChange({ ...safeValue, exporter })}
      />

      {/* 로그 타입별 필터 분기 */}
      {logType === 'springboot' ? (
        <FilterSettings
          value={safeValue.filter as SpringBootFilter}
          onChange={(filter) => onChange({ ...safeValue, filter })}
        />
      ) : (
        <FilterWeb
          value={safeValue.filter as TomcatFilter}
          onChange={(filter) => onChange({ ...safeValue, filter })}
        />
      )}
    </div>
  );
}
