// utils/type.ts

/* ===========================
   API 타입 정의 (백엔드와 통신할 때)
   =========================== */
export type ApiRole = 'ADMIN' | 'MEMBER' | 'VIEWER';  

export type ApiMember = {
  userId: number;          
  role: ApiRole;
  remove?: boolean;
};

export type ApiTeam = {
  id: number;
  name: string;
  description?: string;
  members: ApiMember[];
  createdAt?: string;
  updatedAt?: string;
};

/* ===========================
   UI 타입 정의 (프론트에서만 사용)
   =========================== */
export type UiRole = 'teamAdmin' | 'member' | 'viewer';

export type UiMember = {
  userId?: number;  
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

// Team = Folder + UI 멤버
export type Team = Folder & {
  members?: UiMember[];
};
