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
  return res.data.data; // 배열만 반환
};

// 팀 상세 조회 (id 기준)
export const getTeamDetail = async (teamId: number) => {
  const res = await api.get<{
    status: number;
    message: string;
    data: TeamDetailResponse;
  }>(`/api/teams/${teamId}`);
  return res.data.data;
};

// 팀 폴더 조회 (팀 ID 기준)
export const getTeamFolders = async (teamId: number) => {
  const res = await api.get<{
    status: number;
    message: string;
    data: { id: number; name: string; createdAt: string; updatedAt: string }[];
    timestamp: string;
  }>(`/api/folders/teams/${teamId}`);
  return res.data.data; // 실제 폴더 배열만 반환
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
