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
import {
  createPersonalFolder,
  getPersonalFolders,
  deleteFolder,
  updateFolder,
} from '../../api/folders';
import { getTeams } from '../../api/teams';
import { getDashboards } from '../../api/dashboard';
import { useFolderStore } from '../../utils/folderStore';

// Board 타입 정의
interface Board {
  id: number;
  name: string;
  logPath?: string;
  status?: 'collecting' | 'unresponsive' | 'before';
}

const parseDate = (dateStr: string) => {
  const normalized = dateStr.replace(/\./g, '-').replace(' ', 'T');
  return new Date(normalized);
};

export default function P_SpacePage() {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;

  const username = user.username;
  const navigate = useNavigate();
  const {
    folders,
    setFolders,
    setTeamFolders,
    personalSortOrder,
    setPersonalSortOrder,
  } = useFolderStore();

  const [activeFolderId, setActiveFolderId] = useState<string | number | null>(null);
  const [pendingFolder, setPendingFolder] = useState(false);
  const [_, setPendingDraft] = useState('');
  const pendingCardRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const original = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = original;
    };
  }, []);

  const fetchData = async () => {
    try {
      const data = await getPersonalFolders(user.id);

      // 각 폴더에 boards 붙이기
      const foldersWithBoards = await Promise.all(
        data.map(async (folder: any) => {
          try {
            const res = await getDashboards(folder.id);
            const boards: Board[] = res?.data || [];
            return { ...folder, boards };
          } catch (err) {
            console.error(`대시보드 불러오기 실패 (folderId=${folder.id}):`, err);
            return { ...folder, boards: [] };
          }
        })
      );

      const sortedFolders = [...foldersWithBoards].sort((a, b) => {
        const aDate = parseDate(a.updatedAt);
        const bDate = parseDate(b.updatedAt);

        if (personalSortOrder === 'newest') {
          return bDate.getTime() - aDate.getTime();
        } else {
          return aDate.getTime() - bDate.getTime();
        }
      });

      setFolders(sortedFolders);

      const teams = await getTeams();
      setTeamFolders(teams.map((t: any) => ({ ...t, spaceType: 'team' })));
    } catch (err) {
      console.error('폴더/팀 불러오기 실패:', err);
    }
  };

  useEffect(() => {
    fetchData();
  }, [user, personalSortOrder]);

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
      await fetchData();
    } catch (err) {
      console.error('폴더 생성 실패:', err);
    }

    setPendingDraft('');
    setPendingFolder(false);
  };

  const handleRenameFolder = async (id: number, newName: string) => {
    try {
      await updateFolder(id, newName);
      await fetchData();
    } catch (err) {
      console.error('폴더 수정 실패:', err);
    }
  };

  const handleDeleteFolder = async (id: string | number) => {
    try {
      await deleteFolder(Number(id));
      await fetchData();
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
        onAddFolder={handleAddFolder}
        onRemoveFolder={handleDeleteFolder}
        activePage="personal"
        activeFolderId={activeFolderId}
        onSelectFolder={(id) => {
          setActiveFolderId(id);
          navigate(`/personal/${id}`);
        }}
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
          <BtnSort
            spaceType="personal"
            order={personalSortOrder}
            onSortChange={setPersonalSortOrder}
          />
          <BtnPoint onClick={handleAddFolder}>새 폴더 추가 +</BtnPoint>
        </div>

        <motion.div
          className="grid grid-cols-[repeat(auto-fill,_minmax(371px,_1fr))] 
                     gap-x-[0px] gap-y-[48px] mt-[28px] overflow-visible items-start"
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
                  onClickName={() => {
                    setActiveFolderId(folder.id);
                    navigate(`/personal/${folder.id}`);
                  }}
                  boards={folder.boards || []}
                />
              </motion.div>
            ))}
          </AnimatePresence>

          <AnimatePresence>
            {pendingFolder && (
              <motion.div
                key="pending-folder"
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
