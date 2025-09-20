import { useState } from "react";
import WebAll from "../component/WebAll";
import WebAI from "../component/WebAI";
import WebErrorLog from "../component/WebErrorlog";
import WebPath from "../component/WebPath";
import SearchRefresh from "../component/searchrefresh";
import WebLiveLog from "../component/WebLiveLog";
import WebLogLine from "../component/WebLogLine";
import WebTimeLog from "../component/WebTimeLog";
import WebLogDetailPanel from "./weblogdetail";

export default function WebDashboard() {
  const [refreshKey, setRefreshKey] = useState(0);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [selectedLog, setSelectedLog] = useState<any | null>(null);

  return (
    <div className="flex flex-col gap-6">
      {/* 상단 카드 묶음 (그대로 유지) */}
      <div className="w-full max-w-[1385px] flex gap-2 flex-shrink-0">
        {/* 총 로그수 + 에러 로그 묶음 */}
        <div className="flex flex-col gap-3">
          <WebAll />
          <WebErrorLog />
        </div>

        {/* AI 이상 탐지 + 상위 10 Path */}
        <div className="flex gap-3">
          <WebAI />
          <WebPath />
        </div>
      </div>

      {/* 카드 섹션 */}
      <div className="w-full max-w-[1385px] flex flex-col gap-6">
        <SearchRefresh
          onRefresh={() => setRefreshKey((k) => k + 1)}
          onSearch={(kw) => setSearchKeyword(kw)}
        />

        {/* 로그 클릭 시 패널*/}
        <WebLiveLog
          key={refreshKey}
          keyword={searchKeyword}
          onSelect={setSelectedLog}
        />

        <WebLogLine />
        <WebTimeLog />
      </div>

      {/* 상세 패널 */}
      <WebLogDetailPanel
        log={selectedLog}
        onClose={() => setSelectedLog(null)}
      />
    </div>
  );
}
