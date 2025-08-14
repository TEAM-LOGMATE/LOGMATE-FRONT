// src/components/landingpage/btn-download.tsx
interface BtnDownloadProps {
  label: string;
  primary?: boolean; // true면 초록 버튼, false면 테두리 버튼
  onClick?: () => void;
}

export default function BtnDownload({ label, primary = false, onClick }: BtnDownloadProps) {
  return (
    <button
      onClick={onClick}
      style={{
        display: 'flex',
        width: '200px',
        height: '48px',
        padding: '14px 48px',
        justifyContent: 'center',
        alignItems: 'center',
        gap: '10px',
        flexShrink: 0,
        borderRadius: '12px',
        background: primary ? '#4FE75E' : 'transparent',
        border: primary ? '1px solid #1F5A05' : '1px solid #4FE75E',
        color: primary ? '#091104' : '#4FE75E',
        fontFamily: primary ? 'SUIT' : 'Geist',
        fontSize: '16px',
        fontWeight: primary ? 700 : 500,
        lineHeight: primary ? '150%' : '145%',
        letterSpacing: primary ? '-0.4px' : '0',
        whiteSpace: 'nowrap',
      }}
    >
      {label}
    </button>
  );
}
