import { api } from "./axiosInstance";

// 1. 대시보드 생성
export const createDashboard = async (data: {
  name: string;
  logPath: string;
  sendTo: string;
}) => {
  const res = await api.post("/api/dashboards", data);
  return res.data;
};

// 2. 대시보드 조회 (특정 팀의 모든 대시보드)
export const getDashboards = async (teamId: number) => {
  const res = await api.get(`/api/teams/${teamId}/dashboards`);
  return res.data;
};

// 3. 대시보드 수정 (특정 팀의 특정 대시보드)
export const updateDashboard = async (
  teamId: number,
  dashboardId: number,
  data: {
    name?: string;
    logPath?: string;
    sendTo?: string;
  }
) => {
  const res = await api.put(`/api/teams/${teamId}/dashboards/${dashboardId}`, data);
  return res.data;
};

/* 
// ⚠️ 현재 명세서에 "삭제" API 없음 → 추후 백엔드가 구현하면 사용 가능
export const deleteDashboard = async (teamId: number, dashboardId: number) => {
  const res = await api.delete(`/api/teams/${teamId}/dashboards/${dashboardId}`);
  return res.data;
};
*/
