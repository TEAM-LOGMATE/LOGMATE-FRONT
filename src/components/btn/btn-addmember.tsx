type BtnAddMemberProps = {
  label?: string;
  onClick?: () => void;
  disabled?: boolean;
};

export default function BtnAddMember({
  label = '팀원 추가',
  onClick,
  disabled = false,
}: BtnAddMemberProps) {
  return (
    <div
      className="
        flex w-[92px] h-[32px]
        justify-center items-center flex-shrink-0
      "
    >
      <button
        onClick={disabled ? undefined : onClick}
        disabled={disabled}
        aria-disabled={disabled}
        tabIndex={disabled ? -1 : 0}
        className={`
          flex justify-center items-center gap-[10px]
          w-[92px] h-[32px]
          rounded-[6px]
          font-suit text-[14px] font-bold leading-[150%] tracking-[-0.4px]
          transition-all
          ${disabled
            ? 'bg-[var(--Brand-Tertiary,#1F5A05)] text-[var(--Brand-Background,#091104)]'
            : 'bg-[var(--Brand-Primary,#4FE75E)] text-[var(--Brand-Background,#091104)] hover:brightness-105 active:brightness-95'
          }
        `}
      >
        {label}
      </button>
    </div>
  );
}
