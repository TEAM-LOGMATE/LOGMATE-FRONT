import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

export default function WebAI() {
  // 예시 데이터 (정상/경고/위험)
  const data = [
    { name: "정상", value: 80, color: "#1BA945" },
    { name: "위험", value: 15, color: "#FFD058" },
    { name: "경고", value: 5, color: "#F03838" },
  ];

  return (
    <div className="w-[388px] h-[348px] flex-shrink-0 rounded-[12px] bg-[#171717] p-6 flex flex-col">
      {/* 상단 제목 + 뱃지 */}
      <div className="flex items-center gap-2 mb-2">
        <h2
          className="
            text-[24px] font-bold leading-[140%] tracking-[-0.4px]
            text-[#D8D8D8] font-suit
          "
        >
          AI 이상 탐지
        </h2>

        {/* 이상탐지 +5 */}
        <div
          className="
            flex h-[24px] px-2 items-center gap-2
            rounded-[15px] bg-[#3B1A1A]
          "
        >
          <span className="text-[#FFA8A8] font-suit text-[14px] font-medium leading-[150%] tracking-[-0.4px]">
            이상 탐지
          </span>
          <span className="text-[#FFB3B3] font-['Geist Mono'] text-[14px] font-medium leading-[150%]">
            +5
          </span>
        </div>
      </div>

      {/* 하단 보조 텍스트 */}
      <p
        className="
          text-[#AEAEAE] text-[14px] font-medium leading-[150%] tracking-[-0.4px]
          font-suit
        "
      >
        정상 : 0~60점, 경고 60~ 70점, 위험 70 점 이상
      </p>

      {/* 원형 차트 */}
      <div className="flex flex-1 items-center">
        <ResponsiveContainer width="60%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              innerRadius={60}
              outerRadius={100}
              paddingAngle={2}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>

        {/* 범례 */}
        <div className="flex flex-col ml-6 gap-2">
          <div className="flex items-center gap-2">
            <div className="w-[6px] h-[6px] rounded-[3px] bg-[#1BA945]" />
            <span className="text-[#D8D8D8] text-[14px] font-medium font-suit">정상</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-[6px] h-[6px] rounded-[3px] bg-[#FFD058]" />
            <span className="text-[#D8D8D8] text-[14px] font-medium font-suit">위험</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-[6px] h-[6px] rounded-[3px] bg-[#F03838]" />
            <span className="text-[#D8D8D8] text-[14px] font-medium font-suit">경고</span>
          </div>
        </div>
      </div>
    </div>
  );
}
