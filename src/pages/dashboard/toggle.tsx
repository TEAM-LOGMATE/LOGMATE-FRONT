// src/components/toggle.tsx
interface ToggleProps {
  activeTab: "app" | "web";
  setActiveTab: (tab: "app" | "web") => void;
}

export default function Toggle({ activeTab, setActiveTab }: ToggleProps) {
  return (
    <div className="flex bg-[#2A2A2A] rounded-[28px] p-[1px] ml-0 mt-0.7 scale-[0.8]">
      <button
        onClick={() => setActiveTab("app")}
        className={`px-4 py-1.5 rounded-[28px] text-[14px] font-medium transition-colors
          ${activeTab === "app"
            ? "bg-[#0F0F0F] text-[#D8D8D8]"
            : "bg-transparent text-[#888888]"
          }`}
      >
        App
      </button>
      <button
        onClick={() => setActiveTab("web")}
        className={`px-4 py-1.5 rounded-[28px] text-[14px] font-medium transition-colors
          ${activeTab === "web"
            ? "bg-[#0F0F0F] text-[#D8D8D8]"
            : "bg-transparent text-[#888888]"
          }`}
      >
        Web
      </button>
    </div>
  );
}
