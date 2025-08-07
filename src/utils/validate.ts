// 이메일 유효성 검사
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// 비밀번호 유효성 검사 (8자 이상 + 영문 + 숫자 + 특수문자 포함)
export const isValidPassword = (password: string): boolean => {
  const lengthOK = password.length >= 8;
  const hasEnglish = /[a-zA-Z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecial = /[^a-zA-Z0-9]/.test(password);
  return lengthOK && hasEnglish && hasNumber && hasSpecial;
};

// 사용자 이름 유효성 검사 (2자 이상, 한글 또는 영문만)
export const isValidUsername = (username: string): boolean => {
  const usernameRegex = /^[a-zA-Z가-힣]{2,}$/;
  return usernameRegex.test(username.trim());
};

// 비밀번호 일치 여부 확인
export const doPasswordsMatch = (pw: string, confirmPw: string): boolean => {
  return pw === confirmPw;
};
