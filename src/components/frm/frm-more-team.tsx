export default function FrmMoreTeam() {
  const teamItems = ['팀 설정 변경', '팀 나가기']; 

  return (
    <div
      className="
        flex flex-col items-start
        w-[140px]
        rounded-[4px]
        border border-[#111111]
        bg-[#222222]
        overflow-hidden
      "
    >
      {teamItems.map((item, idx) => (
        <div
          key={idx}
          className={`
            flex items-center gap-[10px]
            h-[40px] px-[12px]
            self-stretch
            text-[#D8D8D8]
            font-[SUIT] text-[14px] font-medium
            leading-[150%] tracking-[-0.4px]
            ${idx !== teamItems.length - 1 ? 'border-b border-[#353535]' : ''}
          `}
        >
          {item}
        </div>
      ))}
    </div>
  );
}
