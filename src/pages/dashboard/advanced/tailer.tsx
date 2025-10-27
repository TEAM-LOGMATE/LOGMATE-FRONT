import Input48 from '../../../components/input/48';
import BtnPlus from '../../../components/btn/btn-plus';
import BtnMinus from '../../../components/btn/btn-minus';

interface TailerSettingsProps {
  value: {
    readIntervalMs: number;
    metaDataFilePathPrefix: string;
  };
  onChange: (newValue: TailerSettingsProps["value"]) => void;
}

export default function TailerSettings({ value, onChange }: TailerSettingsProps) {
  const MIN_READ_INTERVAL_MS = 500;
  const handleIncrease = () => {
    onChange({
      ...value,
      readIntervalMs: value.readIntervalMs + 100,
    });
  };

  const handleDecrease = () => {
    const next = value.readIntervalMs - 100;
    onChange({
      ...value,
      readIntervalMs: Math.max(next, MIN_READ_INTERVAL_MS),
    });
  };

  return (
    <div className="flex flex-col gap-4">
      {/* 제목 */}
      <h3
        className="text-[var(--Alert-Yellow,#D4B66F)]
                   font-[Geist] text-[16px] font-normal leading-[150%]"
      >
        Tailer
      </h3>

      {/* 로그 파일 읽기 간격 */}
      <div className="flex items-center gap-3">
        <span
          className="flex items-center
                     text-[var(--Gray-300,#AEAEAE)]
                     font-[SUIT] text-[16px] font-medium leading-[150%] tracking-[-0.4px]
                     w-[200px]"
        >
          로그 파일 읽기 간격 (ms)
        </span>

        <div className="relative flex-1 h-[48px]">
          <Input48
            type="number"
            min={MIN_READ_INTERVAL_MS}
            value={String(value.readIntervalMs)}
            onChange={handleIncrease}
            placeholder="1000"
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

      {/* 메타데이터 저장 경로 */}
      <div className="flex items-center gap-3">
        <span
          className="flex items-center
                     text-[var(--Gray-300,#AEAEAE)]
                     font-[SUIT] text-[16px] font-medium leading-[150%] tracking-[-0.4px]
                     w-[200px]"
        >
          메타데이터 저장 경로
        </span>
        <div className="flex-1">
          <Input48
            value={value.metaDataFilePathPrefix}
            onChange={(e) =>
              onChange({ ...value, metaDataFilePathPrefix: e.target.value })
            }
            placeholder="[ placeholder ]"
            align="center"
          />
        </div>
      </div>
    </div>
  );
}
