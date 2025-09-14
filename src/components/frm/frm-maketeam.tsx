import { useState } from 'react';
import Input48 from '../input/48';
import FrmMemberList from './frm-memberlist';
import BtnX from '../btn/btn-x';
import BtnSign2Small from '../btn/btn-sign-2-small';
import { isValidEmail } from '../../utils/validate';
import type { UiMember, UiRole } from '../../utils/type';

type FrmMakeTeamProps = {
  onSubmit?: (data: {
    name: string;
    description: string;
    members: UiMember[];
  }) => void;
  onClose?: () => void;
};

export default function FrmMakeTeam({ onSubmit, onClose }: FrmMakeTeamProps) {
  const [teamName, setTeamName] = useState('');
  const [teamDesc, setTeamDesc] = useState('');
  const [members, setMembers] = useState<UiMember[]>([]);

  const handleSubmit = () => {
    if (!teamName.trim() || members.length === 0) return;
    onSubmit?.({
      name: teamName.trim(),
      description: teamDesc.trim(),
      members,
    });
  };

  const isCreateTeamActive = teamName.trim() !== '' && members.length > 0;

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
        새로운 팀 추가
      </h2>

      {/* 팀 이름 */}
      <div className="w-full">
        <label
          className="
            block mb-[8px]
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
            block mb-[8px]
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
            hideName={true}  
            onMemberAdd={(email) => {
              if (isValidEmail(email)) {
                setMembers((prev) => [
                  ...prev,
                  {
                    name: '팀원명',
                    email,
                    role: 'member' as UiRole,
                  },
                ]);
              }
            }}
            onRoleChange={(index, newRole) => {
              setMembers((prev) =>
                prev.map((m, i) =>
                  i === index ? { ...m, role: newRole } : m
                )
              );
            }}
            onDeleteClick={(index) => {
              setMembers((prev) => prev.filter((_, i) => i !== index));
            }}
          />
        </div>
      </div>

      {/* 팀 만들기 버튼 */}
      <div className="w-full flex justify-center mt-[24px]">
        <BtnSign2Small onClick={handleSubmit} isActive={isCreateTeamActive}>
          팀 만들기
        </BtnSign2Small>
      </div>
    </div>
  );
}
