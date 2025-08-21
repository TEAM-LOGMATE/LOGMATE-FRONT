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

export type BoardStatus = "collecting" | "unresponsive" | "before";

export type Folder = {
  id: number;
  name: string;
  createdAt?: string;   // 폴더 생성 시 기록
  modifiedAt?: string;  // 폴더 수정 시 기록
  description?: string; // 폴더 설명
  spaceType: "personal" | "team"; // 개인 스페이스 또는 팀 스페이스
  boards?: {
    id: number;
    name: string;
    logPath?: string;
    lastEdited?: string;
    status?: BoardStatus; // 상태 필드 추가
  }[];
};

/* ---------- 개인 스페이스 ---------- */
export const foldersKey = (username: string) => `folders:${username}`;

export function loadFolders(username: string): Folder[] {
  const data = storage.get<Folder[]>(foldersKey(username), []);
  // 저장된 spaceType 있으면 유지, 없으면 personal
  return data.map(f => ({
    ...f,
    spaceType: f.spaceType ?? "personal",
    boards: f.boards?.map(b => ({
      ...b,
      status: b.status ?? "before", // 기본 상태 "before"
    })),
  }));
}

export function saveFolders(username: string, folders: Folder[]): void {
  storage.set<Folder[]>(foldersKey(username), folders);
}

/* ---------- 팀 스페이스 ---------- */
export const teamFoldersKey = (username: string) => `teamFolders:${username}`;

export function loadTeamFolders(username: string): Folder[] {
  const data = storage.get<Folder[]>(teamFoldersKey(username), []);
  // 저장된 spaceType 있으면 유지, 없으면 team
  return data.map(f => ({
    ...f,
    spaceType: f.spaceType ?? "team",
    boards: f.boards?.map(b => ({
      ...b,
      status: b.status ?? "before", //기본 상태 "before"
    })),
  }));
}

export function saveTeamFolders(username: string, folders: Folder[]): void {
  storage.set<Folder[]>(teamFoldersKey(username), folders);
}

// localStorage.clear(); 로 로컬 스토리지 전체 초기화 가능
