type BtnMoreProps = {
  onClick?: () => void;
};

export default function BtnMore({ onClick }: BtnMoreProps) {
  return (
    <button
      onClick={onClick}
      className="
        group
        flex w-[31px] h-[24px] p-[14px_8px] justify-center items-center gap-[3px] flex-shrink-0
        rounded-[4px] bg-transparent hover:bg-[#222]
      "
    >
      {[...Array(3)].map((_, idx) => (
        <svg
          key={idx}
          xmlns="http://www.w3.org/2000/svg"
          width="3"
          height="4"
          viewBox="0 0 3 4"
          className="text-[#535353] group-hover:text-[#D8D8D8]"
          style={{
            width: '3px',
            height: '3px',
            aspectRatio: '1 / 1',
          }}
        >
          <circle cx="1.5" cy="2" r="1.5" fill="currentColor" />
        </svg>
      ))}
    </button>
  );
}
