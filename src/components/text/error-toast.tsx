import { useEffect, useState } from 'react';

type ErrorToastProps = {
  message: string;
  /** 클릭 등 특정 동작 시 바뀌는 값 (같은 문구라도 표시 재시작) */
  trigger?: number | string;
  /** (선택) 자동 닫힘(ms) */
  autoHideMs?: number;
  /** (선택) 자동 닫힘 시 실행할 콜백 */
  onClose?: () => void;
};

export default function ErrorToast({ message, trigger, autoHideMs, onClose }: ErrorToastProps) {
  const [animKey, setAnimKey] = useState(0);

  // message나 trigger가 바뀌면 애니메이션 재시작
  useEffect(() => {
    setAnimKey((k) => k + 1);
  }, [message, trigger]);

  // autoHideMs 옵션이 있으면 자동 닫기
  useEffect(() => {
    if (!autoHideMs) return;
    const t = setTimeout(() => onClose?.(), autoHideMs);
    return () => clearTimeout(t);
  }, [autoHideMs, onClose, animKey]);

  return (
    <div
      key={animKey}
      className="inline-flex items-center justify-center gap-[4px] px-[16px] py-[6px]
                 text-center border border-[#D46F6F] bg-[#111] rounded-[8px]
                 text-[#D46F6F] font-suit text-[16px] font-bold leading-[24px] tracking-[-0.4px]
                 animate-pop-fade [animation-fill-mode:forwards]
                 whitespace-nowrap"
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
      </svg>
      {message}
    </div>
  );
}
