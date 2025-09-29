import { useState, useEffect } from 'react';
import Input54 from '../../components/input/54';
import BtnSign from '../../components/btn/btn-sign';
import ErrorToast from '../../components/text/error-toast';
import { useNavigate } from 'react-router-dom';
import {
  isValidEmail,
  isValidPassword,
  isValidUsername,
  doPasswordsMatch,
} from '../../utils/validate';
import { motion } from 'framer-motion';
import type { Variants } from 'framer-motion';
import { useAuth } from '../../utils/AuthContext';
import Logo from '../../components/icon/logo';
import { api } from '../../api/axiosInstance';

export default function SignupPage() {
  const navigate = useNavigate();
  const { signup } = useAuth();

  useEffect(() => {
    const originalStyle = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = originalStyle;
    };
  }, []);

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // 이메일 중복 확인 상태
  const [emailCheckResult, setEmailCheckResult] = useState<'idle' | 'valid' | 'duplicate'>('idle');

  // 이메일 변경 시 중복확인 초기화
  useEffect(() => {
    setEmailCheckResult('idle');
  }, [email]);

  const handleCheckDuplicate = async () => {
    const trimmedEmail = email.trim().toLowerCase();
    if (!isValidEmail(trimmedEmail)) {
      setEmailCheckResult('idle');
      return;
    }

    try {
      const res = await api.get('/api/users/check-email', {
        params: { email: trimmedEmail },
      });

      const msg: string = res.data;
      if (msg.includes('사용 가능')) {
        setEmailCheckResult('valid');
      } else if (msg.includes('이미 사용')) {
        setEmailCheckResult('duplicate');
      } else {
        setEmailCheckResult('idle');
      }
    } catch (err: any) {
      console.error(err);
      const msg = err.response?.data;
      const text = typeof msg === 'string' ? msg : msg?.message;

      if (text && text.includes('이미 사용')) {
        setEmailCheckResult('duplicate');
        return;
      }

      setErrorMessage('이메일 중복 확인 중 서버 오류가 발생했습니다.');
      setTimeout(() => setErrorMessage(''), 3000);
    }
  };

  // 유효성 검사
  const isFormValid =
    username.trim() !== '' &&
    isValidUsername(username) &&
    isValidEmail(email) &&
    emailCheckResult === 'valid' &&
    isValidPassword(password) &&
    doPasswordsMatch(password, passwordConfirm);

  // 회원가입 처리
  const handleSubmit = async () => {
    if (!isFormValid) {
      setErrorMessage('모든 정보를 올바르게 입력해 주세요.');
      setTimeout(() => setErrorMessage(''), 3000);
      return;
    }

    try {
      await signup({
        name: username.trim(),
        email: email.trim().toLowerCase(),
        password,
      });
      setErrorMessage('');
      navigate('/login');
    } catch (err: any) {
      console.error(err);
      if (err.response?.status === 400) {
        setErrorMessage(err.response.data.message || '이미 사용 중인 이메일입니다.');
      } else if (err.response?.status === 500) {
        setErrorMessage('서버 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.');
      } else {
        setErrorMessage('네트워크 오류가 발생했습니다.');
      }
      setTimeout(() => setErrorMessage(''), 3000);
    }
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.25, 0.1, 0.25, 1] } },
    exit: { opacity: 0, y: -30, transition: { duration: 0.4, ease: [0.25, 0.1, 0.25, 1] } },
  };

  const disableCheck = !isValidEmail(email);

  return (
    <motion.div
      variants={itemVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="w-screen h-screen flex justify-center items-center bg-[#111]"
    >
      <div className="w-[1920px] flex justify-center items-center py-[80px]">
        <div className="w-[480px] flex flex-col items-center gap-[40px] flex-shrink-0">
          {/* 로고 + 제목 */}
          <div className="flex flex-col items-center gap-[20px]">
            <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6 }}>
              <Logo width={24} height={28} />
            </motion.div>
            <h1 className="text-white text-[28px] font-bold leading-[135%] tracking-[-0.4px]">
              새 계정 만들기
            </h1>
          </div>

          {/* 입력 영역 + 폼 */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSubmit();
            }}
            className="flex flex-col items-start gap-[20px] w-full"
          >
            {/* 사용자 이름 */}
            <div className="flex flex-col gap-[12px] w-full">
              <label className="text-[#F2F2F2] text-[14px] font-medium">
                사용자 이름 <span className="text-[#FF6F6F]">*</span>
              </label>
              <Input54
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="사용할 이름을 입력하세요"
              />
              <span className="min-h-[16px] text-[12px] text-[#FF6F6F]">
                {username.length > 0 && !isValidUsername(username)
                  ? '사용자 이름이 유효하지 않습니다.'
                  : <span className="invisible">유효성 검사 메시지 자리</span>}
              </span>
            </div>

            {/* 이메일 */}
            <div className="flex flex-col gap-[12px] w-full">
              <label className="text-[#F2F2F2] text-[14px] font-medium">
                이메일 <span className="text-[#FF6F6F]">*</span>
              </label>
              <div className="flex h-[54px] px-[12px] py-[15px] justify-between items-center self-stretch border border-[#222] bg-[#171717] rounded-[12px]">
                <input
                  type="email"
                  autoComplete="email"
                  placeholder="이메일을 입력하세요"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-transparent text-[#D8D8D8] text-[14px] outline-none flex-1 pr-2"
                />
                <button
                  onClick={handleCheckDuplicate}
                  type="button"
                  disabled={disableCheck}
                  className={`h-[36px] px-[12px] py-[10px] flex justify-center items-center text-[12px] rounded-[4px] border
                    ${disableCheck
                      ? 'text-[#6E6E6E] border-[#333] cursor-not-allowed'
                      : 'text-[#4FE75E] border-[#4FE75E]'
                    }`}
                >
                  중복확인
                </button>
              </div>
              <span
                className={`min-h-[16px] text-[12px] mt-[4px] ${
                  !isValidEmail(email) && email.length > 0
                    ? 'text-[#FF6F6F]'
                    : emailCheckResult === 'valid'
                    ? 'text-[#4FE75E]'
                    : emailCheckResult === 'duplicate'
                    ? 'text-[#FF6F6F]'
                    : 'invisible'
                }`}
              >
                {email.length > 0 && !isValidEmail(email)
                  ? '이메일 형식이 올바르지 않습니다.'
                  : emailCheckResult === 'valid'
                  ? '사용 가능한 이메일입니다'
                  : emailCheckResult === 'duplicate'
                  ? '이미 사용 중인 이메일입니다.'
                  : 'placeholder'}
              </span>
            </div>

            {/* 비밀번호 */}
            <div className="flex flex-col gap-[12px] w-full">
              <label className="text-[#F2F2F2] text-[14px] font-medium">
                비밀번호 <span className="text-[#FF6F6F]">*</span>
              </label>
              <Input54
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="비밀번호를 입력하세요"
                done={showPassword}
                onDone={setShowPassword}
                showIcon={true}
              />
              <span
                aria-live="polite"
                className={`min-h-[16px] text-[12px] mt-[4px] ${
                  password.length === 0
                    ? 'text-[#888888]'
                    : !isValidPassword(password)
                    ? 'text-[#FF6F6F]'
                    : 'invisible'
                }`}
              >
                {password.length === 0
                  ? '영문, 숫자, 특수문자 포함 8자 이상 입력해 주세요'
                  : !isValidPassword(password)
                  ? '비밀번호는 영문과 숫자, 특수문자를 모두 포함해야 합니다'
                  : 'placeholder'}
              </span>
            </div>

            {/* 비밀번호 확인 */}
            <div className="flex flex-col gap-[12px] w-full">
              <label className="text-[#F2F2F2] text-[14px] font-medium">
                비밀번호 확인 <span className="text-[#FF6F6F]">*</span>
              </label>
              <Input54
                type={showPasswordConfirm ? 'text' : 'password'}
                value={passwordConfirm}
                onChange={(e) => setPasswordConfirm(e.target.value)}
                placeholder="비밀번호를 다시 입력하세요"
                done={showPasswordConfirm}
                onDone={setShowPasswordConfirm}
                showIcon={true}
              />
              <span aria-live="polite" className="min-h-[16px] text-[12px] mt-[4px] text-[#FF6F6F]">
                {passwordConfirm.length > 0 && !doPasswordsMatch(password, passwordConfirm)
                  ? '비밀번호가 일치하지 않습니다.'
                  : <span className="invisible">유효성 검사 메시지 자리</span>}
              </span>
            </div>

            {/* 계정 만들기 버튼 */}
            <div className="w-full flex flex-col items-center gap-2 relative">
              {errorMessage && (
                <div className="absolute -top-[52px] z-50 animate-fade-in-out [animation-fill-mode:forwards]">
                  <ErrorToast message={errorMessage} />
                </div>
              )}
              <BtnSign type="submit" isActive={isFormValid}>
                계정 만들기
              </BtnSign>
            </div>
          </form>

          {/* 하단 링크 */}
          <div className="flex items-center">
            <div
              className="flex justify-center items-center w-[112px] py-[11px] px-[16px] gap-[10px]
                         text-[#AEAEAE] text-[14px] font-suit cursor-pointer hover:text-white transition"
              onClick={() => navigate('/login')}
            >
              로그인하기
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
