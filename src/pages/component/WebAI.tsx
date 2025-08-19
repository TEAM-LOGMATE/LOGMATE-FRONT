import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { useMemo } from "react";
import { useLogStore } from "../../utils/logstore"; // logstore에서 webLogs 불러오기
import type { WebLog } from "../../utils/logstore";

export default function WebAI() {
  const webLogs = useLogStore((state) => state.webLogs);

  // 로그를 정상/경고/위험으로 분류
  const { normal, warning, danger } = useMemo(() => {
    let normal = 0,
      warning = 0,
      danger = 0;

    webLogs.forEach((log: WebLog) => {
      const score = log.aiScore ?? 0;
      if (score < 60) normal++;
      else if (score < 70) warning++;
      else danger++;
    });

    return { normal, warning, danger };
  }, [webLogs]);

  const data = [
    { name: "정상", value: normal, color: "#1BA945" },
    { name: "경고", value: warning, color: "#FFD058" },
    { name: "위험", value: danger, color: "#F03838" },
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

        {/* 이상탐지 +위험개수 */}
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
            +{danger}
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
        정상 : 0~60점, 경고 60~70점, 위험 70점 이상
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
          {data.map((d, i) => (
            <div key={i} className="flex items-center gap-2">
              <div
                className="w-[6px] h-[6px] rounded-[3px]"
                style={{ backgroundColor: d.color }}
              />
              <span className="text-[#D8D8D8] text-[14px] font-medium font-suit">
                {d.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
