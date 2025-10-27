import { useState, useEffect } from 'react';
import Input48 from '../input/48';
import FrmMemberList from './frm-memberlist';
import BtnX from '../btn/btn-x';
import BtnSign2Small from '../btn/btn-sign-2-small';
import { isValidEmail } from '../../utils/validate';
import { getTeamDetail } from '../../api/teams';
import { useAuth } from '../../utils/AuthContext';
import ErrorToast from '../text/error-toast';

type Role = 'teamAdmin' | 'member' | 'viewer';

type UiMember = {
  userId?: number;
  name: string;
  email: string;
  role: Role;
};

type FrmTeamEditProps = {
  teamId: number;
  onSubmit?: (data: { name: string; description: string; members: UiMember[] }) => void;
  onClose?: () => void;
  onDelete?: () => void;
  onLeaveTeam?: () => void;
};

function mapApiRoleToUiRole(apiRole: string): Role {
  switch (apiRole) {
    case 'ADMIN':
      return 'teamAdmin';
    case 'MEMBER':
      return 'member';
    case 'VIEWER':
      return 'viewer';
    default:
      return 'viewer';
  }
}

export default function FrmTeamEdit({
  teamId,
  onSubmit,
  onClose,
  onDelete,
  onLeaveTeam,
}: FrmTeamEditProps) {
  const { user } = useAuth();

  const [loading, setLoading] = useState(true);
  const [teamName, setTeamName] = useState('');
  const [teamDesc, setTeamDesc] = useState('');
  const [members, setMembers] = useState<UiMember[]>([]);
  const [currentRole, setCurrentRole] = useState<Role>('viewer');
  const [errorMsg, setErrorMsg] = useState('');

  const isAdmin = currentRole === 'teamAdmin';
  const isReadOnly = !isAdmin;

  // 팀 상세조회
  useEffect(() => {
    async function fetchTeamDetail() {
      try {
        const data = await getTeamDetail(teamId);

        setTeamName(data.name);
        setTeamDesc(data.description ?? '');
        const mapped = data.members.map((m: any) => ({
          name: m.name,
          email: m.email,
          role: mapApiRoleToUiRole(m.role),
        }));
        setMembers(mapped);

        // 내 역할 판단
        let myRole: Role = 'viewer';
        if (user) {
          const me = mapped.find((m) => m.email === user.email);
          if (me) myRole = me.role;
        } else {
          const admin = mapped.find((m) => m.role === 'teamAdmin');
          if (admin) myRole = 'teamAdmin';
        }
        setCurrentRole(myRole);
      } catch (err) {
        console.error('팀 상세 조회 실패:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchTeamDetail();
  }, [teamId, user]);

  const handleSubmit = () => {
    if (isAdmin) {
      if (!teamName.trim() || members.length === 0) return;
    } else {
      if (teamDesc.trim() === '') return;
    }
    onSubmit?.({ name: teamName, description: teamDesc, members });
  };

  const isSaveActive = isAdmin
    ? teamName.trim() !== '' && members.length > 0
    : teamDesc.trim() !== '';

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[200px] text-[#D8D8D8]">
        팀 정보를 불러오는 중...
      </div>
    );
  }

  return (
    <div className="relative flex flex-col items-center w-full max-w-[800px] p-[40px] gap-[24px] bg-[#0F0F0F] rounded-[12px]">
      {/* 에러 토스트 */}
      {errorMsg && (
        <div className="absolute bottom-[32px] left-1/2 -translate-x-1/2 z-50 ">
          <ErrorToast
            message={errorMsg}
            autoHideMs={2000}
            onClose={() => setErrorMsg('')}
          />
        </div>
      )}


      {/* 닫기 버튼 */}
      <div className="absolute top-[16px] right-[16px]">
        <BtnX onClick={onClose} />
      </div>

      {/* 제목 */}
      <h2 className="text-[var(--Gray-100,#F2F2F2)] text-center font-suit text-[28px] font-bold leading-[135%] tracking-[-0.4px]">
        팀 설정
      </h2>

      {/* 팀 이름 */}
      <div className="w-full">
        <label className="text-[var(--Gray-200,#D8D8D8)] font-suit text-[16px] font-medium leading-[150%] tracking-[-0.4px]">
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

      {/* 팀 설명 */}
      <div className="w-full">
        <label className="text-[var(--Gray-200,#D8D8D8)] font-suit text-[16px] font-medium leading-[150%] tracking-[-0.4px]">
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
        <label className="text-[var(--Gray-200,#D8D8D8)] font-suit text-[16px] font-medium leading-[150%] tracking-[-0.4px]">
          팀원 리스트 <span className="text-[var(--Alert-Red,#D46F6F)]">*</span>
        </label>

        <div className="mt-[8px]">
          <FrmMemberList
            members={members}
            readOnly={isReadOnly}
            onMemberAdd={(email) => {
              const trimmed = email.trim();
              if (!isValidEmail(trimmed)) return;
              setMembers((prev) => {
                if (prev.some((m) => m.email === trimmed)) return prev;
                return [
                  ...prev,
                  { name: '새 팀원', email: trimmed, role: 'member' },
                ];
              });
            }}
            onRoleChange={(index, newRole) => {
              if (!isAdmin) return;
              setMembers((prev) =>
                prev.map((m, i) => (i === index ? { ...m, role: newRole } : m))
              );
            }}
            onDeleteClick={
              isAdmin
                ? (index) => {
                    setMembers((prev) => {
                      const target = prev[index];
                      if (user && target.email === user.email) {
                        setErrorMsg('자기 자신은 삭제할 수 없습니다.'); 
                        setTimeout(() => setErrorMsg(''), 2000);
                        return prev;
                      }
                      return prev.filter((_, i) => i !== index);
                    });
                  }
                : undefined
            }
          />
        </div>
      </div>

      {/* 저장 버튼 */}
      <div className="relative w-full h-[48px]">
        <div className="absolute left-1/2 -translate-x-1/2">
          <BtnSign2Small onClick={handleSubmit} isActive={isSaveActive}>
            저장하기
          </BtnSign2Small>
        </div>
      </div>

      {/* 하단 행동 텍스트 */}
      <div className="relative w-full h-[28px]">
        <div
          className="absolute left-1/2 -translate-x-1/2"
          style={{
            color: 'var(--Gray-400, #888)',
            fontFamily: 'SUIT',
            fontSize: '14px',
            fontWeight: 500,
            lineHeight: '150%',
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
