// ============================================================
// Historical Trends data layer
// Generates deterministic-ish mock series for any metric + range.
// In production, replace `generateSeriesForRange` with a fetch
// against /api/v1/metrics/range?metric=...&start=...&end=...
// ============================================================

/* All metrics that can be shown in Historical Trends */
export const METRIC_OPTIONS = [
  { id: "process_count", label: "Process Count",      unit: "procs", max: 500,  color: "#7c3aed", base: 310, variance: 20 },
  { id: "cpu_usage",     label: "CPU Usage",          unit: "%",     max: 100,  color: "#0d9488", base: 32,  variance: 15 },
  { id: "memory_usage",  label: "Memory Usage",       unit: "%",     max: 100,  color: "#2563eb", base: 55,  variance: 10 },
  { id: "disk_io",       label: "Disk I/O",           unit: "MB/s",  max: 200,  color: "#16a34a", base: 40,  variance: 25 },
  { id: "network",       label: "Network Throughput", unit: "Mbps",  max: 100,  color: "#06b6d4", base: 12,  variance: 15 },
  { id: "cpu_temp",      label: "CPU Temperature",    unit: "°C",    max: 100,  color: "#dc2626", base: 62,  variance: 6  },
  { id: "gpu_usage",     label: "GPU Usage",          unit: "%",     max: 100,  color: "#a855f7", base: 18,  variance: 12 },
];

/* Time ranges, in seconds, with the number of points to sample */
export const TIME_RANGES = [
  { id: "1h",  label: "1h",   seconds: 60 * 60,       points: 60  },
  { id: "6h",  label: "6h",   seconds: 60 * 60 * 6,   points: 72  },
  { id: "24h", label: "24h",  seconds: 60 * 60 * 24,  points: 96  },
  { id: "7d",  label: "7d",   seconds: 60 * 60 * 24 * 7,  points: 84  },
  { id: "30d", label: "30d",  seconds: 60 * 60 * 24 * 30, points: 90  },
];

/* Comparison windows (relative to now) */
export const COMPARE_OPTIONS = [
  { id: "off",        label: "Off" },
  { id: "prev",       label: "Previous period" },
  { id: "yesterday",  label: "Yesterday" },
  { id: "last_week",  label: "Last week" },
  { id: "last_month", label: "Last month" },
];

/* -------------------- helpers -------------------- */

/** Simple deterministic pseudo-random from an integer seed. */
function seededRandom(seed) {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

/**
 * Generate `n` points for a metric within a range.
 * Uses seed = hash(metric + range + offset) so the same
 * (metric, range, compareOffset) always produces the same curve.
 */
export function generateSeriesForRange(metricId, rangeId, compareOffset = 0, now = Date.now()) {
  const metric = METRIC_OPTIONS.find((m) => m.id === metricId) || METRIC_OPTIONS[1];
  const range  = TIME_RANGES.find((r) => r.id === rangeId) || TIME_RANGES[0];

  const points = range.points;
  const stepMs = (range.seconds * 1000) / (points - 1);
  const endMs  = now - compareOffset;

  const seedBase =
    metricId.split("").reduce((h, c) => h + c.charCodeAt(0), 0) * 17 +
    rangeId.split("").reduce((h, c) => h + c.charCodeAt(0), 0) * 31 +
    compareOffset;

  const out = [];
  let val = metric.base;

  for (let i = 0; i < points; i++) {
    const t = endMs - (points - 1 - i) * stepMs;
    const noise = (seededRandom(seedBase + i * 7.13) - 0.5) * metric.variance * 2;
    // Slow sine drift so curves look organic, not jagged
    const drift = Math.sin(i / (points / 6)) * metric.variance * 0.4;
    val = Math.max(0, Math.min(metric.max, val * 0.85 + (metric.base + noise + drift) * 0.15));
    out.push({ t, v: Number(val.toFixed(2)) });
  }
  return out;
}

/** Format a timestamp for a given range's X-axis. */
export function formatAxisTick(timestampMs, rangeId) {
  const d = new Date(timestampMs);
  const pad = (n) => String(n).padStart(2, "0");

  switch (rangeId) {
    case "1h":
    case "6h":
      return `${pad(d.getHours())}:${pad(d.getMinutes())}`;
    case "24h":
      return `${pad(d.getHours())}:${pad(d.getMinutes())}`;
    case "7d":
      return `${["Sun","Mon","Tue","Wed","Thu","Fri","Sat"][d.getDay()]} ${pad(d.getHours())}h`;
    case "30d":
      return `${["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"][d.getMonth()]} ${d.getDate()}`;
    default:
      return `${pad(d.getHours())}:${pad(d.getMinutes())}`;
  }
}

/** Convert a compare id into an offset in milliseconds (relative to now). */
export function compareOffsetMs(compareId, rangeId) {
  const range = TIME_RANGES.find((r) => r.id === rangeId) || TIME_RANGES[0];
  const day = 24 * 60 * 60 * 1000;

  switch (compareId) {
    case "prev":       return range.seconds * 1000;   // one range back
    case "yesterday":  return day;
    case "last_week":  return 7 * day;
    case "last_month": return 30 * day;
    default:           return 0;                     // "off"
  }
}

/** Stats helper: avg, min, max, stddev. */
export function stats(values) {
  if (!values.length) return { avg: 0, min: 0, max: 0, stddev: 0 };
  const avg = values.reduce((a, b) => a + b, 0) / values.length;
  const min = Math.min(...values);
  const max = Math.max(...values);
  const variance = values.reduce((s, v) => s + (v - avg) ** 2, 0) / values.length;
  return { avg, min, max, stddev: Math.sqrt(variance) };
}

/* ============================================================
   Anomaly heatmap — 7 days × 24 hours
   Returns { day, hour, count }[] — ready to render as a grid.
   ============================================================ */
export function generateAnomalyHeatmap(seed = 42) {
  const days  = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const cells = [];

  for (let d = 0; d < 7; d++) {
    for (let h = 0; h < 24; h++) {
      // High-value clusters: 3 AM backup job, 2 PM business-hours peak
      let base = 0;
      if (h === 3) base += 4;                       // nightly job
      if (h >= 14 && h <= 16 && d < 5) base += 2;   // weekday afternoon
      if (h === 12) base += 1;                      // lunch
      if (d === 5 && h >= 10 && h <= 18) base += 1; // Saturday activity

      const noise = ((Math.sin(seed + d * 31 + h * 7.13) * 10000) % 1 + 1) % 1;
      const count = Math.max(0, Math.floor(base + noise * 2));

      cells.push({ day: days[d], hour: h, count });
    }
  }
  return cells;
}

/* Compare presets (extended with Before-update) */
export const COMPARE_EXTRA = [
  { id: "before_update", label: "Before update",   offsetDays: null, note: "Kernel 6.8 → 7.0" },
];

/* Fake "Before update" dataset — used when compare = "before_update" */
export function generateBeforeUpdateSeries(metricId, rangeId) {
  // Slightly higher baseline to simulate a post-update regression
  const now = Date.now();
  const series = generateSeriesForRange(metricId, rangeId, 0, now);
  return series.map((pt, i) => ({
    t: pt.t,
    // 8-15% higher than current — simulates "the update made things worse"
    v: Number((pt.v * (1.10 + (Math.sin(i) * 0.03))).toFixed(2)),
  }));
}
