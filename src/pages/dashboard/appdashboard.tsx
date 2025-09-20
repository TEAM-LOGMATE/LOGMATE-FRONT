import { useState, useEffect } from "react";
import { useParams, Navigate, useLocation, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import Bar from "../../components/navi/bar";
import type { Folder } from "../../utils/type";
import { useAuth } from "../../utils/AuthContext";
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
import { getTeams } from "../../api/teams";
import { getDashboards } from "../../api/dashboard";
import { useLogStore } from "../../utils/logstore";
import AppLogDetailPanel from "./applogdetail";

export default function AppDashboard() {
  const location = useLocation();
  const [params] = useSearchParams();

  // 임베드(썸네일) 판별
  const isThumb = params.get("thumb") === "1";
  const inIframe = typeof window !== "undefined" && window.self !== window.top;
  const isEmbed = isThumb || inIframe;

  // 인증 가드
  const { isLoading, isAuthed, user } = useAuth();
  if (!isEmbed) {
    if (isLoading) return null;
    if (!isAuthed || !user) {
      return (
        <Navigate
          to="/login"
          replace
          state={{ from: location.pathname + location.search }}
        />
      );
    }
  }

  const { folderId, boardId, teamId } = useParams<{
    folderId?: string;
    boardId: string;
    teamId?: string;
  }>();

  // WebSocket 연결/해제 관리
  const { connect, disconnect } = useLogStore();
  const [activeTab, setActiveTab] = useState<"app" | "web">("app");

  useEffect(() => {
    if (!boardId) return;
    const threadNo = activeTab === "web" ? "1" : "2";
    connect("agent-uuid1", threadNo);
    return () => {
      disconnect();
    };
  }, [boardId, activeTab, connect, disconnect]);

  // 임베드일 때는 user가 null일 수 있음 → fallback
  const username = user?.username ?? localStorage.getItem("username") ?? "사용자";

  const [personalFolders, setPersonalFolders] = useState<Folder[]>([]);
  const [teamFolders, setTeamFolders] = useState<Folder[]>([]);

  // 개인 스페이스 불러오기
  useEffect(() => {
    const fetchPersonal = async () => {
      if (!folderId) return;
      try {
        const dashboards = await getDashboards(Number(folderId));
        setPersonalFolders([
          {
            id: Number(folderId),
            name: "내 폴더",
            spaceType: "personal" as const,
            boards:
              dashboards.data?.map((db: any) => ({
                id: db.id,
                name: db.name,
                logPath: db.logPath,
                status: "before" as const,
              })) || [],
          },
        ]);
      } catch (err) {
        console.error("개인 대시보드 불러오기 실패:", err);
      }
    };
    if (!teamId) fetchPersonal();
  }, [folderId, teamId]);

  // 팀 스페이스 불러오기
  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const teamData = await getTeams();
        const withDashboards: Folder[] = await Promise.all(
          teamData.map(async (team: any) => {
            try {
              const dashboards = await getDashboards(team.id);
              return {
                id: team.id,
                name: team.name,
                description: team.description,
                spaceType: "team" as const,
                boards:
                  dashboards.data?.map((db: any) => ({
                    id: db.id,
                    name: db.name,
                    logPath: db.logPath,
                    status: "before" as const,
                  })) || [],
              };
            } catch {
              return {
                id: team.id,
                name: team.name,
                description: team.description,
                spaceType: "team" as const,
                boards: [],
              };
            }
          })
        );
        setTeamFolders(withDashboards);
      } catch (err) {
        console.error("팀/대시보드 불러오기 실패:", err);
      }
    };
    fetchTeams();
  }, []);

  let folder: Folder | undefined;
  if (teamId) {
    folder = teamFolders.find((f: Folder) => String(f.id) === String(teamId));
  } else if (folderId) {
    folder = personalFolders.find((f: Folder) => String(f.id) === String(folderId));
  }

  const board = folder?.boards?.find((b) => String(b.id) === String(boardId));

  const [refreshKey, setRefreshKey] = useState(0);
  const [searchKeyword, setSearchKeyword] = useState("");

  const spaceType = folder?.spaceType === "team" ? "팀 스페이스" : "개인 스페이스";

  const [selectedLog, setSelectedLog] = useState<any | null>(null);

  return (
    <div className="flex w-full h-screen overflow-hidden bg-[#0F0F0F] text-white font-suit">
      {/* 왼쪽 Bar */}
      <Bar
        username={username}
        activePage={folder?.spaceType === "team" ? "team" : "personal"}
        activeFolderId={Number(folder?.id ?? folderId ?? teamId)}
      />

      {/* 오른쪽 메인 영역 (애니메이션 적용) */}
      <motion.div
        className="flex flex-col flex-1 min-w-0 px-10 pt-10 overflow-y-auto"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
      >
        {/* 상단: 스페이스 타입 / 폴더 이름 */}
        {folder && (
          <div className="flex items-center gap-2 flex-shrink-0">
            <span className="text-[#888888] text-[16px]">{spaceType}</span>
            <span className="text-[#888888] text-[16px]">/ {folder.name}</span>
          </div>
        )}

        {/* 대시보드 제목 + 토글 */}
        {board && (
          <div className="flex items-center mt-4 gap-4 flex-shrink-0">
            <div className="w-[10px] h-[10px] rounded-full bg-[#4FE75E]" />
            <h1 className="text-[28px] font-bold text-[#F2F2F2] leading-[135%] tracking-[-0.4px]">
              {board.name}
            </h1>
            <Toggle activeTab={activeTab} setActiveTab={setActiveTab} />
          </div>
        )}

        {/* App / Web 내용 */}
        {board && (
          <div className="mt-8 flex-1 relative">
            {/* App 영역 */}
            <div className={activeTab === "app" ? "block" : "hidden"}>
              <div className="flex flex-col gap-6">
                {/* 카드 묶음 */}
                <div className="w-full max-w-[1385px] flex gap-2 flex-shrink-0">
                  <div className="flex flex-col gap-2">
                    <AppAll />
                    <AppErrorLog />
                  </div>
                  <AppLevel />
                  <AppLogger />
                </div>

                {/* 아래 영역 */}
                <div className="w-full max-w-[1385px] flex flex-col gap-6">
                  <SearchRefresh
                    onRefresh={() => setRefreshKey((k) => k + 1)}
                    onSearch={(kw) => setSearchKeyword(kw)}
                  />
                  <AppLiveLog
                    key={refreshKey}
                    keyword={searchKeyword}
                    onSelectLog={(log) => setSelectedLog(log)}
                  />
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
        )}
      </motion.div>

      {/* 로그 상세 패널 */}
      <AppLogDetailPanel
        log={selectedLog}
        onClose={() => setSelectedLog(null)}
      />
    </div>
  );
}
