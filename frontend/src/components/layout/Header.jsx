import { Shield, Radio, User, Activity, LayoutGrid, LineChart, History } from "lucide-react";

const TABS = [
  { id: "live",         label: "Live Monitoring",  icon: Activity },
  { id: "overview",     label: "System Overview",  icon: LayoutGrid },
  { id: "anomaly",      label: "Anomaly Analysis", icon: LineChart },
  { id: "historical",   label: "Historical",       icon: History },
];

export default function Header({ activeTab, onTabChange, onProfileClick }) {
  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-white/70 border-b border-agentx-border">
      <div className="px-6 py-3 flex items-center justify-between gap-6 max-w-[1600px] mx-auto">
        {/* Left: Logo + Title */}
        <div className="flex items-center gap-3 flex-shrink-0">
          <div className="w-10 h-10 rounded-lg bg-agentx-teal flex items-center justify-center">
            <Shield className="w-6 h-6 text-white" strokeWidth={2.5} />
          </div>
          <div className="hidden sm:block">
            <h1 className="text-lg font-bold leading-none">AgentX</h1>
            <p className="text-[10px] text-agentx-muted mt-0.5">
              AI-Powered PC Monitoring
            </p>
          </div>
        </div>

        {/* Center: Tabs */}
        <nav className="hidden md:flex items-center gap-1 bg-agentx-bg/60 border border-agentx-border rounded-full p-1">
          {TABS.map(({ id, label, icon: Icon }) => {
            const isActive = activeTab === id;
            return (
              <button
                key={id}
                onClick={() => onTabChange(id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-white shadow-sm border border-agentx-border text-agentx-text"
                    : "text-agentx-muted hover:text-agentx-text"
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="hidden lg:inline">{label}</span>
              </button>
            );
          })}
        </nav>

        {/* Right: Edge Live + Profile */}
        <div className="flex items-center gap-3 flex-shrink-0">
          <span className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold border bg-agentx-tealSoft text-agentx-teal border-agentx-teal/20">
            <Radio className="w-4 h-4" />
            EDGE LIVE
          </span>

          <button
            onClick={onProfileClick}
            aria-label="Open profile"
            className="w-10 h-10 rounded-full bg-agentx-bg border border-agentx-border flex items-center justify-center hover:bg-white hover:border-agentx-teal/40 transition"
          >
            <User className="w-5 h-5 text-agentx-muted" />
          </button>
        </div>
      </div>

      {/* Mobile tab bar (shown only on small screens) */}
      <nav className="md:hidden flex overflow-x-auto gap-1 px-4 py-2 border-t border-agentx-border">
        {TABS.map(({ id, label, icon: Icon }) => {
          const isActive = activeTab === id;
          return (
            <button
              key={id}
              onClick={() => onTabChange(id)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap ${
                isActive
                  ? "bg-white shadow-sm border border-agentx-border"
                  : "text-agentx-muted"
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              {label}
            </button>
          );
        })}
      </nav>
    </header>
  );
}
