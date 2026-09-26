// ============================================================
// Extended mock data for System Overview panels
// ============================================================
import { generateSeries } from "./mockData";

/* ---------------- CPU ---------------- */
export const cpuTimes = {
  us: 31.9,   // user
  sy: 4.9,    // system
  ni: 0.0,    // nice
  id: 62.4,   // idle
  wa: 0.8,    // iowait
  hi: 0.0,    // hw interrupts
  si: 0.2,    // sw interrupts
  st: 0.0,    // steal
};

export const cpuInfo = {
  physicalCores: 2,
  logicalThreads: 4,
  totalUtilization: 31.9,
  perCore: [28.1, 41.2, 27.9, 30.4],
  perCoreFreqMHz: [2594, 2394, 2594, 2594],
  maxFreqMHz: 2700,
  minFreqMHz: 500,
  contextSwitchesPerSec: 12480,
  interruptsPerSec: 8320,
};

// 4 cores × 30 time slices (0-100)
export const coreHeatmap = Array.from({ length: 4 }, (_, c) =>
  Array.from({ length: 30 }, (_, t) =>
    Math.max(0, Math.min(100, 40 + Math.sin(t / 3 + c) * 30 + Math.random() * 20))
  )
);

export const cpuTotalSeries = generateSeries(60, 32, 15, 100);

/* ---------------- GPU ---------------- */
export const gpuInfo = {
  name: "Intel® HD Graphics 5500 (BDW GT2)",
  driver: "i915 (Mesa 24.0.9)",
  cuda: "N/A (integrated)",
  utilization: 18.3,
  memoryUtilization: 12.4,
  vramUsedGB: 0.42,
  vramTotalGB: 1.0,
  temperature: 54,
  powerDrawW: 4.8,
  powerLimitW: 15,
  fanPercent: 28,
  graphicsClockMHz: 850,
  maxGraphicsClockMHz: 950,
  memoryClockMHz: 800,
  maxMemoryClockMHz: 800,
  encoderUtil: 0,
  decoderUtil: 3.2,
  pcieRxMBps: 12.4,
  pcieTxMBps: 3.1,
};

export const gpuUtilSeries = generateSeries(60, 18, 20, 100);
export const gpuMemUtilSeries = generateSeries(60, 12, 8, 100);
export const gpuClockSeries = generateSeries(60, 850, 60, 1000);
export const gpuPowerSeries = generateSeries(60, 4.8, 2, 15);

/* ---------------- Memory ---------------- */
export const memInfo = {
  totalGB: 7.67,
  usedGB: 4.45,
  buffersGB: 0.45,
  cachedGB: 2.61,
  availableGB: 2.50,
  percent: 67.4,
  swapTotalGB: 14.9,
  swapUsedGB: 3.31,
  swapPercent: 22.2,
  swapInMBps: 0.21,
  swapOutMBps: 0.14,
};

export const memBreakdown = [
  { name: "Used",           value: 4.45, color: "#2563eb" },
  { name: "Buffers+Cached", value: 3.06, color: "#7c3aed" },
  { name: "Available",      value: 0.16, color: "#16a34a" },
];

export const swapSeries = generateSeries(60, 20, 6, 100);

export const topMemoryProcesses = [
  { pid: 31459, name: "code",       user: "deviprasad", virtMB: 1448.4, resMB: 542.2, shrMB: 117.2, rssTrend: "stable"   },
  { pid: 36403, name: "chrome",     user: "deviprasad", virtMB: 1448.1, resMB: 264.8, shrMB: 137.6, rssTrend: "leak"     },
  { pid: 4720,  name: "chrome",     user: "deviprasad", virtMB: 1449.9, resMB: 354.6, shrMB: 142.7, rssTrend: "stable"   },
  { pid: 3546,  name: "chrome",     user: "deviprasad", virtMB: 53.0,   resMB: 138.9, shrMB: 86.9,  rssTrend: "stable"   },
  { pid: 2710,  name: "gnome-shell",user: "deviprasad", virtMB: 5129.9, resMB: 206.9, shrMB: 66.3,  rssTrend: "growing"  },
  { pid: 32877, name: "language_server", user: "deviprasad", virtMB: 2457.4, resMB: 214.1, shrMB: 24.3, rssTrend: "stable" },
  { pid: 1567,  name: "mysqld",     user: "mysql",     virtMB: 2376.4, resMB: 16.6,  shrMB: 8.7,   rssTrend: "stable"   },
];

/* ---------------- Temperature ---------------- */
export const tempSensors = [
  { label: "CPU Package", value: 62, critical: 100, unit: "\u00b0C" },
  { label: "GPU",         value: 54, critical: 100, unit: "\u00b0C" },
  { label: "NVMe SSD",    value: 43, critical: 90,  unit: "\u00b0C" },
  { label: "Chipset",     value: 51, critical: 100, unit: "\u00b0C" },
  { label: "Core 0",      value: 58, critical: 100, unit: "\u00b0C" },
  { label: "Core 1",      value: 60, critical: 100, unit: "\u00b0C" },
  { label: "Core 2",      value: 57, critical: 100, unit: "\u00b0C" },
  { label: "Core 3",      value: 59, critical: 100, unit: "\u00b0C" },
];

export const fanSensors = [
  { label: "CPU Fan",    rpm: 2400, max: 5000, tempC: 46 },
  { label: "System Fan", rpm: 1800, max: 4500, tempC: 41 },
];

export const battery = {
  present: true,
  percent: 68,
  pluggedIn: true,
  secondsLeft: null,  // charging
};

export const tempSeries = generateSeries(60, 60, 6, 100);
export const cpuLoadSeries = generateSeries(60, 32, 15, 100);
export const throttleDetected = false;

/* ---------------- Disk I/O ---------------- */
export const diskInfo = {
  readMBps: 12.4,
  writeMBps: 3.8,
  readIOPS: 118,
  writeIOPS: 62,
  avgRequestSizeKB: 42,
  avgLatencyMs: 1.2,
  busyPercent: 14,
};

export const diskReadSeries = generateSeries(60, 12, 15, 200);
export const diskWriteSeries = generateSeries(60, 4, 8, 200);
export const diskIopsSeries = generateSeries(60, 100, 60, 400);
export const iowaitSeries = generateSeries(60, 1, 1.5, 10);

export const diskPartitions = [
  { mount: "/",         device: "/dev/sda1", fstype: "ext4", totalGB: 182.28, usedGB: 24.65, percent: 14.3 },
  { mount: "/boot",     device: "/dev/sda3", fstype: "ext4", totalGB: 1.80,   usedGB: 0.21,  percent: 12.6 },
  { mount: "/home",     device: "/dev/sda5", fstype: "ext4", totalGB: 182.28, usedGB: 59.70, percent: 34.5 },
  { mount: "/boot/efi", device: "/dev/sda2", fstype: "vfat", totalGB: 1.05,   usedGB: 0.01,  percent: 0.6  },
];

export const topDiskProcesses = [
  { pid: 36403, name: "chrome",       readMBps: 4.2, writeMBps: 1.1 },
  { pid: 31459, name: "code",         readMBps: 3.8, writeMBps: 0.9 },
  { pid: 1567,  name: "mysqld",       readMBps: 1.4, writeMBps: 0.6 },
  { pid: 2710,  name: "gnome-shell",  readMBps: 0.4, writeMBps: 0.2 },
];

/* ---------------- Network ---------------- */
export const netInfo = {
  downloadMbps: 12.2,
  uploadMbps: 1.1,
  established: 32,
  listening: 24,
  timeWait: 1258,
  externalConnections: 18,
  totalBytesRecv: 1687552000,   // ~1.57 GiB
  totalBytesSent: 96249856,     // ~91.8 MiB
  totalPacketsRecv: 1438166,
  totalPacketsSent: 362449,
};

export const netDownSeries = generateSeries(60, 12, 15, 200);
export const netUpSeries   = generateSeries(60, 1.2, 2, 50);

export const netInterfaces = [
  {
    name: "wlp19s0", state: "up", ip: "192.168.1.42",
    downMbps: 12.1, upMbps: 1.05,
    bytesRecv: 1643456000, bytesSent: 96092160,
    packetsRecv: 1438166, packetsSent: 362449,
    dropsIn: 0, dropsOut: 23, errorsIn: 0, errorsOut: 0,
  },
  {
    name: "enp7s0", state: "down", ip: "—",
    downMbps: 0, upMbps: 0,
    bytesRecv: 0, bytesSent: 0,
    packetsRecv: 0, packetsSent: 0,
    dropsIn: 0, dropsOut: 0, errorsIn: 0, errorsOut: 0,
  },
  {
    name: "lo", state: "up", ip: "127.0.0.1",
    downMbps: 0.02, upMbps: 0.02,
    bytesRecv: 84975616, bytesSent: 84975616,
    packetsRecv: 686931, packetsSent: 686931,
    dropsIn: 0, dropsOut: 0, errorsIn: 0, errorsOut: 0,
  },
];

export const topTalkers = [
  { pid: 36403, name: "chrome",       downMbps: 6.8, upMbps: 0.4, connections: 14 },
  { pid: 31459, name: "code",         downMbps: 3.4, upMbps: 0.5, connections: 6  },
  { pid: 1567,  name: "mysqld",       downMbps: 0.9, upMbps: 0.2, connections: 4  },
  { pid: 2710,  name: "gnome-shell",  downMbps: 0.4, upMbps: 0.1, connections: 3  },
];

export const newExternalIps = [
  { ip: "142.250.192.46",  hostname: "google.com",           firstSeen: "2m ago",  process: "chrome",  country: "US" },
  { ip: "140.82.121.4",    hostname: "github.com",           firstSeen: "8m ago",  process: "code",    country: "US" },
  { ip: "104.16.132.229",  hostname: "cloudflare.com",       firstSeen: "12m ago", process: "chrome",  country: "US" },
];
