import { useState } from 'react';
import Input48 from '../../../components/input/48';
import BtnPlus from '../../../components/btn/btn-plus';
import BtnMinus from '../../../components/btn/btn-minus';

export default function ConfigurationPuller() {
  const [interval, setInterval] = useState("1000");

  const handleIncrease = () => {
    setInterval((prev) => String(Number(prev || "0") + 100));
  };

  const handleDecrease = () => {
    setInterval((prev) => {
      const next = Number(prev || "0") - 100;
      return String(next > 0 ? next : 0);
    });
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
            value={interval}
            onChange={(e) => setInterval(e.target.value)}
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
    </div>
  );
}
