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
import { useLogStore } from "../../utils/logstore";

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

const generateTimeLabels = (count: number, stepMinutes: number) => {
  const now = new Date();
  return Array.from({ length: count }, (_, i) => {
    const t = new Date(now.getTime() - (count - 1 - i) * stepMinutes * 60000);
    return t.toTimeString().slice(0, 5); // HH:mm
  });
};

export default function AppTimeLog() {
  const { appLogs } = useLogStore();
  const [activeRange, setActiveRange] = useState("1h");
  const [chartData, setChartData] = useState<{ time: string; value: number }[]>(
    []
  );

  // 앱 로그 기반 데이터 생성
  const generateDataFromLogs = (range: string) => {
    let labels: string[] = [];

    if (range === "1h") {
      labels = generateTimeLabels(12, 5); // 5분 단위
    } else if (range === "6h") {
      labels = generateTimeLabels(12, 30); // 30분 단위
    } else {
      labels = generateTimeLabels(12, 60); // 1시간 단위
    }

    return labels.map((labelTime) => {
      const [hour, minute] = labelTime.split(":").map(Number);

      const logsAtTime = appLogs.filter((log) => {
        const logDate = new Date(log.timestamp);
        return (
          logDate.getHours() === hour &&
          Math.floor(
            logDate.getMinutes() /
              (range === "1h" ? 5 : range === "6h" ? 30 : 60)
          ) ===
            Math.floor(
              minute / (range === "1h" ? 5 : range === "6h" ? 30 : 60)
            )
        );
      });

      return {
        time: labelTime,
        value: logsAtTime.length,
      };
    });
  };

  useEffect(() => {
    setChartData(generateDataFromLogs(activeRange));
  }, [activeRange, appLogs]);

  return (
    <div className="w-full bg-[#0F0F0F] rounded-lg p-2">
      {/* 제목 + 설명 */}
      <div className="flex items-center gap-3 mb-2 -ml-1">
        <h2 className="text-[24px] font-bold text-[#F2F2F2]">시간대별 로그량</h2>
        <p className="text-[14px] text-[#AEAEAE]">앱 로그 발생량의 시간대별 변화</p>
      </div>

      {/* 버튼 */}
      <div className="flex gap-2 mb-4 pl-2 -ml-3">
        {["1h", "6h", "12h"].map((range) => (
          <button
            key={range}
            onClick={() => setActiveRange(range)}
            className={
              `px-4 py-1.5 rounded-[19px] text-[14px] ` +
              (activeRange === range
                ? "bg-[#4FE75E] text-black"
                : "bg-[#222] text-[#AEAEAE]")
            }
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
            <CartesianGrid
              stroke="#292929"
              strokeDasharray="3 3"
              vertical={false}
            />
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
              stroke="#4FE75E"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
