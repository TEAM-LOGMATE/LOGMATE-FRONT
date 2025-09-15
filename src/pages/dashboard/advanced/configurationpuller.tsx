import Input48 from '../../../components/input/48';
import BtnPlus from '../../../components/btn/btn-plus';
import BtnMinus from '../../../components/btn/btn-minus';

interface ConfigurationPullerProps {
  value: {
    intervalSec: number;
  };
  onChange: (newValue: ConfigurationPullerProps["value"]) => void;
}

export default function ConfigurationPuller({ value, onChange }: ConfigurationPullerProps) {
  const handleIncrease = () => {
    onChange({ ...value, intervalSec: value.intervalSec + 1 });
  };

  const handleDecrease = () => {
    const next = value.intervalSec - 1;
    onChange({ ...value, intervalSec: next > 0 ? next : 0 });
  };

  return (
    <div className="flex flex-col gap-4">
      {/* 제목 */}
      <h3
        className="text-[var(--Alert-Yellow,#D4B66F)]
                   font-[Geist] text-[16px] font-normal leading-[150%]"
      >
        Configuration Puller
      </h3>

      {/* pulling 간격 */}
      <div className="flex items-center gap-3">
        <span
          className="flex items-center
                     text-[var(--Gray-300,#AEAEAE)]
                     font-[SUIT] text-[16px] font-medium leading-[150%] tracking-[-0.4px]
                     w-[200px]"
        >
          pulling 간격 (초)
        </span>

        <div className="relative flex-1 h-[48px]">
          <Input48
            value={String(value.intervalSec)}
            onChange={(e) =>
              onChange({ ...value, intervalSec: Number(e.target.value) || 0 })
            }
            placeholder="30"
            align="center"
          />
          <div className="absolute left-2 top-1/2 -translate-y-1/2">
            <BtnMinus onClick={handleDecrease} />
          </div>
          <div className="absolute right-2 top-1/2 -translate-y-1/2">
            <BtnPlus onClick={handleIncrease} />
          </div>
        </div>
      </div>
    </div>
  );
}
