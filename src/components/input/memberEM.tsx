import BtnInviteLink from '../btn/btn-invitelink';
import BtnAddMember from '../btn/btn-addmember';

type MemberEMProps = {
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onInviteClick?: () => void;
  onAddClick?: () => void;
  variant?: string;
};

export default function MemberEM({
  placeholder = '멤버 이메일 입력',
  value = '',
  onChange,
  onInviteClick,
  onAddClick,
}: MemberEMProps) {
  const isEmailFilled = value.trim().length > 0;

  return (
    <div
      className="
        flex w-[706px] h-[48px] px-[12px] pr-[8px] py-[8px]
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
        <circle
          cx="14"
          cy="15"
          r="5.4"
          stroke="#AEAEAE"
          strokeWidth="1.2"
        />
        <path
          d="M18 19L22 23"
          stroke="#AEAEAE"
          strokeWidth="1.2"
        />
      </svg>

      {/* 입력 필드 */}
      <input
        type="text"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="
          flex flex-col justify-center flex-1 self-stretch
          bg-transparent outline-none
          text-[var(--Gray-100,#F2F2F2)] font-SUIT text-[16px] font-normal
          leading-[150%] tracking-[-0.4px]
        "
      />

      {/* 우측 버튼들 */}
      <BtnInviteLink onClick={onInviteClick} />
      <BtnAddMember
        onClick={onAddClick}
        disabled={!isEmailFilled}
      />
    </div>
  );
}
