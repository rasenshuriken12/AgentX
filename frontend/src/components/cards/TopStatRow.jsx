import { AlertTriangle, FileText, Activity, Gauge } from "lucide-react";
import { agentInfo } from "../../data/mockData";

export default function TopStatRow({ stats, tick }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Health Score */}
      <Card
        icon={<Gauge className="w-4 h-4 text-agentx-teal" />}
        label="Health Score"
      >
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-extrabold">{stats.healthScore}</span>
          <span className="text-xs text-agentx-muted">/ 100</span>
        </div>
        <p className="text-xs mt-1 text-agentx-green font-semibold">All systems nominal</p>
      </Card>

      {/* Anomalies */}
      <Card
        icon={<AlertTriangle className="w-4 h-4 text-agentx-yellow" />}
        label="Anomalies (24h)"
      >
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-extrabold">{stats.anomalies24h}</span>
          <span className="text-xs font-medium text-agentx-red">
            {stats.criticalCount} critical
          </span>
        </div>
        <p className="text-xs mt-1 text-agentx-muted">On-device detections</p>
      </Card>

      {/* Agent Uptime */}
      <Card
        icon={<Activity className="w-4 h-4 text-agentx-blue" />}
        label="Agent Uptime"
      >
        <div className="text-2xl font-extrabold tracking-tight">
          {formatUptime(agentInfo.uptimeSeconds + tick * 2)}
        </div>
        <p className="text-xs mt-1 text-agentx-muted">Since last restart</p>
      </Card>

      {/* AI Reports */}
      <Card
        icon={<FileText className="w-4 h-4 text-agentx-purple" />}
        label="AI Reports"
      >
        <div className="text-3xl font-extrabold">{stats.aiReports}</div>
        <p className="text-xs mt-1 text-agentx-muted">
          Conf {stats.aiConfidence}% · cloud LLM
        </p>
      </Card>
    </div>
  );
}

function Card({ icon, label, children }) {
  return (
    <div className="bg-agentx-card border border-agentx-border rounded-xl p-5 flex flex-col justify-between min-h-[120px]">
      <div className="flex items-start justify-between">
        <span className="text-xs font-semibold uppercase tracking-wide text-agentx-muted">
          {label}
        </span>
        {icon}
      </div>
      <div className="mt-2">{children}</div>
    </div>
  );
}

function formatUptime(totalSeconds) {
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = totalSeconds % 60;
  return `${String(h).padStart(2, "0")}h ${String(m).padStart(2, "0")}m ${String(s).padStart(2, "0")}s`;
}
