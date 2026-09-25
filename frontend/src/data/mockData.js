export const agentInfo = {
  hostname: "ws-engineer-01",
  os: "Linux 6.8.0-45-generic x86_64",
  cpu: "Intel(R) Core(TM) i7-12700H",
  ram: "32 GB",
  status: "ONLINE",
  uptimeSeconds: 850,
};

export const topStats = {
  anomalies24h: 76,
  criticalCount: 8,
  aiReports: 11,
  aiConfidence: 81,
};

export function generateSeries(length = 60, base = 50, variance = 20) {
  let val = base;
  const out = [];
  for (let i = 0; i < length; i++) {
    val += (Math.random() - 0.5) * variance;
    val = Math.max(0, Math.min(100, val));
    out.push({ t: i, v: Number(val.toFixed(1)) });
  }
  return out;
}

export const metricCards = [
  { id:"cpu",     title:"CPU Usage",          subtitle:"Aggregate CPU utilization across all cores.",        value:26.5, unit:"%",    status:"HEALTHY", color:"teal",  sparkline: generateSeries(60, 30, 15) },
  { id:"memory",  title:"Memory Usage",       subtitle:"System memory utilization (RAM + buffers).",         value:40.2, unit:"%",    status:"HEALTHY", color:"green", sparkline: generateSeries(60, 45, 10) },
  { id:"disk",    title:"Disk I/O",           subtitle:"Combined read+write throughput on the primary disk.", value:67.7, unit:"MB/s", status:"HEALTHY", color:"green", sparkline: generateSeries(60, 20, 25) },
  { id:"network", title:"Network Throughput", subtitle:"Aggregate inbound+outbound network throughput.",     value:12.2, unit:"Mbps", status:"HEALTHY", color:"green", sparkline: generateSeries(60, 15, 40) },
];

export const anomalies = [
  { id:1, severity:"WARNING",  metric:"CPU Usage",       detector:"IQR",     description:"cpu_usage IQR anomaly: value 16.23% is below baseline 39.93% (Δ-59.4%, score=4.45).", time:"5s ago", score:4.45 },
  { id:2, severity:"WARNING",  metric:"Disk I/O",        detector:"IQR",     description:"disk_io IQR anomaly: value 1.71MB/s is below baseline 25.06MB/s (Δ-93.2%, score=4.39).", time:"12s ago", score:4.39 },
  { id:3, severity:"CRITICAL", metric:"CPU Temperature", detector:"Z-Score", description:"cpu_temp Z-score anomaly: 91.2°C exceeds baseline 68.4°C by 3.8σ.", time:"1m ago", score:3.8 },
];

export const aiReports = [
  { id:1, severity:"CRITICAL", confidence:85, time:"1m ago", title:"Likely CPU-intensive process causing thermal spike without corresponding GPU usage", metrics:["cpu_temp"] },
  { id:2, severity:"WARNING",  confidence:75, time:"2m ago", title:"Likely scheduled job or batch process causing temporary process count spike",       metrics:["process_count"] },
  { id:3, severity:"INFO",     confidence:92, time:"8m ago", title:"Memory usage trending upward steadily — possible memory leak in long-running process", metrics:["memory_usage"] },
];

export const topProcesses = [
  { pid:1234, name:"chrome",          user:"dev",  cpu:23.1, mem:18.2, state:"S" },
  { pid:5678, name:"code",            user:"dev",  cpu:15.4, mem:12.1, state:"S" },
  { pid:9012, name:"systemd-journal", user:"root", cpu:3.2,  mem:1.1,  state:"S" },
  { pid:3456, name:"gnome-shell",     user:"dev",  cpu:2.8,  mem:4.5,  state:"S" },
  { pid:7890, name:"firefox",         user:"dev",  cpu:2.1,  mem:6.3,  state:"S" },
];

export const temperatureSensors = [
  { name:"CPU Package", value:62,   unit:"°C",  status:"NORMAL" },
  { name:"CPU Core 0",  value:58,   unit:"°C",  status:"NORMAL" },
  { name:"Fan Speed",   value:2400, unit:"RPM", status:"NORMAL" },
];

export const anomalyDistribution = [
  { name:"Disk I/O",           value:22, color:"#dc2626" },
  { name:"CPU Temperature",    value:18, color:"#16a34a" },
  { name:"Memory Usage",       value:15, color:"#2563eb" },
  { name:"CPU Usage",          value:12, color:"#f59e0b" },
  { name:"Network Throughput", value:5,  color:"#7c3aed" },
  { name:"Process Count",      value:4,  color:"#06b6d4" },
];

export const historicalSeries = generateSeries(120, 50, 10);