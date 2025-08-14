export default function PreviewBox() {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '100px',
        alignSelf: 'stretch',
        width: '1536px',
        height: '864px',
        aspectRatio: '16 / 9',
        borderRadius: '37px',
        border: '1px solid #1F5A05',
        background: '#111', // var(--Gray-900)
        boxShadow: '0 2px 50px 0 rgba(24, 68, 5, 0.60)',
      }}
    >
      {/* 여기에 추후 콘텐츠를 넣을 수 있습니다 */}
    </div>
  );
}
