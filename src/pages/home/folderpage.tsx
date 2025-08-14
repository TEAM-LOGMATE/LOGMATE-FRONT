import { useParams, Navigate, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Bar from '../../components/navi/bar';
import BtnBigArrow from '../../components/btn/btn-big-arrow';
import FrmThumbnailBoard from '../../components/frm/frm-thumbnail-board';
import { useAuth } from '../../utils/AuthContext';
import { loadFolders, saveFolders, foldersKey, type Folder } from '../../utils/storage';
import { MAX_SPACES } from '../../utils/validate';

interface Board {
  id: number;
  name: string;
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
            // 히스토리 길이가 1 이하이면 이전 페이지가 없는 경우 → 기본 경로로 이동
            if (window.history.length <= 1) {
              navigate('/personal', { replace: true });
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
          {currentFolder.name}
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
            boards.map((_, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{
                  duration: 0.3,
                  delay: idx * 0.05,
                }}
              >
                <FrmThumbnailBoard connected={true} />
              </motion.div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
