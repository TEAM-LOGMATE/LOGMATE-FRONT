import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AddFolding from './add-folding';
import MyPage from './my-page';
import SpaceNameG from './spacename-g';
import SpaceNameS from './spacename-s';

interface Folder {
  id: number;
  name: string;
}

interface BarProps {
  username: string;
  folders: Folder[];
  onAddFolder: () => void;
  onRemoveFolder: () => void;
}

export default function Bar({ username, folders, onAddFolder, onRemoveFolder }: BarProps) {
  const [spaceNameSList, setSpaceNameSList] = useState<number[]>([]);
  const [isOpenG, setIsOpenG] = useState(true);
  const [isOpenS, setIsOpenS] = useState(true);
  const navigate = useNavigate();

  const MAX_SPACES = 9;

  const handleAddSpaceNameG = () => {
    if (folders.length >= MAX_SPACES) return;
    if (!isOpenG) setIsOpenG(true);
    onAddFolder(); 
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
    <div
      className="
        w-[220px] h-screen min-h-screen flex-shrink-0
        border-r border-[#222]
        bg-[#171717]
        flex flex-col
      "
    >
      {/* 로고 및 유저 정보 영역 */}
      <div className="flex flex-col px-[16px] pt-[24px]">
        <div className="inline-flex items-center gap-[6px]">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none">
            <circle cx="10" cy="10" r="9.5" stroke="#6E6E6E" strokeWidth="1" />
          </svg>
          <span className="text-[#6E6E6E] font-geist text-[16px] font-normal leading-[16px] tracking-[-0.8px]">
            Log Mate
          </span>
        </div>

        <div className="pt-[12px]">
          <span className="text-[#D8D8D8] font-geist text-[16px] font-normal leading-[145%]">
            {username}
          </span>
        </div>
        <div className="mb-[4px]">
          <span className="text-[#6E6E6E] font-suit text-[14px] font-bold leading-[150%] tracking-[-0.4px] hover:text-[#D8D8D8] cursor-pointer transition-colors">
            로그아웃
          </span>
        </div>
      </div>

      {/* 메뉴 - my-page */}
      <MyPage />

      {/* 개인 스페이스 */}
      <AddFolding
        onAdd={handleAddSpaceNameG}
        label="개인 스페이스"
        isOpen={isOpenG}
        toggleOpen={() => setIsOpenG((prev) => !prev)}
      />
      <div className={isOpenG ? '' : 'hidden'}>
        {folders.map((folder) => (
          <SpaceNameG key={folder.id} name={folder.name} />
        ))}
      </div>

      {/* 팀 스페이스 */}
      <AddFolding
        onAdd={handleAddSpaceNameS}
        label="팀 스페이스"
        isOpen={isOpenS}
        toggleOpen={() => setIsOpenS((prev) => !prev)}
      />
      <div className={isOpenS ? '' : 'hidden'}>
        {spaceNameSList.map((id) => (
          <SpaceNameS key={id} onCancel={() => handleCancelSpaceNameS(id)} />
        ))}
      </div>
    </div>
  );
}
