import { useNavigate } from 'react-router-dom';

interface MyPageProps {
  active?: boolean; // 현재 페이지 활성화 여부
}

export default function MyPage({ active = false }: MyPageProps) {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate('/myinfo');
  };

  return (
    <div
      onClick={handleClick}
      className={`
        w-[220px] h-[56px] border-t border-[#222] px-[12px]
        flex items-center justify-between flex-shrink-0
        cursor-pointer
        ${active ? 'text-[#4FE75E] bg-[#222]' : 'text-[#888] hover:bg-[#222]'}
      `}
    >
      <span
        className={`
          pt-[2px]
          text-center font-suit text-[14px] font-medium
          leading-[150%] tracking-[-0.4px]
          ${active ? 'text-[#4FE75E]' : 'hover:text-[#F2F2F2]'}
          ml-[5px]
        `}
      >
        내 정보
      </span>
    </div>
  );
}
