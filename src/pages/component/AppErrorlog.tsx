import { useLogStore } from "../../utils/logstore";

export default function AppErrorLog() {
  const logs = useLogStore((s) => s.appLogs);

  // ERROR 로그 개수 계산
  const errorCount = logs.filter((log) => log.level === "ERROR").length;

  return (
    <div
      className="
        inline-flex items-center justify-between
        px-6 py-5 gap-[136px]
        rounded-[12px]
        bg-[#171717]
        w-full
      "
    >
      {/* 텍스트 */}
      <span
        className="
          text-[#D8D8D8]
          font-['Geist_Mono']
          text-[16px]
          font-normal
          leading-[130%]
        "
      >
        Error log
      </span>

      {/* 숫자 */}
      <span
        className="
          text-[#D8D8D8]
          text-right
          font-['Geist_Mono']
          text-[24px]
          font-normal
          leading-[130%]
        "
      >
        {errorCount}
      </span>
    </div>
  );
}
