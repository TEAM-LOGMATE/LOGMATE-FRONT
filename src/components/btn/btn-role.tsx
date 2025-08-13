import React from 'react';
import BtnSmallArrow from './btn-small-arrow';

type BtnRoleProps = {
  role: 'teamAdmin' | 'member' | 'viewer'; // 역할 타입 3종
  onArrowClick?: () => void;
};

export default function BtnRole({ role, onArrowClick }: BtnRoleProps) {
  // 역할별 label
  const labelMap: Record<BtnRoleProps['role'], string> = {
    teamAdmin: '팀 관리자',
    member: '팀원',
    viewer: '뷰어',
  };

  // 역할별 색상
  const colorMap: Record<BtnRoleProps['role'], string> = {
    teamAdmin: 'text-[var(--Alert-Yellow,#D4B66F)]', // 약간 노란색
    member: 'text-[var(--Gray-300,#AEAEAE)]',        // 회색
    viewer: 'text-[var(--Gray-300,#AEAEAE)]',        // 회색
  };

  const label = labelMap[role];
  const textColor = colorMap[role];

  return (
    <div className="inline-flex h-[48px] pl-[8px] items-center flex-shrink-0">
      {/* 텍스트 */}
      <span
        className={`
          ${textColor} text-center
          font-suit text-[14px] font-bold leading-[150%] tracking-[-0.4px]
          cursor-default
        `}
      >
        {label}
      </span>

      {/* 화살표: 클릭 가능 */}
      <div
        className="ml-[4px] w-[32px] h-[32px] flex items-center justify-center cursor-pointer"
        onClick={onArrowClick}
      >
        <BtnSmallArrow direction="down" />
      </div>
    </div>
  );
}
