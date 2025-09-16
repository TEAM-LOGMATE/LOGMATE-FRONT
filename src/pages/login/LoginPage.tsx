import { useState, useEffect } from 'react';
import Input54 from '../../components/input/54';
import BtnSign from '../../components/btn/btn-sign';
import BtnSnsLogin from '../../components/btn/btn-sns-login';
import ErrorToast from '../../components/text/error-toast';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../../utils/AuthContext';
import Logo from '../../components/icon/logo';

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();

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
    setErrorMessage(null);
    requestAnimationFrame(() => {
      setErrorMessage(msg);
      setToastTrigger((t) => t + 1);
    });
  };

  const handleLogin = async () => {
    const e = email.trim().toLowerCase();
    if (!e || !password) {
      emitError('이메일과 비밀번호를 입력하세요.');
      return;
    }
    try {
      setErrorMessage(null);
      await login(e, password);
      navigate('/personal');
    } catch (err: any) {
      if (err.response?.status === 400 || err.response?.status === 401) {
        emitError('이메일이나 비밀번호가 올바르지 않습니다.');
      } else if (err.response?.status === 500) {
        emitError('서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
      } else {
        emitError('네트워크 오류가 발생했습니다.');
      }
    }
  };

  // Animation Variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4, ease: ['easeOut'] as any }
    }
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="w-screen h-screen overflow-hidden flex justify-center items-center bg-[#111]"
    >
      <motion.div
        variants={containerVariants}
        className="flex flex-col items-center w-[480px] gap-[55px] flex-shrink-0"
      >
        {/* 로고 + 제목 */}
        <motion.div variants={itemVariants} className="flex flex-col items-center gap-[20px]">
          {/* 로고 */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
          >
            <Logo width={24} height={28} />
          </motion.div>

          <h1 className="text-white text-[28px] font-bold leading-[135%] tracking-[-0.4px]">
            기존 계정으로 로그인
          </h1>
        </motion.div>

        {/* 로그인 폼 */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleLogin();
          }}
          className="flex flex-col items-center gap-[24px] w-full"
        >
          {/* 이메일 */}
          <motion.div variants={itemVariants} className="flex flex-col items-start gap-[12px] w-full">
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
          </motion.div>

          {/* 비밀번호 */}
          <motion.div variants={itemVariants} className="flex flex-col items-start gap-[12px] w-full">
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
          </motion.div>

          {/* 로그인 버튼 + 에러 토스트 */}
          <motion.div variants={itemVariants} className="relative w-full flex flex-col items-center mt-[16px]">
            {errorMessage && (
              <div className="absolute bottom-[calc(100%+16px)]">
                <ErrorToast message={errorMessage} trigger={toastTrigger} />
              </div>
            )}
            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} className="w-full">
              <BtnSign type="submit">로그인</BtnSign>
            </motion.div>
          </motion.div>
        </form>

        {/* SNS 로그인 */}
        <motion.div variants={itemVariants} className="flex flex-row justify-between items-center gap-[12px] w-full">
          <BtnSnsLogin type="google">Google</BtnSnsLogin>
          <BtnSnsLogin type="github">GitHub</BtnSnsLogin>
        </motion.div>

        {/* 하단 링크 */}
        <motion.div variants={itemVariants} className="flex flex-col items-center gap-[60px] w-[480px]">
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
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
