import React, { useState } from 'react';
import BtnSmallArrow from './btn-small-arrow';
import BtnMoreText from './btn-more-text';

type BtnRoleProps = {
  role: 'teamAdmin' | 'member' | 'viewer'; // 역할 타입 3종
  onRoleChange?: (role: 'teamAdmin' | 'member' | 'viewer') => void;
};

export default function BtnRole({ role, onRoleChange }: BtnRoleProps) {
  const [open, setOpen] = useState(false);

  // 역할별 label
  const labelMap: Record<BtnRoleProps['role'], string> = {
    teamAdmin: '팀 관리자',
    member: '팀원',
    viewer: '뷰어',
  };

  // 역할별 색상
  const colorMap: Record<BtnRoleProps['role'], string> = {
    teamAdmin: 'text-[var(--Alert-Yellow,#D4B66F)]',
    member: 'text-[var(--Gray-300,#AEAEAE)]',
    viewer: 'text-[var(--Gray-300,#AEAEAE)]',
  };

  const label = labelMap[role];
  const textColor = colorMap[role];

  const handleSelect = (label: string) => {
    const newRole =
      Object.keys(labelMap).find(
        (key) => labelMap[key as BtnRoleProps['role']] === label
      ) as BtnRoleProps['role'];
    onRoleChange?.(newRole);
    setOpen(false);
  };

  return (
    <div className="relative inline-flex h-[48px] pl-[8px] items-center flex-shrink-0">
      {/* 텍스트 */}
      <span
        className={`
          ${textColor} text-center
          font-suit text-[14px] font-bold leading-[150%] tracking-[-0.4px]
        `}
      >
        {label}
      </span>

      {/* 화살표 */}
      <div
        className="ml-[4px] w-[32px] h-[32px] flex items-center justify-center cursor-pointer"
        onClick={() => setOpen((prev) => !prev)}
      >
        <BtnSmallArrow direction={open ? 'up' : 'down'} />
      </div>

      {/* 드롭다운 */}
      {open && (
        <div className="absolute top-[48px] left-0 z-10">
          <BtnMoreText
            options={['팀 관리자', '팀원', '뷰어']}
            selected={label}
            onSelect={handleSelect}
          />
        </div>
      )}
    </div>
  );
}
