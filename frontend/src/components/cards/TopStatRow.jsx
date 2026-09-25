import { Wifi, Server, Cpu, AlertTriangle, FileText } from "lucide-react";
import StatCard from "./StatCard";
import { agentInfo } from "../../data/mockData";

export default function TopStatRow({ stats, tick }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
      {/* Edge Agent */}
      <StatCard
        label="Edge Agent"
        icon={<Wifi className="w-4 h-4 text-agentx-teal" />}
        value={
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-agentx-tealSoft text-agentx-teal text-sm font-bold border border-agentx-teal/20">
            {agentInfo.status}
          </span>
        }
        footer={`${tick * 2 + 362} ticks`}
      />

      {/* Hostname */}
      <StatCard
        label="Hostname"
        icon={<Server className="w-4 h-4 text-agentx-muted" />}
        value={<span className="text-lg font-bold">{agentInfo.hostname}</span>}
        footer={agentInfo.os}
      />

      {/* CPU */}
      <StatCard
        label="CPU"
        icon={<Cpu className="w-4 h-4 text-agentx-muted" />}
        value={<span className="text-sm font-semibold leading-snug">{agentInfo.cpu}</span>}
        footer={agentInfo.ram}
      />

      {/* Anomalies */}
      <StatCard
        label="Anomalies (24h)"
        icon={<AlertTriangle className="w-4 h-4 text-agentx-yellow" />}
        value={
          <span className="text-2xl font-bold">
            {stats.anomalies24h}{" "}
            <span className="text-sm font-medium text-agentx-red">
              {stats.criticalCount} critical
            </span>
          </span>
        }
      />

      {/* AI Reports */}
      <StatCard
        label="AI Reports"
        icon={<FileText className="w-4 h-4 text-agentx-purple" />}
        value={<span className="text-2xl font-bold">{stats.aiReports}</span>}
        footer={`conf ${stats.aiConfidence}%`}
      />

      {/* Uptime */}
      <StatCard
        label="Agent Uptime"
        icon={<span className="text-xs">⏱</span>}
        value={
          <span className="text-2xl font-bold">
            {formatUptime(agentInfo.uptimeSeconds + tick * 2)}
          </span>
        }
      />
    </div>
  );
}

function formatUptime(totalSeconds) {
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = totalSeconds % 60;
  return `${String(h).padStart(2, "0")}h ${String(m).padStart(2, "0")}m ${String(s).padStart(2, "0")}s`;
}