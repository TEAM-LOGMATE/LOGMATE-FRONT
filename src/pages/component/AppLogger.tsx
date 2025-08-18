import { PieChart, Sector } from "recharts";
import { motion, useMotionValue, animate } from "framer-motion";
import { useEffect, useState } from "react";

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

export default function AppLogger() {
  const [data, setData] = useState([
    { name: "/home", value: 500, color: "#0ADEE3" },
    { name: "/login", value: 300, color: "#B2EC5B" },
    { name: "/dashboard", value: 250, color: "#15D55C" },
    { name: "/settings", value: 180, color: "#4E7DCB" },
    { name: "/about", value: 120, color: "#8B5CF6" },
  ]);

  const [selected, setSelected] = useState<{ name: string; value: number; color: string } | null>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setData((prev) =>
        prev.map((d) => ({
          ...d,
          value: Math.floor(Math.random() * 500) + 100,
        }))
      );
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const sorted = [...data].sort((a, b) => b.value - a.value);
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
      className="w-[530px] h-[303px] rounded-[12px] bg-[#171717] p-6 flex flex-col"
      onMouseDown={(e) => e.preventDefault()}
    >
      <h2 className="text-[24px] font-bold text-[#D8D8D8]">로거별 로그량</h2>
      <p className="mt-1 text-[14px] text-[#AEAEAE]">현재 보드 로거들의 비율</p>

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
        <div className="flex flex-col justify-center ml-20 space-y-2">
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
              <p>선택된 로거: <span style={{ color: selected.color }}>{selected.name}</span></p>
              <p>로그 수: {selected.value}</p>
              <p>비율: {((selected.value / total) * 100).toFixed(1)}%</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
