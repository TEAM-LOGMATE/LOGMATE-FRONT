import ToastMessage from '../dashboard/toastmessage';
import { useParams, Navigate, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Bar from '../../components/navi/bar';
import BtnBigArrow from '../../components/btn/btn-big-arrow';
import FrmThumbnailBoard from '../../components/frm/frm-thumbnail-board';
import DashboardMake from '../dashboard/dashboardmake';
import { useAuth } from '../../utils/AuthContext';
import { loadFolders, loadTeamFolders, saveTeamFolders, type Folder } from '../../utils/storage';
import { MAX_SPACES } from '../../utils/validate';
import { api } from '../../api/axiosInstance';

interface Board {
  id: number;
  name: string;
  lastEdited?: string;
}

const USE_LOCAL_FALLBACK = true;
const FAST_TIMEOUT_MS = 800;

export default function TeamPage() {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;

  const username = user.username;
  const { teamId } = useParams<{ teamId: string }>();
  const navigate = useNavigate();

  const [teamFolders, setTeamFolders] = useState<Folder[]>([]);
  const [loading, setLoading] = useState(true);

  const [showDashboardMake, setShowDashboardMake] = useState(false);
  const [selectedFolderId, setSelectedFolderId] = useState<number | null>(null);
  const [showToast, setShowToast] = useState(false);

  // 로컬 + 네트워크 병합
  useEffect(() => {
    let cancelled = false;
    const local = loadTeamFolders(username) || [];
    setTeamFolders(local);

    const hasLocalCurrent = !!teamId && local.some((f) => String(f.id) === String(teamId));
    setLoading(!hasLocalCurrent);

    (async () => {
      try {
        const res = await api.get('/teams', { timeout: FAST_TIMEOUT_MS });
        if (cancelled) return;

        const serverTeams: Folder[] = res.data ?? [];

        const merged = USE_LOCAL_FALLBACK
          ? [
              ...serverTeams,
              ...local.filter(
                (lf) => !serverTeams.some((sf: Folder) => String(sf.id) === String(lf.id))
              ),
            ]
          : serverTeams;

        setTeamFolders(merged);
        saveTeamFolders(username, merged);
      } catch {
        if (USE_LOCAL_FALLBACK && !cancelled) {
          const onlyLocal = loadTeamFolders(username) || [];
          setTeamFolders(onlyLocal);
          saveTeamFolders(username, onlyLocal);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [username, teamId]);

  const handleAddTeamFolder = async () => {
    try {
      const res = await api.post(`/teams/${teamId}/folders`, {
        name: '새 팀',
        boards: [] as Board[],
      });
      setTeamFolders((prev) => {
        if (prev.length >= MAX_SPACES) return prev;
        const updated = [...prev, res.data];
        saveTeamFolders(username, updated);
        return updated;
      });
    } catch (err) {
      console.error('팀 폴더 추가 실패:', err);
    }
  };

  const handleRemoveTeamFolder = async (folderId?: number | string) => {
    try {
      if (!folderId) return;
      await api.delete(`/teams/${teamId}/folders/${folderId}`);
      setTeamFolders((prev) => {
        const updated = prev.filter((f) => String(f.id) !== String(folderId));
        saveTeamFolders(username, updated);
        return updated;
      });
    } catch (err) {
      console.error('팀 폴더 삭제 실패:', err);
    }
  };

  const currentTeam = teamFolders.find((f) => String(f.id) === String(teamId));

  useEffect(() => {
    if (!loading && teamId && !currentTeam) {
      navigate('/team', { replace: true });
    }
  }, [loading, teamId, currentTeam, navigate]);

  if (loading) {
    return <div style={{ color: '#fff', padding: '20px' }}>Loading...</div>;
  }

  if (!teamId || !currentTeam) {
    return null;
  }

  const boards: Board[] = (currentTeam as any).boards || [];

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
            <h1
              className="text-[28px] font-bold leading-[135%] tracking-[-0.4px]"
              style={{ color: '#F2F2F2', fontFamily: 'SUIT' }}
            >
              {currentTeam.name}
            </h1>
          </div>

          {currentTeam.description && (
            <p
              className="text-[14px] font-bold leading-[150%] tracking-[-0.4px] ml-[12px]"
              style={{ color: '#AEAEAE', fontFamily: 'SUIT' }}
            >
              {currentTeam.description}
            </p>
          )}
        </motion.div>

        {/* 썸네일 목록 */}
        <div
          className="grid gap-x-10 gap-y-10 flex-1"
          style={{
            gridTemplateColumns: "repeat(auto-fill, 640px)",
            gridAutoRows: "372px",
            justifyContent: "start",
            alignContent: "start",
          }}
        >
          {boards.map((b, idx) => (
            <motion.div
              key={b.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: idx * 0.05 }}
            >
              <FrmThumbnailBoard
                connected
                spaceType="team"
                boardName={b.name}
                lastEdited={b.lastEdited}
                onOpen={() => navigate(`/team/${currentTeam.id}/${b.id}`)}
              />
            </motion.div>
          ))}

          {/* + 버튼 */}
          <motion.div
            key="add-board-btn"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
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
                  setTeamFolders((prev) => {
                    const updated = prev.map((team) =>
                      String(team.id) === String(selectedFolderId)
                        ? { ...team, boards: [...(team.boards ?? []), board] }
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

      {/* ToastMessage 모달 */}
      {showToast && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/60 z-50">
          <ToastMessage onCloseToast={() => setShowToast(false)} />
        </div>
      )}
    </div>
  );
}
