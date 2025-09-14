import BtnRole from '../btn/btn-role';
import BtnDelete from '../btn/btn-delete';

type Role = 'teamAdmin' | 'member' | 'viewer';

type FrmMemberLineProps = {
  name?: string;
  email: string;
  role: Role;
  readOnly?: boolean;
  hideName?: boolean; 
  onRoleChange?: (newRole: Role) => void;
  onDeleteClick?: () => void;
};

export default function FrmMemberLine({
  name,
  email,
  role,
  readOnly = false,
  hideName = false,
  onRoleChange,
  onDeleteClick,
}: FrmMemberLineProps) {
  return (
    <div
      className={`
        flex w-[706px] px-[32px] pr-[24px]
        flex-col items-center gap-[10px]
        rounded-[8px]
        transition-colors duration-150
        ${readOnly ? '' : 'hover:bg-[var(--Gray-600,#353535)]'}
      `}
    >
      <div className="flex w-full justify-between items-center">
        {/* 이름 + 이메일 */}
        <div className="flex items-center gap-[12px]">
          {!hideName && name && ( 
            <span className="text-[var(--Gray-200,#D8D8D8)] font-suit text-[16px] font-medium leading-[150%] tracking-[-0.4px]">
              {name}
            </span>
          )}
          <span className="text-[var(--Gray-300,#AEAEAE)] font-geist text-[14px] font-light leading-[150%]">
            {email}
          </span>
        </div>

        {/* 역할 버튼 + 삭제 버튼 */}
        <div className="flex items-center gap-[40px]">
          <BtnRole
            role={role}
            onRoleChange={(newRole) => {
              if (readOnly) return;
              onRoleChange?.(newRole);
            }}
            readOnly={readOnly}
            hideCaret={false} // ✅ 화살표는 항상 보이게
          />

          <BtnDelete onClick={readOnly ? undefined : onDeleteClick} />
        </div>
      </div>
    </div>
  );
}
