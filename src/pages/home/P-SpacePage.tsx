import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Variants } from 'framer-motion';
import { Navigate, useNavigate } from 'react-router-dom';
import Bar from '../../components/navi/bar';
import BtnSort from '../../components/btn/btn-sort';
import BtnPoint from '../../components/btn/btn-point';
import FrmFolder from '../../components/frm/frm-folder';
import { loadFolders, saveFolders, type Folder } from '../../utils/storage';
import { useAuth } from '../../utils/AuthContext';
import { MAX_SPACES } from '../../utils/validate';

export default function P_SpacePage() {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;

  const username = user.username;
  const navigate = useNavigate();

  const [folders, setFolders] = useState<Folder[]>([]);
  const [pendingFolder, setPendingFolder] = useState(false);
  const [pendingDraft, setPendingDraft] = useState('');
  const pendingCardRef = useRef<HTMLDivElement | null>(null);
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest'>('newest');

  // 페이지 진입 시 스크롤 제거
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

  const updateFolders = (updater: (prev: Folder[]) => Folder[]) => {
    setFolders((prev) => {
      const candidate = updater(prev);
      if (candidate.length > MAX_SPACES) return prev;
      const sorted = sortFolders(candidate, sortOrder);
      saveFolders(username, sorted);
      return sorted;
    });
  };

  useEffect(() => {
    const loaded = loadFolders(username);
    setFolders(sortFolders(loaded, sortOrder));
  }, [username, sortOrder]);

  const handleAddFolder = () => {
    if (folders.length >= MAX_SPACES) return;
    setPendingDraft('');
    setPendingFolder(true);
  };

  const handleCancelAdd = () => {
    setPendingFolder(false);
    setPendingDraft('');
  };

  const handleConfirmAdd = (finalName: string) => {
    const name = (finalName ?? '').trim();
    if (!name) {
      handleCancelAdd(); // 이름 없으면 폴더 생성 취소
      return;
    }
    updateFolders((prev) => {
      if (prev.length >= MAX_SPACES) return prev;
      const now = new Date().toISOString();
      return [
        ...prev,
        { id: Date.now() + Math.random(), name, createdAt: now, modifiedAt: now },
      ];
    });
    setPendingFolder(false);
    setPendingDraft('');
  };

  const handleDeleteFolder = (id: string | number) => {
    updateFolders((prev) => prev.filter((f) => f.id !== Number(id)));
  };

  // 초기 로드 애니메이션
  const folderVariantsInitial: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3, ease: 'easeOut' } },
    exit: { opacity: 0, y: -15, transition: { duration: 0.2, ease: 'easeIn' } },
  };

  // 신규 생성 애니메이션
  const folderVariantsNew: Variants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.2, ease: 'easeOut' } },
    exit: { opacity: 0, scale: 0.95, transition: { duration: 0.15, ease: 'easeIn' } },
  };

  return (
    <div className="flex w-screen h-screen overflow-hidden bg-[#0F0F0F] text-white font-suit">
      {/* Bar 고정 (애니메이션 없음) */}
      <Bar
        username={username}
        folders={folders}
        onAddFolder={handleAddFolder}
        onRemoveFolder={handleDeleteFolder}
        activePage="personal"
      />

      {/* 오른쪽 콘텐츠만 애니메이션 */}
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

        <div className="grid grid-cols-[repeat(auto-fill,_minmax(371px,_1fr))] gap-x-[0px] gap-y-[48px] mt-[28px] overflow-visible">
          {/* 초기 로드된 폴더 */}
          <AnimatePresence>
            {folders.map((folder) => (
              <motion.div
                key={folder.id}
                style={{ overflow: 'visible' }}
                variants={folderVariantsInitial}
                initial="hidden"
                animate="visible"
                exit="exit"
                layout
              >
                <FrmFolder
                  spaceType="personal"
                  name={folder.name}
                  onDelete={() => handleDeleteFolder(folder.id)}
                  onClickName={() => navigate(`/personal/${folder.id}`)}
                  boards={(folder as any).boards || []}
                />
              </motion.div>
            ))}
          </AnimatePresence>

          {/* 새로 생성되는 폴더 */}
          <AnimatePresence>
            {pendingFolder && (
              <motion.div
                key="pending-folder"
                style={{ overflow: 'visible' }}
                variants={folderVariantsNew}
                initial="hidden"
                animate="visible"
                exit="exit"
                layout
              >
                <FrmFolder
                  spaceType="personal"
                  name="새 폴더"
                  containerRef={pendingCardRef}
                  onDraftChange={setPendingDraft}
                  onCancel={handleCancelAdd}
                  onRename={handleConfirmAdd} // 새 폴더 생성 시에만 이름 입력 가능
                  boards={[]}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}
