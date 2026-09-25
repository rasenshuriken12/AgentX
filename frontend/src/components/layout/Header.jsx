import { Shield, Radio, Cloud } from "lucide-react";

export default function Header() {
  return (
    <header className="bg-agentx-card border-b border-agentx-border">
      <div className="px-6 py-4 flex items-center justify-between">
        {/* Left: Logo + Title */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-agentx-teal flex items-center justify-center">
            <Shield className="w-6 h-6 text-white" strokeWidth={2.5} />
          </div>
          <div>
            <h1 className="text-xl font-bold leading-none">AgentX</h1>
            <p className="text-xs text-agentx-muted mt-1">
              AI-Powered PC Monitoring & Diagnostics
            </p>
          </div>
        </div>

        {/* Right: Status pills */}
        <div className="flex items-center gap-3">
          <StatusPill
            icon={<Radio className="w-4 h-4" />}
            label="EDGE LIVE"
            color="teal"
          />
          <StatusPill
            icon={<Cloud className="w-4 h-4" />}
            label="CLOUD READY"
            color="purple"
          />
        </div>
      </div>
    </header>
  );
}

function StatusPill({ icon, label, color }) {
  const styles =
    color === "teal"
      ? "bg-agentx-tealSoft text-agentx-teal border-agentx-teal/20"
      : "bg-agentx-purpleSoft text-agentx-purple border-agentx-purple/20";
  return (
    <span
      className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold border ${styles}`}
    >
      {icon}
      {label}
    </span>
  );
}