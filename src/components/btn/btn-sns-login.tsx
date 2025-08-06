import React from 'react';

type SnsLoginButtonProps = {
  type: 'github' | 'google';
  children: React.ReactNode;
  onClick?: () => void;
};

export default function BtnSnsLogin({ type, children, onClick }: SnsLoginButtonProps) {
  const renderIcon = () => {
    if (type === 'github') {
      return (
        <svg
          className="inline-block align-middle"
          xmlns="http://www.w3.org/2000/svg"
          width="25"
          height="24"
          viewBox="0 0 25 24"
          fill="none"
        >
          <path
            d="M12.5 2.75781C11.3181 2.75781 10.1478 2.99638 9.05585 3.45991C7.96392 3.92343 6.97177 4.60282 6.13604 5.4593C4.44821 7.18903 3.5 9.53505 3.5 11.9813C3.5 16.058 6.083 19.5168 9.656 20.7435C10.106 20.8173 10.25 20.5314 10.25 20.2824V18.7236C7.757 19.277 7.226 17.4876 7.226 17.4876C6.812 16.4177 6.227 16.1318 6.227 16.1318C5.408 15.56 6.29 15.5784 6.29 15.5784C7.19 15.643 7.667 16.5284 7.667 16.5284C8.45 17.9304 9.773 17.5153 10.286 17.294C10.367 16.6944 10.601 16.2886 10.853 16.058C8.855 15.8274 6.758 15.0342 6.758 11.5201C6.758 10.4963 7.1 9.67539 7.685 9.02053C7.595 8.78994 7.28 7.83071 7.775 6.58554C7.775 6.58554 8.531 6.33651 10.25 7.52633C10.961 7.32342 11.735 7.22196 12.5 7.22196C13.265 7.22196 14.039 7.32342 14.75 7.52633C16.469 6.33651 17.225 6.58554 17.225 6.58554C17.72 7.83071 17.405 8.78994 17.315 9.02053C17.9 9.67539 18.242 10.4963 18.242 11.5201C18.242 15.0434 16.136 15.8182 14.129 16.0488C14.453 16.3347 14.75 16.8974 14.75 17.7551V20.2824C14.75 20.5314 14.894 20.8265 15.353 20.7435C18.926 19.5076 21.5 16.058 21.5 11.9813C21.5 10.77 21.2672 9.57064 20.8149 8.4516C20.3626 7.33256 19.6997 6.31577 18.864 5.4593C18.0282 4.60282 17.0361 3.92343 15.9442 3.45991C14.8522 2.99638 13.6819 2.75781 12.5 2.75781Z"
            fill="#AEAEAE"
          />
        </svg>
      );
    }

    if (type === 'google') {
      return (
        <svg
          className="inline-block align-middle"
          xmlns="http://www.w3.org/2000/svg"
          width="25"
          height="24"
          viewBox="0 0 25 24"
          fill="none"
        >
          <path
            d="M12 2C6.48 2 2 6.48 ..." //path넣기 
            fill="#AEAEAE"
          />
        </svg>
      );
    }

    return null;
  };

  return (
    <button
      onClick={onClick}
      className="
        flex items-center justify-center
        w-[254px] h-[54px]
        px-[24px] py-[12px]
        gap-[6px]
        rounded-[12px]
        border border-[#222]
        bg-[#111]
        text-[#AEAEAE]

        hover:bg-[#1c1c1c]                
        hover:border-[#AEAEAE]            
        hover:text-[#F2F2F2]                 
        transition-colors duration-200   

        font-suit text-base font-medium leading-6 tracking-[-0.4px]
        text-center
      "
    >
      <span className="inline-block align-middle">{renderIcon()}</span>
      <span className="inline-block align-middle">{children}</span>
    </button>
  );
}
