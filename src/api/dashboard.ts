import { api } from "./axiosInstance";

// 대시보드 생성 
export const createDashboard = async (
  folderId: number,
  data: {
    name: string;
    logPath: string;
  }
) => {
  const token = localStorage.getItem("access_token");
  const res = await api.post(`/api/folders/${folderId}/dashboards`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};

// 대시보드 조회 (특정 폴더의 모든 대시보드)
export const getDashboards = async (folderId: number) => {
  const token = localStorage.getItem("access_token");
  const res = await api.get(`/api/folders/${folderId}/dashboards`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};

// 대시보드 수정 (특정 폴더의 특정 대시보드)
export const updateDashboard = async (
  folderId: number,
  dashboardId: number,
  data: {
    name?: string;
    logPath?: string;
  }
) => {
  const token = localStorage.getItem("access_token");
  const res = await api.put(
    `/api/folders/${folderId}/dashboards/${dashboardId}`,
    data,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return res.data;
};

// 대시보드 삭제 (특정 폴더의 특정 대시보드)
export const deleteDashboard = async (folderId: number, dashboardId: number) => {
  const token = localStorage.getItem("access_token");
  const res = await api.delete(
    `/api/folders/${folderId}/dashboards/${dashboardId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return res.data;
};

// 대시보드 고급설정 저장
export const saveDashboardConfig = async (
  folderId: number,
  dashboardId: number,
  config: {
    tailer: {
      readIntervalMs: number;
      metaDataFilePathPrefix: string;
    };
    multiline: {
      enabled: boolean;
      maxLines: number;
    };
    exporter: {
      compressEnabled: boolean;
      retryIntervalSec: number;
      maxRetryCount: number;
    };
    filter: {
      allowedLevels: string[];
      requiredKeywords: string[];
      after: string; // ISO datetime string
    };
    puller: {
      intervalSec: number;
    };
  }
) => {
  const token = localStorage.getItem("access_token");
  const res = await api.post(
    `/api/folders/${folderId}/dashboards/${dashboardId}/config`,
    config,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return res.data;
};
