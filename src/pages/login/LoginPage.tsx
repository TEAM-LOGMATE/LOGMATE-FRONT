import { useState, useEffect } from 'react';
import Input54 from '../../components/input/54';
import BtnSign from '../../components/btn/btn-sign';
import BtnSnsLogin from '../../components/btn/btn-sns-login';
import ErrorToast from '../../components/text/error-toast';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../../utils/AuthContext';

export default function LoginPage() {
  const navigate = useNavigate();
  const { login, error: authError } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [toastTrigger, setToastTrigger] = useState(0);

  // 배경 스크롤 잠금
  useEffect(() => {
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, []);

  // 에러 토스트 자동 사라짐
  useEffect(() => {
    if (errorMessage) {
      const timer = setTimeout(() => setErrorMessage(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [errorMessage]);

  // 토스트 표시 헬퍼
  const emitError = (msg: string) => {
    setErrorMessage(null); // 먼저 초기화
    requestAnimationFrame(() => {
      setErrorMessage(msg);
      setToastTrigger((t) => t + 1);
    });
  };

  const handleLogin = async () => {
    const e = email.trim().toLowerCase();

    // 클라이언트 선검증
    if (!e || !password) {
      emitError('이메일과 비밀번호를 입력하세요.');
      return;
    }

    try {
      setErrorMessage(null);
      await login(e, password);
      navigate('/personal');
    } catch (err: any) {
      emitError(err?.message ?? '');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -30 }}
      transition={{ duration: 0.4 }}
      className="w-screen h-screen overflow-hidden flex justify-center items-center bg-[#091104]"
    >
      <div className="flex flex-col items-center w-[480px] gap-[55px] flex-shrink-0">
        {/* 로고 + 제목 */}
        <div className="flex flex-col items-center gap-[20px]">
          <div
            className="bg-white text-black text-[12px] font-bold leading-[150%] tracking-[-0.4px]
                       font-suit flex justify-center items-center 
                       px-[1px] py-[3px] aspect-square"
            style={{ width: '30px' }}
          >
            로고
          </div>

          <h1 className="text-white text-[28px] font-bold leading-[135%] tracking-[-0.4px]">
            기존 계정으로 로그인
          </h1>
        </div>

        {/* 이메일 */}
        <div className="flex flex-col items-start gap-[12px] w-full">
          <label className="text-[#F2F2F2] text-[14px] font-medium leading-[150%] tracking-[-0.4px]">
            이메일 <span className="text-[#FF6F6F]">*</span>
          </label>
          <Input54
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="이메일을 입력하세요"
            showIcon={false}
          />
        </div>

        {/* 비밀번호 */}
        <div className="flex flex-col items-start gap-[12px] w-full">
          <label className="text-[#F2F2F2] text-[14px] font-medium leading-[150%] tracking-[-0.4px]">
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
        </div>

        {/* 로그인 버튼 + 에러 토스트 */}
        <div className="relative w-full flex flex-col items-center mt-[16px]">
          {errorMessage && (
            <div className="absolute bottom-[calc(100%+16px)]">
              <ErrorToast message={errorMessage} trigger={toastTrigger} />
            </div>
          )}
          <BtnSign onClick={handleLogin}>로그인</BtnSign>
        </div>

        {/* SNS 로그인 */}
        <div className="flex flex-row justify-between items-center gap-[12px] w-full">
          <BtnSnsLogin type="google">Google</BtnSnsLogin>
          <BtnSnsLogin type="github">GitHub</BtnSnsLogin>
        </div>

        {/* 하단 링크 */}
        <div className="flex flex-col items-center gap-[60px] w-[480px]">
          <div className="flex items-center gap-[14px]">
            <div
              className="flex justify-center items-center w-[112px] py-[11px] px-[16px] gap-[10px]
                         text-[#AEAEAE] text-[14px] leading-[130%] font-suit font-normal text-center
                         cursor-pointer hover:text-white transition"
              onClick={() => navigate('/signup')}
            >
              새 계정 만들기
            </div>

            <div className="flex items-center h-[16px]">
              <svg xmlns="http://www.w3.org/2000/svg" width="2" height="17" viewBox="0 0 2 17" fill="none">
                <path d="M1 0.5L1 16.5" stroke="#888888" />
              </svg>
            </div>

            <div className="flex justify-center items-center w-[112px] py-[11px] px-[16px] gap-[10px]
                            text-[#AEAEAE] text-[14px] leading-[130%] font-suit font-normal text-center">
              비밀번호 찾기
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
