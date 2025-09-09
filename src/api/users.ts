import { api } from "./axiosInstance";

type LoginResponse = {
  token: string;
  userId: number;
  email: string;
  userName: string; 
};

// 회원가입
export const signup = (data: { email: string; password: string; name: string }) =>
  api.post("/api/users/signup", data);

// 로그인
export const login = async (data: { email: string; password: string }) => {
  const res = await api.post<LoginResponse>("/api/users/login", data);

  // 토큰 저장
  localStorage.setItem("access_token", res.data.token);

  // 유저 정보도 같이 저장
  localStorage.setItem("userId", String(res.data.userId));
  localStorage.setItem("email", res.data.email);
  localStorage.setItem("username", res.data.userName);

  return res.data;
};
