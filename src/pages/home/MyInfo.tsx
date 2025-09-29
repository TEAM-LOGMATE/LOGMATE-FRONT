import { useState, useEffect } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Bar from '../../components/navi/bar';
import BtnSign2 from '../../components/btn/btn-sign-2';
import Input54 from '../../components/input/54';
import ErrorToast from '../../components/text/error-toast';
import { useAuth } from '../../utils/AuthContext';

export default function MyInfoPage() {
  const navigate = useNavigate();
  const { user, login, error: authError } = useAuth();

  if (!user) return <Navigate to="/login" replace />;

  const username = user.username;
  const email = user.email;

  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [errorTrigger, setErrorTrigger] = useState(0);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (authError) {
      setErrorMessage(authError);
      setErrorTrigger((t) => t + 1);
    }
  }, [authError]);

  useEffect(() => {
    if (!errorMessage) return;
    const t = setTimeout(() => setErrorMessage(null), 3000);
    return () => clearTimeout(t);
  }, [errorMessage]);

  const handleUpdate = async () => {
    const pwd = password.trim();
    if (!pwd) {
      setErrorMessage('비밀번호를 입력해 주세요.');
      setErrorTrigger((t) => t + 1);
      return;
    }
    try {
      setSubmitting(true);
      setErrorMessage(null);
      await login(email.toLowerCase(), pwd);

      // state + localStorage 모두 저장
      localStorage.setItem('currentPassword', pwd);
      navigate('/edit-info', { state: { currentPassword: pwd } });
    } catch {
      setErrorMessage('비밀번호가 올바르지 않습니다.');
      setErrorTrigger((t) => t + 1);
    } finally {
      setSubmitting(false);
    }
  };

  const canSubmit = password.trim() !== '' && !submitting;

  return (
    <div className="flex w-screen h-screen bg-[#111] text-white font-suit overflow-hidden">
      <Bar
        username={username}
        activePage="myinfo"
        activeFolderId={null}
        onAddFolder={() => {}}
        onRemoveFolder={() => {}}
        onAddTeamFolder={() => {}}
        onRemoveTeamFolder={() => {}}
      />

      <motion.div
        className="flex flex-1 justify-center items-center px-10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: 'easeOut' }}
      >
        <div className="w-full max-w-[480px] flex flex-col items-center gap-[48px]">
          <h1 className="text-[#F2F2F2] text-[28px] font-bold leading-[135%] tracking-[-0.4px]">
            내 정보
          </h1>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleUpdate(); // 엔터 & 버튼 클릭 모두 처리
            }}
            className="flex flex-col gap-[40px] w-full relative"
          >
            {/* 계정 이메일 */}
            <div className="flex flex-col gap-[8px]">
              <label className="text-[#D8D8D8] text-[14px] font-medium leading-[150%] tracking-[-0.4px]">
                계정 이메일
              </label>
              <div className="w-full h-[54px] px-[16px] flex items-center border border-[#222] bg-[#111] rounded-[12px] text-[#D8D8D8] text-[14px]">
                {email}
              </div>
            </div>

            {/* 비밀번호 */}
            <div className="flex flex-col gap-[12px] w-full">
              <label className="text-[#D8D8D8] text-[14px] font-medium leading-[150%] tracking-[-0.4px]">
                비밀번호 <span className="text-[#D46F6F]">*</span>
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

            {/* 버튼 + 에러 메시지 */}
            <div className="relative w-full flex flex-col items-center">
              {errorMessage && (
                <div className="absolute -top-[56px] left-1/2 -translate-x-1/2">
                  <ErrorToast message={errorMessage} trigger={errorTrigger} />
                </div>
              )}
              <BtnSign2 type="submit" isActive={canSubmit}>
                내 정보 수정
              </BtnSign2>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
}
