import React from 'react';

interface BtnBigArrowProps {
  direction?: 'up' | 'down' | 'right' | 'left';
  variant?: 'default' | 'variant2';
}

export default function BtnBigArrow({ direction = 'left', variant = 'default' }: BtnBigArrowProps) {
  const isVariant2 = variant === 'variant2';

  let rotationClass = '';
  switch (direction) {
    case 'up':
      rotationClass = 'rotate-[-90deg]';
      break;
    case 'down':
      rotationClass = 'rotate-90';
      break;
    case 'right':
      rotationClass = 'rotate-180';
      break;
    case 'left':
    default:
      rotationClass = 'rotate-0';
      break;
  }

  return (
    <button
      className={`
        flex w-[32px] h-[32px] flex-shrink-0 items-center justify-center
        ${isVariant2 ? 'bg-[#353535] rounded-[4px]' : 'bg-transparent'}
        transition-transform ${rotationClass}
      `}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="12"
        height="18"
        viewBox="0 0 12 18"
        fill="none"
        className="w-[11.7px] h-[18.001px] flex-shrink-0"
      >
        <path
          fill={isVariant2 ? "#AEAEAE" : "#888888"}
          d="M11.7814 17.6247C11.4579 18.0291 10.8839 18.1157 10.4581 17.8405L10.3751 17.7809L0.863381 10.1706C0.113091 9.57012 0.113088 8.42928 0.86338 7.8288L10.3751 0.218449C10.8064 -0.12656 11.4363 -0.0565624 11.7813 0.374699C12.1264 0.80596 12.0564 1.43594 11.6251 1.78095L2.60166 8.9997L11.6251 16.2184L11.7013 16.2868C12.0631 16.6418 12.1048 17.2204 11.7814 17.6247Z"
        />
      </svg>
    </button>
  );
}
