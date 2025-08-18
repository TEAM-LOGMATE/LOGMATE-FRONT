import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import AddFolding from './add-folding';
import MyPage from './my-page';
import SpaceNameG from './spacename-g';
import SpaceNameS from './spacename-s';
import Logo from '../../components/icon/logo';

import {
  loadFolders,
  foldersKey,
  type Folder,
  loadTeamFolders,
  teamFoldersKey,
} from '../../utils/storage';
import { MAX_SPACES } from '../../utils/validate';

interface BarProps {
  username: string;
  folders?: Folder[];
  teamFolders?: Folder[];
  onAddFolder?: () => void;
  onAddTeamFolder?: () => void; // 팀 폴더 추가 콜백 분리
  onRemoveFolder?: (folderId: string | number) => void;
  onRemoveTeamFolder?: (folderId: string | number) => void;
  activePage?: 'personal' | 'myinfo' | 'team' | null;
  activeFolderId?: string | number | null;
  onSelectFolder?: (folderId: string | number) => void;
  onSelectPage?: (page: 'personal' | 'myinfo' | 'team' | null) => void;
}

export default function Bar({
  username,
  folders,
  teamFolders,
  onAddFolder,
  onAddTeamFolder,
  onRemoveTeamFolder,
  activePage,
  activeFolderId,
  onSelectFolder,
  onSelectPage,
}: BarProps) {
  const [isOpenG, setIsOpenG] = useState(true);
  const [isOpenS, setIsOpenS] = useState(true);

  // 개인 스페이스 로컬 상태
  const [localFolders, setLocalFolders] = useState<Folder[]>([]);
  const propHasFolders = folders !== undefined;

  // 팀 스페이스 로컬 상태
  const [localTeamFolders, setLocalTeamFolders] = useState<Folder[]>([]);
  const propHasTeamFolders = teamFolders !== undefined;

  const navigate = useNavigate();
  const { folderId: routeFolderId } = useParams<{ folderId: string }>();

  /* ---------- 개인 스페이스 항상 로드 ---------- */
  useEffect(() => {
    setLocalFolders(loadFolders(username));
  }, [username]);

  useEffect(() => {
    const key = foldersKey(username);
    const onStorage = (e: StorageEvent) => {
      if (e.key !== key) return;
      setLocalFolders(loadFolders(username));
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, [username]);

  /* ---------- 팀 스페이스 ---------- */
  useEffect(() => {
    if (propHasTeamFolders) return;
    setLocalTeamFolders(loadTeamFolders(username));
  }, [username, propHasTeamFolders]);

  useEffect(() => {
    if (propHasTeamFolders) return;
    const key = teamFoldersKey(username);
    const onStorage = (e: StorageEvent) => {
      if (e.key !== key) return;
      setLocalTeamFolders(loadTeamFolders(username));
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, [username, propHasTeamFolders]);

  const displayedFolders: Folder[] = propHasFolders ? (folders as Folder[]) : localFolders;
  const displayedTeamFolders: Folder[] = propHasTeamFolders ? (teamFolders as Folder[]) : localTeamFolders;

  /* ---------- 버튼 클릭 핸들러 ---------- */
  const handleAddSpaceNameG = () => {
    if (activePage !== 'personal') return; // 다른 페이지에서는 동작 X
    if (displayedFolders.length >= MAX_SPACES) return;
    if (!isOpenG) setIsOpenG(true);
    onAddFolder?.();
  };

  const handleAddSpaceNameS = () => {
    if (activePage !== 'team') return; // 다른 페이지에서는 동작 X
    if (displayedTeamFolders.length >= MAX_SPACES) return;
    if (!isOpenS) setIsOpenS(true);
    onAddTeamFolder?.();
  };

  const handleFolderClick = (folderId: number | string) => {
    onSelectFolder?.(folderId);
    navigate(`/personal/${folderId}`, { replace: true });
  };


  const handleTeamFolderClick = (folderId: number | string) => {
    onSelectFolder?.(folderId);
    onSelectPage?.('team');
    navigate(`/team/${folderId}`, { replace: true }); 
  };


  return (
    <div className="w-[220px] h-screen min-h-screen flex-shrink-0 border-r border-[#222] bg-[#171717] flex flex-col">
      {/* 로고 / 유저 */}
      <div className="flex flex-col px-[16px] pt-[20px]">
        <div className="inline-flex items-center gap-[6px]">
          {/* 로고 사용 */}
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
        active={activePage === 'personal'}
      />
      <div className={isOpenG ? '' : 'hidden'}>
        {displayedFolders.map((folder) => {
          const isActiveFolder = String(folder.id) === String(activeFolderId ?? routeFolderId);
          return (
            <SpaceNameG
              key={folder.id}
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
        active={activePage === 'team'}
      />
      <div className={isOpenS ? '' : 'hidden'}>
        {displayedTeamFolders.map((folder) => {
          const isActiveFolder = String(folder.id) === String(activeFolderId ?? routeFolderId);
          return (
            <SpaceNameS
              key={folder.id}
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
