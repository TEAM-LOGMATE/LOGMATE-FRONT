import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/login/LoginPage';
import ComponentTest from './pages/component-test';
import SignupPage from './pages/signup/SignupPage';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/component-test" element={<ComponentTest />} />
        <Route path="/signup" element={<SignupPage />} />
      </Routes>
    </Router>
  );
}
