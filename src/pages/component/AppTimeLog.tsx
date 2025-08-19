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
import type { AppLog, WebLog } from "../../utils/logstore";

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
  const [activeRange, setActiveRange] = useState("1h");
  const [chartData, setChartData] = useState<{ time: string; value: number }[]>([]);

  // 실제 로그 가져오기
  const { appLogs, webLogs } = useLogStore();

  const generateData = (range: string) => {
    let labels: string[] = [];

    if (range === "1h") {
      labels = generateTimeLabels(12, 5); // 5분 단위 12개
    } else if (range === "6h") {
      labels = generateTimeLabels(12, 30); // 30분 단위
    } else {
      labels = generateTimeLabels(12, 60); // 1시간 단위
    }

    // appLogs + webLogs 합치기
    const allLogs = [...appLogs, ...webLogs] as (AppLog | WebLog)[];

    // 시간대별 count 계산
    const counts: Record<string, number> = {};
    labels.forEach((l) => (counts[l] = 0));

    allLogs.forEach((log) => {
      const t = new Date(log.timestamp);
      const label = t.toTimeString().slice(0, 5);
      // 레이블 중 가장 가까운 시간대에 반영
      const closest = labels.reduce((a, b) =>
        Math.abs(parseInt(label.replace(":", "")) - parseInt(a.replace(":", ""))) <
        Math.abs(parseInt(label.replace(":", "")) - parseInt(b.replace(":", "")))
          ? a
          : b
      );
      counts[closest] = (counts[closest] || 0) + 1;
    });

    return labels.map((t) => ({
      time: t,
      value: counts[t] || 0,
    }));
  };

  useEffect(() => {
    setChartData(generateData(activeRange));
  }, [activeRange, appLogs, webLogs]);

  return (
    <div className="w-full bg-[#0F0F0F] rounded-lg p-2">
      {/* 제목 + 설명 */}
      <div className="flex items-center gap-3 mb-2 -ml-1">
        <h2 className="text-[24px] font-bold text-[#F2F2F2]">시간대별 로그량</h2>
        <p className="text-[14px] text-[#AEAEAE]">로그 발생량의 시간대별 변화</p>
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
            {range === "1h" ? "1시간 전" : range === "6h" ? "6시간 전" : "12시간 전"}
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
