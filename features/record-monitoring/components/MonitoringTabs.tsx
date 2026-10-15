"use client";

interface TabItem {
  readonly id: string;
  readonly label: string;
  readonly icon: string;
  readonly badgeCount?: number;
}

interface MonitoringTabsProps {
  readonly activeTab: string;
  readonly onTabChange: (id: string) => void;
  readonly tabs: readonly TabItem[];
}

export function MonitoringTabs({ activeTab, onTabChange, tabs }: MonitoringTabsProps) {
  return (
    <div className="w-full border-b border-[#E2E8F0] font-[family-name:var(--font-poppins)] overflow-x-auto scrollbar-none flex">
      <div className="flex gap-2 min-w-max pb-1">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={[
                "flex items-center gap-2 px-5 py-3 border-b-2 font-bold text-sm transition-all cursor-pointer outline-none whitespace-nowrap",
                isActive
                  ? "border-[#3B67FC] text-[#3B67FC]"
                  : "border-transparent text-[#718096] hover:text-[#3B67FC] hover:border-[#3B67FC]/35",
              ].join(" ")}
            >
              <span className="material-symbols-outlined text-lg select-none">
                {tab.icon}
              </span>
              <span>{tab.label}</span>
              {tab.badgeCount !== undefined && tab.badgeCount > 0 && (
                <span
                  className={[
                    "ml-1.5 px-2 py-0.5 rounded-full text-[10px] font-extrabold",
                    isActive ? "bg-[#3B67FC] text-white" : "bg-slate-100 text-[#718096]",
                  ].join(" ")}
                >
                  {tab.badgeCount}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
