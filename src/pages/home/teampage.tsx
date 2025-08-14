// src/pages/team/TeamPage.tsx
import { useParams, Navigate, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Bar from '../../components/navi/bar';
import BtnBigArrow from '../../components/btn/btn-big-arrow';
import FrmThumbnailBoard from '../../components/frm/frm-thumbnail-board';
import { useAuth } from '../../utils/AuthContext';
import { loadFolders, storage, type Folder } from '../../utils/storage';
import { MAX_SPACES } from '../../utils/validate';

interface Board {
  id: number;
  name: string;
}

const teamFoldersKey = (username: string) => `teamFolders:${username}`;

export default function TeamPage() {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;

  const username = user.username;
  const { teamId } = useParams<{ teamId: string }>();
  const navigate = useNavigate();

  const [teamFolders, setTeamFolders] = useState<Folder[]>([]);
  const [loading, setLoading] = useState(true);

  // 팀 폴더 로드
  useEffect(() => {
    const loaded = storage.get<Folder[]>(teamFoldersKey(username), []);
    setTeamFolders(loaded);
    setLoading(false);
  }, [username]);

  // storage 변경 감지
  useEffect(() => {
    const key = teamFoldersKey(username);
    const onStorage = (e: StorageEvent) => {
      if (e.key !== key) return;
      const loaded = storage.get<Folder[]>(teamFoldersKey(username), []);
      setTeamFolders(loaded);
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, [username]);

  const updateTeamFolders = (updater: (prev: Folder[]) => Folder[]) => {
    setTeamFolders((prev) => {
      const candidate = updater(prev);
      if (candidate.length > MAX_SPACES) return prev;
      storage.set(teamFoldersKey(username), candidate);
      return candidate;
    });
  };

  const handleAddTeamFolder = () => {
    updateTeamFolders((prev) => [
      ...prev,
      { id: Date.now() + Math.random(), name: '새 팀', boards: [] as Board[] },
    ]);
  };

  const handleRemoveTeamFolder = () => {
    updateTeamFolders((prev) => prev.slice(0, -1));
  };

  const currentTeam = teamFolders.find((f) => String(f.id) === String(teamId));

  useEffect(() => {
    if (!loading && teamId && !currentTeam) {
      navigate('/team');
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
      {/* Bar: 애니메이션 없음 */}
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

      {/* 메인 컨텐츠 */}
      <div className="flex flex-col flex-1 p-6 gap-6">
        {/* 상단 제목 영역 */}
        <motion.div
          className="flex items-center gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
        >
          <div
            onClick={() => {
              if (window.history.length <= 1) {
                navigate('/team', { replace: true });
              } else {
                navigate(-1);
              }
            }}
            className="cursor-pointer"
          >
            <BtnBigArrow />
          </div>
          <h1
            className="text-[28px] font-bold leading-[135%] tracking-[-0.4px]"
            style={{ color: 'var(--Gray-100, #F2F2F2)', fontFamily: 'SUIT' }}
          >
            {currentTeam.name}
          </h1>
        </motion.div>

        {/* 썸네일 2x2 */}
        <div
          className="grid gap-4 flex-1"
          style={{
            gridTemplateRows: 'repeat(2, minmax(0, 1fr))',
            gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
          }}
        >
          {boards.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              <FrmThumbnailBoard connected={false} />
            </motion.div>
          ) : (
            boards.map((b, idx) => (
              <motion.div
                key={b.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{
                  duration: 0.3,
                  delay: idx * 0.05,
                }}
              >
                <FrmThumbnailBoard connected />
              </motion.div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
