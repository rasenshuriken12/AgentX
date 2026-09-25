import { RefreshCw } from "lucide-react";
import DonutChart from "../charts/DonutChart";
import { anomalyDistribution } from "../../data/mockData";

export default function AnomalyDonut() {
  return (
    <div className="bg-agentx-card border border-agentx-border rounded-xl p-5">
      <div className="flex items-start justify-between mb-2">
        <div>
          <h2 className="font-bold">Anomaly Distribution (24h)</h2>
          <p className="text-xs text-agentx-muted mt-1">Breakdown by metric and by detector</p>
        </div>
        <button className="p-2 rounded-md border border-agentx-border hover:bg-agentx-bg transition">
          <RefreshCw className="w-3.5 h-3.5 text-agentx-muted" />
        </button>
      </div>

      <DonutChart data={anomalyDistribution} />

      <div className="grid grid-cols-2 gap-2 mt-4">
        {anomalyDistribution.map((d) => (
          <div key={d.name} className="flex items-center gap-2 text-xs">
            <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: d.color }} />
            <span className="text-agentx-muted truncate">{d.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}