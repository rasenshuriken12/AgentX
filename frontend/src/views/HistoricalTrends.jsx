import { useState } from "react";
import { Mail } from "lucide-react";
import HistoricalChart from "../components/cards/HistoricalChart";
import AnomalyDonut from "../components/cards/AnomalyDonut";
import AnomalyHeatmap from "../components/history/AnomalyHeatmap";
import TimeRangeSelector from "../components/history/TimeRangeSelector";
import CompareSelector from "../components/history/CompareSelector";
import ExportMenu from "../components/history/ExportMenu";
import DigestModal from "../components/history/DigestModal";

export default function HistoricalTrends() {
  const [metric, setMetric]   = useState("cpu_usage");
  const [range, setRange]     = useState("1h");
  const [compare, setCompare] = useState("off");
  const [digestOpen, setDigestOpen] = useState(false);

  return (
    <div className="space-y-5">
      {/* Top toolbar */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <TimeRangeSelector value={range} onChange={setRange} />
        <div className="flex items-center gap-2 flex-wrap">
          <CompareSelector value={compare} onChange={setCompare} disabled={range === "custom"} />
          <ExportMenu metric={metric} range={range} compare={compare} />
          <button
            onClick={() => setDigestOpen(true)}
            className="flex items-center gap-2 border border-agentx-border bg-agentx-card rounded-lg px-3 py-2 text-xs font-medium hover:border-agentx-teal/40 transition"
          >
            <Mail className="w-3.5 h-3.5 text-agentx-muted" />
            Digest
          </button>
        </div>
      </div>

      {/* Chart + side panel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2">
          <HistoricalChart
            metric={metric}
            range={range}
            compare={compare}
            onMetricChange={setMetric}
          />
        </div>
        <AnomalyDonut />
      </div>

      {/* Anomaly heatmap */}
      <AnomalyHeatmap />

      {/* Weekly digest modal */}
      <DigestModal open={digestOpen} onClose={() => setDigestOpen(false)} />
    </div>
  );
}
