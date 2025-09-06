import { api } from "./axiosInstance";

// 1. 팀 생성
export const createTeam = async (data: {
  name: string;
  description?: string;
  members: { userId: number; role?: string; remove?: boolean }[];
}) => {
  const res = await api.post("/api/teams", data);
  return res.data;
};

// 2. 팀 조회 (본인 속한 팀 목록)
export const getTeams = async () => {
  const res = await api.get("/api/teams");
  return res.data;
};

// 3. 팀 수정 (이름/설명/멤버 변경)
export const updateTeam = async (
  teamId: number,
  data: {
    name?: string;
    description?: string;
    members?: { userId: number; role?: string; remove?: boolean }[];
  }
) => {
  const res = await api.put(`/api/teams/${teamId}`, data);
  return res.data;
};

/* 
// ⚠️ 현재 API 명세서에 없음 (백엔드 추가 시 사용 가능)

// 4. 팀 멤버 권한 변경
export const updateMemberRole = async (
  teamId: number,
  data: { userId: number; role: "MANAGER" | "MEMBER" | "VIEWER" }
) => {
  const res = await api.put(`/api/teams/${teamId}/members/role`, data);
  return res.data;
};

// 5. 팀 초대 URL 발급
export const generateInviteUrl = async (teamId: number) => {
  const res = await api.post(`/api/teams/${teamId}/invite`);
  return res.data; // { inviteUrl: string }
};
*/
