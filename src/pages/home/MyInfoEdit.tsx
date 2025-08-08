import { useEffect ,useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Bar from '../../components/navi/bar';
import BtnSign2 from '../../components/btn/btn-sign-2';
import Input54 from '../../components/input/54';
import ErrorToast from '../../components/text/error-toast';
import { isValidEmail, isValidPassword, doPasswordsMatch } from '../../utils/validate';

export default function MyInfoEditPage() {
  const [email] = useState('csjdcpmsal@gmail.com');
  const [newEmail, setNewEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();
  const [emailCheckResult, setEmailCheckResult] = useState<'idle' | 'valid' | 'duplicate'>('idle');

  const isFormValid =
    isValidEmail(newEmail) &&
    emailCheckResult === 'valid' && 
    isValidPassword(newPassword) &&
    doPasswordsMatch(newPassword, confirmPassword);

const handleCheckDuplicate = () => {
  const trimmedEmail = newEmail.trim().toLowerCase();

  if (!isValidEmail(trimmedEmail)) {
    setEmailCheckResult('idle'); // 상태 초기화
    return;
  }

  // 반드시 모두 소문자 처리된 리스트와 비교
  const usedEmails = ['admin@logmate.com', email];
  const normalizedUsedEmails = usedEmails.map(email => email.toLowerCase());

  if (normalizedUsedEmails.includes(trimmedEmail)) {
    setEmailCheckResult('duplicate');
  } else {
    setEmailCheckResult('valid');
  }
};
useEffect(() => {
  if (newEmail === '') {
    setEmailCheckResult('idle');
  }
}, [newEmail]);




  const handleSave = () => {
    if (!newEmail || !newPassword || !confirmPassword) {
      setErrorMessage('모든 정보를 입력해 주세요.');
      setTimeout(() => setErrorMessage(''), 3000);
      return;
    }

    if (!isFormValid) {
      setErrorMessage('모든 정보를 올바르게 입력해 주세요.');
      setTimeout(() => setErrorMessage(''), 3000);
      return;
    }

    console.log('저장된 새 이메일:', newEmail);
    console.log('저장된 새 비밀번호:', newPassword);
    navigate('/myinfo');
  };

  return (
    <div className="flex w-screen h-screen bg-[#111] text-white font-suit overflow-hidden">
      <Bar
        username={localStorage.getItem('username') || 'Guest'}
        folders={[]}
        onAddFolder={() => {}}
        onRemoveFolder={() => {}}
      />

      <div className="flex flex-1 justify-center items-center px-10">
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
                {email}
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
                  placeholder="새 이메일을 입력하세요"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  className="bg-transparent text-[#D8D8D8] text-[14px] outline-none flex-1 pr-2"
                />
                <button
                  onClick={handleCheckDuplicate}
                  className="h-[36px] px-[12px] py-[10px] flex justify-center items-center text-[12px] text-[#4FE75E] border border-[#4FE75E] rounded-[4px]"
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
              {
                newEmail.length > 0 && !isValidEmail(newEmail)
                  ? '이메일 형식이 올바르지 않습니다.'
                  : emailCheckResult === 'valid'
                  ? '사용 가능한 이메일입니다'
                  : emailCheckResult === 'duplicate'
                  ? '이미 사용 중인 이메일입니다.'
                  : 'placeholder'
              }
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

          {/* 저장 버튼 + 오류 메시지 */}
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
      </div>
    </div>
  );
}
