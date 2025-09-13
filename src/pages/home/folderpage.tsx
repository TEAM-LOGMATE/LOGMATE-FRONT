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
import { getDashboards, createDashboard } from '../../api/dashboard';
import { useFolderStore } from '../../utils/folderStore';

interface Board {
  id: number;
  name: string;
  logPath?: string;
  sendTo?: string;
  lastModified?: string;
  status?: 'collecting' | 'unresponsive' | 'before';
}

interface NewBoard {
  name: string;
  logPath: string;
  sendTo: string;
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
  const [boards, setBoards] = useState<Board[]>([]);
  const [activePage, setActivePage] = useState<'personal' | 'myinfo' | 'team'>('personal');

  const [isDashboardMakeOpen, setIsDashboardMakeOpen] = useState(false);
  const [showToast, setShowToast] = useState(false);

  const fetchDashboards = async () => {
    if (!user || !folderId) return;
    try {
      const dashboards = await getDashboards(Number(folderId));
      setBoards(dashboards.data || []);
    } catch (err) {
      console.error('대시보드 조회 실패:', err);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!user || !folderId) return;

        const data = await getPersonalFolders(user.id);
        setFolders(
          (data || []).map((f: any) => ({
            id: f.id,
            name: f.name,
            boards: f.boards || [],
            spaceType: 'personal' as const,
          }))
        );

        await fetchDashboards();
      } catch (err) {
        console.error('폴더/대시보드 조회 실패:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user, folderId, setFolders]);

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

  const handleAddBoard = async (board: NewBoard) => {
    try {
      await createDashboard(Number(folderId), {
        name: board.name,
        logPath: board.logPath,
        sendTo: board.sendTo,
      });
      await fetchDashboards(); // 전체 다시 불러오기
      setShowToast(true);
    } catch (err) {
      console.error('대시보드 생성 실패:', err);
    }
  };

  const handleDeleteBoard = (boardId: number) => {
    setBoards((prev) => prev.filter((b) => b.id !== boardId));
  };

  return (
    <div className="flex w-screen h-screen bg-[#0F0F0F] text-white font-suit overflow-y-auto">
      <Bar
        username={username}
        onAddFolder={() => {
          if (folders.length < MAX_SPACES) {
            setFolders((prev) => [
              ...prev,
              { id: Date.now(), name: '새 폴더', boards: [], spaceType: 'personal' as const },
            ]);
          }
        }}
        onRemoveFolder={() => setFolders((prev) => prev.slice(0, -1))}
        activePage="personal"
        activeFolderId={folderId ? Number(folderId) : null}
        onSelectPage={(page) => {
          if (page) setActivePage(page);
        }}
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
                folderId={Number(folderId)}
                boardId={board.id}
                connected={true}
                boardName={board.name}
                onDeleted={() => handleDeleteBoard(board.id)}
                onOpen={() => navigate(`/personal/${folderId}/${board.id}`)}
                previewPath={`/personal/${folderId}/${board.id}?thumb=1`}
                statusType={board.status || 'before'}
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
              folderId={Number(folderId)} // 더미 값
              boardId={0} // 더미 값
              connected={false}
              onAddBoard={() => setIsDashboardMakeOpen(true)}
            />
          </motion.div>
        </div>
      </div>

      {/* DashboardMake 모달 */}
      {isDashboardMakeOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="absolute inset-0 bg-black/50" onClick={() => setIsDashboardMakeOpen(false)} />
          <div className="relative z-10" onClick={(e) => e.stopPropagation()}>
            <DashboardMake
              folderId={Number(folderId)}
              onClose={() => setIsDashboardMakeOpen(false)}
              onCreate={(board: NewBoard) => {
                handleAddBoard(board);
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
