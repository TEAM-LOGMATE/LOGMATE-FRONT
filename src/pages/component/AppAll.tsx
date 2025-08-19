import { useLogStore } from  "../../utils/logstore";
export default function AppAll() {
  const logs = useLogStore((s) => s.appLogs);

  // 총 로그 수 (store에 쌓인 개수 기준)
  const totalLogs = logs.length;

  // 오늘 로그 수 (단순히 최근 24시간 필터, mock에서는 전체를 오늘로 가정 가능)
  const todayLogs = logs.filter((log) => {
    const logDate = new Date(log.timestamp);
    const now = new Date();
    return (
      logDate.getFullYear() === now.getFullYear() &&
      logDate.getMonth() === now.getMonth() &&
      logDate.getDate() === now.getDate()
    );
  }).length;

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
        {/* Today */}
        <div className="inline-flex h-[24px] px-2 items-center gap-2 rounded-[16px] bg-[#222222] text-[#D8D8D8] text-[14px] font-medium">
          Today <span className="text-[#F2F2F2] font-bold">+{todayLogs}</span>
        </div>

        {/* 전체 로그 수 */}
        <div className="text-[#F2F2F2] font-['Geist Mono'] text-[40px] font-normal leading-[130%]">
          {totalLogs.toLocaleString()}
        </div>
      </div>
    </div>
  );
}
