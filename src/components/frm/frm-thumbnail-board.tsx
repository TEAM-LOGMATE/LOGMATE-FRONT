import { useEffect, useMemo, useState, useRef } from "react";
import AgentStatusUnresponsive from "../text/agent-status-unresponse";
import AgentStatusCollecting from "../text/agent-status-collecting";
import AgentStatusBefore from "../text/agent-status-before";
import BtnMore from "../btn/btn-more";
import BtnMoreText from "../btn/btn-more-text";
import Thumbnail from "../../pages/dashboard/Thumbnail";
import { deleteDashboard } from "../../api/dashboard"; 

interface FrmThumbnailBoardProps {
  folderId: number;  
  boardId: number;
  connected?: boolean;
  onAddBoard?: () => void;
  boardName?: string;
  lastEdited?: string;
  onOpen?: () => void;
  spaceType?: "personal" | "team";
  previewPath?: string;
  statusType?: "collecting" | "unresponsive" | "before";
  onChangeStatus?: (newStatus: "collecting" | "unresponsive" | "before") => void;
  onDeleted?: () => void; 
}

export default function FrmThumbnailBoard({
  folderId,
  boardId,
  connected = true,
  onAddBoard,
  boardName,
  lastEdited,
  onOpen,
  spaceType = "personal",
  previewPath,
  onChangeStatus,
  onDeleted,
}: FrmThumbnailBoardProps) {
  const today = new Date();
  const fallbackDate = today.toISOString().slice(0, 10).replace(/-/g, ".");

  const [statusType, setStatusType] = useState<"unresponsive" | "collecting" | "before">(() => {
    if (!boardId) return "unresponsive";
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

  useEffect(() => {
    if (!boardId) return;
    try {
      localStorage.setItem(`statusType-${boardId}`, statusType);
      window.dispatchEvent(
        new CustomEvent("boardStatusChange", { detail: { boardId, statusType } })
      );
    } catch {}
  }, [statusType, boardId]);

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

  const ensureAbsolute = (p: string) =>
    /^https?:\/\//i.test(p) ? p : p.startsWith("/") ? p : `/${p}`;
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

  const effectivePreviewPath = useMemo(() => {
    const fallback = boardId ? `/dashboard/${boardId}` : undefined;
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
      {/* 공통 wrapper 유지 */}
      {connected ? (
        <>
          {/* 상단 상태 (토글) */}
          <div
            className="w-full flex justify-end cursor-pointer mb-2"
            onClick={handleToggleStatus}
          >
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
              <div className="w-full h-full rounded-[8px] border border-[#2a2a2a] bg-[#111] flex items-center justify-center text-[#888] text-[12px]">
                {statusType === "unresponsive" ? "에이전트 미응답" : "대시보드 준비 중"}
              </div>
            )}
          </div>

          {/* 하단 메타/설정 */}
          <div className="w-full flex justify-between items-center mt-auto">
            <div className="flex flex-col gap-[2px]">
              <span
                onClick={() => onOpen?.()}
                className="font-suit text-[18px] font-bold leading-[140%] tracking-[-0.4px] text-[#D8D8D8] cursor-pointer hover:text-[#F2F2F2] transition"
              >
                {boardName || (spaceType === "team" ? "팀 보드" : "모니터링 보드 A")}
              </span>
              <div className="flex gap-[4px]">
                <span className="font-geist text-[14px] text-[#AEAEAE]">Edited</span>
                <span className="font-geist-mono text-[14px] text-[#AEAEAE]">
                  {lastEdited || fallbackDate}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <BoardMenu
                onRename={() => console.log("보드 이름 바꾸기 실행")}
                onDelete={async () => {
                  try {
                    const res = await deleteDashboard(folderId, boardId);
                    console.log("삭제 성공:", res);
                    onDeleted?.(); 
                  } catch (err) {
                    console.error("삭제 실패:", err);
                  }
                }}
              />
            </div>
          </div>
        </>
      ) : (
        // 같은 wrapper 유지, 내용만 바꿈
        <div className="flex flex-1 w-full h-full justify-center items-center">
          <span
            onClick={onAddBoard}
            className="font-suit text-[16px] font-medium leading-[150%] tracking-[-0.4px] text-[#888888] cursor-pointer hover:text-[#F2F2F2] transition"
          >
            {spaceType === "team" ? "팀 보드 연결하기 +" : "새로운 보드 연결하기 +"}
          </span>
        </div>
      )}
    </div>
  );
}

/* 드롭다운 메뉴 */
function BoardMenu({ onRename, onDelete }: { onRename?: () => void; onDelete?: () => void }) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const options = ["보드 이름 바꾸기", "보드 삭제"];

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (value: string) => {
    if (value === "보드 이름 바꾸기") onRename?.();
    if (value === "보드 삭제") onDelete?.();
    setOpen(false);
  };

  return (
    <div className="relative" ref={menuRef}>
      <BtnMore onClick={() => setOpen((prev) => !prev)} />
      {open && (
        <div className="absolute right-0 mt-2 z-50">
          <BtnMoreText options={options} onSelect={handleSelect} onClose={() => setOpen(false)} />
        </div>
      )}
    </div>
  );
}
