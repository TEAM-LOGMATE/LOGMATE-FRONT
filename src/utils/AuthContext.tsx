import { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { ReactNode, ReactElement } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { api } from "../api/axiosInstance";

export type User = { username: string; email: string };

type AuthContextValue = {
  user: User | null;
  isLoading: boolean;
  initializing: boolean;
  isAuthed: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  signup: (username: string, email: string, password: string) => Promise<void>;
  setUserUnsafe?: (u: User | null) => void;
  error?: string | null;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const LS_KEY = "authUser";
const TOKEN_KEY = "access_token";
const USE_MOCK = import.meta.env.VITE_USE_MOCK?.toLowerCase() === "true";

// ── helpers
function readUserFromStorage(): User | null {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (!raw) return null;
    const p = JSON.parse(raw);
    if (p && typeof p.username === "string" && typeof p.email === "string") return p as User;
    return null;
  } catch {
    return null;
  }
}
function writeUserToStorage(u: User | null) {
  try {
    if (u) {
      localStorage.setItem(LS_KEY, JSON.stringify(u));
      localStorage.setItem("username", u.username);
    } else {
      localStorage.removeItem(LS_KEY);
      localStorage.removeItem("username");
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
function parseJwtPayload(token?: string): any | null {
  try {
    if (!token) return null;
    const base = token.split(".")[1];
    if (!base) return null;
    const json = atob(base.replace(/-/g, "+").replace(/_/g, "/"));
    return JSON.parse(json);
  } catch {
    return null;
  }
}
function synthesizeUser(token?: string): User {
  const fromLS = localStorage.getItem("username") || "";
  const payload = parseJwtPayload(token);
  const email =
    (payload && (payload.email || payload.mail)) ||
    (fromLS ? `${fromLS}@local` : "viewer@local");
  const username =
    fromLS ||
    (payload && (payload.username || payload.name || (payload.email?.split("@")[0] ?? "viewer"))) ||
    "viewer";
  return { username, email };
}

// ── provider
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

        if (USE_MOCK) {
          if (alive) setUser(stored);
          return;
        }

        // 임베드(썸네일/iframe)일 때는 네트워크 확인을 SKIP
        if (isEmbed) {
          const u = stored ?? synthesizeUser(token);
          if (alive) {
            setUser(u);
            writeUserToStorage(u);
          }
          return;
        }

        // 일반 화면: 토큰 있으면 서버 확인, 없으면 비인증
        if (!token) {
          if (alive) setUser(null);
          return;
        }
        try {
          const res = await api.get("/api/auth/me");
          if (alive) {
            const u: User = { username: res.data.name, email: res.data.email };
            setUser(u);
            writeUserToStorage(u);
          }
        } catch {
          if (alive) setUser(null);
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

  // auth actions
  const login = async (email: string, password: string) => {
    setError(null);
    if (USE_MOCK) {
      const storedUser = readUserFromStorage();
      if (storedUser && storedUser.email === email) {
        setUser(storedUser);
        writeUserToStorage(storedUser);
      } else {
        const u: User = { username: email.split("@")[0], email };
        setUser(u);
        writeUserToStorage(u);
      }
      return;
    }
    try {
      const res = await api.post("/api/auth/login", { email, password });
      if (res.data?.token) {
        localStorage.setItem(TOKEN_KEY, res.data.token);
        const me = await api.get("/api/auth/me");
        const u: User = { username: me.data.name, email: me.data.email };
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
    if (USE_MOCK) {
      setUser(null);
      writeUserToStorage(null);
      return;
    }
    // 서버에 logout API 없음 → 프론트에서 토큰만 제거
    setUser(null);
    writeUserToStorage(null);
    localStorage.removeItem(TOKEN_KEY);
  };

  const signup = async (username: string, email: string, password: string) => {
    setError(null);
    if (USE_MOCK) {
      const u: User = { username: username.trim() || "사용자", email: email.trim() };
      setUser(u);
      writeUserToStorage(u);
      return;
    }
    try {
      await api.post("/api/users/signup", { name: username, email, password });
      await login(email, password); // 회원가입 후 자동 로그인
    } catch (err) {
      setError("회원가입 실패");
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

// ── ProtectedRoute: 임베드는 무조건 통과
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

  if (isEmbed) return children; // 미리보기는 인증 체크 생략
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
