// src/components/btn/btn-delete.tsx
import React from 'react';

type BtnDeleteProps = {
  label?: string;
  onClick?: () => void;
  /** 미세 높이 보정이 필요하면 -2 ~ 2px 정도로 조정 */
  nudgeY?: number;
};

export default function BtnDelete({
  label = '삭제하기',
  onClick,
  nudgeY = 0,
}: BtnDeleteProps) {
  return (
    <button
      onClick={onClick}
      className="
        inline-flex w-[80px] h-[48px] items-center justify-center
        p-0 m-0 flex-shrink-0 group
        font-suit bg-transparent
      "
      style={{ lineHeight: 1 }} // 버튼 자체 라인하이트 영향 제거
    >
      <span
        className="
          block w-[54px] h-[21px]
          text-[14px] font-medium tracking-[-0.4px]
          text-[var(--Gray-300,#AEAEAE)]
          transition-colors
          group-hover:text-[var(--Gray-100,#F2F2F2)]
          text-center
        "
        style={{
          lineHeight: '21px',        // 텍스트 박스 높이와 동일 → 정확한 중앙
          transform: `translateY(${nudgeY}px)`, // 시각적 미세보정 옵션
        }}
      >
        {label}
      </span>
    </button>
  );
}
