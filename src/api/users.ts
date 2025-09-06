import { api } from "./axiosInstance";

// 회원가입
export const signup = (data: { email: string; password: string; name: string }) =>
  api.post("/api/users/signup", data);

// 로그인
export const login = async (data: { email: string; password: string }) => {
  const res = await api.post<{ token: string }>("/api/auth/login", data);
  localStorage.setItem("access_token", res.data.token);
  return res.data;
};
