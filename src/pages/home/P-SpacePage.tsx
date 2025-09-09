// src/pages/home/P_SpacePage.tsx
import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Variants } from 'framer-motion';
import { Navigate, useNavigate } from 'react-router-dom';
import Bar from '../../components/navi/bar';
import BtnSort from '../../components/btn/btn-sort';
import BtnPoint from '../../components/btn/btn-point';
import FrmFolder from '../../components/frm/frm-folder';
import { useAuth } from '../../utils/AuthContext';
import { MAX_SPACES } from '../../utils/validate';

// API
import { createPersonalFolder, getPersonalFolders, deleteFolder, updateFolder } from '../../api/folders';

// Folder/Board 타입 정의
interface Board {
  id: number;
  name: string;
  logPath?: string;
  status?: 'collecting' | 'unresponsive' | 'before';
}

interface Folder {
  id: number;
  name: string;
  createdAt?: string;
  modifiedAt?: string;
  spaceType: 'personal';
  boards?: Board[];
}

export default function P_SpacePage() {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;

  const username = user.username;
  const navigate = useNavigate();

  const [folders, setFolders] = useState<Folder[]>([]);
  const [pendingFolder, setPendingFolder] = useState(false);
  const [_, setPendingDraft] = useState('');
  const pendingCardRef = useRef<HTMLDivElement | null>(null);
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest'>('newest');

  useEffect(() => {
    const original = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = original;
    };
  }, []);

  const sortFolders = (data: Folder[], order: 'newest' | 'oldest') =>
    [...data].sort((a, b) => {
      const dateA = new Date(a.modifiedAt || a.createdAt || 0).getTime();
      const dateB = new Date(b.modifiedAt || b.createdAt || 0).getTime();
      return order === 'newest' ? dateB - dateA : dateA - dateB;
    });

  const fetchFolders = async () => {
    try {
      const data = await getPersonalFolders(user.id);
      setFolders(sortFolders(data, sortOrder));
    } catch (err) {
      console.error('개인 폴더 불러오기 실패:', err);
    }
  };

  useEffect(() => {
    fetchFolders();
  }, [user, sortOrder]);

  const handleAddFolder = () => {
    if (folders.length >= MAX_SPACES) return;
    setPendingDraft('');
    setPendingFolder(true);
  };

  const handleCancelAdd = () => {
    setPendingFolder(false);
    setPendingDraft('');
  };

  const handleConfirmAdd = async (finalName: string) => {
    const name = (finalName ?? '').trim();
    if (!name) {
      handleCancelAdd();
      return;
    }

    try {
      await createPersonalFolder(user.id, name);
      await fetchFolders(); // 생성 후 서버 데이터 다시 불러오기
    } catch (err) {
      console.error('폴더 생성 실패:', err);
    }

    setPendingDraft('');
    setPendingFolder(false);
  };

  const handleRenameFolder = async (id: number, newName: string) => {
    try {
      await updateFolder(id, newName);
      await fetchFolders(); // 수정 후 서버 데이터 다시 불러오기
    } catch (err) {
      console.error('폴더 수정 실패:', err);
    }
  };

  const handleDeleteFolder = async (id: string | number) => {
    try {
      await deleteFolder(Number(id));
      await fetchFolders(); // 삭제 후 서버 데이터 다시 불러오기
    } catch (err) {
      console.error('폴더 삭제 실패:', err);
    }
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
    <div className="flex w-screen h-screen overflow-hidden bg-[#0F0F0F] text-white font-suit">
      <Bar
        username={username}
        folders={folders}
        onAddFolder={handleAddFolder}
        onRemoveFolder={handleDeleteFolder}
        activePage="personal"
      />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -30 }}
        transition={{ duration: 0.4 }}
        className="flex flex-col flex-1 px-10 pt-10 overflow-hidden"
      >
        <div className="relative flex items-start w-fit">
          <h1 className="text-[28px] font-bold text-[#F2F2F2]">개인 스페이스</h1>
          <span className="ml-4 text-[16px] text-[#888] whitespace-nowrap">
            {folders.length}개 폴더
          </span>
        </div>

        <div className="flex gap-[12px] mt-[28px]">
          <BtnSort spaceType="personal" onSortChange={(order) => setSortOrder(order)} />
          <BtnPoint onClick={handleAddFolder}>새 폴더 추가 +</BtnPoint>
        </div>

        <motion.div
          layout
          className="grid grid-cols-[repeat(auto-fill,_minmax(371px,_1fr))] gap-x-[0px] gap-y-[48px] mt-[28px] overflow-visible"
        >
          <AnimatePresence>
            {folders.map((folder) => (
              <motion.div
                key={Number(folder.id)}
                layout
                style={{ overflow: 'visible' }}
                variants={folderVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
              >
                <FrmFolder
                  spaceType="personal"
                  name={folder.name}
                  onDelete={() => handleDeleteFolder(folder.id)}
                  onRename={(newName) => handleRenameFolder(folder.id, newName)}
                  onClickName={() => navigate(`/personal/${folder.id}`)}
                  boards={folder.boards || []}
                />
              </motion.div>
            ))}
          </AnimatePresence>

          <AnimatePresence>
            {pendingFolder && (
              <motion.div
                key="pending-folder"
                layout
                style={{ overflow: 'visible' }}
                variants={folderVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
              >
                <FrmFolder
                  spaceType="personal"
                  name="새 폴더"
                  containerRef={pendingCardRef}
                  onDraftChange={setPendingDraft}
                  onCancel={handleCancelAdd}
                  onRename={handleConfirmAdd}
                  boards={[]}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </motion.div>
    </div>
  );
}
