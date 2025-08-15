type BtnXProps = {
  onClick?: () => void;
};

export default function BtnX({ onClick }: BtnXProps) {
  return (
    <button
      onClick={onClick}
      className="
        flex w-[32px] h-[32px] flex-shrink-0 items-center justify-center
        bg-transparent hover:bg-[var(--Gray-600,#353535)]
        transition-colors duration-150
      "
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="12"
        height="12"
        viewBox="0 0 14 14"
        fill="none"
        className="flex-shrink-0"
      >
        <path
          d="M1 1L13 13"
          stroke="#AEAEAE"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        <path
          d="M13 1L1 13"
          stroke="#AEAEAE"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>
    </button>
  );
}
