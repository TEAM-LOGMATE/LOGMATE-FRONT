import BtnDownload from './btn-download';
import PreviewBox from './preview-box';
import FeatureSection from './feature-section';
import { useNavigate } from 'react-router-dom';

export default function LandingPage() {
    const navigate = useNavigate();
    
  return (
    <div
      className="flex flex-col items-center"
      style={{
        width: '100%',
        minHeight: '100vh',
        backgroundColor: '#0F0F0F',
        overflowX: 'hidden', // 가로 스크롤 제거
      }}
    >
      {/* 헤더 */}
      <header className="flex items-center px-8 py-4 w-full max-w-[1920px]">
        <img
          src="/Logmate.png"
          alt="Logmate Icon"
          style={{
            width: '22px',
            height: '22px',
            aspectRatio: '1 / 1',
          }}
          className="mr-2"
        />
        <span
          className="text-[#FAFAFA]"
          style={{
            fontFamily: 'Geist',
            fontSize: '20px',
            fontWeight: 500,
            lineHeight: '140%',
            letterSpacing: '-0.4px',
          }}
        >
          Logmate
        </span>
      </header>

      {/* 헤더와 타이틀 사이 간격 80px */}
      <div style={{ height: '80px' }} />

      {/* Hero + 나머지 */}
      <div
        style={{
          display: 'flex',
          width: '1920px',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '140px', // 각 섹션 간격
        }}
      >
        {/* Hero 섹션 */}
        <section
          className="flex flex-col items-center"
          style={{ width: '100%', maxWidth: '1920px' }}
        >
          {/* 타이틀 + 서브타이틀 */}
          <div
            className="flex flex-col items-center"
            style={{
              gap: '44px', // Logmate ↔ 로그 수집을 더 쉽게, 더 간단하게.
              alignSelf: 'stretch',
            }}
          >
            <h1
              style={{
                color: '#71FF90',
                textAlign: 'center',
                fontFamily: 'Geist',
                fontSize: '96px',
                fontWeight: 400,
                lineHeight: '113%',
                letterSpacing: '-1.92px',
              }}
            >
              LogMate
            </h1>

            <h2
              style={{
                color: '#D8D8D8',
                textAlign: 'center',
                fontFamily: 'SUIT',
                fontSize: '32px',
                fontWeight: 500,
                lineHeight: '150%',
                letterSpacing: '-0.64px',
              }}
            >
              로그 수집을 더 쉽게, 더 간단하게.
            </h2>
          </div>

          {/* 설명 + 버튼 */}
          <div
            className="flex flex-col items-center"
            style={{
              gap: '44px', // 설명 ↔ 버튼 간격
              alignSelf: 'stretch',
              marginTop: '44px',
            }}
          >
            <p
              style={{
                color: '#B7B7B7',
                textAlign: 'center',
                fontFamily: 'SUIT',
                fontSize: '16px',
                fontWeight: 400,
                lineHeight: '150%',
                letterSpacing: '-0.32px',
              }}
            >
              복잡한 설정 없이, 지금 바로 로그를 수집하고 분석하세요.
              <br />
              개발자와 팀을 위한 가장 직관적인 로그 서비스
            </p>

            <div className="flex gap-[12px]">
              <BtnDownload
                label="대시보드 시작하기"
                primary
                onClick={() => navigate('/login')}
      />
              <BtnDownload label="Agent 서버 다운로드" />
            </div>
          </div>

          {/* PreviewBox */}
          <div style={{ marginTop: '100px' }}>
            <PreviewBox />
          </div>
        </section>

        {/* Feature Section */}
        <FeatureSection />

        {/* Footer */}
        <footer
          className="flex items-center justify-center gap-2"
          style={{
            height: '64px',
            alignSelf: 'stretch',
            background: '#1C1C1C',
          }}
        >
          <span
            style={{
              color: '#FAFAFA',
              fontFamily: 'SUIT',
              fontSize: '16px',
              fontWeight: 500,
              lineHeight: '150%',
              letterSpacing: '-0.4px',
            }}
          >
            오픈소스로 신뢰와 투명성을
          </span>
          <span
            style={{
              color: '#FAFAFA',
              fontFamily: 'Geist',
              fontSize: '16px',
              fontWeight: 400,
              lineHeight: '150%',
            }}
          >
            GitHub
          </span>
        </footer>
      </div>
    </div>
  );
}
