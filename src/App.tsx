import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import LoginPage from './pages/login/LoginPage';
import SignupPage from './pages/signup/SignupPage';
import PSpacePage from './pages/home/P-SpacePage';
import MyInfoPage from './pages/home/MyInfo';
import MyInfoEditPage from './pages/home/MyInfoEdit';
import { AuthProvider, ProtectedRoute, useAuth } from './utils/AuthContext';
import FolderPage from './pages/home/folderpage';
import S_SpacePage from './pages/home/S-SpacePage';
import LandingPage from './pages/landingpage/landingpage';
import TeamPage from './pages/home/teampage';
import AppDashboard from './pages/dashboard/appdashboard';
import { useEffect } from 'react';
import { useFolderStore } from './utils/folderStore';
import { getPersonalFolders } from './api/folders';
import { getTeams, getTeamFolders } from './api/teams';

// 로그인 후 폴더/팀 초기화 컴포넌트
function AppInitializer() {
  const { user } = useAuth();
  const { setFolders, setTeamFolders } = useFolderStore();

  useEffect(() => {
    if (!user) return;

    const initData = async () => {
      try {
        // 개인 폴더
        const personal = await getPersonalFolders(user.id);
        setFolders(() => personal);

        // 팀 목록
        const teams = await getTeams();

        // 각 팀의 폴더 불러오기
        const allTeamFolders = await Promise.all(
          teams.map(async (team: any) => {
            try {
              const res = await getTeamFolders(team.id);
              if (!res || res.length === 0) return null;

              const folder = res[0];
              return {
                ...folder,
                teamId: team.id,
                teamName: team.name,
                myRole: team.myRole,
              };
            } catch (err) {
              console.error(`팀 폴더 조회 실패 (teamId=${team.id}):`, err);
              return null;
            }
          })
        );

        setTeamFolders(() => allTeamFolders.filter(Boolean));
      } catch (err) {
        console.error('초기 데이터 불러오기 실패:', err);
      }
    };

    initData();
  }, [user, setFolders, setTeamFolders]);

  return null;
}

function AnimatedRoutes() {
  const location = useLocation();
  return (
    <Routes location={location} key={location.pathname}>
      {/* 첫 화면: 랜딩페이지 */}
      <Route path="/" element={<LandingPage />} />

      {/* 로그인/회원가입 */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />

      {/* 개인 스페이스 */}
      <Route
        path="/personal"
        element={
          <ProtectedRoute fallback={<div style={{ color: '#fff' }}>Loading...</div>}>
            <PSpacePage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/personal/:folderId"
        element={
          <ProtectedRoute fallback={<div style={{ color: '#fff' }}>Loading...</div>}>
            <FolderPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/personal/:folderId/:boardId"
        element={
          <ProtectedRoute fallback={<div style={{ color: '#fff' }}>Loading...</div>}>
            <AppDashboard />
          </ProtectedRoute>
        }
      />

      {/* 팀 스페이스 */}
      <Route
        path="/team"
        element={
          <ProtectedRoute fallback={<div style={{ color: '#fff' }}>Loading...</div>}>
            <S_SpacePage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/team/:teamId"
        element={
          <ProtectedRoute fallback={<div style={{ color: '#fff' }}>Loading...</div>}>
            <TeamPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/team/:teamId/:boardId"
        element={
          <ProtectedRoute fallback={<div style={{ color: '#fff' }}>Loading...</div>}>
            <AppDashboard />
          </ProtectedRoute>
        }
      />

      {/* 내 정보 */}
      <Route
        path="/myinfo"
        element={
          <ProtectedRoute fallback={<div style={{ color: '#fff' }}>Loading...</div>}>
            <MyInfoPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/edit-info"
        element={
          <ProtectedRoute fallback={<div style={{ color: '#fff' }}>Loading...</div>}>
            <MyInfoEditPage />
          </ProtectedRoute>
        }
      />

      {/* 그 외 경로는 로그인 페이지로 */}
      <Route path="*" element={<LoginPage />} />
    </Routes>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <Router>
        {/* 로그인 후 개인/팀 폴더를 전역 초기화 */}
        <AppInitializer />
        <AnimatedRoutes />
      </Router>
    </AuthProvider>
  );
}
