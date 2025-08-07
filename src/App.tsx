import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion'; 
import LoginPage from './pages/login/LoginPage';
import ComponentTest from './pages/component-test';
import SignupPage from './pages/signup/SignupPage';
import MainPage from './pages/home/MainPage';


function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/component-test" element={<ComponentTest />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/main" element={<MainPage />} /> 
      </Routes>
    </AnimatePresence>
  );
}

export default function App() {
  return (
    <Router>
      <AnimatedRoutes />
    </Router>
  );
}
