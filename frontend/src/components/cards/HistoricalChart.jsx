import { useState, useRef, useEffect, useMemo } from "react";
import {
  AreaChart, Area, Line, ResponsiveContainer, XAxis, YAxis, Tooltip,
  CartesianGrid, ReferenceLine, Legend,
} from "recharts";
import { RefreshCw, ChevronDown, Check, ArrowUpRight, ArrowDownRight, Minus } from "lucide-react";
import {
  METRIC_OPTIONS, TIME_RANGES,
  generateSeriesForRange, formatAxisTick, compareOffsetMs, stats,
  generateBeforeUpdateSeries,
} from "../../data/historicalData";

const COMPARE_LABELS = {
  off: "Off",
  prev: "Previous period",
  yesterday: "Yesterday",
  last_week: "Last week",
  last_month: "Last month",
  before_update: "Before update",
};

export default function HistoricalChart({ metric, range, compare, onMetricChange }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const selected = METRIC_OPTIONS.find((m) => m.id === metric) || METRIC_OPTIONS[1];
  const rangeMeta = TIME_RANGES.find((r) => r.id === range) || TIME_RANGES[0];

  const { data, currentStats, previousStats } = useMemo(() => {
    const now = Date.now();
    const current = generateSeriesForRange(metric, range, 0, now);

    let previous = [];
    if (compare === "before_update") {
      previous = generateBeforeUpdateSeries(metric, range);
    } else if (compare !== "off") {
      const offset = compareOffsetMs(compare, range);
      previous = generateSeriesForRange(metric, range, offset, now);
    }

    const len = Math.max(current.length, previous.length);
    const merged = Array.from({ length: len }, (_, i) => ({
      t: current[i]?.t ?? previous[i]?.t,
      current: current[i]?.v,
      previous: previous[i]?.v,
    }));

    return {
      data: merged,
      currentStats: stats(current.map((d) => d.v)),
      previousStats: previous.length ? stats(previous.map((d) => d.v)) : null,
    };
  }, [metric, range, compare]);

  useEffect(() => {
    const onClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const delta = previousStats
    ? ((currentStats.avg - previousStats.avg) / previousStats.avg) * 100
    : null;

  const compareLabel = COMPARE_LABELS[compare] || "Comparison";

  return (
    <div id="agentx-historical-chart" className="bg-agentx-card border border-agentx-border rounded-xl p-5">
      <div className="flex items-start justify-between gap-3 mb-4 flex-wrap">
        <div>
          <h2 className="font-bold">Historical Metric Trend</h2>
          <p className="text-xs text-agentx-muted mt-1">
            {selected.label} · {rangeMeta.label}
            {compare !== "off" && ` vs ${compareLabel.toLowerCase()}`}
            {" · "}avg {currentStats.avg.toFixed(1)} {selected.unit}
          </p>
        </div>

        <div className="flex items-center gap-2">
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

      {delta !== null && (
        <div className="mb-3 flex items-center gap-2 text-xs">
          <span className="text-agentx-muted">vs {compareLabel}:</span>
          <span
            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full font-bold ${
              Math.abs(delta) < 2
                ? "bg-agentx-bg text-agentx-muted"
                : delta > 0
                ? "bg-agentx-redSoft text-agentx-red"
                : "bg-agentx-greenSoft text-agentx-green"
            }`}
          >
            {Math.abs(delta) < 2 ? <Minus className="w-3 h-3" /> :
             delta > 0 ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
            {delta > 0 ? "+" : ""}{delta.toFixed(1)}%
          </span>
          {compare === "before_update" && (
            <span className="text-agentx-muted">
              (kernel 6.8 → 7.0 · {new Date().toLocaleDateString()})
            </span>
          )}
        </div>
      )}

      <ResponsiveContainer width="100%" height={320} key={`${metric}-${range}-${compare}`}>
        <AreaChart data={data}>
          <defs>
            <linearGradient id="agentxGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%"   stopColor={selected.color} stopOpacity={0.35} />
              <stop offset="100%" stopColor={selected.color} stopOpacity={0.02} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis
            dataKey="t"
            tick={{ fontSize: 10, fill: "#9ca3af" }}
            tickFormatter={(v) => formatAxisTick(v, range)}
            minTickGap={40}
          />
          <YAxis domain={[0, selected.max]} tick={{ fontSize: 10, fill: "#9ca3af" }} />
          <Tooltip
            contentStyle={{ fontSize: 12, borderRadius: 8 }}
            labelFormatter={(v) => new Date(v).toLocaleString()}
            formatter={(value, name) => [
              `${value} ${selected.unit}`,
              name === "current" ? "Current" : compareLabel,
            ]}
          />
          {compare !== "off" && <Legend wrapperStyle={{ fontSize: 11 }} />}
          <ReferenceLine
            y={currentStats.avg}
            stroke="#94a3b8"
            strokeDasharray="4 4"
            label={{ value: "avg", position: "right", fontSize: 10, fill: "#94a3b8" }}
          />
          {compare !== "off" && (
            <Line
              name={compareLabel}
              type="monotone"
              dataKey="previous"
              stroke="#cbd5e1"
              strokeWidth={2}
              strokeDasharray="5 4"
              dot={false}
              connectNulls
            />
          )}
          <Area
            name="Current"
            type="monotone"
            dataKey="current"
            stroke={selected.color}
            strokeWidth={2}
            fill="url(#agentxGradient)"
            connectNulls
          />
        </AreaChart>
      </ResponsiveContainer>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4">
        <StatChip label="Average" value={`${currentStats.avg.toFixed(1)} ${selected.unit}`} />
        <StatChip label="Min"     value={`${currentStats.min.toFixed(1)} ${selected.unit}`} />
        <StatChip label="Max"     value={`${currentStats.max.toFixed(1)} ${selected.unit}`} />
        <StatChip label="Std dev" value={`± ${currentStats.stddev.toFixed(2)}`} />
      </div>
    </div>
  );
}

function StatChip({ label, value }) {
  return (
    <div className="p-3 rounded-lg bg-agentx-bg border border-agentx-border">
      <p className="text-[10px] uppercase tracking-wider text-agentx-muted">{label}</p>
      <p className="text-sm font-bold mt-1">{value}</p>
    </div>
  );
}
