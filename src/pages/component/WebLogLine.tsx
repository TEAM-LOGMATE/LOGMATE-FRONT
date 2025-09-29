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

// 커스텀 X축 라벨
const CustomTick = ({ x, y, payload }: any) => (
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

// 시간 라벨 + 구간 범위 생성
const generateTimeRanges = (count: number, stepMinutes: number) => {
  const now = new Date();
  return Array.from({ length: count }, (_, i) => {
    const start = new Date(now.getTime() - (count - 1 - i) * stepMinutes * 60000);
    const end = new Date(start.getTime() + stepMinutes * 60000);
    return {
      label: start.toTimeString().slice(0, 5),
      start,
      end,
    };
  });
};

export default function WebLogLine() {
  const { webLogs } = useLogStore();
  const [activeRange, setActiveRange] = useState("1h");
  const [chartData, setChartData] = useState<any[]>([]);

  // 로그 기반 데이터 생성
  const generateDataFromLogs = (range: string) => {
    let stepMinutes = 5;
    if (range === "6h") stepMinutes = 30;
    else if (range === "12h") stepMinutes = 60;

    const ranges = generateTimeRanges(12, stepMinutes);

    return ranges.map(({ label, start, end }) => {
      const logsAtTime = webLogs.filter((log) => {
        const t = new Date(log.timestamp);
        return t >= start && t < end;
      });

      return {
        time: label,
        warning: logsAtTime.filter((l) => l.aiScore >= 60 && l.aiScore < 70).length,
        danger: logsAtTime.filter((l) => l.aiScore >= 70).length,
      };
    });
  };

  useEffect(() => {
    // 초기 렌더링 시 데이터 생성
    setChartData(generateDataFromLogs(activeRange));

    // 1분마다 최신 시각 기준으로 다시 계산
    const interval = setInterval(() => {
      setChartData(generateDataFromLogs(activeRange));
    }, 60 * 1000);

    return () => clearInterval(interval);
  }, [activeRange, webLogs]);

  return (
    <div className="w-full bg-[#0F0F0F] rounded-lg p-2">
      {/* 제목 + 설명 */}
      <div className="flex items-center gap-3 mb-2 -ml-1">
        <h2 className="text-[24px] font-bold text-[#F2F2F2]">이상 로그라인</h2>
        <p className="text-[14px] text-[#AEAEAE]">시간대별 AI 이상 탐지 수 변화</p>
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
          <LineChart data={chartData} margin={{ top: 5, right: 20, left: 20, bottom: 5 }}>
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

            {/* Warning (노랑) — 있을 때만 표시 */}
            {chartData.some((d) => d.warning > 0) && (
              <Line
                type="linear"
                dataKey="warning"
                stroke="#FFD058"
                strokeWidth={2}
                dot={false}
                name="경고"
              />
            )}

            {/* Danger (빨강) — 항상 표시 */}
            <Line
              type="linear"
              dataKey="danger"
              stroke="#FF6969"
              strokeWidth={2}
              dot={false}
              name="위험"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
