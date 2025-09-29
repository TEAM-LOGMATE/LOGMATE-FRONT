import { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { ReactNode, ReactElement } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { api } from "../api/axiosInstance";

// User 타입
export type User = {
  id: number;
  username: string; 
  email: string;
};

type AuthContextValue = {
  user: User | null;
  isLoading: boolean;
  initializing: boolean;
  isAuthed: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  signup: (data: { name: string; email: string; password: string }) => Promise<void>;
  setUserUnsafe?: (u: User | null) => void;
  error?: string | null;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const LS_KEY = "authUser";
const TOKEN_KEY = "access_token";

function readUserFromStorage(): User | null {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as User;
  } catch {
    return null;
  }
}
function writeUserToStorage(u: User | null) {
  try {
    if (u) {
      localStorage.setItem(LS_KEY, JSON.stringify(u));
    } else {
      localStorage.removeItem(LS_KEY);
    }
  } catch {}
}
function detectEmbed(): boolean {
  try {
    if (typeof window === "undefined") return false;
    const qs = new URLSearchParams(window.location.search);
    const isThumb = qs.get("thumb") === "1";
    const inIframe = window.self !== window.top;
    return isThumb || inIframe;
  } catch {
    return false;
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => readUserFromStorage());
  const [isLoading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;
    (async () => {
      setLoading(true);
      try {
        const isEmbed = detectEmbed();
        const stored = readUserFromStorage();
        const token: string | undefined = localStorage.getItem(TOKEN_KEY) ?? undefined;

        if (isEmbed) {
          if (alive && stored) setUser(stored);
          return;
        }

        if (!token) {
          if (alive) setUser(null);
          return;
        }

        if (alive && stored) {
          setUser(stored);
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

  const login = async (email: string, password: string) => {
    setError(null);
    try {
      const res = await api.post("/api/users/login", { email, password });

      if (res.data?.token) {
        localStorage.setItem(TOKEN_KEY, res.data.token);

        const u: User = {
          id: res.data.userId,
          username: res.data.userName,
          email: res.data.email,
        };

        setUser(u);
        writeUserToStorage(u);
      }
    } catch (err) {
      setError("로그인 실패");
      throw err;
    }
  };

  const logout = async () => {
    setError(null);
    setUser(null);
    writeUserToStorage(null);
    localStorage.removeItem(TOKEN_KEY);
  };

  const signup = async (data: { name: string; email: string; password: string }) => {
    setError(null);
    try {
      const res = await api.post("/api/users/signup", data);

      // 응답 유효성 확인
      if (!res || res.status !== 200 || !res.data?.id) {
        throw new Error(res.data?.message || "회원가입 실패");
      }

      const newUser: User = {
        id: res.data.id,
        username: res.data.name,
        email: res.data.email,
      };
      setUser(newUser);
      writeUserToStorage(newUser);

      await login(data.email, data.password);
    } catch (err: any) {
      setError(err.response?.data?.message || "회원가입 실패");
      throw err;
    }
  };

  const value: AuthContextValue = useMemo(
    () => ({
      user,
      isLoading,
      initializing: isLoading,
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
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

export function ProtectedRoute({
  children,
  fallback = null,
}: {
  children: ReactElement;
  fallback?: ReactNode;
}) {
  const { isLoading, isAuthed } = useAuth();
  const location = useLocation();

  const isEmbed = (() => {
    try {
      const q = new URLSearchParams(location.search);
      const byQuery = q.get("thumb") === "1";
      const inIframe = typeof window !== "undefined" && window.self !== window.top;
      return byQuery || inIframe;
    } catch {
      return false;
    }
  })();

  if (isEmbed) return children;
  if (isLoading) return <>{fallback}</>;
  if (!isAuthed)
    return (
      <Navigate
        to="/login"
        replace
        state={{ from: location.pathname + location.search }}
      />
    );
  return children;
}
