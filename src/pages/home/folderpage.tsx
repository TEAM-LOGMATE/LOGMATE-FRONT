import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Variants } from 'framer-motion';
import { useParams, Navigate, useNavigate } from 'react-router-dom';
import ToastMessage from '../dashboard/toastmessage';
import Bar from '../../components/navi/bar';
import BtnBigArrow from '../../components/btn/btn-big-arrow';
import FrmThumbnailBoard from '../../components/frm/frm-thumbnail-board';
import DashboardMake from '../dashboard/dashboardmake';
import DashboardEdit from '../dashboard/dashboardedit';
import { useAuth } from '../../utils/AuthContext';
import { MAX_SPACES } from '../../utils/validate';
import { getPersonalFolders } from '../../api/folders';
import {
  getDashboards,
  createDashboard,
  saveDashboardConfig,
  getDashboardConfigs,
} from '../../api/dashboard';
import { useFolderStore } from '../../utils/folderStore';

interface Board {
  id: number;
  name: string;
  logPath?: string;
  lastModified?: string;
  status?: 'collecting' | 'unresponsive' | 'before';
  agentId?: string;
  advancedConfig?: any;
  pullerConfig?: any;
}

interface NewBoard {
  name: string;
  logPath: string;
  advancedConfig: any;
  logType: string;
  timezone: string;
  agentId?: string;
  puller?: any;
}

// 날짜 문자열 파싱
const parseDate = (dateStr: string) => {
  const normalized = dateStr.replace(/\./g, '-').replace(' ', 'T');
  return new Date(normalized);
};

export default function FolderPage() {
  const { isLoading, isAuthed, user } = useAuth();
  if (isLoading) return null;
  if (!isAuthed || !user) return <Navigate to="/login" replace />;

  const username = user.username;
  const { folderId } = useParams<{ folderId: string }>();
  const navigate = useNavigate();

  const { folders, setFolders, personalSortOrder } = useFolderStore();

  const [loading, setLoading] = useState(true);
  const [boards, setBoards] = useState<Board[]>([]);
  const [activePage, setActivePage] = useState<'personal' | 'myinfo' | 'team'>('personal');

  const [isDashboardMakeOpen, setIsDashboardMakeOpen] = useState(false);
  const [isDashboardEditOpen, setIsDashboardEditOpen] = useState(false);
  const [editTargetBoard, setEditTargetBoard] = useState<Board | null>(null);

  const [showToast, setShowToast] = useState(false);
  const [createdAgentId, setCreatedAgentId] = useState<string | null>(null);

  const cardVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3, ease: 'easeOut' } },
    exit: { opacity: 0, y: -15, transition: { duration: 0.2, ease: 'easeIn' } },
  };

  // 폴더 단위로 순서 보장된 대시보드 + 고급설정 로드
  const fetchDashboards = async () => {
    if (!user || !folderId) return;
    try {
      // 대시보드 목록 먼저 가져오기
      const dashboardsRes = await getDashboards(Number(folderId));
      console.log('[getDashboards 응답]', dashboardsRes);
      const boardsData = dashboardsRes.data || [];

      // 기본 정보 세팅
      setBoards(
        boardsData.map((d: any) => ({
          id: d.id,
          name: d.name,
          logPath: d.logPath,
          lastModified: d.lastModified,
          status: d.status,
          agentId: d.agentId,
          pullerConfig: null,
          advancedConfig: [],
        }))
      );

      // 목록 로드가 끝난 뒤, 폴더 단위 고급정보 조회
      const advRes = await getDashboardConfigs(Number(folderId));
      console.log('[getDashboardConfigs 응답]', advRes);
      const advList = advRes?.data || [];

      // 대시보드별 매칭
      setBoards((prev) =>
        prev.map((b) => {
          const advItem = advList.find((a: any) => a.dashboardId === b.id);
          return advItem
            ? {
                ...b,
                pullerConfig: advItem.pullerConfig ?? null,
                advancedConfig: advItem.logPipelineConfigs ?? [],
                status: advItem.dashboardStatus ?? b.status,
              }
            : b;
        })
      );
    } catch (err) {
      console.error('대시보드 조회 실패:', err);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!user || !folderId) return;

        const data = await getPersonalFolders(user.id);
        console.log('[getPersonalFolders 응답]', data);
        const sorted = [...(data || [])].sort((a, b) => {
          const aDate = parseDate(a.updatedAt);
          const bDate = parseDate(b.updatedAt);
          return personalSortOrder === 'newest'
            ? bDate.getTime() - aDate.getTime()
            : aDate.getTime() - bDate.getTime();
        });

        setFolders(
          sorted.map((f: any) => ({
            id: f.id,
            name: f.name,
            boards: f.boards || [],
            spaceType: 'personal' as const,
          }))
        );

        await fetchDashboards();
      } catch (err) {
        console.error('폴더/대시보드 조회 실패:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user, folderId, setFolders, personalSortOrder]);

  const currentFolder = folders.find((f) => String(f.id) === String(folderId));

  useEffect(() => {
    if (!loading && folders.length > 0 && folderId && !currentFolder) {
      if (window.location.pathname !== '/personal') navigate('/personal');
    }
  }, [loading, folders, folderId, currentFolder, navigate]);

  if (!folderId || !currentFolder) return null;
  const handleAddBoard = async (board: NewBoard) => {
    try {
      const created = await createDashboard(Number(folderId), {
        name: board.name,
        logPath: board.logPath,
      });
      console.log('[createDashboard 응답]', created);

      const dashboardId = created?.data?.id;
      if (!dashboardId) throw new Error('대시보드 ID를 가져오지 못했습니다.');

      const configBody = {
        agentId: board.agentId || null,
        puller: board.puller,
        logPipelineConfigs: [
          {
            parserType: board.logType,
            parser: { timezone: board.timezone },
            tailer: {
              ...board.advancedConfig.tailer,
              filePath: board.logPath,
            },
            multiline: board.advancedConfig.multiline,
            exporter: board.advancedConfig.exporter,
            filter:
              board.logType === 'springboot'
                ? {
                    allowedLevels: board.advancedConfig.filter.allowedLevels || [],
                    requiredKeywords: board.advancedConfig.filter.requiredKeywords || [],
                  }
                : {
                    allowedMethods: board.advancedConfig.filter.allowedMethods || [],
                    requiredKeywords: board.advancedConfig.filter.requiredKeywords || [],
                  },
          },
        ],
      };

      const configRes = await saveDashboardConfig(Number(folderId), dashboardId, configBody);
      console.log('[saveDashboardConfig 응답]', configRes);
      const agentId = configRes?.data?.agentId;
      setCreatedAgentId(agentId);

      setBoards((prev) => [
        ...prev,
        {
          id: dashboardId,
          name: board.name,
          logPath: board.logPath,
          lastModified: new Date().toISOString(),
          status: 'before',
          agentId,
          advancedConfig: configBody.logPipelineConfigs,
        },
      ]);

      setIsDashboardMakeOpen(false);
      setShowToast(true);
    } catch (err) {
      console.error('대시보드 생성 실패:', err);
    }
  };

  const handleDeleteBoard = (boardId: number) => {
    console.log('[deleteDashboard 요청] boardId:', boardId);
    setBoards((prev) => prev.filter((b) => b.id !== boardId));
  };

  const handleUpdateBoard = (updated: Board) => {
    console.log('[대시보드 업데이트 요청]', updated);
    setBoards((prev) =>
      prev.map((b) =>
        b.id === updated.id
          ? {
              ...b,
              ...updated,
              advancedConfig: [
                {
                  ...(updated.advancedConfig || {}),
                  pullerConfig:
                    updated.pullerConfig ??
                    b.advancedConfig?.[0]?.pullerConfig ??
                    { intervalSec: 5 },
                },
              ],
            }
          : b
      )
    );
  };

  return (
    <div className="flex w-screen h-screen bg-[#0F0F0F] text-white font-suit overflow-hidden">
      <Bar
        username={username}
        onAddFolder={() => {
          if (folders.length < MAX_SPACES) {
            setFolders((prev) => [
              ...prev,
              { id: Date.now(), name: '새 폴더', boards: [], spaceType: 'personal' as const },
            ]);
          }
        }}
        onRemoveFolder={() => setFolders((prev) => prev.slice(0, -1))}
        activePage="personal"
        activeFolderId={folderId ? Number(folderId) : null}
        onSelectPage={(page) => page && setActivePage(page)}
        onSelectFolder={(id) => {
          setActivePage('personal');
          navigate(`/personal/${id}`, { replace: true });
        }}
      />

      <div className="flex flex-col flex-1 p-6 gap-6">
        <motion.div
          className="flex items-center gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
        >
          <div onClick={() => navigate('/personal', { replace: true })} className="cursor-pointer">
            <BtnBigArrow />
          </div>
          <h1 className="text-[28px] font-bold" style={{ color: '#F2F2F2', fontFamily: 'SUIT' }}>
            {currentFolder.name}
          </h1>
        </motion.div>

        <motion.div
          layout
          className="grid gap-x-10 gap-y-10 flex-1"
          style={{
            gridTemplateColumns: 'repeat(auto-fill, 640px)',
            gridAutoRows: '372px',
            justifyContent: 'start',
            alignContent: 'start',
          }}
        >
          <AnimatePresence>
            {!loading &&
              boards.map((board) => (
                <motion.div
                  key={board.id}
                  layout
                  variants={cardVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                >
                  <FrmThumbnailBoard
                    folderId={Number(folderId)}
                    boardId={board.id}
                    connected
                    boardName={board.name}
                    logPath={board.logPath}
                    advancedConfig={board.advancedConfig}
                    agentId={board.agentId}
                    onDeleted={() => handleDeleteBoard(board.id)}
                    onUpdated={() => {
                      setEditTargetBoard(board);
                      setIsDashboardEditOpen(true);
                    }}
                    onOpen={() => navigate(`/personal/${folderId}/${board.id}`)}
                    previewPath={`/personal/${folderId}/${board.id}?thumb=1`}
                    dashboardStatus={board.status || '에이전트 미응답'}
                  />
                </motion.div>
              ))}

            {!loading && boards.length < 4 && (
              <motion.div
                key="add-slot"
                layout
                variants={cardVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
              >
                <FrmThumbnailBoard
                  folderId={Number(folderId)}
                  boardId={0}
                  connected={false}
                  onAddBoard={() => setIsDashboardMakeOpen(true)}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* DashboardMake 모달 */}
      <AnimatePresence>
        {isDashboardMakeOpen && (
          <motion.div
            key="make"
            className="fixed inset-0 flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="absolute inset-0 bg-black/50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsDashboardMakeOpen(false)}
            />
            <motion.div
              className="relative z-10"
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              onClick={(e) => e.stopPropagation()}
            >
              <DashboardMake
                folderId={Number(folderId)}
                onCreate={(board: NewBoard) => handleAddBoard(board)}
                onClose={() => setIsDashboardMakeOpen(false)}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* DashboardEdit 모달 */}
      <AnimatePresence>
        {isDashboardEditOpen && editTargetBoard && (
          <motion.div
            key={`edit-${editTargetBoard.id}`}
            className="fixed inset-0 flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="absolute inset-0 bg-black/50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsDashboardEditOpen(false)}
            />
            <motion.div
              className="relative z-10"
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              onClick={(e) => e.stopPropagation()}
            >
              <DashboardEdit
                folderId={Number(folderId)}
                boardId={editTargetBoard.id}
                initialName={editTargetBoard.name}
                initialLogPath={editTargetBoard.logPath ?? ''}
                initialAdvancedConfig={editTargetBoard.advancedConfig}
                initialAgentId={editTargetBoard.agentId}
                initialLogType={
                  editTargetBoard.advancedConfig?.[0]?.parserType ?? 'springboot'
                }
                initialTimezone={
                  editTargetBoard.advancedConfig?.[0]?.parser?.timezone ?? 'Asia/Seoul'
                }
                onUpdated={handleUpdateBoard}
                onClose={() => setIsDashboardEditOpen(false)}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {showToast && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/60 z-50">
          <ToastMessage agentId={createdAgentId} onCloseToast={() => setShowToast(false)} />
        </div>
      )}
    </div>
  );
}
