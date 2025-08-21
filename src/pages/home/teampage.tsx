import ToastMessage from '../dashboard/toastmessage';
import { useParams, Navigate, useNavigate } from 'react-router-dom';
import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Bar from '../../components/navi/bar';
import BtnBigArrow from '../../components/btn/btn-big-arrow';
import BtnSort from '../../components/btn/btn-sort';
import FrmThumbnailBoard from '../../components/frm/frm-thumbnail-board';
import DashboardMake from '../dashboard/dashboardmake';
import { useAuth } from '../../utils/AuthContext';
import { loadFolders, loadTeamFolders, saveTeamFolders, type Folder } from '../../utils/storage';
import { MAX_SPACES } from '../../utils/validate';

type BoardStatus = 'collecting' | 'unresponsive' | 'before';

interface Board {
  id: number;
  name: string;
  lastEdited?: string;
  logPath?: string;
  statusType: BoardStatus; // 정규화 후 항상 존재
}

export default function TeamPage() {
  const { user } = useAuth();
  const username = user?.username ?? '';
  const { teamId } = useParams<{ teamId: string }>();
  const navigate = useNavigate();

  const [teamFolders, setTeamFolders] = useState<Folder[]>([]);
  const [loading, setLoading] = useState(true);

  const [showDashboardMake, setShowDashboardMake] = useState(false);
  const [selectedFolderId, setSelectedFolderId] = useState<number | null>(null);
  const [showToast, setShowToast] = useState(false);
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest'>('newest');

  // 초기 로드
  useEffect(() => {
    if (!user) return;
    const local = loadTeamFolders(username) || [];
    setTeamFolders(local);

    const hasLocalCurrent = !!teamId && local.some((f) => String(f.id) === String(teamId));
    setLoading(!hasLocalCurrent ? false : false); // 일단 로컬만 쓰므로 즉시 false
  }, [user, username, teamId]);

  const handleAddTeamFolder = () => {
    setTeamFolders((prev) => {
      if (prev.length >= MAX_SPACES) return prev;
      const newFolder: Folder = {
        id: Date.now(),
        name: '새 팀',
        createdAt: new Date().toISOString(),
        spaceType: 'team',
        boards: [],
      };
      const updated = [...prev, newFolder];
      if (user) saveTeamFolders(username, updated);
      return updated;
    });
  };

  const handleRemoveTeamFolder = (folderId?: number | string) => {
    if (!folderId) return;
    setTeamFolders((prev) => {
      const updated = prev.filter((f) => String(f.id) !== String(folderId));
      if (user) saveTeamFolders(username, updated);
      return updated;
    });
  };

  const currentTeam = teamFolders.find((f) => String(f.id) === String(teamId));

  useEffect(() => {
    if (!user) return;
    if (!loading && teamId && !currentTeam) {
      navigate('/team', { replace: true });
    }
  }, [user, loading, teamId, currentTeam, navigate]);

  // ---- 정규화 유틸: status/statusType 혼재 → 항상 statusType으로 맞춤 ----
  const normalizeBoard = (raw: any): Board => {
    const status: BoardStatus =
      (raw?.statusType as BoardStatus) ??
      (raw?.status as BoardStatus) ??
      'before';
    return {
      id: Number(raw?.id),
      name: String(raw?.name ?? ''),
      lastEdited: raw?.lastEdited,
      logPath: raw?.logPath,
      statusType: status,
    };
  };
  // ----------------------------------------------------------------------

  // 보드 목록 (정규화 + 정렬)
  const boards: Board[] = useMemo(() => {
    const list = (currentTeam?.boards ?? []).map(normalizeBoard);
    return list.sort((a, b) => {
      const aTime = a.lastEdited ? new Date(a.lastEdited).getTime() : 0;
      const bTime = b.lastEdited ? new Date(b.lastEdited).getTime() : 0;
      return sortOrder === 'newest' ? bTime - aTime : aTime - bTime;
    });
  }, [currentTeam, sortOrder]);

  if (!user) return <Navigate to="/login" replace />;
  if (loading) return <div style={{ color: '#fff', padding: '20px' }}>Loading...</div>;
  if (!teamId || !currentTeam) return null;

  return (
    <div className="flex w-screen h-screen bg-[#0F0F0F] text-white font-suit">
      <Bar
        username={username}
        folders={loadFolders(username)}
        teamFolders={teamFolders}
        activePage={!teamId ? 'team' : undefined}
        activeFolderId={teamId}
        onAddTeamFolder={handleAddTeamFolder}
        onRemoveTeamFolder={handleRemoveTeamFolder}
        onSelectFolder={(id) => {
          navigate(`/team/${id}`, { replace: true });
        }}
      />

      <div className="flex flex-col flex-1 p-6 gap-6">
        {/* 상단 */}
        <motion.div
          className="flex flex-col gap-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
        >
          <div className="flex items-center gap-4">
            <div onClick={() => navigate('/team', { replace: true })} className="cursor-pointer">
              <BtnBigArrow />
            </div>
            <h1 className="text-[28px] font-bold leading-[135%] tracking-[-0.4px] text-[#F2F2F2]">
              {currentTeam.name}
            </h1>
            <BtnSort onSortChange={(order) => setSortOrder(order)} />
          </div>

          {currentTeam.description && (
            <p className="text-[14px] font-bold leading-[150%] tracking-[-0.4px] ml-[12px] text-[#AEAEAE]">
              {currentTeam.description}
            </p>
          )}
        </motion.div>

        {/* 썸네일 목록 */}
        <div
          className="grid gap-x-10 gap-y-10 flex-1"
          style={{
            gridTemplateColumns: 'repeat(auto-fill, 640px)',
            gridAutoRows: '372px',
            justifyContent: 'start',
            alignContent: 'start',
          }}
        >
          <AnimatePresence>
            {boards.map((b, idx) => (
              <motion.div
                key={b.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3, delay: idx * 0.05 }}
              >
                <FrmThumbnailBoard
                  boardId={b.id}
                  connected={true}
                  spaceType="team"
                  boardName={b.name}
                  previewPath={`/team/${currentTeam.id}/${b.id}?thumb=1`}
                  statusType={b.statusType}
                  lastEdited={b.lastEdited}
                  onOpen={() => navigate(`/team/${currentTeam.id}/${b.id}`)}
                  // 상태 클릭 시 상위/스토리지 반영
                  onChangeStatus={(newStatus) => {
                    setTeamFolders((prev) => {
                      const updated = prev.map((team) =>
                        String(team.id) === String(currentTeam.id)
                          ? {
                              ...team,
                              boards: (team.boards ?? []).map((board: any) =>
                                Number(board.id) === b.id
                                  ? { ...board, statusType: newStatus }
                                  : board
                              ),
                            }
                          : team
                      );
                      saveTeamFolders(username, updated);
                      return updated;
                    });
                  }}
                />
              </motion.div>
            ))}

            {/* + 버튼 */}
            <motion.div
              key="add-board-btn"
              layout
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
            >
              <FrmThumbnailBoard
                connected={false}
                spaceType="team"
                onAddBoard={() => {
                  setSelectedFolderId(Number(currentTeam.id));
                  setShowDashboardMake(true);
                }}
              />
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* DashboardMake 모달 */}
      <AnimatePresence>
        {showDashboardMake && selectedFolderId != null && (
          <motion.div
            key="dashboardMakeModal"
            className="fixed inset-0 bg-black/60 flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: -20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            >
              <DashboardMake
                onClose={() => {
                  setShowDashboardMake(false);
                  setSelectedFolderId(null);
                }}
                onCreate={(board) => {
                  const newBoard: Board = {
                    ...normalizeBoard(board),
                    lastEdited: new Date().toISOString(),
                    statusType: 'before', // 새 보드는 '대시보드 준비 중'
                  };
                  setTeamFolders((prev) => {
                    const updated = prev.map((team) =>
                      String(team.id) === String(selectedFolderId)
                        ? { ...team, boards: [...(team.boards ?? []), newBoard] }
                        : team
                    );
                    saveTeamFolders(username, updated);
                    return updated;
                  });
                  setShowDashboardMake(false);
                  setSelectedFolderId(null);
                  setShowToast(true);
                }}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ToastMessage */}
      <AnimatePresence>
        {showToast && (
          <motion.div
            key="toast"
            className="fixed inset-0 flex items-center justify-center bg-black/60 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <ToastMessage onCloseToast={() => setShowToast(false)} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
