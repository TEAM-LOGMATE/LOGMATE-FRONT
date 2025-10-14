interface ToggleProps {
  activeTab: "app" | "web";
  setActiveTab: (tab: "app" | "web") => void;
  disabledTabs?: ("app" | "web")[];
}

export default function Toggle({ activeTab, setActiveTab, disabledTabs = [] }: ToggleProps) {
  return (
    <div className="flex bg-[#2A2A2A] rounded-[28px] p-[1px] ml-0 mt-0.7 scale-[0.8]">
      <button
        onClick={() => !disabledTabs.includes("app") && setActiveTab("app")}
        disabled={disabledTabs.includes("app")}
        className={`px-4 py-1.5 rounded-[28px] text-[14px] font-medium transition-colors
          ${activeTab === "app" ? "bg-[#0F0F0F] text-[#D8D8D8]" : "bg-transparent text-[#888888]"}
          ${disabledTabs.includes("app") ? "opacity-40 cursor-not-allowed" : ""}
        `}
      >
        App
      </button>
      <button
        onClick={() => !disabledTabs.includes("web") && setActiveTab("web")}
        disabled={disabledTabs.includes("web")}
        className={`px-4 py-1.5 rounded-[28px] text-[14px] font-medium transition-colors
          ${activeTab === "web" ? "bg-[#0F0F0F] text-[#D8D8D8]" : "bg-transparent text-[#888888]"}
          ${disabledTabs.includes("web") ? "opacity-40 cursor-not-allowed" : ""}
        `}
      >
        Web
      </button>
    </div>
  );
}
