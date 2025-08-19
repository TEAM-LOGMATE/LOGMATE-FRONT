import { useLogStore } from "../../utils/logstore";

export default function WebErrorLog() {
  const { webLogs } = useLogStore();

  // HTTP 상태 코드 카운트
  const counts: Record<string, number> = {};
  webLogs.forEach((log) => {
    counts[log.status] = (counts[log.status] || 0) + 1;
  });

  const error400 = counts["400"] || 0;
  const error500 = counts["500"] || 0;

  return (
    <div
      className="
        w-[300px] h-[116px] flex-shrink-0
        flex flex-col justify-center
        px-6 py-5
        rounded-[12px]
        bg-[#171717]
      "
    >
      {/* 400-Error */}
      <div className="flex items-center justify-between">
        <span
          className="
            text-[#D8D8D8]
            font-['Geist_Mono']
            text-[16px]
            font-normal
            leading-[130%]
          "
        >
          400-Error
        </span>
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
          {error400}
        </span>
      </div>

      {/* 500-Error */}
      <div className="flex items-center justify-between mt-2">
        <span
          className="
            text-[#D8D8D8]
            font-['Geist_Mono']
            text-[16px]
            font-normal
            leading-[130%]
          "
        >
          500-Error
        </span>
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
          {error500}
        </span>
      </div>
    </div>
  );
}
