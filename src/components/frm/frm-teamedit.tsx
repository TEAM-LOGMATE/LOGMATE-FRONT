import { useState } from 'react';
import Input48 from '../input/48';
import FrmMemberList from './frm-memberlist';
import BtnX from '../btn/btn-x';
import BtnSign2Small from '../btn/btn-sign-2-small';
import { isValidEmail } from '../../utils/validate';

type Role = 'teamAdmin' | 'member' | 'viewer';

type Member = {
  name: string;
  email: string;
  role: Role;
};

type FrmTeamEditProps = {
  initialName: string;
  initialDescription?: string;
  initialMembers: Member[];
  currentRole: Role; 
  onSubmit?: (data: { name: string; description: string; members: Member[] }) => void;
  onClose?: () => void;
  onDelete?: () => void;    // 관리자 전용
  onLeaveTeam?: () => void; // 멤버/뷰어 전용
};

export default function FrmTeamEdit({
  initialName,
  initialDescription = '',
  initialMembers,
  currentRole,
  onSubmit,
  onClose,
  onDelete,
  onLeaveTeam,
}: FrmTeamEditProps) {
  const [teamName, setTeamName] = useState(initialName);
  const [teamDesc, setTeamDesc] = useState(initialDescription);
  const [members, setMembers] = useState<Member[]>(initialMembers);

  const isAdmin = currentRole === 'teamAdmin';
  const isReadOnly = !isAdmin;

  const handleSubmit = () => {
    // 비관리자도 설명 수정은 가능 → 그대로 onSubmit 전달 (백엔드/상위에서 권한체크 가능)
    if (isAdmin) {
      if (!teamName.trim() || members.length === 0) return;
    } else {
      // 멤버/뷰어: 이름/멤버는 읽기 전용이므로 필수 검증에서 제외
      if (teamDesc.trim() === '') return;
    }
    onSubmit?.({ name: teamName, description: teamDesc, members });
  };

  const isSaveActive = isAdmin
    ? teamName.trim() !== '' && members.length > 0
    : teamDesc.trim() !== ''; // 멤버/뷰어는 설명만 수정 가능

  return (
    <div
      className="
        relative
        flex flex-col items-center w-full max-w-[800px]
        p-[40px] gap-[24px]
        bg-[#0F0F0F] rounded-[12px]
      "
    >
      {/* 닫기 버튼 */}
      <div className="absolute top-[16px] right-[16px]">
        <BtnX onClick={onClose} />
      </div>

      {/* 제목 */}
      <h2
        className="
          text-[var(--Gray-100,#F2F2F2)] text-center
          font-suit text-[28px] font-bold leading-[135%] tracking-[-0.4px]
        "
      >
        팀 설정
      </h2>

      {/* 팀 이름 (관리자만 수정 가능) */}
      <div className="w-full">
        <label
          className="
            text-[var(--Gray-200,#D8D8D8)]
            font-suit text-[16px] font-medium leading-[150%] tracking-[-0.4px]
          "
        >
          팀 이름 <span className="text-[var(--Alert-Red,#D46F6F)]">*</span>
        </label>
        <Input48
          value={teamName}
          onChange={(e) => setTeamName(e.target.value)}
          placeholder="팀 이름을 입력하세요"
          disabled={isReadOnly}
          readOnly={isReadOnly}
        />
      </div>

      {/* 팀 설명 (모두 수정 가능) */}
      <div className="w-full">
        <label
          className="
            text-[var(--Gray-200,#D8D8D8)]
            font-suit text-[16px] font-medium leading-[150%] tracking-[-0.4px]
          "
        >
          팀 설명
        </label>
        <Input48
          value={teamDesc}
          onChange={(e) => setTeamDesc(e.target.value)}
          placeholder="ex. 백엔드 개발팀.."
        />
      </div>

      {/* 팀원 리스트 */}
      <div className="w-full">
        <label
          className="
            text-[var(--Gray-200,#D8D8D8)]
            font-suit text-[16px] font-medium leading-[150%] tracking-[-0.4px]
          "
        >
          팀원 리스트 <span className="text-[var(--Alert-Red,#D46F6F)]">*</span>
        </label>

        <div className="mt-[8px]">
          <FrmMemberList
            members={members}
            readOnly={isReadOnly} // 역할변경/삭제만 막기 용도
            onMemberAdd={(email) => {
              const trimmed = email.trim();
              if (!isValidEmail(trimmed)) return;
              // (옵션) 중복 방지
              setMembers((prev) => {
                if (prev.some((m) => m.email === trimmed)) return prev;
                return [...prev, { name: '팀원명', email: trimmed, role: 'member' }];
              });
            }}
            // ⬇️ 역할 변경/삭제는 관리자만
            onRoleChange={
              isAdmin
                ? (index, newRole) => {
                    setMembers((prev) =>
                      prev.map((m, i) => (i === index ? { ...m, role: newRole } : m))
                    );
                  }
                : undefined
            }
            onDeleteClick={
              isAdmin
                ? (index) => {
                    setMembers((prev) => prev.filter((_, i) => i !== index));
                  }
                : undefined
            }
          />
        </div>
      </div>

      {/* 저장하기 버튼 */}
      <div className="relative w-full h-[48px]">
        <div className="absolute left-1/2 -translate-x-1/2">
          <BtnSign2Small onClick={handleSubmit} isActive={isSaveActive}>
            저장하기
          </BtnSign2Small>
        </div>
      </div>

      {/* 하단 행동 텍스트: 관리자=팀 삭제하기 / 멤버·뷰어=팀 나가기 */}
      <div className="relative w-full h-[28px]">
        <div
          className="absolute left-1/2 -translate-x-1/2"
          style={{
            color: 'var(--Gray-400, #888)',
            fontFamily: 'SUIT',
            fontSize: '14px',
            fontStyle: 'normal',
            fontWeight: 500,
            lineHeight: '150%', // 21px
            letterSpacing: '-0.4px',
            display: 'flex',
            width: '72px',
            height: '28px',
            flexDirection: 'column',
            justifyContent: 'center',
            cursor: 'pointer',
            textAlign: 'center',
          }}
          onClick={isAdmin ? onDelete : onLeaveTeam}
        >
          {isAdmin ? '팀 삭제하기' : '팀 나가기'}
        </div>
      </div>
    </div>
  );
}
