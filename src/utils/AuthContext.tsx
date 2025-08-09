import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import type { ReactNode, ReactElement } from 'react';
import { Navigate } from 'react-router-dom';

export type User = { username: string; email: string };

type AuthContextValue = {
  user: User | null;
  isLoading: boolean;
  isAuthed: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  signup: (username: string, email: string, password: string) => Promise<void>;
  setUserUnsafe?: (u: User | null) => void;
  error?: string | null;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const LS_KEY = 'authUser';

// 데모 계정 (mock)
const DEMO_EMAIL = 'admin@logmate.com';
const DEMO_PASSWORD = 'admin1234@';
const DEMO_USERNAME = '관리자';

// 나중에 .env로 'api' 전환 가능
const MODE: 'mock' | 'api' = 'mock';

function readUserFromStorage(): User | null {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (!raw) return null;
    const p = JSON.parse(raw);
    if (p && typeof p.username === 'string' && typeof p.email === 'string') return p as User;
    return null;
  } catch {
    return null;
  }
}
function writeUserToStorage(u: User | null) {
  try {
    if (u) {
      localStorage.setItem(LS_KEY, JSON.stringify(u));
      localStorage.setItem('username', u.username); // 구 코드 호환
    } else {
      localStorage.removeItem(LS_KEY);
      localStorage.removeItem('username');
    }
  } catch {}
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 앱 시작 시 세션 복구
  useEffect(() => {
    let alive = true;
    (async () => {
      setLoading(true);
      try {
        if (MODE === 'mock') {
          const u = readUserFromStorage();
          if (alive) setUser(u);
        } else {
          // API 모드: /auth/me 호출
        }
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => { alive = false; };
  }, []);

  const login = async (email: string, password: string) => {
    setError(null);
    if (MODE === 'mock') {
      const ok = email.trim().toLowerCase() === DEMO_EMAIL && password === DEMO_PASSWORD;
      if (!ok) {
        setError('이메일 또는 비밀번호가 올바르지 않습니다.');
        throw new Error('Invalid credentials');
      }
      const u: User = { username: DEMO_USERNAME, email: DEMO_EMAIL };
      setUser(u); writeUserToStorage(u);
      return;
    }
    // API 모드: /auth/login → /auth/me
  };

  const logout = async () => {
    setError(null);
    if (MODE === 'mock') {
      setUser(null); writeUserToStorage(null);
      return;
    }
    // API 모드: /auth/logout
  };

  const signup = async (username: string, email: string, password: string) => {
    setError(null);
    if (MODE === 'mock') {
      const u: User = { username: username.trim() || '사용자', email: email.trim() };
      setUser(u); writeUserToStorage(u);
      return;
    }
    // API 모드: /auth/signup → login
  };

  const value: AuthContextValue = useMemo(() => ({
    user,
    isLoading,
    isAuthed: !!user,
    login,
    logout,
    signup,
    setUserUnsafe: (u) => { setUser(u); writeUserToStorage(u); },
    error,
  }), [user, isLoading, error]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}

// 보호 라우트
export function ProtectedRoute({
  children,
  fallback = null,
}: { children: ReactElement; fallback?: ReactNode }) {
  const { isLoading, isAuthed } = useAuth();
  if (isLoading) return <>{fallback}</>;
  if (!isAuthed) return <Navigate to="/login" replace />;
  return children;
}
