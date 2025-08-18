import { useState } from 'react';

interface BtnDownloadProps {
  label: string;
  primary?: boolean; // true면 초록 버튼, false면 테두리 버튼
  onClick?: () => void;
}

export default function BtnDownload({
  label,
  primary = false,
  onClick,
}: BtnDownloadProps) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: 'relative',
        borderRadius: '12px',
        display: 'inline-block',
      }}
    >
      {/* Glow Layer */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          borderRadius: '12px',
          boxShadow: '0 0 8px #4FE75E, 0 0 16px #4FE75E',
          opacity: hovered ? 1 : 0,
          transition: 'opacity 0.25s ease',
          pointerEvents: 'none', // 클릭 방해 안 하게
        }}
      />

      {/* Button */}
      <button
        onClick={onClick}
        style={{
          position: 'relative',
          width: '200px',
          height: '48px',
          padding: '14px 48px',
          borderRadius: '12px',
          background: primary ? '#4FE75E' : 'transparent',
          border: primary ? '1px solid #1F5A05' : '1px solid #4FE75E',
          color: primary ? '#091104' : '#4FE75E',
          fontFamily: primary ? 'SUIT' : 'Geist',
          fontSize: '16px',
          fontWeight: primary ? 700 : 500,
          letterSpacing: primary ? '-0.4px' : '0',
          whiteSpace: 'nowrap',
          backgroundClip: 'padding-box',
          transition: 'transform 0.25s ease',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '10px',
        }}
      >
        {label}
      </button>
    </div>
  );
}
