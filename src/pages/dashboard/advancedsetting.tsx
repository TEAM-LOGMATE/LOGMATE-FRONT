import TailerSettings from './advanced/tailer';
import MultilineSettings from './advanced/multiline';
import ExporterSettings from './advanced/exporter';
import FilterSettings from './advanced/filter';      // Spring Boot용
import FilterWeb from './advanced/filterweb';        // Tomcat용

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

// 기본값 정의
const defaultConfig = {
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
    allowedLevels: [],
    requiredKeywords: [],
  } as SpringBootFilter,
};

export default function AdvancedSettings({ logType, value, onChange }: AdvancedSettingsProps) {
  // 기본값과 병합 (서버에서 내려온 값이 있으면 덮어씀)
  const safeValue = {
    ...defaultConfig,
    ...value,
    tailer: { ...defaultConfig.tailer, ...(value?.tailer || {}) },
    multiline: { ...defaultConfig.multiline, ...(value?.multiline || {}) },
    exporter: { ...defaultConfig.exporter, ...(value?.exporter || {}) },
    filter: { ...defaultConfig.filter, ...(value?.filter || {}) },
  };

  return (
    <div className="flex flex-col gap-6">
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
