import { AlertTriangle, Zap, ChevronDown } from "lucide-react";

const SEVERITY = {
  CRITICAL: { bg: "bg-agentx-redSoft",    text: "text-agentx-red",    label: "CRITICAL" },
  WARNING:  { bg: "bg-agentx-yellowSoft", text: "text-agentx-yellow", label: "WARNING" },
  INFO:     { bg: "bg-blue-50",           text: "text-agentx-blue",   label: "INFO" },
};

export default function AnomalyFeed({ anomalies, count = 43 }) {
  return (
    <div className="bg-agentx-card border border-agentx-border rounded-xl flex flex-col h-[520px]">
      {/* Header — fixed at top */}
      <div className="p-5 border-b border-agentx-border flex items-start justify-between flex-shrink-0">
        <div>
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-agentx-yellow" />
            <h2 className="font-bold">Anomaly Feed</h2>
          </div>
          <p className="text-xs text-agentx-muted mt-1">
            On-device statistical detections (Z-score · EWMA · IQR)
          </p>
        </div>
        <span className="bg-agentx-bg border border-agentx-border rounded-md px-2 py-1 text-xs font-bold">
          {count}
        </span>
      </div>

      {/* Scrollable list — takes remaining height */}
      <div className="p-4 space-y-3 overflow-y-auto flex-1">
        {anomalies.map((a) => (
          <AnomalyItem key={a.id} anomaly={a} />
        ))}
      </div>

      {/* Footer — fixed at bottom */}
      {anomalies.length > 3 && (
        <div className="px-4 py-2 border-t border-agentx-border text-center flex-shrink-0">
          <span className="inline-flex items-center gap-1 text-[10px] text-agentx-muted">
            <ChevronDown className="w-3 h-3" />
            Scroll to see {anomalies.length - 3} more
          </span>
        </div>
      )}
    </div>
  );
}

function AnomalyItem({ anomaly }) {
  const sev = SEVERITY[anomaly.severity] || SEVERITY.INFO;
  return (
    <div className="bg-agentx-yellowSoft/40 border border-agentx-yellow/20 rounded-lg p-4">
      <div className="flex items-center justify-between mb-2 flex-wrap gap-2">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-sm font-bold">{anomaly.metric}</span>
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${sev.bg} ${sev.text}`}>
            {sev.label}
          </span>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-700">
            {anomaly.detector}
          </span>
        </div>
        <button className="flex items-center gap-1.5 text-xs font-semibold border border-agentx-border rounded-md px-2.5 py-1 hover:bg-white transition">
          <Zap className="w-3 h-3" />
          Diagnose
        </button>
      </div>
      <p className="text-xs text-agentx-muted leading-relaxed">{anomaly.description}</p>
      <p className="text-[10px] text-agentx-muted mt-2">
        {anomaly.time} · score {anomaly.score}
      </p>
    </div>
  );
}
