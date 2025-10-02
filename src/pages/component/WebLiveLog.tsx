import { useRef, useState, useMemo, useEffect } from "react";
import BtnDropdown from "../../components/btn/btn-dropdown";
import SearchRefresh from "./searchrefresh";
import { useLogStore } from "../../utils/logstore";
import { api } from "../../api/axiosInstance";

interface WebLiveLogProps {
  onSelect?: (log: any) => void;
}

export default function WebLiveLog({ onSelect }: WebLiveLogProps) {
  const { webLogs } = useLogStore();
  const containerRef = useRef<HTMLDivElement>(null);

  // 검색 키워드
  const [keyword, setKeyword] = useState("");

  // --- 필터 상태 ---
  const [methodFilter, setMethodFilter] = useState<string | null>(null);
  const [protocolFilter, setProtocolFilter] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [uaFilter, setUaFilter] = useState<string | null>(null);

  // --- 정렬 상태 (Timestamp 전용) ---
  const [sortAsc, setSortAsc] = useState(false);

  // 새로고침 → 필터 + 검색 초기화
  const handleRefresh = () => {
    setKeyword("");
    setMethodFilter(null);
    setProtocolFilter(null);
    setStatusFilter(null);
    setUaFilter(null);
  };

  // --- 드롭다운 옵션 목록 ---
  const uniqueMethods = useMemo(
    () =>
      webLogs.length > 0
        ? Array.from(new Set(webLogs.map((l) => l.method).filter(Boolean)))
        : [],
    [webLogs]
  );

  const uniqueProtocols = useMemo(
    () =>
      webLogs.length > 0
        ? Array.from(new Set(webLogs.map((l) => l.protocol).filter(Boolean)))
        : [],
    [webLogs]
  );

  const uniqueStatuses = useMemo(
    () =>
      webLogs.length > 0
        ? Array.from(
            new Set(webLogs.map((l) => String(l.status)).filter(Boolean))
          )
        : [],
    [webLogs]
  );

  const uniqueUAs = useMemo(
    () =>
      webLogs.length > 0
        ? Array.from(new Set(webLogs.map((l) => l.userAgent).filter(Boolean)))
        : [],
    [webLogs]
  );

  // --- 필터링 로직 ---
  const filteredLogs = useMemo(() => {
    return webLogs.filter((log) => {
      const matchesKeyword =
        keyword.trim() === "" ||
        Object.values(log).some((value) =>
          String(value).toLowerCase().includes(keyword.toLowerCase())
        );

      const matchesMethod = !methodFilter || log.method === methodFilter;
      const matchesProtocol = !protocolFilter || log.protocol === protocolFilter;
      const matchesStatus =
        !statusFilter || String(log.status) === statusFilter;
      const matchesUA = !uaFilter || log.userAgent === uaFilter;

      return (
        matchesKeyword &&
        matchesMethod &&
        matchesProtocol &&
        matchesStatus &&
        matchesUA
      );
    });
  }, [webLogs, keyword, methodFilter, protocolFilter, statusFilter, uaFilter]);

  // --- 정렬 (Timestamp 전용) ---
  const visibleLogs = useMemo(() => {
    const sorted = [...filteredLogs];
    sorted.sort((a, b) => {
      const t1 = new Date(a.timestamp).getTime();
      const t2 = new Date(b.timestamp).getTime();
      return sortAsc ? t1 - t2 : t2 - t1;
    });
    return sorted;
  }, [filteredLogs, sortAsc]);

  // AI Score 색상 함수
  const getAiScoreColor = (score: number) => {
    if (score >= 70) return "#F44336"; // 위험
    if (score >= 60) return "#FFC107"; // 경고
    return "#4CAF50"; // 정상
  };

  // AI Score 80 이상일 때 자동 웹훅 트리거
  useEffect(() => {
    if (!webLogs.length) return;
    const latest = webLogs[webLogs.length - 1];
    const aiScore = latest?.aiScore;

    if (aiScore >= 80) {
      const message = `
🔎 *AI Score 알림*
시스템에서 **AI Score가 높은 로그**가 감지되었습니다. 확인이 필요합니다.

📂 Path: \`${latest.path || "-"}\`
📌 Method: \`${latest.method || "-"}\`
📊 Status: \`${latest.status || "-"}\`
🌐 IP: \`${latest.ip || "-"}\`
⚠️ Score: **${aiScore} / 100**

_LogMate AI Security • 로그 검토 권장_
      `.trim();

      api
        .post(`/api/webhooks/trigger?message=${encodeURIComponent(message)}`)
        .catch((err) => {
          console.error("웹훅 전송 실패:", err);
        });
    }
  }, [webLogs]);

  return (
    <div className="w-full">
      {/* 검색 + 새로고침 */}
      <SearchRefresh onSearch={setKeyword} onRefresh={handleRefresh} />

      <div className="mt-2 bg-[#0F0F0F] rounded-lg p-2">
        {/* 헤더 */}
        <div className="flex bg-[#171717] rounded-t-lg overflow-visible">
          {/* Timestamp (정렬 토글) */}
          <div
            className="flex h-[36px] justify-center items-center gap-1 bg-[#232323] rounded-tl-md w-[200px] cursor-pointer"
            onClick={() => setSortAsc((prev) => !prev)}
          >
            <span className="text-[14px] text-[#D8D8D8]">Timestamp</span>
            <button className="w-[24px] h-[24px] flex items-center justify-center p-0 bg-transparent border-none">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                className={`w-6 h-6 transform transition-transform duration-200 ${
                  sortAsc ? "rotate-180" : ""
                }`}
                fill="none"
              >
                <path
                  d="M11.7474 16.1399L6.95119 10.6585C6.38543 10.0119 6.84461 9 7.70377 9H17.2962C18.1554 9 18.6146 10.0119 18.0488 10.6585L13.2526 16.1399C12.8542 16.5952 12.1458 16.5952 11.7474 16.1399Z"
                  fill="#AEAEAE"
                />
              </svg>
            </button>
          </div>

          {/* Method */}
          <div className="flex h-[36px] justify-center items-center gap-1 bg-[#232323] w-[120px]">
            <span className="text-[14px] text-[#D8D8D8]">Method</span>
            <BtnDropdown
              options={uniqueMethods}
              selected={methodFilter}
              onSelect={(opt) => setMethodFilter(opt)}
            />
          </div>

          {/* Protocol */}
          <div className="flex h-[36px] justify-center items-center gap-1 bg-[#232323] w-[120px]">
            <span className="text-[14px] text-[#D8D8D8]">Protocol</span>
            <BtnDropdown
              options={uniqueProtocols}
              selected={protocolFilter}
              onSelect={(opt) => setProtocolFilter(opt)}
            />
          </div>

          {/* Size */}
          <div className="flex h-[36px] justify-center items-center gap-1 bg-[#232323] w-[100px]">
            <span className="text-[14px] text-[#D8D8D8]">Size</span>
          </div>

          {/* Path */}
          <div className="flex h-[36px] justify-center items-center gap-1 bg-[#232323] w-[300px]">
            <span className="text-[14px] text-[#D8D8D8]">Path</span>
          </div>

          {/* Status */}
          <div className="flex h-[36px] justify-center items-center gap-1 bg-[#232323] w-[100px]">
            <span className="text-[14px] text-[#D8D8D8]">Status</span>
            <BtnDropdown
              options={uniqueStatuses}
              selected={statusFilter}
              onSelect={(opt) => setStatusFilter(opt)}
            />
          </div>

          {/* Referrer */}
          <div className="flex h-[36px] justify-center items-center gap-1 bg-[#232323] w-[140px]">
            <span className="text-[14px] text-[#D8D8D8]">Referrer</span>
          </div>

          {/* User-Agent */}
          <div className="flex h-[36px] justify-center items-center gap-1 bg-[#232323] w-[160px]">
            <span className="text-[14px] text-[#D8D8D8]">User-Agent</span>
            <BtnDropdown
              options={uniqueUAs}
              selected={uaFilter}
              onSelect={(opt) => setUaFilter(opt)}
            />
          </div>

          {/* IP */}
          <div className="flex h-[36px] justify-center items-center gap-1 bg-[#232323] w-[140px]">
            <span className="text-[14px] text-[#D8D8D8]">IP</span>
          </div>

          {/* AI Score */}
          <div className="flex h-[36px] justify-center items-center gap-1 bg-[#232323] rounded-tr-md w-[120px]">
            <span className="text-[14px] text-[#D8D8D8]">AI Score</span>
          </div>
        </div>

        {/* 데이터 행 */}
        <div
          className="flex flex-col h-[432px] overflow-y-auto"
          ref={containerRef}
        >
          {visibleLogs.map((row, idx) => {
            const aiScore = row?.aiScore ?? null;
            const isLast = idx === visibleLogs.length - 1;

            return (
              <div
                key={idx}
                onClick={() => onSelect?.(row)}
                className="flex border-b border-[#2A2A2A] last:border-none cursor-pointer hover:bg-[#2A2A2A]"
              >
                <div
                  className={`flex w-[200px] h-[36px] justify-center items-center bg-[#171717] ${
                    isLast ? "rounded-bl-md" : ""
                  }`}
                >
                  <span className="text-[#D8D8D8] text-[14px] font-light font-['Geist_Mono']">
                    {row?.timestamp ?? ""}
                  </span>
                </div>
                <div className="flex w-[120px] h-[36px] justify-center items-center bg-[#171717]">
                  <span className="text-[#D8D8D8] text-[14px]">
                    {row?.method ?? ""}
                  </span>
                </div>
                <div className="flex w-[120px] h-[36px] justify-center items-center bg-[#171717]">
                  <span className="text-[#D8D8D8] text-[14px]">
                    {row?.protocol ?? ""}
                  </span>
                </div>
                <div className="flex w-[100px] h-[36px] justify-center items-center bg-[#171717]">
                  <span className="text-[#D8D8D8] text-[14px]">
                    {row?.size ?? ""}
                  </span>
                </div>
                {/* Path */}
                <div className="flex w-[300px] h-[36px] items-center bg-[#171717] px-2">
                  <span
                    className="text-[#D8D8D8] text-[14px] truncate w-full"
                    title={row?.path ?? ""}
                  >
                    {row?.path ?? ""}
                  </span>
                </div>
                <div className="flex w-[100px] h-[36px] justify-center items-center bg-[#171717]">
                  <span className="text-[#D8D8D8] text-[14px]">
                    {row?.status ?? ""}
                  </span>
                </div>
                {/* Referrer */}
                <div className="flex w-[140px] h-[36px] items-center bg-[#171717] px-2">
                  <span
                    className="text-[#D8D8D8] text-[14px] truncate w-full"
                    title={row?.referrer ?? ""}
                  >
                    {row?.referrer ?? ""}
                  </span>
                </div>
                {/* User-Agent */}
                <div className="flex w-[160px] h-[36px] items-center bg-[#171717] px-2">
                  <span
                    className="text-[#D8D8D8] text-[14px] truncate w-full"
                    title={row?.userAgent ?? ""}
                  >
                    {row?.userAgent ?? ""}
                  </span>
                </div>
                {/* IP */}
                <div className="flex w-[140px] h-[36px] items-center bg-[#171717] px-2">
                  <span
                    className="text-[#D8D8D8] text-[14px] truncate w-full"
                    title={row?.ip ?? ""}
                  >
                    {row?.ip ?? ""}
                  </span>
                </div>
                {/* AI Score */}
                <div
                  className={`flex w-[120px] h-[36px] justify-center items-center bg-[#171717] ${
                    isLast ? "rounded-br-md" : ""
                  }`}
                >
                  <span
                    className="text-[14px] font-bold"
                    style={{
                      color:
                        aiScore !== null ? getAiScoreColor(aiScore) : "#D8D8D8",
                    }}
                  >
                    {aiScore !== null ? aiScore : ""}
                  </span>
                </div>
              </div>
            );
          })}

          {/* 로그 없을 때 */}
          {keyword.trim() === "" && visibleLogs.length === 0 && (
            <div className="flex justify-center items-center h-full text-[#888] text-[14px]">
              아직 수집된 로그가 없습니다.
            </div>
          )}

          {/* 검색 결과 없을 때 */}
          {keyword.trim() !== "" && visibleLogs.length === 0 && (
            <div className="flex justify-center items-center h-full text-[#888] text-[14px]">
              검색된 로그가 없습니다.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
