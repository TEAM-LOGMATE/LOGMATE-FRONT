import React, { useState } from 'react';
import FrmMemberLine from './frm-memberline';
import BtnInviteLink from '../btn/btn-invitelink';
import BtnAddMember from '../btn/btn-addmember';
import { isValidEmail } from '../../utils/validate';

type FrmMemberListProps = {
  members: {
    name: string;
    email: string;
    role: 'teamAdmin' | 'member' | 'viewer';
  }[];
  onMemberAdd?: (email: string) => void;
  onRoleChange?: (index: number, newRole: 'teamAdmin' | 'member' | 'viewer') => void;
  onDeleteClick?: (index: number) => void;
};

export default function FrmMemberList({
  members,
  onMemberAdd,
  onRoleChange,
  onDeleteClick,
}: FrmMemberListProps) {
  const [emailInput, setEmailInput] = useState('');

  const isAddActive = isValidEmail(emailInput);

  return (
    <div
      className="
        flex w-[722px] min-h-[200px] p-[8px]
        flex-col items-center gap-[12px]
        rounded-[12px] border border-[var(--Gray-700,#222)]
        bg-[var(--Gray-700,#222)]
      "
    >
      {/* 이메일 입력 + 버튼 */}
      <div
        className="
          flex w-[706px] h-[48px] px-[12px] py-[8px]
          items-center gap-[8px] flex-shrink-0
          rounded-[8px] bg-[var(--Gray-900,#111)]
        "
      >
        {/* 검색 아이콘 */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="32"
          height="32"
          viewBox="0 0 32 32"
          fill="none"
          className="flex-shrink-0"
        >
          <circle cx="14" cy="15" r="5.4" stroke="#AEAEAE" strokeWidth="1.2" />
          <path d="M18 19L22 23" stroke="#AEAEAE" strokeWidth="1.2" />
        </svg>

        {/* 입력 필드 */}
        <input
          type="text"
          value={emailInput}
          onChange={(e) => setEmailInput(e.target.value)}
          placeholder="초대할 팀원의 이메일을 입력하세요"
          className="
            flex-1 bg-transparent outline-none
            text-[var(--Gray-300,#AEAEAE)] font-geist text-[16px]
            font-medium leading-[150%] tracking-[-0.4px]
          "
        />

        {/* 버튼들 */}
        <BtnInviteLink onClick={() => console.log('링크 복사')} />
        <BtnAddMember
          onClick={() => {
            if (isValidEmail(emailInput)) {
              onMemberAdd?.(emailInput.trim());
              setEmailInput('');
            }
          }}
          disabled={!isAddActive}
        />
      </div>

      {/* 멤버 리스트 */}
      {members.map((member, index) => (
        <FrmMemberLine
          key={index}
          name={member.name}
          email={member.email}
          role={member.role}
          onRoleChange={(newRole) => onRoleChange?.(index, newRole)}
          onDeleteClick={() => onDeleteClick?.(index)}
        />
      ))}
    </div>
  );
}
