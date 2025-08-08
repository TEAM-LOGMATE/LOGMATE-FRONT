import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function MyPage() {
  const [selected, setSelected] = useState(false);
  const navigate = useNavigate();

  const handleClick = () => {
    setSelected(true);        
    navigate('/myinfo');       
  };

  return (
    <div
      onClick={handleClick}
      className={`
        w-[220px] h-[56px] border-t border-[#222] px-[12px]
        flex items-center justify-between flex-shrink-0
        cursor-pointer
        ${selected ? 'text-[#4FE75E] bg-[#222]' : 'text-[#888] hover:bg-[#222]'}
      `}
    >
      <span
        className={`
          pt-[2px]
          text-center font-suit text-[14px] font-medium
          leading-[150%] tracking-[-0.4px]
          ${selected ? 'text-[#4FE75E]' : 'hover:text-[#F2F2F2]'}
          ml-[5px]
        `}
      >
        내 정보
      </span>
    </div>
  );
}
