import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Bar from '../../components/navi/bar';
import BtnSort from '../../components/btn/btn-sort';
import BtnPoint from '../../components/btn/btn-point';
import FrmFolder from '../../components/frm/frm-folder';

export default function P_SpacePage() {
  const username = localStorage.getItem('username') || 'Guest';
  const [folderCount, setFolderCount] = useState(0);

  // ✅ body overflow hidden 적용
  useEffect(() => {
    // 페이지 진입 시 overflow 숨김
    document.body.style.overflow = 'hidden';

    const timeout = setTimeout(() => {
      // 애니메이션 끝나고 스크롤 허용
      document.body.style.overflow = '';
    }, 400); // transition.duration 과 동일하게 설정

    return () => {
      clearTimeout(timeout);
      document.body.style.overflow = '';
    };
  }, []);

  const handleAddFolder = () => {
    setFolderCount((prev) => prev + 1);
  };

  const handleRemoveFolder = () => {
    setFolderCount((prev) => Math.max(prev - 1, 0));
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
            {folderCount}개 폴더
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
          {Array.from({ length: folderCount }).map((_, idx) => (
            <FrmFolder key={idx} />
          ))}
        </div>
      </div>
    </motion.div>
  );
}
