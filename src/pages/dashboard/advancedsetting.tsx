import TailerSettings from './advanced/tailer';
import MultilineSettings from './advanced/multiline';
import ExporterSettings from './advanced/exporter';
import FilterSettings from './advanced/filter';
import ConfigurationPuller from './advanced/configurationpuller';

interface AdvancedSettingsProps {
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
    filter: {
      allowedLevels: string[];
      requiredKeywords: string[];
      after: string;
    };
    puller: {
      intervalSec: number;
    };
  };
  onChange: (newValue: AdvancedSettingsProps["value"]) => void;
}

export default function AdvancedSettings({ value, onChange }: AdvancedSettingsProps) {
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
      <FilterSettings
        value={value.filter}
        onChange={(filter) => onChange({ ...value, filter })}
      />
      <ConfigurationPuller
        value={value.puller}
        onChange={(puller) => onChange({ ...value, puller })}
      />
    </div>
  );
}
