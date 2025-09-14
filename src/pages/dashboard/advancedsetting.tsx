import TailerSettings from './advanced/tailer';
import MultilineSettings from './advanced/multiline';
import ExporterSettings from './advanced/exporter';
import FilterSettings from './advanced/filter';
import ConfigurationPuller from './advanced/configurationpuller';
import AIActive from './advanced/AIActive';

export default function AdvancedSettings() {
  return (
    <div className="flex flex-col gap-6">
      <TailerSettings />
      <MultilineSettings />
      <ExporterSettings />
      <FilterSettings />
      <ConfigurationPuller />
    </div>
  );
}
