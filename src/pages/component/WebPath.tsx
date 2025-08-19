import { PieChart, Sector } from "recharts";
import { motion, useMotionValue, animate } from "framer-motion";
import { useEffect, useState } from "react";
import { useLogStore } from "../../utils/logstore"; // ✅ logstore 불러오기

const CustomSector = ({
  cx,
  cy,
  innerRadius,
  outerRadius,
  startAngle,
  endAngle,
  fill,
}: any) => (
  <Sector
    cx={cx}
    cy={cy}
    innerRadius={innerRadius}
    outerRadius={outerRadius}
    startAngle={startAngle}
    endAngle={endAngle}
    fill={fill}
    cornerRadius={10}
  />
);

export default function WebPath() {
  const { webLogs } = useLogStore();
  const [selected, setSelected] = useState<{
    name: string;
    value: number;
    color: string;
  } | null>(null);

  // ✅ Path별 카운트
  const counts: Record<string, number> = {};
  webLogs.forEach((log: any) => {
    const path = log.url || log.path || "/";
    counts[path] = (counts[path] || 0) + 1;
  });

  // ✅ 상위 10개만 추출 + 고정 색상 매핑
  const fixedColors = [
    "#3B82F6", // 파랑
    "#EF4444", // 빨강
    "#FFB663", // 주황
    "#7B5ED2", // 보라
    "#B3D35C", // 연두
    "#2BC3C6", // 청록
    "#335389", // 남색
    "#AEAEAE", // 회색
    "#AEAEAE", // 회색 (terms랑 동일)
    "#D8D8D8", // 밝은 회색
  ];

  const sorted = Object.entries(counts)
    .map(([name, value], i) => ({
      name,
      value,
      color: fixedColors[i] || "#888888", // 고정 팔레트
    }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 10);

  const total = sorted.reduce((sum, d) => sum + d.value, 0);
  let cumulative = 0;

  const sectors = sorted.map((entry, index) => {
    const start = 90 - (cumulative / total) * 360;
    cumulative += entry.value;
    const end = 90 - (cumulative / total) * 360;

    const minRadius = 60;
    const maxExtra = 30;
    const scale = entry.value / Math.max(...sorted.map((d) => d.value));
    const radius = minRadius + maxExtra * scale;

    const startAngle = useMotionValue(start);
    const endAngle = useMotionValue(end);
    const outerRadius = useMotionValue(radius);

    useEffect(() => {
      animate(startAngle, start, { duration: 1, ease: "easeInOut" });
      animate(endAngle, end, { duration: 1, ease: "easeInOut" });
      animate(outerRadius, radius, { duration: 1, ease: "easeInOut" });
    }, [start, end, radius]);

    return (
      <g
        key={index}
        style={{ pointerEvents: "auto", cursor: "pointer" }}
        onClick={(e) => {
          e.stopPropagation();
          setSelected(entry);
        }}
      >
        <CustomSector
          cx={150}
          cy={90}
          innerRadius={40}
          startAngle={startAngle.get()}
          endAngle={endAngle.get()}
          outerRadius={outerRadius.get()}
          fill={entry.color}
        />
      </g>
    );
  });

  return (
    <div
      className="w-[684px] h-[348px] rounded-[12px] bg-[#171717] p-6 flex flex-col"
      onMouseDown={(e) => e.preventDefault()}
    >
      <h2 className="text-[24px] font-bold text-[#D8D8D8]">상위 10 Path</h2>
      <p className="mt-1 text-[14px] text-[#AEAEAE]">사용자가 가장 많이 접근한 경로</p>

      <div className="flex-1 mt-4 flex">
        <PieChart
          width={260}
          height={220}
          tabIndex={-1}
          style={{ outline: "none", pointerEvents: "auto" }}
        >
          {sectors}
        </PieChart>

        {/* 오른쪽 Legend */}
        <div className="flex flex-col justify-center ml-20 space-y-1 mt-[-70px]">
          {sorted.map((entry, i) => (
            <div key={i} className="flex items-center space-x-2">
              <div
                style={{
                  width: "6px",
                  height: "6px",
                  borderRadius: "3px",
                  background: entry.color,
                }}
              />
              <span className="text-[#AEAEAE] text-sm">{entry.name}</span>
            </div>
          ))}

          {/* 선택된 항목 정보 표시 */}
          {selected && (
            <div className="mt-4 p-2 rounded bg-[#2A2A2A] text-[#D8D8D8] text-sm">
              <p>
                선택된 경로:{" "}
                <span style={{ color: selected.color }}>{selected.name}</span>
              </p>
              <p>접근 수: {selected.value}</p>
              <p>비율: {((selected.value / total) * 100).toFixed(1)}%</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
