export default function AppAll() {
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
        {/* Today +123 */}
        <div className="inline-flex h-[24px] px-2 items-center gap-2 rounded-[16px] bg-[#222222] text-[#D8D8D8] text-[14px] font-medium">
          Today <span className="text-[#F2F2F2] font-bold">+123</span>
        </div>

        {/* 전체 로그 수 */}
        <div className="text-[#F2F2F2] font-['Geist Mono'] text-[40px] font-normal leading-[130%]">
          12,345
        </div>
      </div>
    </div>
  );
}
