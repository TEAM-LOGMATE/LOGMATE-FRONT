import ToastMessage from '../dashboard/toastmessage';
import { useParams, Navigate, useNavigate } from 'react-router-dom';
import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Bar from '../../components/navi/bar';
import BtnBigArrow from '../../components/btn/btn-big-arrow';
import FrmThumbnailBoard from '../../components/frm/frm-thumbnail-board';
import DashboardMake from '../dashboard/dashboardmake';
import FrmMakeTeam from '../../components/frm/frm-maketeam';
import { useAuth } from '../../utils/AuthContext';
import { getTeams, createTeam } from '../../api/teams';
import { getDashboards, createDashboard } from '../../api/dashboard';
import { useFolderStore } from '../../utils/folderStore';
import type { UiMember, UiRole, ApiMember, ApiRole } from '../../utils/type';

const roleMap: Record<UiRole, ApiRole> = {
  teamAdmin: 'ADMIN',
  member: 'MEMBER',
  viewer: 'VIEWER',
};

type BoardStatus = 'collecting' | 'unresponsive' | 'before';

interface Board {
  id: number;
  name: string;
  lastEdited?: string;
  logPath?: string;
  sendTo?: string;
  status?: BoardStatus;
}

export default function TeamPage() {
  const { user } = useAuth();
  const username = user?.username ?? '';
  const { teamId } = useParams<{ teamId: string }>();
  const navigate = useNavigate();
  const { teamFolders, setTeamFolders } = useFolderStore();
  const [activeFolderId, setActiveFolderId] = useState<string | number | null>(teamId ?? null);
  const [boards, setBoards] = useState<Board[]>([]);
  const [loading, setLoading] = useState(true);
  const [showDashboardMake, setShowDashboardMake] = useState(false);
  const [selectedFolderId, setSelectedFolderId] = useState<number | null>(null);
  const [showToast, setShowToast] = useState(false);

  const [showMakeTeam, setShowMakeTeam] = useState(false);

  useEffect(() => {
    if (!user) return;

    const fetchTeamsAndBoards = async () => {
      try {
        const res = await getTeams();
        setTeamFolders(res);

        if (teamId) {
          setActiveFolderId(teamId);
          const team = res.find((t: any) => String(t.id) === String(teamId));
          if (team) {
            const dashboards = await getDashboards(Number(teamId));
            setBoards(dashboards.data);
          }
        }
      } catch (err) {
        console.error('팀/대시보드 불러오기 실패:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchTeamsAndBoards();
  }, [user, teamId, setTeamFolders]);

  const handleCreateBoard = async (boardData: any) => {
    if (!teamId) return;
    try {
      const res = await createDashboard(Number(teamId), {
        name: boardData.name,
        logPath: boardData.logPath,
        sendTo: boardData.sendTo,
      });
      setBoards((prev) => [...prev, res.data]);
      setShowDashboardMake(false);
      setShowToast(true);
    } catch (err) {
      console.error('보드 생성 실패:', err);
    }
  };

  const sortedBoards = useMemo(() => {
    return [...boards].sort((a, b) => {
      const aTime = a.lastEdited ? new Date(a.lastEdited).getTime() : 0;
      const bTime = b.lastEdited ? new Date(b.lastEdited).getTime() : 0;
      return bTime - aTime;
    });
  }, [boards]);

  if (!user) return <Navigate to="/login" replace />;
  if (loading) return <div style={{ color: '#fff', padding: '20px' }}>Loading...</div>;

  const currentTeam = teamFolders.find((f) => String(f.id) === String(teamId));
  if (!teamId || !currentTeam) return null;

  return (
    <div className="flex w-screen h-screen bg-[#0F0F0F] text-white font-suit">
      <Bar
        username={username}
        activePage="team"
        activeFolderId={activeFolderId}
        onAddTeamFolder={() => setShowMakeTeam(true)}
        onSelectFolder={(id) => {
          setActiveFolderId(id);
          navigate(`/team/${id}`, { replace: true });
        }}
      />

      <div className="flex flex-col flex-1 p-6 gap-6">
        <motion.div
          className="flex flex-col gap-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
        >
          <div className="flex items-start gap-4">
            <div onClick={() => navigate('/team', { replace: true })} className="cursor-pointer">
              <BtnBigArrow />
            </div>
            <div className="flex flex-col">
              <h1 className="text-[28px] font-bold text-[#F2F2F2]">{currentTeam.name}</h1>
              {currentTeam.description && (
                <p className="text-[#AEAEAE] text-[16px] mt-1">{currentTeam.description}</p>
              )}
            </div>
          </div>
        </motion.div>

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
            {sortedBoards.map((b, idx) => (
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
                  statusType={b.status || 'before'}
                  lastEdited={b.lastEdited}
                  onOpen={() => navigate(`/team/${currentTeam.id}/${b.id}`)}
                />
              </motion.div>
            ))}

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
            <DashboardMake
              onClose={() => {
                setShowDashboardMake(false);
                setSelectedFolderId(null);
              }}
              onCreate={handleCreateBoard}
            />
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showMakeTeam && (
          <motion.div
            key="makeTeamModal"
            className="fixed inset-0 bg-black/60 flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <FrmMakeTeam
              onClose={() => setShowMakeTeam(false)}
              onSubmit={async (data: { name: string; description: string; members: UiMember[] }) => {
                try {
                  const apiMembers: ApiMember[] = data.members.map((m) => ({
                    email: m.email,
                    role: roleMap[m.role],
                  }));

                  const res = await createTeam({
                    name: data.name,
                    description: data.description,
                    members: apiMembers,
                  });

                  setTeamFolders((prev) => [...prev, res.data]);
                  setShowMakeTeam(false);
                } catch (err) {
                  console.error('팀 생성 실패:', err);
                }
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>

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
