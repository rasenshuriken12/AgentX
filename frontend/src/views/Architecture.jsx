export default function Architecture() {
  return (
    <div className="bg-agentx-card border border-agentx-border rounded-xl p-8">
      <h2 className="text-xl font-bold mb-2">AgentX Architecture</h2>
      <p className="text-sm text-agentx-muted mb-6">
        Hybrid edge detection with cloud LLM root-cause analysis.
      </p>
      <pre className="text-xs bg-agentx-bg rounded-lg p-4 overflow-auto">
{`
┌──────────────────────────────┐
│  Edge Agent (this machine)   │
│  ├─ Collector (psutil)       │
│  ├─ EWMA + IQR detectors     │
│  └─ Local SQLite buffer      │
└──────────────┬───────────────┘
               │ (HTTPS, batched)
               ▼
┌──────────────────────────────┐
│  Cloud Backend (FastAPI)     │
│  ├─ InfluxDB (metrics)       │
│  ├─ ChromaDB (RAG context)   │
│  └─ Ollama/Gemma (LLM)       │
└──────────────┬───────────────┘
               │
               ▼
┌──────────────────────────────┐
│  React Dashboard (you)       │
│  ├─ Live Monitoring          │
│  ├─ Anomaly Analysis         │
│  └─ Historical Trends        │
└──────────────────────────────┘
`}
      </pre>
    </div>
  );
}