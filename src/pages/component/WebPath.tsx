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

export default function WebPath() {
  const [data, setData] = useState([
    { name: "/home", value: 1200, color: "#3B82F6" },
    { name: "/login", value: 950, color: "#EF4444" },
    { name: "/dashboard", value: 870, color: "#FFB663" },
    { name: "/settings", value: 720, color: "#7B5ED2" },
    { name: "/about", value: 680, color: "#B3D35C" },
    { name: "/profile", value: 540, color: "#2BC3C6" },
    { name: "/admin", value: 420, color: "#335389" },
    { name: "/contact", value: 350, color: "#AEAEAE" },
    { name: "/terms", value: 300, color: "#AEAEAE" },
    { name: "/privacy", value: 250, color: "#D8D8D8" },
  ]);

  const [selected, setSelected] = useState<{
    name: string;
    value: number;
    color: string;
  } | null>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setData((prev) =>
        prev.map((d) => ({
          ...d,
          value: Math.floor(Math.random() * 1200) + 100,
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
