import { useEffect, useMemo, useState } from "react";
import AgentStatusUnresponsive from "../text/agent-status-unresponse";
import AgentStatusCollecting from "../text/agent-status-collecting";
import AgentStatusBefore from "../text/agent-status-before";
import BtnSetting from "../btn/btn-setting";
import Thumbnail from "../../pages/dashboard/Thumbnail";

interface FrmThumbnailBoardProps {
  boardId?: number;
  connected?: boolean;
  onAddBoard?: () => void;
  boardName?: string;
  lastEdited?: string;
  onDelete?: () => void;
  onOpen?: () => void;
  spaceType?: "personal" | "team";
  previewPath?: string;
  statusType?: "collecting" | "unresponsive" | "before"; // ← 이제는 사실상 무시
  onChangeStatus?: (newStatus: "collecting" | "unresponsive" | "before") => void;
}

export default function FrmThumbnailBoard({
  boardId,
  connected = true,
  onAddBoard,
  boardName,
  lastEdited,
  onDelete,
  onOpen,
  spaceType = "personal",
  previewPath,
  onChangeStatus,
}: FrmThumbnailBoardProps) {
  const today = new Date();
  const fallbackDate = today.toISOString().slice(0, 10).replace(/-/g, ".");

  // ✅ 초기 상태: localStorage → 없으면 무조건 "unresponsive"
  const [statusType, setStatusType] = useState<"unresponsive" | "collecting" | "before">(() => {
    if (boardId == null) return "unresponsive";
    const saved = localStorage.getItem(`statusType-${boardId}`) as
      | "unresponsive"
      | "collecting"
      | "before"
      | null;
    if (!saved) {
      localStorage.setItem(`statusType-${boardId}`, "unresponsive");
      return "unresponsive";
    }
    return saved;
  });

  // ✅ 상태 변경되면 localStorage에 저장
  useEffect(() => {
    if (boardId == null) return;
    try {
      localStorage.setItem(`statusType-${boardId}`, statusType);
      window.dispatchEvent(
        new CustomEvent("boardStatusChange", { detail: { boardId, statusType } })
      );
    } catch {}
  }, [statusType, boardId]);

  // 상태 토글
  const handleToggleStatus = () => {
    setStatusType((prev) => {
      const next =
        prev === "unresponsive"
          ? "collecting"
          : prev === "collecting"
          ? "before"
          : "unresponsive";

      onChangeStatus?.(next);
      return next;
    });
  };

  // 경로 보정 유틸
  const ensureAbsolute = (p: string) => (/^https?:\/\//i.test(p) ? p : p.startsWith("/") ? p : `/${p}`);
  const ensureThumbParam = (p: string) => {
    try {
      if (/^https?:\/\//i.test(p)) {
        const url = new URL(p);
        if (!url.searchParams.has("thumb")) url.searchParams.set("thumb", "1");
        return url.toString();
      } else {
        const [path, qs = ""] = p.split("?");
        const sp = new URLSearchParams(qs);
        if (!sp.has("thumb")) sp.set("thumb", "1");
        const qsStr = sp.toString();
        return `${path}${qsStr ? `?${qsStr}` : ""}`;
      }
    } catch {
      return p;
    }
  };

  // previewPath 적용
  const effectivePreviewPath = useMemo(() => {
    const fallback = boardId != null ? `/dashboard/${boardId}` : undefined;
    let p = previewPath ?? fallback;
    if (!p) return undefined;
    p = ensureAbsolute(p);
    p = ensureThumbParam(p);
    return p;
  }, [previewPath, boardId]);

  const THUMB_W = 592;
  const THUMB_H = 260;

  const canMountThumb = statusType === "collecting" && !!effectivePreviewPath;

  return (
    <div className="flex flex-col w-[640px] h-[372px] p-4 rounded-[8px] bg-[#171717]">
      {connected ? (
        <>
          {/* 상단 상태 (토글) */}
          <div className="w-full flex justify-end cursor-pointer mb-2" onClick={handleToggleStatus}>
            {statusType === "unresponsive" && <AgentStatusUnresponsive />}
            {statusType === "collecting" && <AgentStatusCollecting />}
            {statusType === "before" && <AgentStatusBefore />}
          </div>

          {/* 중앙: 썸네일 */}
          <div className="w-full mb-2" style={{ height: THUMB_H }}>
            {canMountThumb ? (
              <Thumbnail
                path={effectivePreviewPath!}
                width={THUMB_W}
                height={THUMB_H}
                scale={0.4}
                offsetX={87}
                offsetY={50}
              />
            ) : (
              <div
                className="
                  w-full h-full rounded-[8px]
                  border border-[#2a2a2a] bg-[#111]
                  flex items-center justify-center
                  text-[#888] text-[12px]
                "
              >
                {statusType === "unresponsive" ? "에이전트 미응답" : "대시보드 준비 중"}
              </div>
            )}
          </div>

          {/* 하단 메타/설정 */}
          <div className="w-full flex justify-between items-center mt-auto">
            <div className="flex flex-col gap-[2px]">
              <span
                onClick={() => onOpen?.()}
                className="
                  font-suit text-[18px] font-bold leading-[140%] tracking-[-0.4px]
                  text-[#D8D8D8] cursor-pointer hover:text-[#F2F2F2] transition
                "
              >
                {boardName || (spaceType === "team" ? "팀 보드" : "모니터링 보드 A")}
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

            <div className="flex items-center gap-2">
              <BtnSetting onClick={onDelete} />
            </div>
          </div>
        </>
      ) : (
        <div className="flex flex-1 w-full h-full justify-center items-center">
          <span
            onClick={onAddBoard}
            className="
              font-suit text-[16px] font-medium leading-[150%] tracking-[-0.4px]
              text-[#888888] cursor-pointer hover:text-[#F2F2F2] transition
            "
          >
            {spaceType === "team" ? "팀 보드 연결하기 +" : "새로운 보드 연결하기 +"}
          </span>
        </div>
      )}
    </div>
  );
}
