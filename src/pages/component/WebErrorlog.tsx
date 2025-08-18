export default function WebErrorLog() {
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
          45
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
          290
        </span>
      </div>
    </div>
  );
}
