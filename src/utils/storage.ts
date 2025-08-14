export const storage = {
  get<T>(key: string, fallback: T): T {
    try {
      if (typeof window === 'undefined') return fallback;
      const raw = localStorage.getItem(key);
      return raw ? (JSON.parse(raw) as T) : fallback;
    } catch {
      return fallback;
    }
  },
  set<T>(key: string, value: T): void {
    try {
      if (typeof window === 'undefined') return;
      localStorage.setItem(key, JSON.stringify(value));
    } catch {}
  },
  remove(key: string): void {
    try {
      if (typeof window === 'undefined') return;
      localStorage.removeItem(key);
    } catch {}
  },
};

export type Folder = {
  id: number;
  name: string;
  createdAt?: string;   // 폴더 생성 시 기록
  modifiedAt?: string;  // 폴더 수정 시 기록
};

/* ---------- 개인 스페이스 ---------- */
export const foldersKey = (username: string) => `folders:${username}`;

export function loadFolders(username: string): Folder[] {
  return storage.get<Folder[]>(foldersKey(username), []);
}

export function saveFolders(username: string, folders: Folder[]): void {
  storage.set<Folder[]>(foldersKey(username), folders);
}

/* ---------- 팀 스페이스 ---------- */
export const teamFoldersKey = (username: string) => `teamFolders:${username}`;

export function loadTeamFolders(username: string): Folder[] {
  return storage.get<Folder[]>(teamFoldersKey(username), []);
}

export function saveTeamFolders(username: string, folders: Folder[]): void {
  storage.set<Folder[]>(teamFoldersKey(username), folders);
}

// localStorage.clear(); 로 로컬 스토리지 전체 초기화 가능
