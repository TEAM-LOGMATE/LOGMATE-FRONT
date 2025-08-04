import { useState } from 'react';
import BtnSign from './components/btn-sign';
import BtnSnsLogin from './components/btn-sns-login';
import BtnPoint from './components/btn-point';
import BtnSetting from './components/btn-setting';
import BtnAdd from './components/btn-add';
import BtnLink from './components/btn-link';
import BtnMore from './components/btn-more';
import BtnMoreText from './components/btn-more-text';

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

       {/* 포인트 버튼 (추가/저장 버튼) */}
      <BtnPoint>
        추가/저장 버튼
      </BtnPoint>
       {/* 설정 버튼 미완성임*/}
      <BtnSetting>
      </BtnSetting>
      {/* 추가 버튼 */}
      <BtnAdd>
      </BtnAdd>
      {/* 링크 버튼 */}
      <BtnLink>
        http://google.com
      </BtnLink>
      {/* 더보기 버튼 */}
      <BtnMore>
      </BtnMore>
      
      {/* 더보기-텍스트 버튼  */}
      <BtnMoreText>
        옵션창 내용
      </BtnMoreText>
    </div>
  );
}
