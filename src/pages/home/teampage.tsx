import ToastMessage from '../dashboard/toastmessage';
import { useParams, Navigate, useNavigate } from 'react-router-dom';
import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Variants } from 'framer-motion';
import Bar from '../../components/navi/bar';
import BtnBigArrow from '../../components/btn/btn-big-arrow';
import FrmThumbnailBoard from '../../components/frm/frm-thumbnail-board';
import DashboardMake from '../dashboard/dashboardmake';
import FrmMakeTeam from '../../components/frm/frm-maketeam';
import { useAuth } from '../../utils/AuthContext';
import { getTeams, createTeam } from '../../api/teams';
import { getDashboards, createDashboard, deleteDashboard } from '../../api/dashboard';
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

  // Variants (보드 전용)
  const cardVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.3, ease: 'easeOut' },
    },
    exit: { opacity: 0, y: -15, transition: { duration: 0.2, ease: 'easeIn' } },
  };

  const fetchDashboards = async (id: number) => {
    try {
      const dashboards = await getDashboards(id);
      setBoards(dashboards.data || []);
    } catch (err) {
      console.error('대시보드 조회 실패:', err);
    }
  };

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
            await fetchDashboards(Number(teamId));
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
      await createDashboard(Number(teamId), {
        name: boardData.name,
        logPath: boardData.logPath,
      });

      await fetchDashboards(Number(teamId));
      setShowDashboardMake(false);
      setShowToast(true);
    } catch (err) {
      console.error('보드 생성 실패:', err);
    }
  };

  const handleDeleteBoard = async (boardId: number) => {
    if (!teamId) return;
    try {
      setBoards((prev) => prev.filter((b) => b.id !== boardId));
      await deleteDashboard(Number(teamId), boardId);
    } catch (err) {
      console.error('보드 삭제 실패:', err);
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
        {/* 상단 제목 */}
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

        {/* 보드 썸네일들 */}
        <div
          className="grid gap-x-10 gap-y-10 flex-1"
          style={{
            gridTemplateColumns: 'repeat(auto-fill, 640px)',
            gridAutoRows: '372px',
            justifyContent: 'start',
            alignContent: 'start',
          }}
        >
          {/* 보드들 (애니메이션 적용) */}
          <AnimatePresence>
            {!loading &&
              sortedBoards.map((b) => (
                <motion.div
                  key={b.id}
                  layout
                  variants={cardVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                >
                  <FrmThumbnailBoard
                    folderId={Number(currentTeam.id)}
                    boardId={b.id}
                    connected={true}
                    spaceType="team"
                    boardName={b.name}
                    previewPath={`/team/${currentTeam.id}/${b.id}?thumb=1`}
                    statusType={b.status || 'before'}
                    lastEdited={b.lastEdited}
                    onOpen={() => navigate(`/team/${currentTeam.id}/${b.id}`)}
                    onDeleted={() => handleDeleteBoard(b.id)}
                  />
                </motion.div>
              ))}
          </AnimatePresence>

          {/* +카드는 로딩 끝난 후에만 렌더링 */}
          {!loading && (
            <FrmThumbnailBoard
              folderId={Number(currentTeam.id)}
              boardId={0}
              connected={false}
              spaceType="team"
              onAddBoard={() => {
                setSelectedFolderId(Number(currentTeam.id));
                setShowDashboardMake(true);
              }}
            />
          )}
        </div>
      </div>

      {/* DashboardMake 모달 */}
      {showDashboardMake && selectedFolderId != null && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <DashboardMake
            folderId={Number(currentTeam.id)}
            onClose={() => {
              setShowDashboardMake(false);
              setSelectedFolderId(null);
            }}
            onCreate={handleCreateBoard}
          />
        </div>
      )}

      {/* 팀 생성 모달 */}
      {showMakeTeam && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
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
        </div>
      )}

      {/* 토스트 */}
      {showToast && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/60 z-50">
          <ToastMessage onCloseToast={() => setShowToast(false)} />
        </div>
      )}
    </div>
  );
}
