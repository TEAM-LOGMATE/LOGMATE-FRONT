import { PieChart, Sector } from "recharts";
import { useMotionValue, animate } from "framer-motion";
import { useEffect } from "react";
import { useLogStore } from "../../utils/logstore";

// 색상 팔레트 (순위 기반)
const colorPalette = [
  "#0ADEE3", "#B2EC5B", "#15D55C", "#4E7DCB", "#8B5CF6",
  "#FF6B6B", "#FFD058", "#38BDF8", "#22C55E", "#F97316",
];

// 커스텀 섹터 (부드러운 코너)
const CustomSector = ({
  cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill,
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

function AnimatedSector({ start, end, radius, color }: any) {
  const startAngle = useMotionValue(start);
  const endAngle = useMotionValue(end);
  const outerRadius = useMotionValue(radius);

  useEffect(() => {
    animate(startAngle, start, { duration: 1, ease: "easeInOut" });
    animate(endAngle, end, { duration: 1, ease: "easeInOut" });
    animate(outerRadius, radius, { duration: 1, ease: "easeInOut" });
  }, [start, end, radius]);

  return (
    <CustomSector
      cx={150}
      cy={90}
      innerRadius={40}
      startAngle={startAngle.get()}
      endAngle={endAngle.get()}
      outerRadius={outerRadius.get()}
      fill={color}
    />
  );
}

export default function AppLogger() {
  const { appLogs } = useLogStore();

  // logger별 카운트
  const counts: Record<string, number> = {};
  appLogs.forEach((log) => {
    counts[log.logger] = (counts[log.logger] || 0) + 1;
  });

  // 정렬
  const data = Object.entries(counts).map(([name, value]) => ({ name, value }));
  const sorted = [...data].sort((a, b) => b.value - a.value);

  const total = sorted.reduce((sum, d) => sum + d.value, 0);
  let cumulative = 0;

  return (
    <div className="w-[530px] h-[303px] rounded-[12px] bg-[#171717] p-6 flex flex-col"
         onMouseDown={(e) => e.preventDefault()}>
      <h2 className="text-[24px] font-bold text-[#D8D8D8]">로거별 로그량</h2>
      <p className="mt-1 text-[14px] text-[#AEAEAE]">현재 보드 로거들의 비율</p>

      <div className="flex-1 mt-4 flex">
        {/* 차트 */}
        <PieChart width={260} height={220} tabIndex={-1} style={{ outline: "none" }}>
          {sorted.map((entry, i) => {
            const start = 90 - (cumulative / total) * 360;
            cumulative += entry.value;
            const end = 90 - (cumulative / total) * 360;

            const minRadius = 60;
            const maxExtra = 30;
            const scale = entry.value / Math.max(...sorted.map((d) => d.value));
            const radius = minRadius + maxExtra * scale;

            return (
              <AnimatedSector
                key={entry.name}
                entry={entry}
                start={start}
                end={end}
                radius={radius}
                color={colorPalette[i % colorPalette.length]}
              />
            );
          })}
        </PieChart>

        {/* 범례 */}
        <div className="flex flex-col justify-center ml-20 space-y-2">
          {sorted.map((entry, i) => (
            <div key={entry.name} className="flex items-center space-x-2">
              <div
                style={{
                  width: "6px", height: "6px", borderRadius: "3px",
                  background: colorPalette[i % colorPalette.length],
                }}
              />
              <span className="text-[#AEAEAE] text-sm">
                {entry.name} ({entry.value})
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
