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
import AppLiveLog from "../component/AppLiveLog";
import AppLogLine from "../component/AppLogLine";
import AppTimeLog from "../component/AppTimeLog";
import { getTeams } from "../../api/teams";
import { getDashboards, getDashboardConfigs } from "../../api/dashboard";
import { useLogStore } from "../../utils/logstore";
import AppLogDetailPanel from "./applogdetail";
import { fetchLogs } from "../../api/log";

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

  // 라우트 파라미터
  const { folderId, boardId, teamId } = useParams<{
    folderId?: string;
    boardId: string;
    teamId?: string;
  }>();

  const { connect, disconnect } = useLogStore();
  const [activeTab, setActiveTab] = useState<"app" | "web">("app");
  const [disabledTabs, setDisabledTabs] = useState<("app" | "web")[]>([]);

  const username = user?.username ?? localStorage.getItem("username") ?? "사용자";

  const [personalFolders, setPersonalFolders] = useState<Folder[]>([]);
  const [teamFolders, setTeamFolders] = useState<Folder[]>([]);
  const [dashboardConfigs, setDashboardConfigs] = useState<any[]>([]);

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
                agentId: db.agentId,
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
              // 팀 대시보드는 /api/folders/{team.id}/dashboards
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
                    agentId: db.agentId,
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
  useEffect(() => {
    const loadConfigs = async () => {
      try {
        //팀 페이지면 teamId 개인 페이지면 folderId로 호출
        let targetFolderId: number | undefined;
        if (teamId) targetFolderId = Number(teamId);
        else if (folderId) targetFolderId = Number(folderId);

        if (!targetFolderId) {
          console.warn("folderId/teamId 없음");
          return;
        }

        const res = await getDashboardConfigs(targetFolderId);

        // logPipelineConfigs 키 정규화
        const normalized = (res.data || []).map((cfg: any) => ({
          ...cfg,
          logPipelineConfigs:
            cfg.logPipelineConfigs || cfg.logpipelineConfigs || [],
        }));

        setDashboardConfigs(normalized);
      } catch (err) {
        console.error("대시보드 설정 불러오기 실패:", err);
      }
    };

    loadConfigs();
  }, [folderId, teamId]);

  // parserType 기반 탭 자동 선택 + 토글 비활성화
  useEffect(() => {
    if (!dashboardConfigs.length) return;

    const matchedConfig = dashboardConfigs.find(
      (cfg) => String(cfg.dashboardId) === String(boardId)
    );

    const pipeline = matchedConfig?.logPipelineConfigs?.[0];

    const parserType =
      pipeline?.parser?.type?.toLowerCase?.() ??
      pipeline?.parserType?.toLowerCase?.() ??
      "";

    if (parserType === "springboot") {
      setDisabledTabs(["web"]);
      setActiveTab("app");
    } else if (parserType === "tomcat") {
      setDisabledTabs(["app"]);
      setActiveTab("web");
    } else {
      setDisabledTabs([]);
      setActiveTab("app");
    }
  }, [boardId, dashboardConfigs]);

  useEffect(() => {
    if (!boardId || !board?.agentId || dashboardConfigs.length === 0) return;

    const matchedConfig = dashboardConfigs.find(
      (cfg) => String(cfg.dashboardId) === String(boardId)
    );
    const pipeline = matchedConfig?.logPipelineConfigs?.[0];
    if (!pipeline) {
      console.warn("logPipelineConfigs 없음:", matchedConfig);
      return;
    }

    const agentId = board.agentId;
    const thNum = pipeline.thNum;
    connect(agentId, String(thNum));

    return () => {
      disconnect();
    };
  }, [boardId, board?.agentId, dashboardConfigs, connect, disconnect]);

useEffect(() => {
  if (!boardId || !board?.agentId || dashboardConfigs.length === 0) return;

  const matchedConfig = dashboardConfigs.find(
    (cfg) => String(cfg.dashboardId) === String(boardId)
  );
  const pipeline = matchedConfig?.logPipelineConfigs?.[0];
  if (!pipeline) return;

  const agentId = board.agentId;
  const thNum = pipeline.thNum;

  const fetchAllLogs = async () => {
    try {
      const springParams = {
        agentId,
        thNum,
        logType: "SPRING_BOOT",
      };
      const springLogs = await fetchLogs(springParams);
      useLogStore.getState().setAppLogs(springLogs);
      const webParams = {
        agentId,
        thNum,
        logType: "TOMCAT_ACCESS",
      };
      const webLogs = await fetchLogs(webParams);
      useLogStore.getState().setWebLogs(webLogs);

      console.log("두 로그 모두 조회 완료", {
        appLogs: springLogs.length,
        webLogs: webLogs.length,
      });
    } catch (err) {
      console.error("로그 조회 실패:", err);
    }
  };

  fetchAllLogs();
}, [boardId, board?.agentId, dashboardConfigs]);


  const [refreshKey] = useState(0);
  const [selectedLog, setSelectedLog] = useState<any | null>(null);
  const spaceType = folder?.spaceType === "team" ? "팀 스페이스" : "개인 스페이스";

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
            <Toggle
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              disabledTabs={disabledTabs}
            />
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
                  <AppLiveLog
                    key={refreshKey}
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
