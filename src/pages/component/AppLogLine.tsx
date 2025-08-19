import { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useLogStore } from "../../utils/logstore"; // 로그 스토어 연결

const CustomTick = (props: any) => {
  const { x, y, payload } = props;
  return (
    <text
      x={x}
      y={y + 20}
      textAnchor="middle"
      style={{
        fill: "var(--Gray-300, #AEAEAE)",
        fontFamily: "Geist Mono",
        fontSize: "14px",
        fontWeight: 300,
      }}
    >
      {payload.value}
    </text>
  );
};

// 이상 로그 레벨 정의
const abnormalLevels = ["WARN", "ERROR", "FATAL"];

export default function AppLogLine() {
  const { appLogs } = useLogStore();
  const [activeRange, setActiveRange] = useState("1h");
  const [chartData, setChartData] = useState<{ time: string; value: number }[]>([]);

  // 범위별 데이터 생성
  const generateData = (range: string) => {
    const now = new Date();
    let count = 12;
    let stepMinutes = 5;

    if (range === "1h") stepMinutes = 5; // 12칸 = 60분
    else if (range === "6h") stepMinutes = 30; // 12칸 = 360분
    else stepMinutes = 60; // 12칸 = 720분

    return Array.from({ length: count }, (_, i) => {
      const start = new Date(now.getTime() - (count - 1 - i) * stepMinutes * 60000);
      const end = new Date(start.getTime() + stepMinutes * 60000);

      // 해당 구간 로그 필터링
      const abnormalCount = appLogs.filter((log) => {
        const t = new Date(log.timestamp);
        return (
          t >= start &&
          t < end &&
          abnormalLevels.includes(log.level.toUpperCase())
        );
      }).length;

      return {
        time: start.toTimeString().slice(0, 5),
        value: abnormalCount,
      };
    });
  };

  useEffect(() => {
    setChartData(generateData(activeRange));

    const interval = setInterval(() => {
      setChartData(generateData(activeRange));
    }, 5000); // 5초마다 갱신

    return () => clearInterval(interval);
  }, [activeRange, appLogs]);

  return (
    <div className="w-full bg-[#0F0F0F] rounded-lg p-2">
      {/* 제목 + 설명 */}
      <div className="flex items-center gap-3 mb-2 -ml-1">
        <h2 className="text-[24px] font-bold text-[#F2F2F2]">이상 로그라인</h2>
        <p className="text-[14px] text-[#AEAEAE]">이상 로그의 시간대별 변화</p>
      </div>

      {/* 버튼 */}
      <div className="flex gap-2 mb-4 pl-2 -ml-3">
        {["1h", "6h", "12h"].map((range) => (
          <button
            key={range}
            onClick={() => setActiveRange(range)}
            className={`px-4 py-1.5 rounded-[19px] text-[14px] ${
              activeRange === range
                ? "bg-[#4FE75E] text-black"
                : "bg-[#222] text-[#AEAEAE]"
            }`}
          >
            {range === "1h"
              ? "1시간 전"
              : range === "6h"
              ? "6시간 전"
              : "12시간 전"}
          </button>
        ))}
      </div>

      {/* 차트 */}
      <div className="w-full h-[320px] bg-[#171717] rounded-md p-4">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={chartData}
            margin={{ top: 5, right: 20, left: 20, bottom: 5 }}
          >
            <CartesianGrid stroke="#292929" strokeDasharray="3 3" vertical={false} />
            <XAxis
              dataKey="time"
              interval={0}
              tick={<CustomTick />}
              tickLine={false}
              axisLine={false}
            />
            <YAxis hide tickCount={7} />
            <Tooltip
              contentStyle={{ backgroundColor: "#232323", borderRadius: "6px" }}
              labelStyle={{ color: "#F2F2F2" }}
            />
            <Line
              type="linear"
              dataKey="value"
              stroke="#FF6969"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
