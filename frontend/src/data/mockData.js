export const agentInfo = {
  hostname: "deviprasad-shetty-HP-Notebook",
  os: "Linux 7.0.0-31-generic x86_64",
  cpu: "Intel® Core™ i5-5200U × 4",
  ram: "8.0 GiB",
  status: "ONLINE",
  uptimeSeconds: 850,
};

export const topStats = {
  healthScore: 82,
  anomalies24h: 76,
  criticalCount: 8,
  aiReports: 11,
  aiConfidence: 81,
};

export function generateSeries(length = 60, base = 50, variance = 20, max = 100) {
  let val = base;
  const out = [];
  for (let i = 0; i < length; i++) {
    val += (Math.random() - 0.5) * variance;
    val = Math.max(0, Math.min(max, val));
    out.push({ t: i, v: Number(val.toFixed(1)) });
  }
  return out;
}

export const metricCards = [
  {
    id: "cpu",
    title: "CPU Usage",
    subtitle: "Aggregate CPU utilization across all cores.",
    value: 26.5,
    unit: "%",
    max: 100,
    status: "HEALTHY",
    color: "teal",
    sparkline: generateSeries(60, 30, 15, 100),
  },
  {
    id: "gpu",
    title: "GPU Usage",
    subtitle: "GPU 3D engine utilization.",
    value: 18.3,
    unit: "%",
    max: 100,
    status: "HEALTHY",
    color: "purple",
    sparkline: generateSeries(60, 20, 20, 100),
  },
  {
    id: "memory",
    title: "Memory Usage",
    subtitle: "System memory utilization (RAM + buffers).",
    value: 40.2,
    unit: "%",
    max: 100,
    status: "HEALTHY",
    color: "green",
    sparkline: generateSeries(60, 45, 10, 100),
  },
  {
    id: "cpu_temp",
    title: "CPU Temperature",
    subtitle: "Package temperature reported by the thermal sensor.",
    value: 62.0,
    unit: "°C",
    max: 100,
    status: "HEALTHY",
    color: "red",
    sparkline: generateSeries(60, 62, 8, 100),
  },
  {
    id: "disk",
    title: "Disk I/O",
    subtitle: "Combined read+write throughput on the primary disk.",
    value: 67.7,
    unit: "MB/s",
    max: 250,
    status: "HEALTHY",
    color: "green",
    sparkline: generateSeries(60, 60, 40, 250),
  },
  {
    id: "network",
    title: "Network Throughput",
    subtitle: "Aggregate inbound+outbound network throughput.",
    value: 12.2,
    unit: "Mbps",
    max: 1200,
    status: "HEALTHY",
    color: "green",
    sparkline: generateSeries(60, 100, 200, 1200),
  },
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

export const anomalyDistribution = [
  { name:"Disk I/O",           value:22, color:"#dc2626" },
  { name:"CPU Temperature",    value:18, color:"#16a34a" },
  { name:"Memory Usage",       value:15, color:"#2563eb" },
  { name:"CPU Usage",          value:12, color:"#f59e0b" },
  { name:"Network Throughput", value:5,  color:"#7c3aed" },
  { name:"Process Count",      value:4,  color:"#06b6d4" },
];

export const historicalSeries = generateSeries(120, 50, 10, 100);

// ============================================================
// Profile — System Information
// ============================================================
export const profileInfo = {
  hostname: "deviprasad-shetty-HP-Notebook",
  software: {
    osName: "Ubuntu 24.04.5 LTS",
    osType: "64-bit",
    gnomeVersion: "46",
    windowingSystem: "Wayland",
    kernelVersion: "Linux 7.0.0-31-generic",
  },
  hardware: {
    hardwareModel: "HP HP Notebook",
    memory: "8.0 GiB",
    processor: "Intel® Core™ i5-5200U × 4",
    graphics: "Intel® HD Graphics 5500 (BDW GT2)",
    diskCapacity: "480.1 GB",
  },
};
