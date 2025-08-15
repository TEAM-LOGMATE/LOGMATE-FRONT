// src/pages/team/TeamPage.tsx
import { useParams, Navigate, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Bar from '../../components/navi/bar';
import BtnBigArrow from '../../components/btn/btn-big-arrow';
import FrmThumbnailBoard from '../../components/frm/frm-thumbnail-board';
import { useAuth } from '../../utils/AuthContext';
import { loadFolders, loadTeamFolders, type Folder } from '../../utils/storage';
import { MAX_SPACES } from '../../utils/validate';
import { api } from '../../api/axiosInstance';

interface Board {
  id: number;
  name: string;
}

// 개발 시 true, 배포 시 false
const USE_LOCAL_FALLBACK = true;

export default function TeamPage() {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;

  const username = user.username;
  const { teamId } = useParams<{ teamId: string }>();
  const navigate = useNavigate();

  const [teamFolders, setTeamFolders] = useState<Folder[]>([]);
  const [loading, setLoading] = useState(true);

  // 서버에서 팀 목록 로드
  useEffect(() => {
    async function fetchTeamList() {
      try {
        const res = await api.get('/teams');

        if (USE_LOCAL_FALLBACK) {
          // 개발 모드: 서버 + 로컬 데이터 병합
          const localFolders = loadTeamFolders(username);
          const merged = [
            ...res.data,
            ...localFolders.filter(
              lf => !res.data.some((sf: Folder) => String(sf.id) === String(lf.id))
            ),
          ];
          setTeamFolders(merged);
        } else {
          // 배포 모드: 서버 데이터만
          setTeamFolders(res.data);
        }
      } catch (err) {
        console.error('팀 목록 불러오기 실패:', err);
        if (USE_LOCAL_FALLBACK) {
          // 서버 요청 실패 시 로컬 데이터만 표시
          setTeamFolders(loadTeamFolders(username));
        }
      } finally {
        setLoading(false);
      }
    }
    fetchTeamList();
  }, [username]);

  // 팀 폴더 추가
  const handleAddTeamFolder = async () => {
    try {
      const res = await api.post(`/teams/${teamId}/folders`, {
        name: '새 팀',
        boards: [] as Board[],
      });
      setTeamFolders(prev => {
        if (prev.length >= MAX_SPACES) return prev;
        return [...prev, res.data];
      });
    } catch (err) {
      console.error('팀 폴더 추가 실패:', err);
    }
  };

  // 팀 폴더 삭제
  const handleRemoveTeamFolder = async (folderId?: number | string) => {
    try {
      if (!folderId) return;
      await api.delete(`/teams/${teamId}/folders/${folderId}`);
      setTeamFolders(prev => prev.filter(f => f.id !== folderId));
    } catch (err) {
      console.error('팀 폴더 삭제 실패:', err);
    }
  };

  // 현재 선택된 팀 정보
  const currentTeam = teamFolders.find(f => String(f.id) === String(teamId));

  // 현재 팀이 없으면 /team으로 이동
  useEffect(() => {
    if (!loading && teamId && !currentTeam) {
      navigate('/team');
    }
  }, [loading, teamId, currentTeam, navigate]);

  if (loading) {
    return <div style={{ color: '#fff', padding: '20px' }}>Loading...</div>;
  }

  if (!teamId || !currentTeam) {
    return null;
  }

  const boards: Board[] = (currentTeam as any).boards || [];

  return (
    <div className="flex w-screen h-screen bg-[#0F0F0F] text-white font-suit">
      {/* Bar */}
      <Bar
        username={username}
        folders={loadFolders(username)}
        teamFolders={teamFolders}
        activePage={!teamId ? 'team' : undefined}
        activeFolderId={teamId}
        onAddTeamFolder={handleAddTeamFolder}
        onRemoveTeamFolder={handleRemoveTeamFolder}
        onSelectFolder={id => {
          navigate(`/team/${id}`, { replace: true });
        }}
      />

      {/* 메인 컨텐츠 */}
      <div className="flex flex-col flex-1 p-6 gap-6">
        {/* 상단 제목 */}
        <motion.div
          className="flex items-center gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
        >
          <div
            onClick={() => {
              navigate('/team', { replace: true });
            }}
            className="cursor-pointer"
          >
            <BtnBigArrow />
          </div>
          <h1
            className="text-[28px] font-bold leading-[135%] tracking-[-0.4px]"
            style={{ color: 'var(--Gray-100, #F2F2F2)', fontFamily: 'SUIT' }}
          >
            {currentTeam.name}
          </h1>
        </motion.div>

        {/* 썸네일 2x2 */}
        <div
          className="grid gap-4 flex-1"
          style={{
            gridTemplateRows: 'repeat(2, minmax(0, 1fr))',
            gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
          }}
        >
          {boards.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              <FrmThumbnailBoard connected={false} />
            </motion.div>
          ) : (
            boards.map((b, idx) => (
              <motion.div
                key={b.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{
                  duration: 0.3,
                  delay: idx * 0.05,
                }}
              >
                <FrmThumbnailBoard connected />
              </motion.div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
