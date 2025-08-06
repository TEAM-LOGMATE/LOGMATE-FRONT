import React from 'react';

interface BtnSmallArrowProps {
  direction?: 'up' | 'down' | 'right' | 'left';
  selected? : boolean;
}

export default function BtnSmallArrow({ direction = 'up' }: BtnSmallArrowProps) {
  let rotationClass = '';

  switch (direction) {
    case 'up':
      rotationClass = 'rotate-[360deg]';
      break;
    case 'down':
      rotationClass = 'rotate-180';
      break;
    case 'right':
      rotationClass = 'rotate-90';
      break;
    case 'left':
      rotationClass = 'rotate-[-90deg]';
      break;
    default:
      rotationClass = '';
  }

  return (
    <button
      className={`
        flex items-center justify-center
        w-[32px] h-[32px] aspect-square flex-shrink-0
        bg-transparent rounded-[4px] transition
        group
        ${rotationClass}
      `}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="14"
        height="9"
        viewBox="0 0 14 9"
        fill="none"
        className="w-[8.231px] h-[13.5px] flex-shrink-0"
      >
        <path
          d="M0.511772 8.56934C0.216966 8.31651 0.166638 7.88438 0.383842 7.57227L0.430717 7.51172L6.05083 0.955083C6.5497 0.373069 7.4504 0.373069 7.94927 0.955083L13.5694 7.51172C13.8389 7.82616 13.8027 8.29975 13.4883 8.56934C13.1739 8.83886 12.7003 8.80263 12.4307 8.48829L7.00005 2.15235L1.56939 8.48829L1.51665 8.54395C1.24137 8.80603 0.806585 8.82204 0.511772 8.56934Z"
          className="fill-current group-hover:fill-[#F2F2F2] transition-colors"
        />
      </svg>
    </button>
  );
}
