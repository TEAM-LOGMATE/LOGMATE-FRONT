import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { useMemo, useState } from "react";
import { useLogStore } from "../../utils/logstore"; // logstore에서 webLogs 불러오기
import type { WebLog } from "../../utils/logstore";

type CategoryKey = "normal" | "warning" | "danger";

export default function WebAI() {
  const webLogs = useLogStore((state) => state.webLogs);
  const [selectedCategory, setSelectedCategory] = useState<CategoryKey | null>(null);

  // 로그를 정상/경고/위험으로 분류
  const { normal, warning, danger, logsByCategory } = useMemo(() => {
    let normal: WebLog[] = [];
    let warning: WebLog[] = [];
    let danger: WebLog[] = [];

    webLogs.forEach((log: WebLog) => {
      const score = log.aiScore ?? 0;
      if (score < 60) normal.push(log);
      else if (score < 70) warning.push(log);
      else danger.push(log);
    });

    return {
      normal: normal.length,
      warning: warning.length,
      danger: danger.length,
      logsByCategory: { normal, warning, danger },
    };
  }, [webLogs]);

  const total = normal + warning + danger;

  const data = [
    { name: "정상", key: "normal" as const, value: normal, color: "#1BA945" },
    { name: "경고", key: "warning" as const, value: warning, color: "#FFD058" },
    { name: "위험", key: "danger" as const, value: danger, color: "#F03838" },
  ];

  return (
    <div className="w-[500px] h-[348px] flex-shrink-0 rounded-[12px] bg-[#171717] p-6 flex flex-col">
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

      {/* 원형 차트 + 상세정보 */}
      <div className="flex flex-1 items-center">
        {/* 차트 */}
        <ResponsiveContainer width="50%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              innerRadius={60}
              outerRadius={100}
              paddingAngle={2}
              onClick={(entry) => setSelectedCategory(entry.key)} // 카테고리 클릭 이벤트
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} cursor="pointer" />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>

        {/* 오른쪽 영역: 범례 + 상세 */}
        <div className="flex flex-col ml-6 gap-3 flex-1">
          {/* 범례 */}
          {data.map((d, i) => (
            <div
              key={i}
              className="flex items-center gap-2 cursor-pointer"
              onClick={() => setSelectedCategory(d.key)}
            >
              <div
                className="w-[6px] h-[6px] rounded-[3px]"
                style={{ backgroundColor: d.color }}
              />
              <span className="text-[#D8D8D8] text-[14px] font-medium font-suit">
                {d.name} ({d.value})
              </span>
            </div>
          ))}

          {/* 선택된 카테고리 상세 */}
          {selectedCategory && (
            <div className="mt-4 p-3 rounded bg-[#232323] text-[#D8D8D8] text-[14px] font-suit">
              <p className="font-bold mb-2">
                {data.find((d) => d.key === selectedCategory)?.name} 상세
              </p>
              <p>
                비율:{" "}
                {total > 0
                  ? (
                      (logsByCategory[selectedCategory].length / total) *
                      100
                    ).toFixed(1)
                  : 0}
                %
              </p>
              <p>개수: {logsByCategory[selectedCategory].length} 개</p>
              <p className="mt-2 text-[#AEAEAE] text-[13px]">
                (예시 IP: {logsByCategory[selectedCategory][0]?.ip ?? "없음"})
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
