import Input48 from '../../../components/input/48';
import BtnPlus from '../../../components/btn/btn-plus';
import BtnMinus from '../../../components/btn/btn-minus';

interface ExporterSettingsProps {
  value: {
    compressEnabled: boolean;
    retryIntervalSec: number;
    maxRetryCount: number;
  };
  onChange: (newValue: ExporterSettingsProps["value"]) => void;
}

export default function ExporterSettings({ value, onChange }: ExporterSettingsProps) {
  const MIN_RETRY_INTERVAL_SEC = 2;
  // 핸들러: retryIntervalSec
  const increaseRetry = () =>
    onChange({ ...value, retryIntervalSec: value.retryIntervalSec + 1 });
  const decreaseRetry = () =>{
    const next = value.retryIntervalSec - 1;
    onChange({
      ...value,
      retryIntervalSec: Math.max(next, MIN_RETRY_INTERVAL_SEC),
    });
  };
  const handleRetryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = Number(e.target.value);
    const valid = isNaN(raw) ? MIN_RETRY_INTERVAL_SEC : Math.max(raw, MIN_RETRY_INTERVAL_SEC);
    onChange({ ...value, retryIntervalSec: valid });
  }

  // 핸들러: maxRetryCount
  const increaseMaxRetry = () =>
    onChange({ ...value, maxRetryCount: value.maxRetryCount + 1 });
  const decreaseMaxRetry = () =>
    onChange({
      ...value,
      maxRetryCount: value.maxRetryCount > 1 ? value.maxRetryCount - 1 : 0,
    });

  return (
    <div className="flex flex-col gap-4">
      <h3
        className="text-[var(--Alert-Yellow,#D4B66F)]
                   font-[Geist] text-[16px] font-normal leading-[150%]"
      >
        Exporter
      </h3>

      {/* 압축 여부 */}
      <div className="flex items-center gap-3">
        <span className="w-[200px] text-[var(--Gray-300,#AEAEAE)] font-[SUIT] text-[16px]">
          압축 사용
        </span>
        <input
          type="checkbox"
          checked={value.compressEnabled}
          onChange={(e) => onChange({ ...value, compressEnabled: e.target.checked })}
        />
      </div>

      {/* 재시도 간격 (초) */}
      <div className="flex items-center gap-3">
        <span
          className="flex items-center
                     text-[var(--Gray-300,#AEAEAE)]
                     font-[SUIT] text-[16px] font-medium leading-[150%] tracking-[-0.4px]
                     w-[200px]"
        >
          재시도 간격 (초)
        </span>
        <div className="relative flex-1 h-[48px]">
          <Input48
            type="number"
            min={MIN_RETRY_INTERVAL_SEC}
            value={String(value.retryIntervalSec)}
            onChange={handleRetryChange}
            align="center"
          />
          <div className="absolute left-2 top-1/2 -translate-y-1/2">
            <BtnMinus onClick={decreaseRetry} />
          </div>
          <div className="absolute right-2 top-1/2 -translate-y-1/2">
            <BtnPlus onClick={increaseRetry} />
          </div>
        </div>
      </div>

      {/* 최대 재시도 횟수 */}
      <div className="flex items-center gap-3">
        <span
          className="flex items-center
                     text-[var(--Gray-300,#AEAEAE)]
                     font-[SUIT] text-[16px] font-medium leading-[150%] tracking-[-0.4px]
                     w-[200px]"
        >
          최대 재시도 횟수
        </span>
        <div className="relative flex-1 h-[48px]">
          <Input48
            value={String(value.maxRetryCount)}
            onChange={(e) =>
              onChange({ ...value, maxRetryCount: Number(e.target.value) || 0 })
            }
            align="center"
          />
          <div className="absolute left-2 top-1/2 -translate-y-1/2">
            <BtnMinus onClick={decreaseMaxRetry} />
          </div>
          <div className="absolute right-2 top-1/2 -translate-y-1/2">
            <BtnPlus onClick={increaseMaxRetry} />
          </div>
        </div>
      </div>
    </div>
  );
}
