import { useMemo } from "react";
import { useLogStore } from "../../utils/logstore";
import type { WebLog } from "../../utils/logstore";

export default function WebAll() {
  const webLogs = useLogStore((state) => state.webLogs);

  // 전체 로그 수
  const totalLogs = webLogs.length;

  // 오늘 날짜 (YYYY-MM-DD)
  const todayStr = new Date().toISOString().slice(0, 10);

  // 오늘 들어온 로그 수
  const todayLogs = useMemo(() => {
    return webLogs.filter((log: WebLog) =>
      log.timestamp.startsWith(todayStr)
    ).length;
  }, [webLogs, todayStr]);

  return (
    <div className="w-[300px] h-[220px] flex-shrink-0 rounded-[12px] bg-[#171717] p-6 flex flex-col justify-between">
      {/* 제목 */}
      <div>
        <h2 className="text-[24px] font-bold leading-[140%] tracking-[-0.4px] text-[#D8D8D8]">
          총 로그수
        </h2>
        <p className="text-[14px] font-medium leading-[150%] tracking-[-0.4px] text-[#AEAEAE]">
          실시간 누적 로그
        </p>
      </div>

      {/* 오른쪽 정렬 영역 */}
      <div className="flex flex-col items-end gap-2">
        {/* Today +N */}
        <div className="inline-flex h-[24px] px-2 items-center gap-2 rounded-[16px] bg-[#222222] text-[#D8D8D8] text-[14px] font-medium">
          Today <span className="text-[#F2F2F2] font-bold">+{todayLogs}</span>
        </div>

        {/* 전체 로그 수 */}
        <div className="text-[#F2F2F2] font-['Geist Mono'] text-[40px] font-normal leading-[130%]">
          {totalLogs.toLocaleString()} {/* 숫자에 , 찍기 */}
        </div>
      </div>
    </div>
  );
}
