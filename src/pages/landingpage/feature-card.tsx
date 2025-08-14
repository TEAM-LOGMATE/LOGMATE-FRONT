type FeatureCardProps = {
  title: string;
};

export default function FeatureCard({ title }: FeatureCardProps) {
  return (
    <div
      style={{
        display: 'flex',
        height: '400px',
        padding: '40px 159px',
        justifyContent: 'center',
        alignItems: 'flex-end',
        gap: '10px',
        borderRadius: '24px',
        background: '#222', // var(--Gray-700)
      }}
    >
      <span
        style={{
          color: '#E1E1E1',
          textAlign: 'center',
          fontFamily: 'SUIT',
          fontSize: '28px',
          fontWeight: 700,
          lineHeight: '135%',
          letterSpacing: '-0.4px',
        }}
      >
        {title}
      </span>
    </div>
  );
}
