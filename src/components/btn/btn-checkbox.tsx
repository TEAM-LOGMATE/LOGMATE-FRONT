interface BtnCheckboxProps {
  checked: boolean;
  onToggle: () => void;
}

export default function BtnCheckbox({ checked, onToggle }: BtnCheckboxProps) {
  return (
    <div
      onClick={onToggle}
      className="w-4 h-4 cursor-pointer flex items-center justify-center"
    >
      {checked ? (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
        >
          <rect width="16" height="16" rx="4" fill="#D4B66F" />
          <path
            d="M11.2185 4.40586C11.5635 3.93959 12.1934 3.86391 12.6246 4.23693C13.0559 4.60994 13.1259 5.29105 12.7809 5.75732L8.76166 11.1885C7.9611 12.2705 6.43946 12.2705 5.63886 11.1885L3.21912 7.91966C2.87414 7.4534 2.94413 6.77228 3.37536 6.39927C3.80659 6.02625 4.43652 6.10193 4.7815 6.5682L7.20026 9.83811L11.2185 4.40586Z"
            fill="#171717"
          />
        </svg>
      ) : (
        <div
          className="w-4 h-4"
          style={{
            borderRadius: "4px",
            border: "1px solid var(--Gray-500, #535353)",
          }}
        />
      )}
    </div>
  );
}
