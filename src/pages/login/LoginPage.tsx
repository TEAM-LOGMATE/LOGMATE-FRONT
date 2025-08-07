import { useState, useEffect } from 'react'; // ✅ useEffect 추가
import Input54 from '../../components/input/54';
import BtnSign from '../../components/btn/btn-sign';
import BtnSnsLogin from '../../components/btn/btn-sns-login';
import ErrorToast from '../../components/text/error-toast';
import { useNavigate } from 'react-router-dom';

export default function LoginPage() {
  const navigate = useNavigate(); 
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // 테스트용 추가: 오류 메시지 상태
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // 오류 메시지 3초 후 자동 제거
  useEffect(() => {
  if (errorMessage) {
    const timer = setTimeout(() => setErrorMessage(null), 3000);
    return () => clearTimeout(timer);
  }
}, [errorMessage]);


  // 테스트용 추가: 로그인 핸들러
  const handleLogin = () => {
    const validEmail = 'admin';
    const validPassword = 'admin123@';

    if (email === validEmail && password === validPassword) {
      setErrorMessage(null); // 성공 시 에러 초기화
      console.log('로그인 성공');
      // navigate('/dashboard'); // 필요 시 리디렉션
    } else {
      setErrorMessage('이메일 또는 비밀번호가 올바르지 않습니다.');
    }
  };

  return (
    <div className="w-screen h-screen flex justify-center items-center bg-[#091104]">
      <div className="flex flex-col items-center w-[480px] gap-[55px] flex-shrink-0">

        {/* 로고 + 제목 묶기 */}
        <div className="flex flex-col items-center gap-[20px]">
          {/* 로고 */}
          <div
            className="
              bg-white text-black text-[12px] font-bold leading-[150%] tracking-[-0.4px]
              font-suit flex justify-center items-center 
              px-[1px] py-[3px] aspect-square
            "
            style={{ width: '30px' }}
          >
            로고
          </div>

          {/* 제목 */}
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

        {/* 로그인 버튼 */}
        <div className="relative w-full flex flex-col items-center mt-[16px]">
          {errorMessage && (
            <div className="absolute bottom-[calc(100%+16px)]">
              <ErrorToast message={errorMessage} />
            </div>
          )}

          {/* 🔧 테스트용: 로그인 핸들러 적용 */}
          <BtnSign onClick={handleLogin}>로그인</BtnSign>
        </div>

        {/* SNS 로그인 버튼 */}
        <div className="flex flex-row justify-between items-center gap-[12px] w-full">
          <BtnSnsLogin type="google">Google</BtnSnsLogin>
          <BtnSnsLogin type="github">GitHub</BtnSnsLogin>
        </div>

        {/* SNS 로그인 버튼 아래에 추가 */}
        <div className="flex flex-col items-center gap-[60px] w-[480px]">
          <div className="flex items-center gap-[14px]">
            {/* 새 계정 만들기 */}
            <div
              className="flex justify-center items-center w-[112px] py-[11px] px-[16px] gap-[10px]
                        text-[#AEAEAE] text-[14px] leading-[130%] font-suit font-normal text-center
                        cursor-pointer hover:text-white transition"
              onClick={() => navigate('/signup')}
            >
              새 계정 만들기
            </div>

            {/* 세로 구분선 */}
            <div className="flex items-center h-[16px]">
              <svg xmlns="http://www.w3.org/2000/svg" width="2" height="17" viewBox="0 0 2 17" fill="none">
                <path d="M1 0.5L1 16.5" stroke="#888888" />
              </svg>
            </div>

            {/* 비밀번호 찾기 */}
            <div
              className="flex justify-center items-center w-[112px] py-[11px] px-[16px] gap-[10px]
                        text-[#AEAEAE] text-[14px] leading-[130%] font-suit font-normal text-center"
            >
              비밀번호 찾기
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
