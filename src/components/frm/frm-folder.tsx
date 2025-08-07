import BtnMore from '../btn/btn-more';

export default function FrmFolder() {
  return (
    <div className="w-[371px] h-[275px] flex flex-col items-start gap-[12px] rounded-[8px] bg-[#222] p-[12px] font-suit text-white">
      
      {/*  썸네일 묶음 */}
      <div className="flex flex-col gap-[12px]">
        <div className="flex flex-row gap-[12px]">
          <div className="w-[168px] h-[120px] rounded-[4px] bg-[#171717]" />
          <div className="w-[168px] h-[120px] rounded-[4px] bg-[#171717]" />
        </div>
        <div className="w-[168px] h-[120px] rounded-[4px] bg-[#171717]" />
      </div>

      {/*  텍스트 + 버튼 */}
      <div className="flex w-full justify-between items-start mt-[12px]">
        <div className="flex flex-col items-start gap-[4px]">
          <span className="text-[16px] font-[700] leading-[24px] tracking-[-0.4px] text-[#D8D8D8]">
            새 폴더
          </span>
          <span className="text-[14px] font-light leading-[21px] tracking-[-0.4px] text-[#AEAEAE] font-[Geist_Mono]">
            Edited 0000.00.00
          </span>
        </div>
        <BtnMore />
      </div>
    </div>
  );
}
