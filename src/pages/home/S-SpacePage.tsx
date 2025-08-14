import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import Bar from '../../components/navi/bar';
import BtnSort from '../../components/btn/btn-sort';
import BtnPoint from '../../components/btn/btn-point';
import FrmFolder from '../../components/frm/frm-folder';
import FrmMakeTeam from '../../components/frm/frm-maketeam';
import FrmTeamEdit from '../../components/frm/frm-teamedit';
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
// 팀별 메타데이터(설명/멤버) 저장 키
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

  // 새 팀 만들기 오버레이
  const [showMakeTeam, setShowMakeTeam] = useState(false);
  const [newTeamId, setNewTeamId] = useState<number | null>(null);

  // 팀 설정 오버레이
  const [showTeamSettings, setShowTeamSettings] = useState(false);
  const [editingTeamId, setEditingTeamId] = useState<number | null>(null);
  const [editInitialName, setEditInitialName] = useState<string>('');
  const [editInitialDesc, setEditInitialDesc] = useState<string>('');
  const [editInitialMembers, setEditInitialMembers] = useState<TeamMember[]>([]);

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

  // 팀 폴더 로드
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
      { id: newId, name: '새 팀', createdAt: now, modifiedAt: now },
    ]);

    setNewTeamId(newId);
    setShowMakeTeam(true);
  };

  const handleDeleteFolder = (id: string | number) => {
    // 폴더 삭제 + 관련 메타데이터 삭제
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

  // 새 팀 만들기 제출: 폴더 이름 반영 + 메타 저장
  const handleMakeTeamSubmit = (data: { name: string; description: string; members: TeamMember[] }) => {
    if (newTeamId != null) {
      handleRenameFolder(newTeamId, data.name);
      const meta: TeamMeta = {
        description: data.description ?? '',
        members: data.members ?? [],
      };
      storage.set(teamMetaKey(username, newTeamId), meta);
    }
    setShowMakeTeam(false);
    setNewTeamId(null);
  };

  // 팀 설정 열기
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

  // 팀 설정 저장하기
  const handleTeamEditSubmit = (data: { name: string; description: string; members: TeamMember[] }) => {
    if (editingTeamId == null) return;
    // 이름 저장
    handleRenameFolder(editingTeamId, data.name);

    // 메타 저장
    const meta: TeamMeta = {
      description: data.description ?? '',
      members: data.members ?? [],
    };
    storage.set(teamMetaKey(username, editingTeamId), meta);

    setShowTeamSettings(false);
    setEditingTeamId(null);
  };

  // 팀 설정에서 "팀 삭제하기"
  const handleTeamDeleteFromEdit = () => {
    if (editingTeamId == null) return;
    handleDeleteFolder(editingTeamId);
    setShowTeamSettings(false);
    setEditingTeamId(null);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -30 }}
      transition={{ duration: 0.4 }}
      className="flex w-screen h-screen bg-[#0F0F0F] text-white font-suit"
    >
      <Bar
        username={username}
        folders={loadFolders(username)}
        teamFolders={folders}
        activePage="team"
        activeFolderId={folderId || null}
        onAddTeamFolder={handleAddFolder}
        onRemoveTeamFolder={handleDeleteFolder}
      />

      <div className="flex flex-col flex-1 px-10 pt-10">
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
              onLeaveTeam={() => handleDeleteFolder(folder.id)} // 임시: 나가기 = 목록 제거
              onClickName={() => navigate(`/team/${folder.id}`)}
            />
          ))}
        </div>
      </div>

      {/* 새 팀 만들기 모달 */}
      {showMakeTeam && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <FrmMakeTeam
            onSubmit={handleMakeTeamSubmit}
            onClose={() => {
              // X 누르면 placeholder 삭제
              if (newTeamId != null) {
                handleDeleteFolder(newTeamId);
                setNewTeamId(null);
              }
              setShowMakeTeam(false);
            }}
          />
        </div>
      )}

      {/* 팀 설정 모달 */}
      {showTeamSettings && editingTeamId != null && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <FrmTeamEdit
            initialName={editInitialName}
            initialDescription={editInitialDesc}
            initialMembers={editInitialMembers}
            onSubmit={handleTeamEditSubmit}
            onClose={() => {
              setShowTeamSettings(false);
              setEditingTeamId(null);
            }}
            onDelete={handleTeamDeleteFromEdit}
          />
        </div>
      )}
    </motion.div>
  );
}
