import { useState, useEffect } from 'react';
import Input54 from '../../components/input/54';
import BtnSign from '../../components/btn/btn-sign';
import BtnSnsLogin from '../../components/btn/btn-sns-login';
import ErrorToast from '../../components/text/error-toast';
import { useNavigate } from 'react-router-dom';
import { isValidEmail, isValidPassword, isValidUsername, doPasswordsMatch,} from '../../utils/validate';
import { motion } from 'framer-motion';
import { loadFolders, saveFolders } from '../../utils/storage';
import { useAuth } from '../../utils/AuthContext';

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

  const isFormValid =
    username.trim() !== '' &&
    email.trim() !== '' &&
    password.trim() !== '' &&
    passwordConfirm.trim() !== '' &&
    isValidUsername(username) &&
    isValidEmail(email) &&
    isValidPassword(password) &&
    doPasswordsMatch(password, passwordConfirm);

  const handleClick = async () => {
    if (!isFormValid) {
      setErrorMessage('모든 정보를 올바르게 입력해 주세요.');
      setTimeout(() => setErrorMessage(''), 3000);
      return;
    }

    try {

      await signup(username.trim(), email.trim().toLowerCase(), password);

      const existing = loadFolders(username);
      if (!Array.isArray(existing) || existing.length === 0) {
        saveFolders(username, []);
      }
      navigate('/login');
    } catch (e) {
      console.error(e);
      setErrorMessage('문제가 발생했어요. 잠시 후 다시 시도해 주세요.');
      setTimeout(() => setErrorMessage(''), 3000);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -30 }}
      transition={{ duration: 0.4 }}
      className="w-screen h-screen flex justify-center items-center bg-[#111]"
    >
      <div className="w-[1920px] flex justify-center items-center py-[80px]">
        <div className="w-[480px] flex flex-col items-center gap-[40px] flex-shrink-0">
          {/* 로고 + 제목 */}
          <div className="flex flex-col items-center gap-[20px]">
            <div
              className="bg-white text-black text-[12px] font-bold leading-[150%] tracking-[-0.4px]
                         font-suit flex justify-center items-center px-[1px] py-[3px] aspect-square"
              style={{ width: '30px' }}
            >
              로고
            </div>
            <h1 className="text-white text-[28px] font-bold leading-[135%] tracking-[-0.4px]">
              새 계정 만들기
            </h1>
          </div>

          {/* 입력 영역 */}
          <div className="flex flex-col items-start gap-[20px] w-full">
            {/* 사용자 이름 */}
            <div className="flex flex-col gap-[12px] w-full">
              <label className="text-[#F2F2F2] text-[14px] font-medium leading-[150%] tracking-[-0.4px]">
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
              <label className="text-[#F2F2F2] text-[14px] font-medium leading-[150%] tracking-[-0.4px]">
                이메일 <span className="text-[#FF6F6F]">*</span>
              </label>
              <Input54
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="이메일을 입력하세요"
              />
              <span className="min-h-[16px] text-[12px] text-[#FF6F6F]">
                {email.length > 0 && !isValidEmail(email)
                  ? '이메일 형식이 올바르지 않습니다.'
                  : <span className="invisible">유효성 검사 메시지 자리</span>}
              </span>
            </div>

            {/* 비밀번호 */}
            <div className="flex flex-col gap-[12px] w-full">
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
              <label className="text-[#F2F2F2] text-[14px] font-medium leading-[150%] tracking-[-0.4px]">
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
              <span
                aria-live="polite"
                className="min-h-[16px] text-[12px] mt-[4px] text-[#FF6F6F]"
              >
                {passwordConfirm.length > 0 && !doPasswordsMatch(password, passwordConfirm)
                  ? '비밀번호가 일치하지 않습니다.'
                  : <span className="invisible">유효성 검사 메시지 자리</span>}
              </span>
            </div>
          </div>

          {/* 계정 만들기 버튼 + 에러 메시지 */}
          <div className="w-full flex flex-col items-center gap-2 relative">
            {errorMessage && (
              <div className="absolute -top-[52px] z-50 animate-fade-in-out [animation-fill-mode:forwards]">
                <ErrorToast message={errorMessage} />
              </div>
            )}
            <BtnSign onClick={handleClick} isActive={isFormValid}>
              계정 만들기
            </BtnSign>
          </div>

          {/* SNS 로그인 */}
          <div className="flex flex-row justify-between items-center gap-[12px] w-full">
            <BtnSnsLogin type="google">Google 로그인</BtnSnsLogin>
            <BtnSnsLogin type="github">Github 로그인</BtnSnsLogin>
          </div>

          {/* 하단 링크 */}
          <div className="flex items-center gap-[14px]">
            <div
              className="flex justify-center items-center w-[112px] py-[11px] px-[16px] gap-[10px]
                         text-[#AEAEAE] text-[14px] leading-[130%] font-suit font-normal text-center
                         cursor-pointer hover:text-white transition"
              onClick={() => navigate('/login')}
            >
              로그인하기
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
