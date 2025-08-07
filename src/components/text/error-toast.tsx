// ErrorToast.tsx

type ErrorToastProps = {
  message: string;
};

export default function ErrorToast({ message }: ErrorToastProps) {
  return (
    <div
      className="inline-flex items-center justify-center gap-[4px] px-[16px] py-[6px]
                 text-center border border-[#D46F6F] bg-[#111] rounded-[8px]
                 text-[#D46F6F] font-suit text-[16px] font-bold leading-[24px] tracking-[-0.4px]
                 animate-pop-fade [animation-fill-mode:forwards]" // 애니메이션 추가
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
      >
        <circle cx="12" cy="12" r="8" fill="#D46F6F" />
        <path d="M13 11V17H11V11H13Z" fill="#111111" />
        <path d="M11 7H13V9H11V7Z" fill="#111111" />
        <path d="M13 7V9H11V7H13Z" fill="#111111" />
      </svg>
      {message}
    </div>
  );
}
