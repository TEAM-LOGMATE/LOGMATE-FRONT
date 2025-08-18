import AgentStatusUnresponsive from '../text/agent-status-unresponse';
import BtnLink from '../btn/btn-link';
import BtnSetting from '../btn/btn-setting';

interface FrmThumbnailBoardProps {
  connected?: boolean;
  onAddBoard?: () => void; // 새로운 보드 연결 클릭 이벤트
  boardName?: string;
  lastEdited?: string;     // 수정된 날짜 (YYYY.MM.DD)
  onDelete?: () => void;   // 세팅 버튼 클릭 → 삭제 임의로 구현
  onOpen?: () => void;     // 보드 이름 클릭 시 대시보드 열기
}

export default function FrmThumbnailBoard({
  connected = true,
  onAddBoard,
  boardName,
  lastEdited,
  onDelete,
  onOpen,
}: FrmThumbnailBoardProps) {
  const today = new Date();
  const fallbackDate = today.toISOString().slice(0, 10).replace(/-/g, '.');

  return (
    <div
      className="
        flex flex-col justify-between items-end
        w-[640px] h-[372px] p-4
        rounded-[8px]
        bg-[#171717]
      "
    >
      {connected ? (
        <>
          {/* 우측 상단 상태 */}
          <div className="w-full flex justify-end">
            <AgentStatusUnresponsive />
          </div>

          {/* 하단 영역 */}
          <div className="w-full flex justify-between items-center">
            {/* 좌측: 텍스트 영역 */}
            <div className="flex flex-col gap-[2px]">
              <span
                onClick={onOpen}
                className="
                  font-suit text-[18px] font-bold leading-[140%] tracking-[-0.4px]
                  text-[#D8D8D8] cursor-pointer
                "
              >
                {boardName || '모니터링 보드 A'}
              </span>
              <div className="flex gap-[4px]">
                <span className="font-geist text-[14px] font-light leading-[150%] text-[#AEAEAE]">
                  Edited
                </span>
                <span className="font-geist-mono text-[14px] font-light leading-[150%] text-[#AEAEAE]">
                  {lastEdited || fallbackDate}
                </span>
              </div>
            </div>

            {/* 우측: 링크 + 세팅 */}
            <div className="flex items-center gap-2 relative top-[8px]">
              <BtnLink>http://google.com</BtnLink>
              <BtnSetting onClick={onDelete} />
            </div>
          </div>
        </>
      ) : (
        /* Unconnected 상태 */
        <div className="flex flex-1 w-full h-full justify-center items-center">
          <span
            onClick={onAddBoard}
            className="
              font-suit text-[16px] font-medium leading-[150%] tracking-[-0.4px]
              text-[#888888] cursor-pointer hover:text-[#F2F2F2] transition
            "
          >
            새로운 보드 연결하기 +
          </span>
        </div>
      )}
    </div>
  );
}
