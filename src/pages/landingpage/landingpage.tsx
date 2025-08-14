// src/components/landingpage/index.tsx
import BtnDownload from './btn-download';
import PreviewBox from './preview-box';
import FeatureSection from './feature-section';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

export default function LandingPage() {
  const navigate = useNavigate();

  // 스크롤 감지 Hook
  const { ref: heroRef, inView: heroInView } = useInView({ triggerOnce: false, threshold: 0.3 });
  const { ref: previewRef, inView: previewInView } = useInView({ triggerOnce: false, threshold: 0.2 });
  const { ref: featureRef, inView: featureInView } = useInView({ triggerOnce: false, threshold: 0.2 });

  return (
    <div
      className="flex flex-col items-center"
      style={{
        width: '100%',
        minHeight: '100vh',
        backgroundColor: '#0F0F0F',
        overflowX: 'hidden',
      }}
    >
      {/* 헤더 */}
      <motion.header
        className="flex items-center px-8 py-4 w-full max-w-[1920px]"
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <img
          src="/Logmate.png"
          alt="Logmate Icon"
          style={{ width: '22px', height: '22px', aspectRatio: '1 / 1' }}
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
      </motion.header>

      <div style={{ height: '80px' }} />

      <div
        style={{
          display: 'flex',
          width: '1920px',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '140px',
        }}
      >
        {/* Hero 섹션 */}
        <section
          className="flex flex-col items-center"
          style={{ width: '100%', maxWidth: '1920px' }}
        >
          {/* 타이틀 */}
          <div
            className="flex flex-col items-center"
            style={{ gap: '44px', alignSelf: 'stretch' }}
          >
            <motion.h1
              ref={heroRef}
              style={{
                color: '#71FF90',
                textAlign: 'center',
                fontFamily: 'Geist',
                fontSize: '96px',
                fontWeight: 400,
                lineHeight: '113%',
                letterSpacing: '-1.92px',
              }}
              initial={{ opacity: 0, y: 50 }}
              animate={heroInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
              transition={{ duration: 1 }}
            >
              LogMate
            </motion.h1>

            <motion.h2
              style={{
                color: '#D8D8D8',
                textAlign: 'center',
                fontFamily: 'SUIT',
                fontSize: '32px',
                fontWeight: 500,
                lineHeight: '150%',
                letterSpacing: '-0.64px',
              }}
              initial={{ opacity: 0, y: 20 }}
              animate={heroInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ delay: 0.3, duration: 0.8 }}
            >
              로그 수집을 더 쉽게, 더 간단하게.
            </motion.h2>
          </div>

          {/* 설명 + 버튼 */}
          <motion.div
            className="flex flex-col items-center"
            style={{ gap: '44px', alignSelf: 'stretch', marginTop: '44px' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.8 }}
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
              {/* 대시보드 버튼 */}
              <motion.div
                style={{ borderRadius: '12px', display: 'inline-block' }}
                whileHover={{ scale: 1.05 }}
                transition={{ type: 'spring', stiffness: 200 }}
              >
                <BtnDownload label="대시보드 시작하기" primary onClick={() => navigate('/login')} />
              </motion.div>

              {/* Agent 다운로드 버튼 */}
              <motion.div
                style={{ borderRadius: '12px', display: 'inline-block' }}
                whileHover={{ scale: 1.05 }}
                transition={{ type: 'spring', stiffness: 200 }}
              >
                <BtnDownload label="Agent 서버 다운로드" />
              </motion.div>
            </div>
          </motion.div>

          {/* PreviewBox (스크롤 시 등장 + Glow) */}
          <motion.div
            ref={previewRef}
            style={{
              marginTop: '100px',
              borderRadius: '38px',
              overflow: 'hidden',
            }}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={
              previewInView
                ? {
                    opacity: 1,
                    scale: 1,
                    boxShadow:
                      '0 0 12px rgba(79, 231, 94, 0.7), 0 0 30px rgba(79, 231, 94, 0.5)',
                  }
                : {}
            }
            transition={{ duration: 0.8 }}
          >
            <PreviewBox />
          </motion.div>
        </section>

        {/* Feature Section (순차 등장) */}
        <motion.div
          ref={featureRef}
          initial={{ opacity: 0, y: 50 }}
          animate={
            featureInView
              ? { opacity: 1, y: 0, transition: { duration: 0.8, staggerChildren: 0.2 } }
              : {}
          }
          style={{ width: '100%' }}
        >
          <FeatureSection />
        </motion.div>

        {/* Footer */}
        <motion.footer
          className="flex items-center justify-center gap-2"
          style={{ height: '64px', alignSelf: 'stretch', background: '#1C1C1C' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.4, duration: 0.6 }}
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
        </motion.footer>
      </div>
    </div>
  );
}
