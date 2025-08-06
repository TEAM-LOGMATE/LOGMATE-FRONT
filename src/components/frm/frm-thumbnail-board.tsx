import AgentStatusUnresponsive from '../text/agent-status-unresponse';
import BtnLink from '../btn/btn-link';
import BtnSetting from '../btn/btn-setting';

export default function FrmThumbnailBoard() {
  return (
    <div
      className="
        flex flex-col justify-between items-end
        w-[720px] h-[400px] p-4
        rounded-[8px]
        bg-[#171717]
        text-[#D8D8D8]
      "
    >
      {/* 우측 상단 상태 */}
      <div className="w-full flex justify-end">
        <AgentStatusUnresponsive />
      </div>

      {/* 하단 영역 */}
      <div className="w-full flex justify-between items-center">
        {/* 좌측: 텍스트 영역 */}
        <div className="flex flex-col gap-[2px]">
          <span
            className="
              font-suit text-[18px] font-bold leading-[140%] tracking-[-0.4px]
              text-[#D8D8D8]
            "
          >
            모니터링 보드 A
          </span>
          <div className="flex gap-[4px]">
            <span
              className="
                font-geist text-[14px] font-light leading-[150%] text-[#AEAEAE]
              "
            >
              Edited
            </span>
            <span
              className="
                font-geist-mono text-[14px] font-light leading-[150%] text-[#AEAEAE]
              "
            >
              0000.00.00
            </span>
          </div>
        </div>

        {/* 우측: 링크 + 세팅 */}
        <div className="flex items-center gap-2">
          <BtnLink>
                  http://google.com
            </BtnLink>
          <BtnSetting />
        </div>
      </div>
    </div>
  );
}
