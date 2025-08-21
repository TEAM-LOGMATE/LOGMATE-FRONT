import { useMemo } from "react";

type Props = {
  path: string;
  width: number;
  height: number;
  scale?: number;       // 확대/축소 비율 (0.5 ~ 2.0 등)
  overlay?: string;
  title?: string;
  offsetX?: number;     // X축 이동(px, 원본 기준)
  offsetY?: number;     // Y축 이동(px, 원본 기준)
};

export default function Thumbnail({
  path,
  width,
  height,
  scale = 1.0,
  overlay,
  title = "dashboard-thumb",
  offsetX = 0,
  offsetY = 0,
}: Props) {
  const src = useMemo(() => {
    try {
      if (/^https?:\/\//i.test(path)) return path;
      const u = new URL(path.startsWith("/") ? path : `/${path}`, window.location.origin);
      return u.href;
    } catch {
      const prefix = window.location.origin.replace(/\/$/, "");
      const p = path.startsWith("/") ? path : `/${path}`;
      return `${prefix}${p}`;
    }
  }, [path]);

  // 원본 iframe 크기를 크게 잡아서 이동/확대 시 빈 공간 방지
  const innerW = width * 3;
  const innerH = height * 3;

  const SCROLLBAR_MASK = 20;

  return (
    <div
      className="relative overflow-hidden rounded-[8px] border border-[#2a2a2a] bg-[#111]"
      style={{ width, height }}
    >
      {/* 오프셋 이동 후 확대 */}
      <div
        style={{
          transform: `translate(${-offsetX}px, ${-offsetY}px) scale(${scale})`,
          transformOrigin: "top left",
          width: innerW,
          height: innerH,
          overflow: "hidden",
          position: "relative",
        }}
      >
        <iframe
          title={title}
          src={src}
          width={innerW}
          height={innerH}
          frameBorder="0"
          scrolling="no"
          style={{
            pointerEvents: "none",
            border: "0",
            display: "block",
          }}
        />

        {/* 오른쪽 스크롤바 가림막 */}
        <div
          style={{
            position: "absolute",
            top: 0,
            right: 0,
            width: `${SCROLLBAR_MASK}px`,
            height: "100%",
            background: "#111",
            pointerEvents: "none",
          }}
        />
      </div>

      {overlay && (
        <div className="absolute left-4 top-4 px-3 py-2 rounded-[10px] bg-black/50 text-[12px] text-[#C7F7D1]">
          {overlay}
        </div>
      )}
    </div>
  );
}
