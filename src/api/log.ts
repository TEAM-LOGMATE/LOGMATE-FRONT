import { logApi } from "./axiosInstance";

/**
 * 로그 조회 API
 * GET /api/v1/streaming/logs/search
 */
export const fetchLogs = async (params: {
  agentId: string;
  logType: string;
  thNum: number;
  startTime?: string;
  endTime?: string;
}) => {
  try {
    const response = await logApi.get("/api/v1/streaming/logs/search", { params });
    return response.data;
  } catch (error: any) {
    console.error("[fetchLogs] API 요청 실패:", error);
    throw error.response?.data || error;
  }
};
