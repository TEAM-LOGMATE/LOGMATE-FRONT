import { useParams, Navigate, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Bar from '../../components/navi/bar';
import BtnBigArrow from '../../components/btn/btn-big-arrow';
import FrmThumbnailBoard from '../../components/frm/frm-thumbnail-board';
import DashboardMake from '../dashboard/dashboardmake';
import { useAuth } from '../../utils/AuthContext';
import { loadFolders, saveFolders, foldersKey, type Folder } from '../../utils/storage';
import { MAX_SPACES } from '../../utils/validate';

interface Board {
  id: number;
  name: string;
  logPath?: string;
}

export default function FolderPage() {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;

  const username = user.username;
  const { folderId } = useParams<{ folderId: string }>();
  const navigate = useNavigate();

  const [folders, setFolders] = useState<Folder[]>([]);
  const [loading, setLoading] = useState(true);

  const [activePage, setActivePage] = useState<'personal' | 'myinfo' | 'team' | null>(
    folderId ? null : 'personal'
  );

  const [isDashboardMakeOpen, setIsDashboardMakeOpen] = useState(false);

  useEffect(() => {
    if (folderId) {
      setActivePage(null);
    } else {
      setActivePage('personal');
    }
  }, [folderId]);

  useEffect(() => {
    const loaded = loadFolders(username);
    setFolders(loaded);
    setLoading(false);
  }, [username]);

  useEffect(() => {
    const key = foldersKey(username);
    const onStorage = (e: StorageEvent) => {
      if (e.key !== key) return;
      setFolders(loadFolders(username));
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, [username]);

  const updateFolders = (updater: (prev: Folder[]) => Folder[]) => {
    setFolders((prev) => {
      const candidate = updater(prev);
      if (candidate.length > MAX_SPACES) return prev;
      saveFolders(username, candidate);
      return candidate;
    });
  };

  const handleAddFolder = () => {
    updateFolders((prev) => [
      ...prev,
      { id: Date.now() + Math.random(), name: '새 폴더', boards: [] as Board[] },
    ]);
  };

  const handleRemoveFolder = () => {
    updateFolders((prev) => prev.slice(0, -1));
  };

  const currentFolder = folders.find((f) => String(f.id) === String(folderId));

  useEffect(() => {
    if (!loading && folders.length > 0 && folderId && !currentFolder) {
      navigate('/personal');
    }
  }, [loading, folders, folderId, currentFolder, navigate]);

  if (loading) {
    return <div style={{ color: '#fff', padding: '20px' }}>Loading...</div>;
  }

  if (!folderId || !currentFolder) {
    return null;
  }

  const boards: Board[] = (currentFolder as any).boards || [];

  // 새 보드 추가
  const handleAddBoard = (board: Board) => {
    updateFolders((prev) =>
      prev.map((folder) =>
        folder.id === currentFolder.id
          ? { ...folder, boards: [...(folder.boards || []), board] }
          : folder
      )
    );
  };

  // 보드 삭제
  const handleDeleteBoard = (boardId: number) => {
    updateFolders((prev) =>
      prev.map((folder) =>
        folder.id === currentFolder.id
          ? { ...folder, boards: (folder.boards || []).filter((b) => b.id !== boardId) }
          : folder
      )
    );
  };

  return (
    <div className="flex w-screen h-screen bg-[#0F0F0F] text-white font-suit">
      <Bar
        username={username}
        folders={folders}
        onAddFolder={handleAddFolder}
        onRemoveFolder={handleRemoveFolder}
        activePage={activePage}
        activeFolderId={folderId}
        onSelectPage={(page) => setActivePage(page)}
        onSelectFolder={(id) => {
          setActivePage(null);
          navigate(`/personal/${id}`, { replace: true });
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
              navigate('/personal', { replace: true });
            }}
            className="cursor-pointer"
          >
            <BtnBigArrow />
          </div>
          <h1
            className="text-[28px] font-bold leading-[135%] tracking-[-0.4px]"
            style={{ color: 'var(--Gray-100, #F2F2F2)', fontFamily: 'SUIT' }}
          >
            {currentFolder.name}
          </h1>
        </motion.div>

        {/* 썸네일 영역 */}
        <div
          className="grid gap-x-10 gap-y-10 flex-1"
          style={{
            gridTemplateColumns: 'repeat(auto-fill, 640px)',
            gridAutoRows: '372px',
            justifyContent: 'start',
            alignContent: 'start',
          }}
        >
          {boards.map((board, idx) => (
            <motion.div
              key={board.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{
                duration: 0.3,
                delay: idx * 0.05,
              }}
            >
              <FrmThumbnailBoard
                connected={true}
                boardName={board.name}
                onDelete={() => handleDeleteBoard(board.id)}
                onOpen={() => navigate(`/personal/${folderId}/${board.id}`)}
              />
            </motion.div>
          ))}

          {/* 마지막에 항상 + 썸네일 */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <FrmThumbnailBoard
              connected={false}
              onAddBoard={() => setIsDashboardMakeOpen(true)}
            />
          </motion.div>
        </div>
      </div>

      {/* DashboardMake 모달 */}
      {isDashboardMakeOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          {/* 배경 (어두운 레이어) */}
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setIsDashboardMakeOpen(false)}
          />

          {/* 모달 본체 */}
          <div className="relative z-10">
            <DashboardMake
              onClose={() => setIsDashboardMakeOpen(false)}
              onCreate={(board) => {
                handleAddBoard(board);
                setIsDashboardMakeOpen(false);
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
