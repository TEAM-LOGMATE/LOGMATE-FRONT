import axios from "axios";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: false, // 쿠키 인증이면 true
});

// 요청 인터셉터 - 토큰 자동 첨부 (로그인/회원가입은 제외)
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("access_token");

  // 로그인/회원가입 API는 토큰 필요 없음
  const skipAuthUrls = ["/users/login", "/users/signup", "/users/check-email"];
  const shouldSkip = skipAuthUrls.some((url) => config.url?.includes(url));

  if (token && !shouldSkip) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// 로그 스트리밍 서버용 인스턴스 분리 
export const logApi = axios.create({
  baseURL: import.meta.env.VITE_WS_BASE_URL.replace("wss://", "https://"), // ws → http 변환
  withCredentials: false,
});

//  토큰 첨부
logApi.interceptors.request.use((config) => {
  const token = localStorage.getItem("access_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
