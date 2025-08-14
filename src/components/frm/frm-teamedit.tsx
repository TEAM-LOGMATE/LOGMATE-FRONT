import { useState } from 'react';
import Input48 from '../input/48';
import FrmMemberList from './frm-memberlist';
import BtnX from '../btn/btn-x';
import BtnSign2Small from '../btn/btn-sign-2-small';
import { isValidEmail } from '../../utils/validate';

type Member = {
  name: string;
  email: string;
  role: 'teamAdmin' | 'member' | 'viewer';
};

type FrmTeamEditProps = {
  initialName: string;
  initialDescription?: string;
  initialMembers: Member[];
  onSubmit?: (data: { name: string; description: string; members: Member[] }) => void;
  onClose?: () => void;
  onDelete?: () => void;
};

export default function FrmTeamEdit({
  initialName,
  initialDescription = '',
  initialMembers,
  onSubmit,
  onClose,
  onDelete,
}: FrmTeamEditProps) {
  const [teamName, setTeamName] = useState(initialName);
  const [teamDesc, setTeamDesc] = useState(initialDescription);
  const [members, setMembers] = useState<Member[]>(initialMembers);

  const handleSubmit = () => {
    if (!teamName.trim() || members.length === 0) return;
    onSubmit?.({ name: teamName, description: teamDesc, members });
  };

  const isSaveActive = teamName.trim() !== '' && members.length > 0;

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

      {/* 팀 이름 */}
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
        />
      </div>

      {/* 팀 설명 */}
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
            onMemberAdd={(email) => {
              if (isValidEmail(email)) {
                setMembers((prev) => [
                  ...prev,
                  { name: '팀원명', email, role: 'member' },
                ]);
              }
            }}
            onRoleChange={(index, newRole) => {
              setMembers((prev) =>
                prev.map((m, i) => (i === index ? { ...m, role: newRole } : m))
              );
            }}
            onDeleteClick={(index) => {
              setMembers((prev) => prev.filter((_, i) => i !== index));
            }}
          />
        </div>
      </div>

            {/* 저장하기 버튼 */}
      <div className="w-full flex justify-center">
        <BtnSign2Small onClick={handleSubmit} isActive={isSaveActive}>
          저장하기
        </BtnSign2Small>
      </div>

      {/* 팀 삭제하기 버튼 */}
      <div
        className="w-full flex justify-center"
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
        }}
        onClick={onDelete}
      >
        팀 삭제하기
      </div>
    </div>
  );
}
