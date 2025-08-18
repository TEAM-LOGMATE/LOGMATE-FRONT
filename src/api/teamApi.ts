import { api } from './axiosInstance';

// 1. 팀 생성
export const createTeam = async (data: {
  name: string;
  description?: string;
  memberIds?: number[];
}) => {
  const res = await api.post('/teams', data);
  return res.data;
};

// 2. 팀 수정 (이름/설명)
export const updateTeam = async (teamId: number, data: {
  name?: string;
  description?: string;
}) => {
  const res = await api.put(`/teams/${teamId}`, data);
  return res.data;
};

// 3. 팀 멤버 권한 변경
export const updateMemberRole = async (teamId: number, data: {
  userId: number;
  role: 'MANAGER' | 'MEMBER' | 'VIEWER';
}) => {
  const res = await api.put(`/teams/${teamId}/members/role`, data);
  return res.data;
};

// 4. 팀 초대 URL 발급
export const generateInviteUrl = async (teamId: number) => {
  const res = await api.post(`/teams/${teamId}/invite`);
  return res.data; // 보통 { inviteUrl: string } 형태
};
