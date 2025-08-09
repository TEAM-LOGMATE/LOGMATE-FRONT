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
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
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
        <Route path="*" element={<LoginPage />} />
      </Routes>
    // </AnimatePresence>
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
