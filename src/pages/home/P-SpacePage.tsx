import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Bar from '../../components/navi/bar';
import BtnSort from '../../components/btn/btn-sort';
import BtnPoint from '../../components/btn/btn-point';
import FrmFolder from '../../components/frm/frm-folder';

interface Folder {
  id: number;
  name: string;
}

export default function P_SpacePage() {
  const username = localStorage.getItem('username') || 'Guest';

  const [folders, setFolders] = useState<Folder[]>([]);
  const [pendingFolder, setPendingFolder] = useState<boolean>(false);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    const timeout = setTimeout(() => {
      document.body.style.overflow = '';
    }, 400);
    return () => {
      clearTimeout(timeout);
      document.body.style.overflow = '';
    };
  }, []);

  const handleConfirmAdd = (newName: string) => {
    setFolders((prev) => [
      ...prev,
      { id: Date.now() + Math.random(), name: newName },
    ]);
    setPendingFolder(false);
  };

  const handleCancelAdd = () => {
    setPendingFolder(false);
  };

  const handleAddFolder = () => {
    if (pendingFolder) return;
    setPendingFolder(true);
  };

  const handleRemoveFolder = () => {
    setFolders((prev) => prev.slice(0, -1));
  };

  const handleRenameFolder = (id: number, newName: string) => {
    setFolders((prev) =>
      prev.map((folder) =>
        folder.id === id ? { ...folder, name: newName } : folder
      )
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -30 }}
      transition={{ duration: 0.4 }}
      className="flex w-screen h-screen bg-[#0F0F0F] text-white font-suit"
    >
      {/* 왼쪽 사이드바 */}
      <Bar
        username={username}
        folders={folders}
        onAddFolder={handleAddFolder}
        onRemoveFolder={handleRemoveFolder}
      />

      {/* 오른쪽 메인 콘텐츠 영역 */}
      <div className="flex flex-col flex-1 px-10 pt-10">
        {/* 헤더 영역 */}
        <div className="relative flex items-start w-fit">
          <h1 className="text-[28px] font-bold leading-[135%] tracking-[-0.4px] text-[#F2F2F2]">
            개인 스페이스
          </h1>
          <span className="absolute left-[calc(100%+16px)] top-[7px] text-[16px] font-normal leading-[135%] tracking-[-0.4px] text-[#888888] whitespace-nowrap">
            {folders.length}개 폴더
          </span>
        </div>

        {/* 정렬 + 추가 버튼 */}
        <div className="flex gap-[12px] mt-[28px]">
          <BtnSort onClick={() => console.log('최신순 정렬 클릭')} />
          <BtnPoint onClick={handleAddFolder}>새 폴더 추가 +</BtnPoint>
        </div>

        {/* 폴더 카드 리스트 */}
        <div
          className="
            grid 
            grid-cols-[repeat(auto-fill,_minmax(371px,_1fr))] 
            gap-x-[0px] 
            gap-y-[48px]
            mt-[28px]
          "
        >
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
            />
          )}
        </div>
      </div>
    </motion.div>
  );
}
