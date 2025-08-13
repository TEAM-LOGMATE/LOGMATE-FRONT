import { useState, useEffect } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import Bar from '../../components/navi/bar';
import BtnSign2 from '../../components/btn/btn-sign-2';
import Input54 from '../../components/input/54';
import ErrorToast from '../../components/text/error-toast';
import { useAuth } from '../../utils/AuthContext';
import { loadFolders, type Folder } from '../../utils/storage';

export default function MyInfoPage() {
  const navigate = useNavigate();
  const { user, login, error: authError } = useAuth();

  if (!user) return <Navigate to="/login" replace />;

  const username = user.username;
  const email = user.email;

  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const [folders, setFolders] = useState<Folder[]>([]);

  // 폴더 로드
  useEffect(() => {
    setFolders(loadFolders(username));
  }, [username]);

  useEffect(() => {
    if (authError) setErrorMessage(authError);
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
      return;
    }
    try {
      setSubmitting(true);
      setErrorMessage(null);
      await login(email.toLowerCase(), pwd);
      navigate('/edit-info');
    } catch {
      if (!authError) setErrorMessage('비밀번호가 올바르지 않습니다.');
    } finally {
      setSubmitting(false);
    }
  };

  const canSubmit = password.trim() !== '' && !submitting;

  return (
    <div className="flex w-screen h-screen bg-[#111] text-white font-suit overflow-hidden">
      <Bar
        username={username}
        folders={folders} 
        onAddFolder={() => {}}
        onRemoveFolder={() => {}}
        activePage="myinfo"
      />

      <div className="flex flex-1 justify-center items-center px-10">
        <div className="w-full max-w-[480px] flex flex-col items-center gap-[48px]">
          <h1 className="text-[#F2F2F2] text-[28px] font-bold leading-[135%] tracking-[-0.4px]">
            내 정보
          </h1>

          <div className="flex flex-col gap-[40px] w-full">
            {/* 계정 이메일 (읽기 전용) */}
            <div className="flex flex-col gap-[8px]">
              <label className="text-[#D8D8D8] text-[14px] font-medium leading-[150%] tracking-[-0.4px]">
                계정 이메일
              </label>
              <div className="w-full h-[54px] px-[16px] flex items-center border border-[#222] bg-[#111] rounded-[12px] text-[#D8D8D8] text-[14px]">
                {email}
              </div>
            </div>

            {/* 비밀번호 입력 */}
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
          </div>

          {/* 저장 버튼 + 에러 토스트 */}
          <div className="relative w-full flex flex-col items-center gap-2">
            {errorMessage && (
              <div className="absolute -top-[52px]">
                <ErrorToast message={errorMessage} />
              </div>
            )}
            <BtnSign2 onClick={handleUpdate} isActive={canSubmit}>
              내 정보 수정
            </BtnSign2>
          </div>
        </div>
      </div>
    </div>
  );
}
