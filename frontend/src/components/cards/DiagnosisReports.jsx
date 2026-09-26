import { useState } from "react";
import { FileText, RefreshCw, ArrowLeft, ChevronDown } from "lucide-react";

const SEV_STYLES = {
  CRITICAL: "bg-agentx-redSoft text-agentx-red",
  WARNING:  "bg-agentx-yellowSoft text-agentx-yellow",
  INFO:     "bg-blue-50 text-agentx-blue",
};

export default function DiagnosisReports({ reports, onRefresh }) {
  const [openId, setOpenId] = useState(null);
  const open = reports.find((r) => r.id === openId);

  return (
    <div className="bg-agentx-card border border-agentx-border rounded-xl flex flex-col">
      <div className="p-5 border-b border-agentx-border flex items-start justify-between flex-shrink-0">
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
        >
          <RefreshCw className="w-4 h-4 text-agentx-muted" />
        </button>
      </div>

      {open ? (
        <div className="p-4 overflow-y-auto" style={{ maxHeight: "500px" }}>
          <ReportDetail report={open} onBack={() => setOpenId(null)} />
        </div>
      ) : (
        <>
          <div className="p-4 space-y-3 overflow-y-auto" style={{ maxHeight: "330px" }}>
            {reports.map((r) => (
              <ReportListItem key={r.id} report={r} onClick={() => setOpenId(r.id)} />
            ))}
          </div>
          {reports.length > 3 && (
            <div className="px-4 py-2 border-t border-agentx-border text-center flex-shrink-0">
              <span className="inline-flex items-center gap-1 text-[10px] text-agentx-muted">
                <ChevronDown className="w-3 h-3" />
                Scroll to see {reports.length - 3} more
              </span>
            </div>
          )}
        </>
      )}
    </div>
  );
}

/* -------------------- List item -------------------- */
function ReportListItem({ report, onClick }) {
  const sev = SEV_STYLES[report.severity] || SEV_STYLES.INFO;
  return (
    <button
      onClick={onClick}
      className="w-full text-left bg-agentx-purpleSoft/40 border border-agentx-purple/20 rounded-lg p-4 hover:border-agentx-purple/50 transition"
    >
      <div className="flex items-center gap-2 mb-2 flex-wrap">
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
    </button>
  );
}

/* -------------------- Detail view -------------------- */
function ReportDetail({ report, onBack }) {
  const sev = SEV_STYLES[report.severity] || SEV_STYLES.INFO;
  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-xs font-medium text-agentx-muted hover:text-agentx-text transition"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to reports
        </button>
        <span className="text-[10px] text-agentx-muted">ID #{report.id}</span>
      </div>

      <div className="flex items-center gap-2 flex-wrap mb-3">
        <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${sev}`}>
          {report.severity}
        </span>
        <span className="text-[10px] text-agentx-muted">conf {report.confidence}%</span>
        <span className="text-[10px] text-agentx-muted">· {report.time}</span>
      </div>

      <h3 className="text-base font-bold leading-snug mb-1">{report.title}</h3>
      <p className="text-[10px] text-agentx-muted mb-4">
        metrics: {report.metrics.join(", ")}
      </p>

      <Section title="Summary">
        <p className="text-sm leading-relaxed">{report.summary}</p>
      </Section>

      <Section title="Evidence">
        <ul className="space-y-1.5 list-disc list-inside text-sm">
          {report.evidence.map((e, i) => <li key={i}>{e}</li>)}
        </ul>
      </Section>

      <Section title="Root Cause Hypothesis">
        <p className="text-sm leading-relaxed">{report.rootCause}</p>
      </Section>

      <Section title="Recommendations">
        <ol className="space-y-1.5 list-decimal list-inside text-sm">
          {report.recommendations.map((r, i) => <li key={i}>{r}</li>)}
        </ol>
      </Section>

      {report.riskNotes && (
        <Section title="Risk Notes">
          <p className="text-sm leading-relaxed">{report.riskNotes}</p>
        </Section>
      )}

      {report.actions && report.actions.length > 0 && (
        <div className="mt-5 p-4 rounded-xl bg-agentx-greenSoft/40 border border-agentx-green/30">
          <p className="text-[10px] font-bold uppercase tracking-wider text-agentx-green mb-2">
            Recommended actions
          </p>
          <ol className="space-y-1.5 list-decimal list-inside text-sm">
            {report.actions.map((a, i) => <li key={i} className="font-mono text-xs">{a}</li>)}
          </ol>
        </div>
      )}
    </div>
  );
}

function Section({ title, children }) {
  return (
    <section className="mt-5">
      <h4 className="text-sm font-bold mb-2">{title}</h4>
      <div className="text-agentx-text">{children}</div>
    </section>
  );
}
