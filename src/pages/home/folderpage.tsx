import ToastMessage from '../dashboard/toastmessage';
import { useParams, Navigate, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Variants } from 'framer-motion';
import Bar from '../../components/navi/bar';
import BtnBigArrow from '../../components/btn/btn-big-arrow';
import FrmThumbnailBoard from '../../components/frm/frm-thumbnail-board';
import DashboardMake from '../dashboard/dashboardmake';
import { useAuth } from '../../utils/AuthContext';
import { MAX_SPACES } from '../../utils/validate';
import { getPersonalFolders } from '../../api/folders';
import { getDashboards, createDashboard, saveDashboardConfig } from '../../api/dashboard';
import { useFolderStore } from '../../utils/folderStore';

interface Board {
  id: number;
  name: string;
  logPath?: string;
  lastModified?: string;
  status?: 'collecting' | 'unresponsive' | 'before';
}

interface NewBoard {
  name: string;
  logPath: string;
  advancedConfig?: any;
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
  const [createdAgentId, setCreatedAgentId] = useState<string | null>(null);

  const cardVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.3, ease: 'easeOut' },
    },
    exit: { opacity: 0, y: -15, transition: { duration: 0.2, ease: 'easeIn' } },
  };

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

  useEffect(() => {
    if (!loading && folders.length > 0 && folderId && !currentFolder) {
      if (window.location.pathname !== '/personal') {
        navigate('/personal');
      }
    }
  }, [loading, folders, folderId, currentFolder, navigate]);

  if (!folderId || !currentFolder) {
    return null;
  }

  const handleAddBoard = async (board: NewBoard) => {
    try {
      const created = await createDashboard(Number(folderId), {
        name: board.name,
        logPath: board.logPath,
      });

      const dashboardId = created?.data?.id;
      if (!dashboardId) throw new Error('대시보드 ID를 가져오지 못했습니다.');

      if (board.advancedConfig) {
        const configRes = await saveDashboardConfig(Number(folderId), dashboardId, board.advancedConfig);
        const agentId = configRes?.data?.agentId;
        setCreatedAgentId(agentId);
      }

      await fetchDashboards();

      setIsDashboardMakeOpen(false);
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

      <div className="flex flex-col flex-1 p-6 gap-6">
        <motion.div
          className="flex items-center gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
        >
          <div onClick={() => navigate('/personal', { replace: true })} className="cursor-pointer">
            <BtnBigArrow />
          </div>
          <h1 className="text-[28px] font-bold" style={{ color: '#F2F2F2', fontFamily: 'SUIT' }}>
            {currentFolder.name}
          </h1>
        </motion.div>

        <motion.div
          layout
          className="grid gap-x-10 gap-y-10 flex-1"
          style={{
            gridTemplateColumns: 'repeat(auto-fill, 640px)',
            gridAutoRows: '372px',
            justifyContent: 'start',
            alignContent: 'start',
          }}
        >
          <AnimatePresence>
            {!loading &&
              boards.map((board) => (
                <motion.div key={board.id} layout variants={cardVariants} initial="hidden" animate="visible" exit="exit">
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
          </AnimatePresence>

          {!loading && (
            <FrmThumbnailBoard
              folderId={Number(folderId)}
              boardId={0}
              connected={false}
              onAddBoard={() => setIsDashboardMakeOpen(true)}
            />
          )}
        </motion.div>
      </div>

      {/* DashboardMake 모달 */}
      <AnimatePresence>
        {isDashboardMakeOpen && (
          <motion.div
            className="fixed inset-0 flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* 배경 */}
            <motion.div
              className="absolute inset-0 bg-black/50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsDashboardMakeOpen(false)}
            />
            {/* 모달 */}
            <motion.div
              className="relative z-10"
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              onClick={(e) => e.stopPropagation()}
            >
              <DashboardMake folderId={Number(folderId)} onCreate={(board: NewBoard) => handleAddBoard(board)} />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {showToast && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/60 z-50">
          <ToastMessage agentId={createdAgentId} onCloseToast={() => setShowToast(false)} />
        </div>
      )}
    </div>
  );
}
