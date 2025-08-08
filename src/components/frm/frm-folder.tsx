import BtnMore from '../btn/btn-more';

export default function FrmFolder() {
  return (
    <div className="w-[340px] h-[300px] flex flex-col items-start gap-[12px] font-suit text-white">
      {/* 썸네일 + 전체 배경 박스 */}
      <div className="flex-1 w-full grid grid-cols-2 grid-rows-2 gap-[12px] p-[12px] bg-[#222] rounded-[12px] overflow-hidden">
        <div className="flex-1 rounded-[4px] bg-[#171717]" />
        <div className="flex-1 rounded-[4px] bg-[#171717]" />
        <div className="flex-1 rounded-[4px] bg-[#171717]" />
        <div className="flex-1 rounded-[4px] bg-[#171717]" />
      </div>

      {/* 텍스트 영역 */}
      <div className="w-full bg-[#0F0F0F] px-[12px] pt-[8px] pb-[16px] rounded-b-[12px]">
        <div className="flex justify-between items-start">
          <div className="flex flex-col items-start gap-[4px]">
            <span className="text-[16px] font-bold leading-[24px] text-[#F2F2F2]">새 폴더</span>
            <span className="text-[14px] leading-[21px] text-[#AEAEAE]">
              <span className="font-[Geist] font-light">Edited </span>
              <span className="font-['Geist_Mono'] font-light">0000.00.00</span>
            </span>
          </div>
          <BtnMore />
        </div>
      </div>
    </div>
  );
}
