import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Navigate } from 'react-router-dom';
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

  const [folders, setFolders] = useState<Folder[]>([]);
  const [pendingFolder, setPendingFolder] = useState(false);
  const [pendingDraft, setPendingDraft] = useState('');
  const pendingCardRef = useRef<HTMLDivElement | null>(null);

  const updateFolders = (updater: (prev: Folder[]) => Folder[]) => {
    setFolders((prev) => {
      const candidate = updater(prev);
      if (candidate.length > MAX_SPACES) return prev; 
      saveFolders(username, candidate);
      return candidate;
    });
  };

  useEffect(() => {
    setFolders(loadFolders(username));
    setPendingFolder(false);
    setPendingDraft('');
  }, [username]);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    const t = setTimeout(() => { document.body.style.overflow = ''; }, 400);
    return () => { clearTimeout(t); document.body.style.overflow = ''; };
  }, []);

  const isValidFolderName = (raw: string) => {
    const name = (raw ?? '').trim();
    return !!name && name !== '새 폴더';
  };

  const handleAddFolder = () => {
    const effective = folders.length + (pendingFolder ? 1 : 0);
    if (effective >= MAX_SPACES) return;
    if (pendingFolder) return;
    setPendingFolder(true);
    setPendingDraft('');
  };

  const handleConfirmAdd = (newName: string) => {
    if (!isValidFolderName(newName)) return;
    updateFolders((prev) => {
      if (prev.length >= MAX_SPACES) return prev;
      const name = newName.trim();
      return [...prev, { id: Date.now() + Math.random(), name }];
    });
    setPendingFolder(false);
    setPendingDraft('');
  };

  const handleCancelAdd = () => {
    setPendingFolder(false);
    setPendingDraft('');
  };

  const handleRemoveFolder = () => {
    updateFolders((prev) => prev.slice(0, -1));
  };

  const handleRenameFolder = (id: number, newName: string) => {
    const name = (newName ?? '').trim();
    if (!name) return;
    updateFolders((prev) => prev.map((f) => (f.id === id ? { ...f, name } : f)));
  };

  const barFolders: Folder[] = pendingFolder
    ? [
        ...folders,
        {
          id: -1,
          name: (pendingDraft || '').trim() || '새 폴더',
        },
      ]
    : folders;

  useEffect(() => {
    if (!pendingFolder) return;
    const onDown = (e: MouseEvent) => {
      const target = e.target as Node;
      const inside = pendingCardRef.current?.contains(target);
      const empty = !pendingDraft.trim() || pendingDraft.trim() === '새 폴더';
      if (!inside && empty) handleCancelAdd();
    };
    document.addEventListener('mousedown', onDown);
    return () => document.removeEventListener('mousedown', onDown);
  }, [pendingFolder, pendingDraft]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -30 }}
      transition={{ duration: 0.4 }}
      className="flex w-screen h-screen bg-[#0F0F0F] text-white font-suit"
    >
      <Bar
        username={username}
        folders={barFolders}
        onAddFolder={handleAddFolder}
        onRemoveFolder={handleRemoveFolder}
        activePage="personal"
      />


      <div className="flex flex-col flex-1 px-10 pt-10">
        <div className="relative flex items-start w-fit">
          <h1 className="text-[28px] font-bold text-[#F2F2F2]">개인 스페이스</h1>
          <span className="absolute left-[calc(100%+16px)] top-[7px] text-[16px] text-[#888] whitespace-nowrap">
            {folders.length + (pendingFolder ? 1 : 0)} / {MAX_SPACES} 폴더
          </span>
        </div>

        <div className="flex gap-[12px] mt-[28px]">
          <BtnSort onClick={() => {}} />
          <BtnPoint onClick={handleAddFolder}>새 폴더 추가 +</BtnPoint>
        </div>

        <div className="grid grid-cols-[repeat(auto-fill,_minmax(371px,_1fr))] gap-x-[0px] gap-y-[48px] mt-[28px]">
          {folders.map((folder) => (
            <FrmFolder
              key={folder.id}
              name={folder.name}
              onRename={(newName) => handleRenameFolder(folder.id, newName)}
            />
          ))}

          {pendingFolder && (
            <FrmFolder
              name="새 폴더"
              onRename={handleConfirmAdd}
              onCancel={handleCancelAdd}
              onDraftChange={setPendingDraft}
              containerRef={pendingCardRef}
            />
          )}
        </div>
      </div>
    </motion.div>
  );
}
