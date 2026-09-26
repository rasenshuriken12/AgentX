import { useState, useRef, useEffect, useMemo } from "react";
import {
  LineChart, Line, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid,
  ReferenceLine, Area, AreaChart, Legend,
} from "recharts";
import { RefreshCw, ChevronDown, Check } from "lucide-react";
import { generateSeries } from "../../data/mockData";

export const METRIC_OPTIONS = [
  { id: "process_count", label: "Process Count",   unit: "procs", max: 500,  color: "#7c3aed" },
  { id: "cpu_usage",     label: "CPU Usage",       unit: "%",     max: 100,  color: "#0d9488" },
  { id: "memory_usage",  label: "Memory Usage",    unit: "%",     max: 100,  color: "#2563eb" },
  { id: "disk_io",       label: "Disk I/O",        unit: "MB/s",  max: 200,  color: "#16a34a" },
  { id: "network",       label: "Network Throughput", unit: "Mbps", max: 100, color: "#06b6d4" },
  { id: "cpu_temp",      label: "CPU Temperature", unit: "°C",    max: 100,  color: "#dc2626" },
  { id: "gpu_usage",     label: "GPU Usage",       unit: "%",     max: 100,  color: "#a855f7" },
];

const BASE_SERIES = {
  process_count: { base: 310, variance: 20, max: 500 },
  cpu_usage:     { base: 32,  variance: 15, max: 100 },
  memory_usage:  { base: 55,  variance: 10, max: 100 },
  disk_io:       { base: 40,  variance: 25, max: 200 },
  network:       { base: 12,  variance: 15, max: 100 },
  cpu_temp:      { base: 62,  variance: 6,  max: 100 },
  gpu_usage:     { base: 18,  variance: 12, max: 100 },
};

export default function HistoricalChart({ metric, onMetricChange, range = "1h" }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const selected = METRIC_OPTIONS.find((m) => m.id === metric) || METRIC_OPTIONS[0];

  // Regenerate data whenever metric or range changes
  const data = useMemo(() => {
    const cfg = BASE_SERIES[metric] || BASE_SERIES.cpu_usage;
    return generateSeries(120, cfg.base, cfg.variance, cfg.max);
  }, [metric, range]);

  // Compute baseline (average) and band
  const values = data.map((d) => d.v);
  const avg = values.reduce((a, b) => a + b, 0) / values.length;
  const stddev = Math.sqrt(values.reduce((s, v) => s + (v - avg) ** 2, 0) / values.length);
  const bandHigh = avg + stddev;
  const bandLow  = Math.max(0, avg - stddev);

  useEffect(() => {
    const onClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  return (
    <div className="bg-agentx-card border border-agentx-border rounded-xl p-5">
      <div className="flex items-start justify-between gap-3 mb-4 flex-wrap">
        <div>
          <h2 className="font-bold">Historical Metric Trend</h2>
          <p className="text-xs text-agentx-muted mt-1">
            {selected.label} · last 600 samples · avg {avg.toFixed(1)} {selected.unit}
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Dropdown */}
          <div className="relative" ref={ref}>
            <button
              onClick={() => setOpen((o) => !o)}
              className="flex items-center justify-between gap-3 border border-agentx-border bg-agentx-card rounded-lg px-3 py-2 text-sm font-medium hover:border-agentx-teal/40 transition min-w-[200px]"
            >
              <span>{selected.label}</span>
              <ChevronDown className={`w-4 h-4 text-agentx-muted transition-transform ${open ? "rotate-180" : ""}`} />
            </button>

            {open && (
              <div className="absolute right-0 mt-2 w-64 bg-agentx-card border border-agentx-border rounded-xl shadow-lg z-30 overflow-hidden">
                <ul className="py-1">
                  {METRIC_OPTIONS.map((opt) => {
                    const isSelected = opt.id === metric;
                    return (
                      <li key={opt.id}>
                        <button
                          onClick={() => { onMetricChange(opt.id); setOpen(false); }}
                          className={`w-full flex items-center justify-between px-4 py-2.5 text-sm text-left hover:bg-agentx-bg transition ${
                            isSelected ? "bg-agentx-bg font-semibold" : ""
                          }`}
                        >
                          <span>{opt.label}</span>
                          {isSelected && <Check className="w-4 h-4 text-agentx-teal" />}
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </div>
            )}
          </div>

          <button className="p-2 rounded-md border border-agentx-border hover:bg-agentx-bg transition">
            <RefreshCw className="w-3.5 h-3.5 text-agentx-muted" />
          </button>
        </div>
      </div>

      {/* Chart — key tied to metric forces remount */}
      <ResponsiveContainer width="100%" height={320} key={`${metric}-${range}`}>
        <AreaChart data={data}>
          <defs>
            <linearGradient id="agentxGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%"   stopColor={selected.color} stopOpacity={0.35} />
              <stop offset="100%" stopColor={selected.color} stopOpacity={0.02} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis dataKey="t" tick={{ fontSize: 10, fill: "#9ca3af" }} />
          <YAxis domain={[0, selected.max]} tick={{ fontSize: 10, fill: "#9ca3af" }} />
          <Tooltip
            contentStyle={{ fontSize: 12, borderRadius: 8 }}
            formatter={(v) => [`${v} ${selected.unit}`, selected.label]}
          />
          <ReferenceLine y={avg}      stroke="#94a3b8" strokeDasharray="4 4" label={{ value: "avg", position: "right", fontSize: 10, fill: "#94a3b8" }} />
          <ReferenceLine y={bandHigh} stroke="#cbd5e1" strokeDasharray="2 4" />
          <ReferenceLine y={bandLow}  stroke="#cbd5e1" strokeDasharray="2 4" />
          <Area type="monotone" dataKey="v" stroke={selected.color} strokeWidth={2} fill="url(#agentxGradient)" />
        </AreaChart>
      </ResponsiveContainer>

      <div className="flex items-center justify-center gap-4 mt-3 text-[10px] text-agentx-muted">
        <span className="flex items-center gap-1"><span className="w-3 h-0.5 bg-slate-400" /> Average</span>
        <span className="flex items-center gap-1"><span className="w-3 h-0.5 bg-slate-300" /> Healthy band (±1σ)</span>
      </div>
    </div>
  );
}
