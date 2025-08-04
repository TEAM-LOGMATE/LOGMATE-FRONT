import { useState } from 'react';
import BtnSign from './components/btn-sign';
import BtnSnsLogin from './components/btn-sns-login';

export default function App() {
  const [disabled, setDisabled] = useState(false);

  const handleClick = () => {
    if (!disabled) {
      setDisabled(true);
    }
  };

  return (
    <div className="flex flex-col items-center gap-4 p-10 min-h-screen">
      {/* 기본 로그인 버튼 */}
      <BtnSign disabled={disabled} onClick={handleClick}>
        로그인
      </BtnSign>

      {/* GitHub SNS 로그인 버튼 */}
      <BtnSnsLogin type="github" onClick={() => console.log('GitHub 로그인')}>
        GitHub 로그인
      </BtnSnsLogin>
    </div>
  );
}
