import { api } from "./axiosInstance";

export type ApiMember = {
  name: string;
  email: string;
  role: "ADMIN" | "MEMBER" | "VIEWER";
};

export type TeamDetailResponse = {
  id: number;
  name: string;
  description?: string;
  teamFolderId: number;
  members: ApiMember[];
};

// 팀 생성
export const createTeam = async (data: {
  name: string;
  description?: string;
  members: { email: string; role?: string }[];
}) => {
  const res = await api.post("/api/teams", data);
  return res.data;
};

// 팀 조회 (본인 속한 팀 목록)
export const getTeams = async () => {
  const res = await api.get("/api/teams");
  return res.data;
};

// 팀 상세 조회 (id 기준)
export const getTeamDetail = async (teamId: number) => {
  const res = await api.get<{ status: number; message: string; data: TeamDetailResponse }>(
    `/api/teams/${teamId}`
  );
  return res.data.data; 
};

// 팀 수정 (이름/설명/멤버 변경)
export const updateTeam = async (
  teamId: number,
  data: {
    name?: string;
    description?: string;
    members?: { email: string; role?: string; remove?: boolean }[];
  }
) => {
  const res = await api.put(`/api/teams/${teamId}`, data);
  return res.data;
};

// 팀 삭제
export const deleteTeam = async (teamId: number) => {
  const res = await api.delete(`/api/teams/${teamId}`);
  return res.data;
};
