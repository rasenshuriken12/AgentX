import { Activity, LineChart, History, Network } from "lucide-react";

const TABS = [
  { id: "live",         label: "Live Monitoring",  icon: Activity },
  { id: "anomaly",      label: "Anomaly Analysis", icon: LineChart },
  { id: "historical",   label: "Historical",       icon: History },
  { id: "architecture", label: "Architecture",     icon: Network },
];

export default function TabNav({ active, onChange }) {
  return (
    <div className="flex gap-2 bg-agentx-card border border-agentx-border rounded-full p-1 w-fit">
      {TABS.map(({ id, label, icon: Icon }) => {
        const isActive = active === id;
        return (
          <button
            key={id}
            onClick={() => onChange(id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              isActive
                ? "bg-white shadow-sm border border-agentx-border text-agentx-text"
                : "text-agentx-muted hover:text-agentx-text"
            }`}
          >
            <Icon className="w-4 h-4" />
            {label}
          </button>
        );
      })}
    </div>
  );
}
