import { useState } from "react";
import { useParams } from "react-router-dom";
import Bar from "../../components/navi/bar";
import { useAuth } from "../../utils/AuthContext";
import { loadFolders } from "../../utils/storage";
import Toggle from "./toggle";
import WebDashboard from "./webdashboard";
import AppAll from "../component/AppAll";
import AppLevel from "../component/AppLevel";
import AppLogger from "../component/AppLogger";
import AppErrorLog from "../component/AppErrorlog";
import SearchRefresh from "../component/searchrefresh";
import AppLiveLog from "../component/AppLiveLog";
import AppLogLine from "../component/AppLogLine";
import AppTimeLog from "../component/AppTimeLog";

export default function AppDashboard() {
  const { user } = useAuth();
  const { folderId, boardId } = useParams<{ folderId: string; boardId: string }>();

  const username = user!.username;
  const folders = loadFolders(username) || [];
  const folder = folders.find((f) => f.id === Number(folderId));
  const board = folder?.boards?.find((b: any) => b.id === Number(boardId));

  const [activeTab, setActiveTab] = useState<"app" | "web">("app");
  const [refreshKey, setRefreshKey] = useState(0);

  if (!folder || !board) {
    return <div className="text-white p-6">대시보드를 찾을 수 없습니다.</div>;
  }

  const spaceType = folder.spaceType === "team" ? "팀 스페이스" : "개인 스페이스";

  return (
    <div className="flex w-screen h-screen bg-[#0F0F0F] text-white font-suit">
      {/* 왼쪽 Bar */}
      <Bar username={username} activePage={null} activeFolderId={folderId} />

      {/* 오른쪽 메인 영역 */}
      <div className="flex flex-col flex-1 px-10 pt-10 overflow-y-auto">
        {/* 상단: 스페이스 타입 / 폴더 이름 */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <span className="text-[#888888] text-[16px]">{spaceType}</span>
          <span className="text-[#888888] text-[16px]">/ {folder.name}</span>
        </div>

        {/* 대시보드 제목 + 토글 */}
        <div className="flex items-center mt-4 gap-4 flex-shrink-0">
          <div className="w-[10px] h-[10px] rounded-full bg-[#4FE75E]" />
          <h1 className="text-[28px] font-bold text-[#F2F2F2] leading-[135%] tracking-[-0.4px]">
            {board.name}
          </h1>

          <Toggle activeTab={activeTab} setActiveTab={setActiveTab} />
        </div>

        {/* App / Web 내용 */}
        <div className="mt-8 flex-1">
          {/* App 영역 */}
          <div className={activeTab === "app" ? "block" : "hidden"}>
            <div className="flex flex-col gap-6">
              {/* 카드 묶음 */}
              <div className="w-full max-w-[1385px] flex gap-2 flex-shrink-0">
                {/* 총 로그수 + 에러 로그 묶음 */}
                <div className="flex flex-col gap-2">
                  <AppAll />
                  <AppErrorLog />
                </div>

                {/* 나머지 카드 */}
                <AppLevel />
                <AppLogger />
              </div>

              {/* 아래 영역도 전부 카드묶음 폭에 맞춤 */}
              <div className="w-full max-w-[1385px] flex flex-col gap-6">
                <SearchRefresh onRefresh={() => setRefreshKey((k) => k + 1)} />
                <AppLiveLog key={refreshKey} />
                <AppLogLine />
                <AppTimeLog />
              </div>
            </div>
          </div>

          {/* Web 영역 */}
          <div className={activeTab === "web" ? "block" : "hidden"}>
            <WebDashboard />
          </div>
        </div>
      </div>
    </div>
  );
}
