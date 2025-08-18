// src/App.tsx
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import LoginPage from './pages/login/LoginPage';
import SignupPage from './pages/signup/SignupPage';
import PSpacePage from './pages/home/P-SpacePage';
import MyInfoPage from './pages/home/MyInfo';
import MyInfoEditPage from './pages/home/MyInfoEdit';
import { AuthProvider, ProtectedRoute } from './utils/AuthContext';
import TestPage from './test';
import FolderPage from './pages/home/folderpage';
import S_SpacePage from './pages/home/S-SpacePage';
import LandingPage from './pages/landingpage/landingpage';
import TeamPage from './pages/home/teampage';
import AppDashboard from './pages/dashboard/appdashboard';

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
      {/* 개인 스페이스 폴더 내부 */}
      <Route
        path="/personal/:folderId"
        element={
          <ProtectedRoute fallback={<div style={{ color: '#fff' }}>Loading...</div>}>
            <FolderPage />
          </ProtectedRoute>
        }
      />
      {/* 개인 스페이스 보드(AppDashboard) */}
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
      {/* 팀 스페이스 폴더 내부 */}
      <Route
        path="/team/:teamId"
        element={
          <ProtectedRoute fallback={<div style={{ color: '#fff' }}>Loading...</div>}>
            <TeamPage />
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

      {/* 컴포넌트 테스트 페이지 */}
      <Route path="/test" element={<TestPage />} />

      {/* 그 외 경로는 로그인 페이지로 */}
      <Route path="*" element={<LoginPage />} />
    </Routes>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <AnimatedRoutes />
      </Router>
    </AuthProvider>
  );
}
