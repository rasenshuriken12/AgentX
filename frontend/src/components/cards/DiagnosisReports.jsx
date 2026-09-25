import { FileText, RefreshCw } from "lucide-react";

const SEV_STYLES = {
  CRITICAL: "bg-agentx-redSoft text-agentx-red",
  WARNING: "bg-agentx-yellowSoft text-agentx-yellow",
  INFO: "bg-blue-50 text-agentx-blue",
};

export default function DiagnosisReports({ reports, onRefresh }) {
  return (
    <div className="bg-agentx-card border border-agentx-border rounded-xl">
      <div className="p-5 border-b border-agentx-border flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-agentx-purple" />
            <h2 className="font-bold">AI Diagnosis Reports</h2>
          </div>
          <p className="text-xs text-agentx-muted mt-1">
            Cloud LLM root-cause analysis · auto-fired on critical anomalies
          </p>
        </div>
        <button
          onClick={onRefresh}
          className="p-2 rounded-md border border-agentx-border hover:bg-agentx-bg transition"
          aria-label="Refresh reports"
        >
          <RefreshCw className="w-4 h-4 text-agentx-muted" />
        </button>
      </div>

      <div className="p-4 space-y-3 max-h-[400px] overflow-y-auto">
        {reports.map((r) => (
          <ReportItem key={r.id} report={r} />
        ))}
      </div>
    </div>
  );
}

function ReportItem({ report }) {
  const sev = SEV_STYLES[report.severity] || SEV_STYLES.INFO;
  return (
    <div className="bg-agentx-purpleSoft/40 border border-agentx-purple/20 rounded-lg p-4">
      <div className="flex items-center gap-2 mb-2">
        <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${sev}`}>
          {report.severity}
        </span>
        <span className="text-[10px] text-agentx-muted">conf {report.confidence}%</span>
        <span className="text-[10px] text-agentx-muted">· {report.time}</span>
      </div>
      <p className="text-sm font-semibold leading-snug">{report.title}</p>
      <p className="text-[10px] text-agentx-muted mt-2">
        metrics: {report.metrics.join(", ")}
      </p>
    </div>
  );
}