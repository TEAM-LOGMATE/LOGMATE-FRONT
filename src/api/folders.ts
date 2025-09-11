import { api } from "./axiosInstance";

// 개인 폴더 생성
export const createPersonalFolder = async (userId: number, name: string) => {
  const token = localStorage.getItem("access_token");
  const res = await api.post(
    `/api/folders/personal/${userId}`,
    { name },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return res.data.data; // 폴더 객체
};

// 개인 폴더 조회
export const getPersonalFolders = async (userId: number) => {
  const token = localStorage.getItem("access_token");
  const res = await api.get(`/api/folders/personal/${userId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data.data; // 폴더 배열
};

// 폴더 수정 (개인/팀 공통)
export const updateFolder = async (folderId: number, name: string) => {
  const token = localStorage.getItem("access_token");
  const res = await api.put(
    `/api/folders/${folderId}`,
    { name },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return res.data.data; // 수정된 폴더 객체
};

// 폴더 삭제 (개인/팀 공통)
export const deleteFolder = async (folderId: number) => {
  const token = localStorage.getItem("access_token");
  const res = await api.delete(`/api/folders/${folderId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};
