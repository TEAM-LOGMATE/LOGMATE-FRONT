import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import AddFolding from './add-folding';
import MyPage from './my-page';
import SpaceNameG from './spacename-g';
import SpaceNameS from './spacename-s';
import Logo from '../../components/icon/logo';

import { MAX_SPACES } from '../../utils/validate';
import { useFolderStore } from '../../utils/folderStore';

interface BarProps {
  username: string;
  onAddFolder?: () => void;
  onAddTeamFolder?: () => void;
  onRemoveFolder?: (folderId: string | number) => void;
  onRemoveTeamFolder?: (folderId: string | number) => void;
  activePage?: 'personal' | 'myinfo' | 'team' | null;
  activeFolderId?: string | number | null;
  onSelectFolder?: (folderId: string | number) => void;
  onSelectPage?: (page: 'personal' | 'myinfo' | 'team' | null) => void;
}

export default function Bar({
  username,
  onAddFolder,
  onAddTeamFolder,
  onRemoveFolder,
  onRemoveTeamFolder,
  activePage,
  activeFolderId,
  onSelectFolder,
  onSelectPage,
}: BarProps) {
  const [isOpenG, setIsOpenG] = useState(true);
  const [isOpenS, setIsOpenS] = useState(true);

  const navigate = useNavigate();
  const { folderId: routeFolderId } = useParams<{ folderId: string }>();

  // 전역 스토어에서 folders/teamFolders 가져오기
  const { folders, teamFolders } = useFolderStore();

  const handleAddSpaceNameG = () => {
    if (activePage !== 'personal') return;
    if (folders.length >= MAX_SPACES) return;
    if (!isOpenG) setIsOpenG(true);
    onAddFolder?.();
  };

  const handleAddSpaceNameS = () => {
    if (activePage !== 'team') return;
    if (teamFolders.length >= MAX_SPACES) return;
    if (!isOpenS) setIsOpenS(true);
    onAddTeamFolder?.();
  };

  const handleFolderClick = (folderId: number | string) => {
    onSelectPage?.('personal'); // 페이지 상태 갱신
    onSelectFolder?.(folderId); // 폴더 상태 갱신
    navigate(`/personal/${folderId}`, { replace: true });
  };

  const handleTeamFolderClick = (folderId: number | string) => {
    onSelectPage?.('team');
    onSelectFolder?.(folderId);
    navigate(`/team/${folderId}`, { replace: true });
  };

  return (
    <div className="w-[220px] h-screen min-h-screen flex-shrink-0 border-r border-[#222] bg-[#171717] flex flex-col">
      {/* 로고 / 유저 */}
      <div className="flex flex-col px-[16px] pt-[20px]">
        <div className="inline-flex items-center gap-[6px]">
          <Logo width={20} height={20} fill="var(--Gray-300, #AEAEAE)" />
          <span className="text-[#6E6E6E] font-geist text-[16px]">Log Mate</span>
        </div>
        <div className="pt-[12px]">
          <span className="text-[#D8D8D8] font-Geist text-[16px]">{username}</span>
        </div>
        <div className="mb-[4px]">
          <span
            className="text-[#6E6E6E] font-suit text-[14px] font-bold hover:text-[#D8D8D8] cursor-pointer transition-colors"
            onClick={() => navigate('/')}
          >
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
        onLabelClick={() => {
          onSelectPage?.('personal');
          navigate('/personal');
        }}
        active={activePage === 'personal' && !activeFolderId}
      />
      <div className={isOpenG ? '' : 'hidden'}>
        {folders.map((folder) => {
          const isActiveFolder =
            activePage === 'personal' &&
            String(folder.id) === String(activeFolderId ?? routeFolderId);
          return (
            <SpaceNameG
              key={Number(folder.id)}
              name={folder.name}
              isActive={isActiveFolder}
              onClick={() => handleFolderClick(folder.id)}
            />
          );
        })}
      </div>

      {/* 팀 스페이스 */}
      <AddFolding
        onAdd={handleAddSpaceNameS}
        label="팀 스페이스"
        isOpen={isOpenS}
        toggleOpen={() => setIsOpenS((p) => !p)}
        onLabelClick={() => {
          onSelectPage?.('team');
          navigate('/team');
        }}
        active={activePage === 'team' && !activeFolderId}
      />
      <div className={isOpenS ? '' : 'hidden'}>
        {teamFolders.map((folder) => {
          const isActiveFolder =
            activePage === 'team' &&
            String(folder.id) === String(activeFolderId ?? routeFolderId);
          return (
            <SpaceNameS
              key={Number(folder.id)}
              onCancel={() => onRemoveTeamFolder?.(folder.id)}
              isActive={isActiveFolder}
              onClick={() => handleTeamFolderClick(folder.id)}
              name={folder.name}
            />
          );
        })}
      </div>
    </div>
  );
}
