import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AddFolding from './add-folding';
import MyPage from './my-page';
import SpaceNameG from './spacename-g';
import SpaceNameS from './spacename-s';

// ✅ storage 유틸
import { loadFolders, foldersKey, type Folder } from '../../utils/storage';
// ✅ 전역 제한값 사용
import { MAX_SPACES } from '../../utils/validate';

interface BarProps {
  username: string;
  folders?: Folder[];
  onAddFolder?: () => void;
  onRemoveFolder?: () => void;
  activePage?: 'personal' | 'myinfo' | string; // 현재 활성 페이지
}

export default function Bar({
  username,
  folders,
  onAddFolder,
  onRemoveFolder,
  activePage,
}: BarProps) {
  const [spaceNameSList, setSpaceNameSList] = useState<number[]>([]);
  const [isOpenG, setIsOpenG] = useState(true);
  const [isOpenS, setIsOpenS] = useState(true);
  const [localFolders, setLocalFolders] = useState<Folder[]>([]);
  const navigate = useNavigate();

  // ✅ 전달 여부만 확인 (빈 배열도 유효)
  const propHasFolders = folders !== undefined;

  // props 없을 때만 로컬 로드
  useEffect(() => {
    if (propHasFolders) return;
    setLocalFolders(loadFolders(username));
  }, [username, propHasFolders]);

  // props 없을 때만 로컬 동기화
  useEffect(() => {
    if (propHasFolders) return;
    const key = foldersKey(username);
    const onStorage = (e: StorageEvent) => {
      if (e.key !== key) return;
      setLocalFolders(loadFolders(username));
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, [username, propHasFolders]);

  const displayedFolders: Folder[] = propHasFolders ? (folders as Folder[]) : localFolders;

  const handleAddSpaceNameG = () => {
    if (onAddFolder) {
      if (displayedFolders.length >= MAX_SPACES) return;
      if (!isOpenG) setIsOpenG(true);
      onAddFolder();
      return;
    }
    navigate('/personal');
  };

  const handleAddSpaceNameS = () => {
    if (spaceNameSList.length >= MAX_SPACES) return;
    if (!isOpenS) setIsOpenS(true);
    const newId = Date.now() + Math.random();
    setSpaceNameSList((prev) => [...prev, newId]);
  };

  const handleCancelSpaceNameS = (id: number) => {
    setSpaceNameSList((prev) => prev.filter((item) => item !== id));
  };

  return (
    <div className="w-[220px] h-screen min-h-screen flex-shrink-0 border-r border-[#222] bg-[#171717] flex flex-col">
      {/* 로고/유저 */}
      <div className="flex flex-col px-[16px] pt-[24px]">
        <div className="inline-flex items-center gap-[6px]">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none">
            <circle cx="10" cy="10" r="9.5" stroke="#6E6E6E" strokeWidth="1" />
          </svg>
          <span className="text-[#6E6E6E] font-geist text-[16px]">Log Mate</span>
        </div>
        <div className="pt-[12px]">
          <span className="text-[#D8D8D8] font-geist text-[16px]">{username}</span>
        </div>
        <div className="mb-[4px]">
          <span className="text-[#6E6E6E] font-suit text-[14px] font-bold hover:text-[#D8D8D8] cursor-pointer transition-colors">
            로그아웃
          </span>
        </div>
      </div>

      <MyPage active={activePage === 'myinfo'} />

      {/* 개인 스페이스 */}
      <AddFolding
        onAdd={handleAddSpaceNameG}
        label="개인 스페이스"
        isOpen={isOpenG}
        toggleOpen={() => setIsOpenG((p) => !p)}
        onLabelClick={() => navigate('/personal')}
        labelClassName={activePage === 'personal' ? 'text-[#4FE75E]' : 'text-[#888]'}
      />


      <div className={isOpenG ? '' : 'hidden'}>
        {displayedFolders.map((folder) => (
          <SpaceNameG key={folder.id} name={folder.name} />
        ))}
      </div>

      {/* 팀 스페이스 */}
      <AddFolding
        onAdd={handleAddSpaceNameS}
        label="팀 스페이스"
        isOpen={isOpenS}
        toggleOpen={() => setIsOpenS((p) => !p)}
      />
      <div className={isOpenS ? '' : 'hidden'}>
        {spaceNameSList.map((id) => (
          <SpaceNameS key={id} onCancel={() => handleCancelSpaceNameS(id)} />
        ))}
      </div>
    </div>
  );
}
