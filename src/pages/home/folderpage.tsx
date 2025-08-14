import { useParams, Navigate, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Bar from '../../components/navi/bar';
import BtnBigArrow from '../../components/btn/btn-big-arrow';
import FrmThumbnailBoard from '../../components/frm/frm-thumbnail-board';
import { useAuth } from '../../utils/AuthContext';
import { loadFolders, saveFolders, foldersKey, type Folder } from '../../utils/storage';
import { MAX_SPACES } from '../../utils/validate';

interface Board {
  id: number;
  name: string;
  // 필요한 필드 추가 가능
}

export default function FolderPage() {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;

  const username = user.username;
  const { folderId } = useParams<{ folderId: string }>();
  const navigate = useNavigate();

  const [folders, setFolders] = useState<Folder[]>([]);
  const [loading, setLoading] = useState(true);

  const [activePage, setActivePage] = useState<'personal' | 'myinfo' | null>(
  folderId ? null : 'personal'
);
  
  useEffect(() => {
    if (folderId) {
      setActivePage(null); // 폴더 페이지 → personal 비활성화
    } else {
      setActivePage('personal'); // personal 페이지 → personal 활성화
    }
  }, [folderId]);

  // 폴더 로드
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
    return null; // 리다이렉트 직전 빈 화면 방지
  }

  const boards: Board[] = (currentFolder as any).boards || [];

  return (
    <div className="flex w-screen h-screen bg-[#0F0F0F] text-white font-suit">
      {/* 네비게이션 바 */}
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
        navigate(`/personal/${id}`);
  }}
      />

      {/* 메인 컨텐츠 */}
      <div className="flex flex-col flex-1 p-6 gap-6">
        {/* 상단 제목 영역 */}
        <div className="flex items-center gap-4">
          <div onClick={() => navigate(-1)} className="cursor-pointer">
            <BtnBigArrow />
          </div>
          <h1
            className="text-[28px] font-bold leading-[135%] tracking-[-0.4px]"
            style={{ color: 'var(--Gray-100, #F2F2F2)', fontFamily: 'SUIT' }}
          >
            {currentFolder.name}
          </h1>
        </div>

        {/* 썸네일 2x2 */}
        <div
          className="grid gap-4 flex-1"
          style={{
            gridTemplateRows: 'repeat(2, minmax(0, 1fr))',
            gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
          }}
        >
          {boards.length === 0 ? (
            <FrmThumbnailBoard connected={false} />
          ) : (
            boards.map((_, idx) => (
              <FrmThumbnailBoard key={idx} connected={true} />
            ))
          )}
        </div>
      </div>
    </div>
  );
}
