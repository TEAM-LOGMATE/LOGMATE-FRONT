import Input48 from "../../components/input/48";

interface ToastMessageProps {
  onCloseToast?: () => void;  
}

export default function ToastMessage({ onCloseToast }: ToastMessageProps) {
  return (
    <div
      className="
        flex flex-col items-center gap-6
        w-[660px] px-10 pt-10 pb-12
        rounded-[24px] bg-[#111]
      "
    >
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

      {/* Input + 아이콘 (Input 내부로 이동) */}
      <div className="relative w-full max-w-[376px]">
        <Input48 value="/var/log/app.log" readOnly onChange={() => {}} />
        {/* Input 내부 오른쪽에 붙는 아이콘 */}
        <div
          className="absolute right-2 top-1/2 -translate-y-1/2 
                     flex justify-center items-center w-[28px] h-[28px] 
                     bg-[#6B6B6B] text-[#F2F2F2] font-[SUIT] text-[12px] 
                     font-medium rounded-[6px]">
          □
        </div>
      </div>

      {/* 안내 텍스트 */}
      <p className="text-center text-[#888] font-[SUIT] text-[12px] font-medium leading-[150%] tracking-[-0.4px]">
        이 ID는 Agent의 고유 식별자이며, 수집 로그를 이 보드에 연결하는 데 필요합니다.
      </p>

      {/* 확인 버튼 */}
      <button
        onClick={onCloseToast}
        className="flex justify-center items-center w-[140px] py-[5px]
                   rounded-[12px] bg-[#242424]
                   text-[#F2F2F2] font-[SUIT] text-[16px] font-medium leading-[150%] tracking-[-0.4px]"
      >
        확인
      </button>
    </div>
  );
}
