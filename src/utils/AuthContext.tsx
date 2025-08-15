// src/utils/AuthContext.tsx
import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import type { ReactNode, ReactElement } from 'react';
import { Navigate } from 'react-router-dom';
import { api } from '../api/axiosInstance';

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
const TOKEN_KEY = 'access_token';
const USE_MOCK = import.meta.env.VITE_USE_MOCK?.toLowerCase() === 'true';

// 로컬스토리지 유저 읽기/쓰기
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
      localStorage.setItem('username', u.username);
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
        if (USE_MOCK) {
          // mock 모드에서는 로컬스토리지에서 바로 복구
          const u = readUserFromStorage();
          if (alive) setUser(u);
        } else {
          const token = localStorage.getItem(TOKEN_KEY);
          if (!token) {
            setUser(null);
          } else {
            const res = await api.get('/auth/me');
            if (alive) {
              const u: User = { username: res.data.username, email: res.data.email };
              setUser(u);
              writeUserToStorage(u);
            }
          }
        }
      } catch {
        if (alive) setUser(null);
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  // 로그인
  const login = async (email: string, password: string) => {
    setError(null);
    if (USE_MOCK) {
      // 회원가입 시 저장된 이름 그대로 복구
      const storedUser = readUserFromStorage();
      if (storedUser && storedUser.email === email) {
        setUser(storedUser);
        writeUserToStorage(storedUser);
      } else {
        const u: User = { username: email.split('@')[0], email };
        setUser(u);
        writeUserToStorage(u);
      }
      return;
    }
    try {
      const res = await api.post('/users/login', { email, password });
      if (res.data?.token) {
        localStorage.setItem(TOKEN_KEY, res.data.token);
        const me = await api.get('/auth/me');
        const u: User = { username: me.data.username, email: me.data.email };
        setUser(u);
        writeUserToStorage(u);
      }
    } catch (err) {
      setError('로그인 실패');
      throw err;
    }
  };

  // 로그아웃
  const logout = async () => {
    setError(null);
    if (USE_MOCK) {
      setUser(null);
      writeUserToStorage(null);
      return;
    }
    try {
      await api.post('/users/logout');
    } finally {
      setUser(null);
      writeUserToStorage(null);
      localStorage.removeItem(TOKEN_KEY);
    }
  };

  // 회원가입
  const signup = async (username: string, email: string, password: string) => {
    setError(null);
    if (USE_MOCK) {
      const u: User = { username: username.trim() || '사용자', email: email.trim() };
      setUser(u);
      writeUserToStorage(u);
      return;
    }
    try {
      await api.post('/users/signup', { name: username, email, password });
      await login(email, password); // 회원가입 후 자동 로그인
    } catch (err) {
      setError('회원가입 실패');
      throw err;
    }
  };

  const value: AuthContextValue = useMemo(
    () => ({
      user,
      isLoading,
      isAuthed: !!user,
      login,
      logout,
      signup,
      setUserUnsafe: (u) => {
        setUser(u);
        writeUserToStorage(u);
      },
      error,
    }),
    [user, isLoading, error]
  );

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
}: {
  children: ReactElement;
  fallback?: ReactNode;
}) {
  const { isLoading, isAuthed } = useAuth();
  if (isLoading) return <>{fallback}</>;
  if (!isAuthed) return <Navigate to="/login" replace />;
  return children;
}
