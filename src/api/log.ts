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
    // 서버가 data 안에 또 data를 중첩해서 주는 경우 처리
    const logs =
      response.data?.data ??
      response.data?.result ??
      response.data ??
      [];

    if (Array.isArray(logs)) {
      console.log("[fetchLogs 정상 수신] 로그 개수:", logs.length);
      return logs;
    } else {
      console.warn("[fetchLogs] 예상치 못한 응답 구조:", response.data);
      return [];
    }
  } catch (error: any) {
    console.error(" [fetchLogs 실패]", error?.response || error);
    return [];
  }
};
