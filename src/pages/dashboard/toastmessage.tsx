import { useState } from "react";
import Input48 from "../../components/input/48";

interface ToastMessageProps {
  onCloseToast?: () => void;
}

export default function ToastMessage({ onCloseToast }: ToastMessageProps) {
  const [showCopyToast, setShowCopyToast] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText("agent001");
      setShowCopyToast(true);
      setTimeout(() => setShowCopyToast(false), 2000); // 2초 후 사라짐
    } catch (err) {
      console.error("복사 실패:", err);
    }
  };

  return (
    <div
      className="
        relative flex flex-col items-center gap-3
        w-[660px] px-10 pt-10 pb-8
        rounded-[24px] bg-[#111]
      "
    >
      {/* 닫기 버튼 */}
      <button
        onClick={onCloseToast}
        className="absolute right-6 top-6 w-[24px] h-[24px] flex items-center justify-center 
                   text-[#888] hover:text-[#fff] bg-transparent p-0 border-0"
      >
        ✕
      </button>

      {/* 아이콘 */}
      <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32" fill="none">
        <rect x="0.75" y="0.75" width="30.5" height="30.5" rx="15.25" fill="#091104"/>
        <rect x="0.75" y="0.75" width="30.5" height="30.5" rx="15.25" stroke="#4FE75E" strokeWidth="1.5"/>
        <path d="M9.5 16.2727L13.2296 20.2283C13.6243 20.647 14.29 20.647 14.6847 20.2283L21.5 13"
              stroke="#4FE75E" strokeWidth="2" strokeLinecap="round"/>
      </svg>

      {/* 타이틀 */}
      <h2 className="text-center text-[#F2F2F2] font-[SUIT] text-[28px] font-bold leading-[135%] tracking-[-0.4px]">
        보드 등록이 완료되었습니다!
      </h2>

      {/* 설명 */}
      <p className="text-center text-[#D8D8D8] font-[SUIT] text-[16px] font-medium leading-[150%] tracking-[-0.4px]">
        아래의 Agent ID를 해당 Agent에 입력해주세요.
      </p>

      {/* Input48 + 커스텀 텍스트 오버레이 */}
      <div className="relative w-[290px]">
        <Input48 value="" readOnly onChange={() => {}} align="center" />
        <div className="absolute inset-0 flex justify-center items-center pointer-events-none">
          <span className="text-[var(--Brand-Primary,#4FE75E)] font-[Geist] text-[16px] font-normal leading-[150%]">
            agent-
          </span>
          <span className="text-[var(--Brand-Primary,#4FE75E)] font-['Geist_Mono'] text-[16px] font-light leading-[150%]">
            001
          </span>
        </div>

        {/* 오른쪽 아이콘 (클릭 → 복사) */}
        <button
          onClick={handleCopy}
          className="absolute right-2 top-2 w-[24px] h-[24px] flex items-center justify-center bg-transparent border-0 p-0"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
            <rect x="8" y="4" width="11" height="13" rx="2" fill="#535353"/>
            <rect x="5" y="7" width="11" height="13" rx="2" fill="#888888"/>
          </svg>
        </button>
      </div>

      {/* 안내 텍스트 */}
      <p
        className="
          text-center text-[var(--Gray-300,#AEAEAE)]
          font-[SUIT] text-[14px] font-normal leading-[150%] tracking-[-0.4px]
        "
      >
        이 ID는 Agent의 고유 식별자이며,
        <br />
        수집 로그를 이 보드에 연결하는 데 필요합니다.
      </p>

      {/* Agent 설치 가이드 보기 */}
      <button
        onClick={() => console.log("Agent 설치 가이드 보기")}
        className="text-[var(--Gray-400,#888)] font-[SUIT] text-[14px] font-medium leading-[150%] tracking-[-0.4px] underline bg-transparent"
      >
        Agent 설치 가이드 보기
      </button>

      {/* 복사 성공 토스트 */}
      {showCopyToast && (
        <div
          className="absolute bottom-[-50px] px-4 py-2 rounded-lg bg-[#333] text-[#fff] text-sm"
        >
          Agent ID가 복사되었습니다!
        </div>
      )}
    </div>
  );
}
