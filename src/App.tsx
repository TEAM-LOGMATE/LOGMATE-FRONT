import { useState } from 'react';
import BtnSign from './components/btn/btn-sign';
import BtnSnsLogin from './components/btn/btn-sns-login';
import BtnPoint from './components/btn/btn-point';
import BtnSetting from './components/btn/btn-setting';
import BtnAdd from './components/btn/btn-add';
import BtnLink from './components/btn/btn-link';
import BtnMore from './components/btn/btn-more';
import BtnMoreText from './components/btn/btn-more-text';
import BtnSmallArrow from './components/btn/btn-small-arrow';
import BtnBigArrow from './components/btn/btn-big-arrow';
import IconBlind from './components/icon/icon-blind';
import IconSign from './components/icon/icon-sign';
import Input54 from './components/input/54';
import Input48 from './components/input/48';
import FrmMoreUser from './components/frm/frm-more-user';
import FrmMoreTeam from './components/frm/frm-more-team';
import AgentStatusUnresponsive from './components/text/agent-status-unresponse';
import AgentStatusCollecting from './components/text/agent-status-collecting';
import AgentStatusBefore from './components/text/agent-status-before';
import AgentStatusStop from './components/text/agent-status-stop';
import ErrorToast from './components/text/error-toast';
import FrmFolder from './components/frm/frm-folder';
import MyPage from './components/navi/my-page';
import AddFolding from './components/navi/add-folding';
import SpaceNameG from './components/navi/spacename-g';
import SpaceNameS from './components/navi/spacename-S';
import Bar from './components/navi/bar';
import FrmThumbnailBoard from './components/frm/frm-thumbnail-board';

export default function App() {
  const [disabled, setDisabled] = useState(false);
  const [text, setText54] = useState('');
  const [done, setDone] = useState(false);
  const [code, setText48] = useState('');

  const handleClick = () => {
    if (!disabled) {
      setDisabled(true);
    }
  };

  return (
    <div className="flex flex-wrap items-start gap-4 p-10 w-full bg-brand-background text-white font-suit">
      {/* 기본 로그인 버튼 */}
      <BtnSign disabled={disabled} onClick={handleClick}>
        로그인
      </BtnSign>

      {/* GitHub SNS 로그인 버튼 */}
      <BtnSnsLogin type="github" onClick={() => console.log('GitHub 로그인')}>
        GitHub 로그인
      </BtnSnsLogin>

      {/* 포인트 버튼 */}
      <BtnPoint>
        추가/저장 버튼
      </BtnPoint>

      {/* 설정 버튼 */}
      <BtnSetting />

      {/* 추가 버튼 */}
      <BtnAdd />

      {/* 링크 버튼 */}
      <BtnLink>
        http://google.com
      </BtnLink>

      {/* 더보기 버튼 */}
      <BtnMore />

      {/* 더보기-텍스트 버튼 */}
      <BtnMoreText>
        옵션창 내용
      </BtnMoreText>

      {/* 화살표 표시 버튼 */}
      <BtnBigArrow />

      {/* 화살표 표시 버튼 2 */}
      <BtnBigArrow variant="variant2" /> 

      {/* 화살표 표시 버튼 */}
      <BtnSmallArrow direction="up" />
      <BtnSmallArrow direction="down" />

      {/* 아이콘 */}
      <IconSign />
      <IconBlind/>

      {/* 입력창 */}
      <Input54
        value={text}
        onChange={(e) => setText54(e.target.value)}
        placeholder="글자 입력하고 엔터누르면 색 바꾸기"
        done={done}
        onDone={() => setDone(true)}
      />

      {/* 입력창2 */}
      <Input48
        value={code}
        onChange={(e) => setText48(e.target.value)}
        placeholder="팀 이름을 입력하세요"
      />

      {/* user */}
      <FrmMoreUser />
      {/* team */}
      <FrmMoreTeam />


      {/* Agent status 4가지 */}
      <AgentStatusUnresponsive />

      <AgentStatusCollecting />

      <AgentStatusBefore/>

      <AgentStatusStop/>

      {/* 오류 텍스트 */}
      <ErrorToast/>

      {/* my mage */}
      <MyPage/>

      {/* 개인/팀 스페이스 */}
      <AddFolding/>

      {/* spacename-s */}
      <SpaceNameG/>

      {/* spacename-g */}
      <SpaceNameS/>

      {/* navi-bar */}
      <Bar/>

      {/* frm-folder -----미완성 */}
      <FrmFolder/>

      {/* thumbnail */}
      <FrmThumbnailBoard/>
    </div>
  );
}
