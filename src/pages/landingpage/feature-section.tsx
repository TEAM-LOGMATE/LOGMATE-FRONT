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
        <FeatureCard title="간단한 초기 설정" image="/1.png" />
        
        {/* 2번 */}
        <FeatureCard 
          title="실시간 로그 스트리밍" 
          image="/2.png"
          imageStyle={{ left: "50%", top: "45%", width: "70%" }}
        />
        
        <FeatureCard title="팀 기반 대시보드" image="/3.png" />
      </div>
    </div>
  );
}
