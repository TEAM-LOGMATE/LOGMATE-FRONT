import { useState, useEffect, useRef } from "react";

interface BtnDropdownProps {
  options?: string[];
  selected?: string | null;
  onSelect?: (value: string | null) => void;
}

export default function BtnDropdown({
  options = [],
  selected,
  onSelect,
}: BtnDropdownProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const toggleMenu = () => {
    if (options.length > 0) {
      setOpen((prev) => !prev);
    }
  };

  const handleSelect = (opt: string) => {
    if (selected === opt) {
      onSelect?.(null);
    } else {
      onSelect?.(opt);
    }
    setOpen(false);
  };

  // 메뉴 외부 클릭 시 닫기
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    if (open) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  return (
    <div className="relative" ref={ref}>
      <button
        className="
          w-[24px] h-[24px]
          flex items-center justify-center
          p-0 bg-transparent border-none
        "
        onClick={toggleMenu}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          className="w-6 h-6"
          fill="none"
        >
          <path
            d="M11.7474 16.1399L6.95119 10.6585C6.38543 10.0119 6.84461 9 7.70377 9H17.2962C18.1554 9 18.6146 10.0119 18.0488 10.6585L13.2526 16.1399C12.8542 16.5952 12.1458 16.5952 11.7474 16.1399Z"
            fill="#AEAEAE"
          />
        </svg>
      </button>

      {/* 드롭다운 메뉴 */}
      {open && options.length > 0 && (
        <div className="absolute right-0 mt-1 w-32 bg-[#232323] border border-[#333] rounded shadow z-10">
          {options.map((opt) => (
            <div
              key={opt}
              onClick={() => handleSelect(opt)}
              className={`px-2 py-1 text-[14px] text-[#D8D8D8] hover:bg-[#1F1F1F] cursor-pointer ${
                selected === opt ? "bg-[#2A2A2A]" : ""
              }`}
            >
              {opt}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
