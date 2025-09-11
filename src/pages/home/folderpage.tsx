import { useParams, Navigate, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Bar from '../../components/navi/bar';
import BtnBigArrow from '../../components/btn/btn-big-arrow';
import FrmThumbnailBoard from '../../components/frm/frm-thumbnail-board';
import DashboardMake from '../dashboard/dashboardmake';
import ToastMessage from '../dashboard/toastmessage';
import { useAuth } from '../../utils/AuthContext';
import { MAX_SPACES } from '../../utils/validate';
import { getPersonalFolders } from '../../api/folders';
import { useFolderStore } from '../../utils/folderStore';

// 개인 스페이스 보드 타입
interface Board {
  id: number;
  name: string;
  logPath?: string;
  status?: 'collecting' | 'unresponsive' | 'before';
}

export default function FolderPage() {
  const { isLoading, isAuthed, user } = useAuth();
  if (isLoading) return null;
  if (!isAuthed || !user) return <Navigate to="/login" replace />;

  const username = user.username;
  const { folderId } = useParams<{ folderId: string }>();
  const navigate = useNavigate();

  const { folders, setFolders } = useFolderStore();

  const [loading, setLoading] = useState(true);
  const [activePage, setActivePage] = useState<'personal' | 'myinfo' | 'team' | null>(
    folderId ? 'personal' : 'personal'
  );

  const [isDashboardMakeOpen, setIsDashboardMakeOpen] = useState(false);
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    const fetchFolders = async () => {
      try {
        if (!user) return;
        const data = await getPersonalFolders(user.id);
        setFolders(
          (data || []).map((f: any) => ({
            id: f.id,
            name: f.name,
            boards: f.boards || [],
            spaceType: 'personal' as const,
          }))
        );
      } catch (err) {
        console.error('개인 폴더 조회 실패:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchFolders();
  }, [user, setFolders]);

  // 폴더 추가
  const handleAddFolder = () => {
    setFolders((prev) => {
      if (prev.length >= MAX_SPACES) return prev;
      return [
        ...prev,
        {
          id: Date.now(),
          name: '새 폴더',
          boards: [],
          spaceType: 'personal' as const,
        },
      ];
    });
  };

  // 폴더 삭제
  const handleRemoveFolder = () => {
    setFolders((prev) => prev.slice(0, -1));
  };

  const currentFolder = folders.find((f) => String(f.id) === String(folderId));

  // 무한 루프 방지: 없는 폴더 접근 시 personal로 이동
  useEffect(() => {
    if (!loading && folders.length > 0 && folderId && !currentFolder) {
      if (window.location.pathname !== '/personal') {
        navigate('/personal');
      }
    }
  }, [loading, folders, folderId, currentFolder, navigate]);

  if (loading) {
    return <div style={{ color: '#fff', padding: '20px' }}>Loading...</div>;
  }

  if (!folderId || !currentFolder) {
    return null;
  }

  const boards: Board[] = currentFolder.boards || [];

  // 보드 추가
  const handleAddBoard = (board: Board) => {
    setFolders((prev) =>
      prev.map((folder) =>
        folder.id === currentFolder.id
          ? {
              ...folder,
              boards: [
                ...(folder.boards || []),
                {
                  ...board,
                  status: 'collecting',
                },
              ],
            }
          : folder
      )
    );
    setShowToast(true);
  };

  // 보드 삭제
  const handleDeleteBoard = (boardId: number) => {
    setFolders((prev) =>
      prev.map((folder) =>
        folder.id === currentFolder.id
          ? {
              ...folder,
              boards: (folder.boards || []).filter((b) => b.id !== boardId),
            }
          : folder
      )
    );
  };

  return (
    <div className="flex w-screen h-screen bg-[#0F0F0F] text-white font-suit overflow-y-auto">
      <Bar
        username={username}
        onAddFolder={handleAddFolder}
        onRemoveFolder={handleRemoveFolder}
        activePage="personal"
        activeFolderId={folderId ? Number(folderId) : null}
        onSelectPage={(page) => setActivePage(page)}
        onSelectFolder={(id) => {
          setActivePage('personal');
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
          <div onClick={() => navigate('/personal', { replace: true })} className="cursor-pointer">
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
              transition={{ duration: 0.3, delay: idx * 0.05 }}
            >
              <FrmThumbnailBoard
                boardId={board.id}
                connected={true}
                boardName={board.name}
                onDelete={() => handleDeleteBoard(board.id)}
                onOpen={() => navigate(`/personal/${folderId}/${board.id}`)}
                previewPath={`/personal/${folderId}/${board.id}?thumb=1`}
                statusType={board.status}
              />
            </motion.div>
          ))}

          {/* 마지막에 항상 + 썸네일 */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <FrmThumbnailBoard connected={false} onAddBoard={() => setIsDashboardMakeOpen(true)} />
          </motion.div>
        </div>
      </div>

      {/* DashboardMake 모달 */}
      {isDashboardMakeOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="absolute inset-0 bg-black/50" onClick={() => setIsDashboardMakeOpen(false)} />
          <div className="relative z-10" onClick={(e) => e.stopPropagation()}>
            <DashboardMake
              onClose={() => setIsDashboardMakeOpen(false)}
              onCreate={(board) => {
                handleAddBoard({ ...board, status: 'collecting' });
                setIsDashboardMakeOpen(false);
              }}
            />
          </div>
        </div>
      )}

      {/* ToastMessage 모달 */}
      {showToast && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/60 z-50">
          <ToastMessage onCloseToast={() => setShowToast(false)} />
        </div>
      )}
    </div>
  );
}
