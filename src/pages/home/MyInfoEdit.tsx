import { useEffect, useState } from 'react';
import { useNavigate, Navigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { api } from '../../api/axiosInstance';
import Bar from '../../components/navi/bar';
import BtnSign2 from '../../components/btn/btn-sign-2';
import Input54 from '../../components/input/54';
import ErrorToast from '../../components/text/error-toast';
import { isValidEmail, isValidPassword, doPasswordsMatch } from '../../utils/validate';
import { useAuth } from '../../utils/AuthContext';

export default function MyInfoEditPage() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const { user, setUserUnsafe } = useAuth();

  if (!user) return <Navigate to="/login" replace />;

  const username = user.username;
  const currentEmail = user.email;

  const currentPassword =
    state?.currentPassword || localStorage.getItem('currentPassword');

  const [newEmail, setNewEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [emailCheckResult, setEmailCheckResult] = useState<'idle' | 'valid' | 'duplicate'>('idle');

  const isFormValid =
    isValidEmail(newEmail) &&
    emailCheckResult === 'valid' &&
    isValidPassword(newPassword) &&
    doPasswordsMatch(newPassword, confirmPassword);

  const handleCheckDuplicate = async () => {
    const trimmedEmail = newEmail.trim().toLowerCase();
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

  useEffect(() => {
    setEmailCheckResult('idle');
  }, [newEmail]);

  const handleSave = async () => {
    if (!currentPassword) {
      setErrorMessage('비밀번호 인증이 만료되었습니다. 다시 로그인해 주세요.');
      setTimeout(() => setErrorMessage(''), 3000);
      navigate('/myinfo');
      return;
    }

    if (!newEmail && !newPassword && !confirmPassword) {
      setErrorMessage('변경할 정보를 입력해 주세요.');
      setTimeout(() => setErrorMessage(''), 3000);
      return;
    }
    if (!isFormValid) {
      setErrorMessage('모든 정보를 올바르게 입력해 주세요.');
      setTimeout(() => setErrorMessage(''), 3000);
      return;
    }

    try {
      const body: any = { currentPassword };

      if (newEmail.trim() && newEmail.trim().toLowerCase() !== currentEmail.toLowerCase()) {
        body.newEmail = newEmail.trim().toLowerCase();
      }
      if (newPassword.trim()) {
        body.newPassword = newPassword.trim();
      }

      const res = await api.put('/api/users/mypage', body);

      if (res.data.status === 200) {
        const { token, userId, email, userName } = res.data.data;

        localStorage.setItem('access_token', token);

        setUserUnsafe?.({
          id: userId,
          username: userName,
          email,
        });

        localStorage.removeItem('currentPassword');

        navigate('/myinfo');
      }
    } catch (err) {
      setErrorMessage('정보 수정에 실패했습니다. 다시 시도해주세요.');
      setTimeout(() => setErrorMessage(''), 3000);
    }
  };

  const disableCheck =
    !isValidEmail(newEmail) ||
    newEmail.trim().toLowerCase() === currentEmail.toLowerCase();

  return (
    <div className="flex w-screen h-screen bg-[#111] text-white font-suit overflow-hidden">
      <Bar username={username} />

      <motion.div
        className="flex flex-1 justify-center items-center px-10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            e.preventDefault();
            handleSave();
          }
        }}
      >
        <div className="w-full max-w-[480px] flex flex-col items-center gap-[48px]">
          <h1 className="text-[#F2F2F2] text-[28px] font-bold leading-[135%] tracking-[-0.4px]">
            내 정보 수정
          </h1>

          <div className="flex flex-col gap-[40px] w-full">
            {/* 기존 이메일 */}
            <div className="flex flex-col gap-[8px]">
              <label className="text-[#D8D8D8] text-[14px] font-medium leading-[150%] tracking-[-0.4px]">
                계정 이메일
              </label>
              <div className="w-full h-[54px] px-[16px] flex items-center border border-[#222] bg-[#111] rounded-[12px] text-[#D8D8D8] text-[14px]">
                {currentEmail}
              </div>
            </div>

            {/* 새 이메일 */}
            <div className="flex flex-col gap-[8px]">
              <label className="text-[#D8D8D8] text-[14px] font-medium leading-[150%] tracking-[-0.4px]">
                새 계정 이메일
              </label>
              <div className="flex h-[54px] px-[12px] py-[15px] justify-between items-center self-stretch border border-[#222] bg-[#171717] rounded-[12px]">
                <input
                  type="email"
                  autoComplete="email"
                  placeholder="새 이메일을 입력하세요"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  className="bg-transparent text-[#D8D8D8] text-[14px] outline-none flex-1 pr-2"
                />
                <button
                  onClick={handleCheckDuplicate}
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
                  !isValidEmail(newEmail) && newEmail.length > 0
                    ? 'text-[#FF6F6F]'
                    : emailCheckResult === 'valid'
                    ? 'text-[#4FE75E]'
                    : emailCheckResult === 'duplicate'
                    ? 'text-[#FF6F6F]'
                    : 'invisible'
                }`}
              >
                {newEmail.length > 0 && !isValidEmail(newEmail)
                  ? '이메일 형식이 올바르지 않습니다.'
                  : emailCheckResult === 'valid'
                  ? '사용 가능한 이메일입니다'
                  : emailCheckResult === 'duplicate'
                  ? '이미 사용 중인 이메일입니다.'
                  : 'placeholder'}
              </span>
            </div>

            {/* 새 비밀번호 */}
            <div className="flex flex-col gap-[12px] w-full">
              <label className="text-[#F2F2F2] text-[14px] font-medium leading-[150%] tracking-[-0.4px]">
                비밀번호 <span className="text-[#FF6F6F]">*</span>
              </label>
              <Input54
                type={showPassword ? 'text' : 'password'}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="비밀번호를 입력하세요"
                done={showPassword}
                onDone={setShowPassword}
                showIcon={true}
              />
              <span
                className={`min-h-[16px] text-[12px] mt-[4px] ${
                  newPassword.length === 0
                    ? 'text-[#888888]'
                    : !isValidPassword(newPassword)
                    ? 'text-[#FF6F6F]'
                    : 'invisible'
                }`}
              >
                {newPassword.length === 0
                  ? '영문, 숫자, 특수문자 포함 8자 이상 입력해 주세요'
                  : !isValidPassword(newPassword)
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
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="비밀번호를 다시 입력하세요"
                done={showPasswordConfirm}
                onDone={setShowPasswordConfirm}
                showIcon={true}
              />
              <span className="min-h-[16px] text-[12px] text-[#FF6F6F]">
                {confirmPassword.length > 0 && !doPasswordsMatch(newPassword, confirmPassword)
                  ? '비밀번호가 일치하지 않습니다.'
                  : <span className="invisible">placeholder</span>}
              </span>
            </div>
          </div>

          {/* 저장 버튼 */}
          <div className="w-full flex flex-col items-center relative gap-[8px]">
            {errorMessage && (
              <div className="absolute -top-[56px] left-1/2 -translate-x-1/2">
                <ErrorToast message={errorMessage} />
              </div>
            )}
            <BtnSign2 onClick={handleSave} isActive={isFormValid}>
              저장하기
            </BtnSign2>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
