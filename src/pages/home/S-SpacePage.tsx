import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Variants } from 'framer-motion';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import Bar from '../../components/navi/bar';
import BtnSort from '../../components/btn/btn-sort';
import BtnPoint from '../../components/btn/btn-point';
import FrmFolder from '../../components/frm/frm-folder';
import FrmMakeTeam from '../../components/frm/frm-maketeam';
import FrmTeamEdit from '../../components/frm/frm-teamedit';
import DashboardMake from '../dashboard/dashboardmake';
import { useAuth } from '../../utils/AuthContext';
import { getTeams, createTeam, updateTeam, deleteTeam, getTeamFolders } from '../../api/teams';
import { createDashboard } from '../../api/dashboard';
import type { Team, UiMember, UiRole, ApiMember, ApiRole } from '../../utils/type';
import { useFolderStore } from '../../utils/folderStore';

const toApiRole = (role: UiRole): ApiRole =>
  role === 'teamAdmin' ? 'ADMIN' : role === 'member' ? 'MEMBER' : 'VIEWER';

export default function S_SpacePage() {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;

  const username = user.username;
  const navigate = useNavigate();
  const { folderId } = useParams<{ folderId: string }>();

  const {
    teamFolders: teams,
    setTeamFolders,
    teamSortOrder,
    setTeamSortOrder,
  } = useFolderStore();

  const [showMakeTeam, setShowMakeTeam] = useState(false);
  const [showTeamSettings, setShowTeamSettings] = useState(false);
  const [editingTeam, setEditingTeam] = useState<Team | null>(null);
  const [myRole, setMyRole] = useState<UiRole>('viewer');
  const [showDashboardMake, setShowDashboardMake] = useState(false);
  const [selectedFolderId, setSelectedFolderId] = useState<number | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // 팀 + 팀 폴더 불러오기
  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const res = await getTeams();

        const teamsWithFolders = await Promise.all(
          res.map(async (t: any) => {
            try {
              const folders = await getTeamFolders(t.id);
              return { ...t, boards: folders, spaceType: 'team' };
            } catch (e) {
              console.error(`팀 ${t.id} 폴더 불러오기 실패:`, e);
              return { ...t, boards: [], spaceType: 'team' };
            }
          })
        );

        setTeamFolders(teamsWithFolders);
      } catch (err) {
        console.error('팀 불러오기 실패:', err);
      }
    };
    fetchTeams();
  }, [setTeamFolders, teamSortOrder]);

  // 팀 삭제 (= 팀 나가기)
  const handleDeleteTeam = async (id: string | number) => {
    try {
      await deleteTeam(Number(id));
      setTeamFolders((prev) => prev.filter((t) => t.id !== Number(id)));
    } catch (err) {
      console.error('팀 삭제 실패:', err);
    }
  };

  // 팀 수정
  const handleTeamEditSubmit = async (data: {
    name: string;
    description: string;
    members: UiMember[];
  }) => {
    if (!editingTeam) return;
    try {
      const apiMembers: ApiMember[] = data.members.map((m) => ({
        email: m.email,
        role: toApiRole(m.role),
      }));

      const updated = await updateTeam(editingTeam.id, {
        name: data.name,
        description: data.description,
        members: apiMembers,
      });

      setTeamFolders((prev) =>
        prev.map((t) =>
          t.id === editingTeam.id
            ? { ...t, ...data, ...updated, spaceType: 'team' }
            : t
        )
      );
      setShowTeamSettings(false);
      setEditingTeam(null);
    } catch (err) {
      console.error('팀 수정 실패:', err);
    }
  };

  // 팀 설정 열기
  const openTeamSettings = (team: Team) => {
    setEditingTeam(team);

    const myMember = (team.members || []).find((m: any) => m.email === user.email);
    const myRole = myMember ? (myMember.role.toLowerCase() as UiRole) : 'viewer';
    setMyRole(myRole);

    setShowTeamSettings(true);
  };

  const folderVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.3, ease: 'easeOut' },
    },
    exit: { opacity: 0, y: -15, transition: { duration: 0.2, ease: 'easeIn' } },
  };

  return (
    <div className="flex w-screen h-screen bg-[#0F0F0F] text-white font-suit overflow-hidden">
      <Bar
        username={username}
        activePage="team"
        activeFolderId={folderId || null}
        onAddTeamFolder={() => setShowMakeTeam(true)}
        onRemoveTeamFolder={handleDeleteTeam}
      />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -30 }}
        transition={{ duration: 0.4 }}
        className="flex flex-col flex-1 px-10 pt-10"
      >
        <div className="relative flex items-start w-fit">
          <h1 className="text-[28px] font-bold text-[#F2F2F2]">팀 스페이스</h1>
          <span className="absolute left-[calc(100%+16px)] top-[7px] text-[16px] text-[#888] whitespace-nowrap">
            {teams.length}개 팀 참여중
          </span>
        </div>

        <div className="flex gap-[12px] mt-[28px]">
          <BtnSort
            spaceType="team"
            order={teamSortOrder}
            onSortChange={setTeamSortOrder}
          />
          <BtnPoint onClick={() => setShowMakeTeam(true)}>새 팀 추가 +</BtnPoint>
        </div>

        {/* 팀 리스트 */}
        <motion.div
          layout
          className="grid grid-cols-[repeat(auto-fill,_minmax(371px,_1fr))] gap-x-[0px] gap-y-[48px] mt-[28px] overflow-visible"
        >
          <AnimatePresence>
            {teams.map((team) => (
              <motion.div
                key={team.id}
                layout
                style={{ overflow: 'visible' }}
                variants={folderVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
              >
                <FrmFolder
                  spaceType="team"
                  name={team.name}
                  onOpenTeamSettings={() => openTeamSettings(team)}
                  onLeaveTeam={() => handleDeleteTeam(team.id)}
                  onClickName={() => navigate(`/team/${team.id}`)}
                  // boards={(team as any).boards || []}   // 썸네일/뱃지 기능 미구현
                  onAddBoard={() => {
                    setSelectedFolderId(Number(team.id));
                    setShowDashboardMake(true);
                  }}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </motion.div>

      {/* 팀 생성 모달 */}
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
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: -20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            >
              <FrmMakeTeam
                onSubmit={async (data) => {
                  try {
                    const apiMembers: ApiMember[] = [
                      { email: user.email, role: 'ADMIN' },
                      ...data.members.map((m) => ({
                        email: m.email,
                        role: toApiRole(m.role),
                      })),
                    ];

                    const newTeam = await createTeam({
                      name: data.name,
                      description: data.description,
                      members: apiMembers,
                    });

                    setTeamFolders((prev) => [
                      ...prev,
                      { ...newTeam.data, spaceType: 'team', boards: [] },
                    ]);
                    setShowMakeTeam(false);
                  } catch (err: any) {
                    console.error('팀 생성 실패:', err);
                    const msg =
                      err?.response?.data?.message ||
                      '팀 생성 중 오류가 발생했습니다.';
                    setErrorMessage(msg);
                    setTimeout(() => setErrorMessage(null), 3000);
                  }
                }}
                onClose={() => setShowMakeTeam(false)}
                errorMessage={errorMessage}
                onErrorClear={() => setErrorMessage(null)}
              />
            </motion.div>
          </motion.div>
        )}

        {showTeamSettings && editingTeam && (
          <motion.div
            key="teamSettingsModal"
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
              <FrmTeamEdit
                teamId={editingTeam.id}
                onSubmit={handleTeamEditSubmit}
                onClose={() => {
                  setShowTeamSettings(false);
                  setEditingTeam(null);
                }}
                onDelete={() => handleDeleteTeam(editingTeam.id)}
                onLeaveTeam={() => handleDeleteTeam(editingTeam.id)}
              />
            </motion.div>
          </motion.div>
        )}

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
              folderId={selectedFolderId}
              onClose={() => {
                setShowDashboardMake(false);
                setSelectedFolderId(null);
              }}
              onCreate={async (board) => {
                try {
                  const res = await createDashboard(selectedFolderId, {
                    name: board.name,
                    logPath: board.logPath,
                  });
                  setTeamFolders((prev) =>
                    prev.map((team) =>
                      team.id === selectedFolderId
                        ? { ...team, boards: [...(team.boards || []), res.data] }
                        : team
                    )
                  );
                  setShowDashboardMake(false);
                } catch (err) {
                  console.error('팀 대시보드 생성 실패:', err);
                }
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
