/* ===========================
   API 타입 정의 (백엔드와 통신할 때)
   =========================== */
export type ApiRole = 'ADMIN' | 'MEMBER' | 'VIEWER';  

export type ApiMember = {
  email: string;  
  role?: ApiRole;
  remove?: boolean;
};

export type ApiTeam = {
  id: number;
  name: string;
  description?: string;
  members: ApiMember[];
  createdAt?: string;
  updatedAt?: string;
  teamFolderId?: number;  
  myRole?: ApiRole;      
};

/* ===========================
   UI 타입 정의 (프론트에서만 사용)
   =========================== */
export type UiRole = 'teamAdmin' | 'member' | 'viewer';

export type UiMember = {
  userId?: number;  // 프론트에서만 쓰는 선택적 값 (백엔드로 안 보냄)
  name: string;
  email: string;
  role: UiRole;
};

/* ===========================
   Folder & Team (공용)
   =========================== */
export type Folder = {
  id: number;
  name: string;
  description?: string;
  spaceType: 'personal' | 'team';
  createdAt?: string;
  updatedAt?: string;
  boards?: {
    id: number;
    name: string;
    logPath?: string;
    lastEdited?: string;
    status?: 'collecting' | 'unresponsive' | 'before';
  }[];
};

// Team = Folder + UI 멤버 + 백엔드 전용 속성
export type Team = Folder & {
  members?: UiMember[];
  teamFolderId?: number; 
  myRole?: ApiRole;       
};
