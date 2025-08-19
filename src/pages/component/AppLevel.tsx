import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { useState, useMemo } from "react";
import { useLogStore } from "../../utils/logstore"; // 로그 스토어에서 가져오기

export default function AppLevel() {
  const logs = useLogStore((s) => s.appLogs);

  // 로그 레벨별 카운트 계산
  const levelCounts = useMemo(() => {
    const counts = { INFO: 0, WARN: 0, ERROR: 0 };
    logs.forEach((log) => {
      if (log.level === "INFO") counts.INFO++;
      if (log.level === "WARN") counts.WARN++;
      if (log.level === "ERROR") counts.ERROR++;
    });
    return counts;
  }, [logs]);

  const data = [
    { name: "Info", value: levelCounts.INFO, color: "#3B82F6" },   // 파랑
    { name: "Warning", value: levelCounts.WARN, color: "#FFD058" },// 노랑
    { name: "Error", value: levelCounts.ERROR, color: "#F03838" }, // 빨강
  ];

  const [selectedName, setSelectedName] = useState<string | null>(null);

  const total = data.reduce((sum, d) => sum + d.value, 0);
  const selected = selectedName ? data.find((d) => d.name === selectedName) : null;

  return (
    <div className="w-[531px] h-[303px] flex-shrink-0 rounded-[12px] bg-[#171717] p-6 flex flex-col">
      {/* 제목 + 에러 발생 */}
      <div className="flex items-center gap-3">
        <h2 className="text-[24px] font-bold leading-[140%] tracking-[-0.4px] text-[#D8D8D8]">
          레벨 비율
        </h2>
        <div className="flex h-[24px] px-2 items-center gap-2 rounded-[15px] bg-[#3B1A1A]">
          <span className="text-[#FFA8A8] text-[14px] font-medium leading-[150%] tracking-[-0.4px]">
            에러 발생
          </span>
          <span className="text-[#FFB3B3] font-['Geist Mono'] text-[14px] font-medium leading-[150%]">
            +{levelCounts.ERROR}
          </span>
        </div>
      </div>

      {/* 설명 */}
      <p className="mt-1 text-[14px] font-medium leading-[150%] tracking-[-0.4px] text-[#AEAEAE]">
        INFO/WARN/ERROR 비율
      </p>

      {/* 차트 + 범례 */}
      <div className="flex justify-between flex-1 mt-4 relative">
        {/* 반원 차트 */}
        <div className="absolute left-1/2 transform -translate-x-1/2 mt-14">
          <ResponsiveContainer width={222} height={111}>
            <PieChart>
              <Pie
                data={data}
                dataKey="value"
                cx="50%"
                cy="100%"
                startAngle={180}
                endAngle={0}
                innerRadius={55}
                outerRadius={95}
                paddingAngle={0}
                onClick={(_, index) => setSelectedName(data[index].name)}
              >
                {data.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={entry.color}
                    style={{ cursor: "pointer" }}
                  />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* 범례 */}
        <div className="flex flex-col gap-3 mt-[-20px] ml-auto mr-[40px]">
          {data.map((item) => (
            <div key={item.name} className="flex items-center gap-2">
              <div
                className="w-[6px] h-[6px] rounded-[3px]"
                style={{ background: item.color }}
              />
              <span className="text-[14px] text-[#AEAEAE]">{item.name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 선택한 섹터 정보 */}
      {selected && total > 0 && (
        <div className="mt-4 text-[14px] text-[#D8D8D8]">
          선택된 항목: <span style={{ color: selected.color }}>{selected.name}</span>  
          ({selected.value} / {total}, {((selected.value / total) * 100).toFixed(1)}%)
        </div>
      )}
    </div>
  );
}
