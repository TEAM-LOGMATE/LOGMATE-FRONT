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


export const foldersKey = (username: string) => `folders:${username}`;

export function loadFolders(username: string): Folder[] {
  return storage.get<Folder[]>(foldersKey(username), []);
}

export function saveFolders(username: string, folders: Folder[]): void {
  storage.set<Folder[]>(foldersKey(username), folders);
}


//localStorage.clear(); 이거로 로컬 스토리지 초기화 가능