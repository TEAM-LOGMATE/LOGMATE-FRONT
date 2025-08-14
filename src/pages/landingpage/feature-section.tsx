import FeatureCard from './feature-card';

export default function FeaturesSection() {
  return (
    <div
      style={{
        display: 'flex',
        width: '1920px',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '140px',
      }}
    >
      <div style={{ display: 'flex', gap: '40px' }}>
        <FeatureCard title="간단한 초기 설정" />
        <FeatureCard title="실시간 로그 스트리밍" />
        <FeatureCard title="팀 기반 대시보드" />
      </div>
    </div>
  );
}
