import TailerSettings from './advanced/tailer';
import MultilineSettings from './advanced/multiline';
import ExporterSettings from './advanced/exporter';
import FilterSettings from './advanced/filter';      // Spring Boot용
import FilterWeb from './advanced/filterweb';        // Tomcat용
import ConfigurationPuller from './advanced/configurationpuller';

interface SpringBootFilter {
  allowedLevels: string[];
  requiredKeywords: string[];
  after: string;
}

interface TomcatFilter {
  allowedMethods: string[];
  requiredKeywords: string[];
}

interface AdvancedSettingsProps {
  logType: 'springboot' | 'tomcat access';
  value: {
    tailer: {
      readIntervalMs: number;
      metaDataFilePathPrefix: string;
    };
    multiline: {
      enabled: boolean;
      maxLines: number;
    };
    exporter: {
      compressEnabled: boolean;
      retryIntervalSec: number;
      maxRetryCount: number;
    };
    filter: SpringBootFilter | TomcatFilter;
    puller: {
      intervalSec: number;
    };
  };
  onChange: (newValue: AdvancedSettingsProps["value"]) => void;
}

export default function AdvancedSettings({ logType, value, onChange }: AdvancedSettingsProps) {
  return (
    <div className="flex flex-col gap-6">
      <TailerSettings
        value={value.tailer}
        onChange={(tailer) => onChange({ ...value, tailer })}
      />
      <MultilineSettings
        value={value.multiline}
        onChange={(multiline) => onChange({ ...value, multiline })}
      />
      <ExporterSettings
        value={value.exporter}
        onChange={(exporter) => onChange({ ...value, exporter })}
      />

      {/* 🔹 로그 타입별 필터 분기 + 방어적 체크 */}
      {logType === 'springboot' && (value.filter as SpringBootFilter)?.allowedLevels ? (
        <FilterSettings
          value={value.filter as SpringBootFilter}
          onChange={(filter) => onChange({ ...value, filter })}
        />
      ) : null}

      {logType === 'tomcat access' && (value.filter as TomcatFilter)?.allowedMethods ? (
        <FilterWeb
          value={value.filter as TomcatFilter}
          onChange={(filter) => onChange({ ...value, filter })}
        />
      ) : null}

      <ConfigurationPuller
        value={value.puller}
        onChange={(puller) => onChange({ ...value, puller })}
      />
    </div>
  );
}
