import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import Bar from '../../components/navi/bar';
import BtnSort from '../../components/btn/btn-sort';
import BtnPoint from '../../components/btn/btn-point';
import FrmFolder from '../../components/frm/frm-folder';
import FrmMakeTeam from '../../components/frm/frm-maketeam';
import FrmTeamEdit from '../../components/frm/frm-teamedit';
import DashboardMake from '../dashboard/dashboardmake';
import { storage, type Folder, loadFolders } from '../../utils/storage';
import { useAuth } from '../../utils/AuthContext';
import { MAX_SPACES } from '../../utils/validate';

type TeamMember = {
  name: string;
  email: string;
  role: 'teamAdmin' | 'member' | 'viewer';
};

type TeamMeta = {
  description: string;
  members: TeamMember[];
};

const teamFoldersKey = (username: string) => `teamFolders:${username}`;
const teamMetaKey = (username: string, teamId: number | string) =>
  `teamMeta:${username}:${teamId}`;

export default function S_SpacePage() {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;

  const username = user.username;
  const navigate = useNavigate();
  const { folderId } = useParams<{ folderId: string }>();

  const [folders, setFolders] = useState<Folder[]>([]);
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest'>('newest');

  const [showMakeTeam, setShowMakeTeam] = useState(false);
  const [newTeamId, setNewTeamId] = useState<number | null>(null);

  const [showTeamSettings, setShowTeamSettings] = useState(false);
  const [editingTeamId, setEditingTeamId] = useState<number | null>(null);
  const [editInitialName, setEditInitialName] = useState<string>('');
  const [editInitialDesc, setEditInitialDesc] = useState<string>('');
  const [editInitialMembers, setEditInitialMembers] = useState<TeamMember[]>([]);

  const [showDashboardMake, setShowDashboardMake] = useState(false);
  const [selectedFolderId, setSelectedFolderId] = useState<number | null>(null);

  useEffect(() => {
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, []);

  const sortFolders = (data: Folder[], order: 'newest' | 'oldest') =>
    [...data].sort((a, b) => {
      const dateA = new Date(a.modifiedAt || a.createdAt || 0).getTime();
      const dateB = new Date(b.modifiedAt || b.createdAt || 0).getTime();
      return order === 'newest' ? dateB - dateA : dateA - dateB;
    });

  const updateFolders = (updater: (prev: Folder[]) => Folder[]) => {
    setFolders((prev) => {
      const candidate = updater(prev);
      if (candidate.length > MAX_SPACES) return prev;
      const sorted = sortFolders(candidate, sortOrder);
      storage.set(teamFoldersKey(username), sorted);
      return sorted;
    });
  };

  useEffect(() => {
    const loaded = storage.get<Folder[]>(teamFoldersKey(username), []);
    setFolders(sortFolders(loaded, sortOrder));
  }, [username, sortOrder]);

  const isValidFolderName = (raw: string) => {
    const name = (raw ?? '').trim();
    return !!name && name !== '새 팀';
  };

  const handleAddFolder = () => {
    if (folders.length >= MAX_SPACES) return;
    const newId = Date.now() + Math.random();
    const now = new Date().toISOString();
    updateFolders((prev) => [
      ...prev,
      { id: newId, name: '새 팀', createdAt: now, modifiedAt: now, spaceType: 'team'},
    ]);
    setNewTeamId(newId);
    setShowMakeTeam(true);
  };

  const handleDeleteFolder = (id: string | number) => {
    storage.remove(teamMetaKey(username, id));
    updateFolders((prev) => prev.filter((f) => f.id !== Number(id)));
  };

  const handleRenameFolder = (id: number, newName: string) => {
    if (!isValidFolderName(newName)) return;
    updateFolders((prev) =>
      prev.map((f) =>
        f.id === id
          ? { ...f, name: newName.trim(), modifiedAt: new Date().toISOString() }
          : f
      )
    );
  };

  const handleMakeTeamSubmit = (data: { name: string; description: string; members: TeamMember[] }) => {
    if (newTeamId != null) {
      updateFolders((prev) =>
        prev.map((f) =>
          f.id === newTeamId
            ? {
                ...f,
                name: data.name,
                description: data.description,
                modifiedAt: new Date().toISOString(),
              }
            : f
        )
      );
      const meta: TeamMeta = {
        description: data.description ?? '',
        members: data.members ?? [],
      };
      storage.set(teamMetaKey(username, newTeamId), meta);
    }
    setShowMakeTeam(false);
    setNewTeamId(null);
  };

  const openTeamSettings = (teamId: number, teamName: string) => {
    const meta = storage.get<TeamMeta>(teamMetaKey(username, teamId), {
      description: '',
      members: [],
    });
    setEditingTeamId(teamId);
    setEditInitialName(teamName);
    setEditInitialDesc(meta.description || '');
    setEditInitialMembers(meta.members || []);
    setShowTeamSettings(true);
  };

  const handleTeamEditSubmit = (data: { name: string; description: string; members: TeamMember[] }) => {
    if (editingTeamId == null) return;

    updateFolders((prev) =>
      prev.map((f) =>
        f.id === editingTeamId
          ? {
              ...f,
              name: data.name,
              description: data.description,
              modifiedAt: new Date().toISOString(),
            }
          : f
      )
    );

    const meta: TeamMeta = {
      description: data.description ?? '',
      members: data.members ?? [],
    };
    storage.set(teamMetaKey(username, editingTeamId), meta);

    setShowTeamSettings(false);
    setEditingTeamId(null);
  };

  const handleTeamDeleteFromEdit = () => {
    if (editingTeamId == null) return;
    handleDeleteFolder(editingTeamId);
    setShowTeamSettings(false);
    setEditingTeamId(null);
  };

  return (
    <div className="flex w-screen h-screen bg-[#0F0F0F] text-white font-suit overflow-hidden">
      <Bar
        username={username}
        folders={loadFolders(username)}
        teamFolders={folders}
        activePage="team"
        activeFolderId={folderId || null}
        onAddTeamFolder={handleAddFolder}
        onRemoveTeamFolder={handleDeleteFolder}
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
            {folders.length}개 팀 참여중
          </span>
        </div>

        <div className="flex gap-[12px] mt-[28px]">
          <BtnSort onSortChange={(order) => setSortOrder(order)} />
          <BtnPoint onClick={handleAddFolder}>새 팀 추가 +</BtnPoint>
        </div>

        <div className="grid grid-cols-[repeat(auto-fill,_minmax(371px,_1fr))] gap-x-[0px] gap-y-[48px] mt-[28px]">
          {folders.map((folder) => (
            <FrmFolder
              key={folder.id}
              spaceType="team"
              name={folder.name}
              onOpenTeamSettings={() => openTeamSettings(Number(folder.id), folder.name)}
              onLeaveTeam={() => handleDeleteFolder(folder.id)}
              onClickName={() => navigate(`/team/${folder.id}`)}
              onAddBoard={() => {
                setSelectedFolderId(Number(folder.id));
                setShowDashboardMake(true);
              }}
            />
          ))}
        </div>
      </motion.div>

      <AnimatePresence>
        {/* 팀 만들기 모달 */}
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
                onSubmit={handleMakeTeamSubmit}
                onClose={() => {
                  if (newTeamId != null) {
                    handleDeleteFolder(newTeamId);
                    setNewTeamId(null);
                  }
                  setShowMakeTeam(false);
                }}
              />
            </motion.div>
          </motion.div>
        )}

        {/* 팀 설정 모달 */}
        {showTeamSettings && editingTeamId != null && (
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
                initialName={editInitialName}
                initialDescription={editInitialDesc}
                initialMembers={editInitialMembers}
                currentRole="teamAdmin"
                onSubmit={handleTeamEditSubmit}
                onClose={() => {
                  setShowTeamSettings(false);
                  setEditingTeamId(null);
                }}
                onDelete={handleTeamDeleteFromEdit}
                onLeaveTeam={() => {
                  if (editingTeamId != null) {
                    handleDeleteFolder(editingTeamId);
                    setShowTeamSettings(false);
                    setEditingTeamId(null);
                  }
                }}
              />
            </motion.div>
          </motion.div>
        )}

        {/* DashboardMake 모달 */}
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
                onClose={() => setShowDashboardMake(false)}
                onCreate={(board) => {
                  updateFolders((prev) =>
                    prev.map((f) =>
                      f.id === selectedFolderId
                        ? { ...f, boards: [...(f.boards || []), board] }
                        : f
                    )
                  );
                  setShowDashboardMake(false);
                }}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
