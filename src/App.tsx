import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import LoginPage from './pages/login/LoginPage';
import SignupPage from './pages/signup/SignupPage';
import PSpacePage from './pages/home/P-SpacePage';
import MyInfoPage from './pages/home/MyInfo';
import MyInfoEditPage from './pages/home/MyInfoEdit';
import { AuthProvider, ProtectedRoute } from './utils/AuthContext';

function AnimatedRoutes() {
  const location = useLocation();
  return (
    <Routes location={location} key={location.pathname}>
      {/* 첫 화면: 랜딩페이지 */}
      <Route
        path="/"
        element={
          <div
            style={{
              color: '#fff',
              fontSize: '24px',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              height: '100vh',
              backgroundColor: '#000',
            }}
          >
            랜딩페이지
          </div>
        }
      />

      {/* 로그인/회원가입 */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />

      {/* 보호된 페이지 */}
      <Route
        path="/personal"
        element={
          <ProtectedRoute fallback={<div style={{ color: '#fff' }}>Loading...</div>}>
            <PSpacePage />
          </ProtectedRoute>
        }
      />
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
        <AnimatedRoutes />
      </Router>
    </AuthProvider>
  );
}
