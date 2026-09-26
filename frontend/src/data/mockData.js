// ============================================================
// AgentX mock data — swap with API/WebSocket calls in production
// ============================================================

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
  aiReports: 10,
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
  { id:"cpu",      title:"CPU Usage",          subtitle:"Aggregate CPU utilization across all cores.",        value:26.5, unit:"%",    max:100,  status:"HEALTHY", color:"teal",   sparkline: generateSeries(60, 30, 15, 100) },
  { id:"gpu",      title:"GPU Usage",          subtitle:"GPU 3D engine utilization.",                          value:18.3, unit:"%",    max:100,  status:"HEALTHY", color:"purple", sparkline: generateSeries(60, 20, 20, 100) },
  { id:"memory",   title:"Memory Usage",       subtitle:"System memory utilization (RAM + buffers).",         value:40.2, unit:"%",    max:100,  status:"HEALTHY", color:"green",  sparkline: generateSeries(60, 45, 10, 100) },
  { id:"cpu_temp", title:"CPU Temperature",    subtitle:"Package temperature reported by the thermal sensor.", value:62.0, unit:"°C",   max:100,  status:"HEALTHY", color:"red",    sparkline: generateSeries(60, 62, 8, 100) },
  { id:"disk",     title:"Disk I/O",           subtitle:"Combined read+write throughput on the primary disk.", value:67.7, unit:"MB/s", max:250,  status:"HEALTHY", color:"green",  sparkline: generateSeries(60, 60, 40, 250) },
  { id:"network",  title:"Network Throughput", subtitle:"Aggregate inbound+outbound network throughput.",     value:12.2, unit:"Mbps", max:1200, status:"HEALTHY", color:"green",  sparkline: generateSeries(60, 100, 200, 1200) },
];

export const anomalies = [
  { id:1,  severity:"WARNING",  metric:"CPU Usage",       detector:"IQR",     description:"cpu_usage IQR anomaly: value 16.23% is below baseline 39.93% (delta -59.4%, score=4.45).", time:"5s ago",   score:4.45 },
  { id:2,  severity:"WARNING",  metric:"Disk I/O",        detector:"IQR",     description:"disk_io IQR anomaly: value 1.71 MB/s is below baseline 25.06 MB/s (delta -93.2%, score=4.39).", time:"12s ago",  score:4.39 },
  { id:3,  severity:"CRITICAL", metric:"CPU Temperature", detector:"Z-Score", description:"cpu_temp Z-score anomaly: 91.2 C exceeds baseline 68.4 C by 3.8 sigma.", time:"1m ago",    score:3.80 },
  { id:4,  severity:"WARNING",  metric:"Memory Usage",    detector:"EWMA",    description:"memory_usage EWMA anomaly: 82.05% is +28.3% above the moving baseline of 63.97%.", time:"2m ago",    score:3.62 },
  { id:5,  severity:"INFO",     metric:"Process Count",   detector:"IQR",     description:"process_count IQR anomaly: 172 vs baseline 140.2 (+22.8%), self-resolved in ~4 min.", time:"3m ago",    score:2.91 },
  { id:6,  severity:"WARNING",  metric:"Network",         detector:"Z-Score", description:"time_wait TCP states hit 1,258 (baseline 180, +5.9 sigma) — possible port pressure.", time:"6m ago",    score:5.90 },
  { id:7,  severity:"CRITICAL", metric:"Auth",            detector:"Rule",    description:"67 failed SSH logins from 45.148.10.54 within 6 minutes — brute-force pattern.", time:"9m ago",    score:9.00 },
  { id:8,  severity:"WARNING",  metric:"GPU Usage",       detector:"EWMA",    description:"gpu_util dropped to 0.0% for ~3 min while display active — possible driver stall.", time:"15m ago",   score:3.14 },
  { id:9,  severity:"INFO",     metric:"Boot Time",       detector:"Trend",   description:"Boot regression: 22s -> 1m 40s over last 3 boots. Top culprit: NetworkManager-wait-online.", time:"22m ago", score:2.40 },
  { id:10, severity:"WARNING",  metric:"CPU",             detector:"Z-Score", description:"CPU steal time sustained at 4.2% for 10 minutes — hypervisor contention.", time:"31m ago",   score:4.20 },
  { id:11, severity:"INFO",     metric:"Swap",            detector:"IQR",     description:"swap_out rate steady at 0.14 MB/s over 1h — mild ongoing memory pressure.", time:"48m ago",   score:2.10 },
  { id:12, severity:"WARNING",  metric:"Disk I/O",        detector:"IQR",     description:"avg disk latency climbed from 0.6 ms to 1.2 ms while throughput dropped — possible seek amplification.", time:"1h ago", score:3.31 },
];

export const aiReports = [
  {
    id: 1,
    severity: "WARNING",
    confidence: 85,
    time: "1m ago",
    title: "Likely memory leak in a process causing gradual memory consumption increase",
    metrics: ["memory_usage"],
    summary:
      "The system ws-engineer-01 experienced a memory usage anomaly on 2026-09-25, with memory usage jumping from ~60% to 82.05%, exceeding the baseline of 63.97% (IQR detector, score=4.04). This represents a significant increase of 28.3% and is approaching the upper healthy threshold of 85%.",
    evidence: [
      "Memory usage shows a gradual increase from ~50-60% to 82.05% over the sampling period",
      "Process count has been steadily increasing from ~130 to ~170 processes",
      "Disk I/O activity has been variable but not showing abnormal patterns",
      "The memory increase does not correlate with process count or disk I/O spikes",
    ],
    rootCause:
      "The most probable cause is a memory leak in one or more processes. The gradual nature of the memory increase without corresponding increases in process count or disk I/O suggests that processes are consuming more memory over time without properly releasing it. This is consistent with memory leak behavior rather than sudden resource saturation.",
    recommendations: [
      "Identify and investigate processes with high memory usage using ps aux --sort=-%mem",
      "Check system logs for errors that might indicate application issues",
      "Monitor current memory trends with vmstat to observe if the issue continues",
      "Review running processes for any unusual activity",
      "Consider implementing memory limits for critical services",
      "Correlate with recent application updates or deployments",
    ],
    riskNotes:
      "While this appears to be a technical issue rather than a security threat, unaddressed memory leaks can lead to system instability and eventual crashes. The gradual nature suggests this is not an immediate critical issue, but should be addressed before it impacts system availability. No indicators of malicious activity were observed in the provided metrics.",
    actions: [
      "Run ps aux --sort=-%mem to identify top memory-consuming processes",
      "Check system logs with journalctl -n 100 -p err for recent errors",
      "Monitor memory usage with vmstat 1 10 to observe current trends",
      "Review running processes with top -b -n 1 to identify unusual processes",
      "Consider setting up memory cgroup limits for critical services",
      "Check if any recent application updates or deployments correlate with the anomaly",
    ],
  },
  {
    id: 2,
    severity: "WARNING",
    confidence: 75,
    time: "2m ago",
    title: "Likely scheduled job or batch process causing temporary process count spike",
    metrics: ["process_count"],
    summary:
      "Process count briefly spiked from a baseline of ~140 to 172 between 14:28 and 14:32 UTC, then returned to normal levels. The pattern aligns with typical batch job behavior and did not persist beyond four minutes.",
    evidence: [
      "Process count anomaly: 172 (baseline 140.2, +22.8%)",
      "Spike duration: ~4 minutes, then returned to baseline",
      "CPU utilization rose by 18% during the same window",
      "No new external network connections observed",
      "No new listening ports detected",
    ],
    rootCause:
      "The short-lived, self-resolving nature of the spike strongly indicates a scheduled task such as a cron job, log rotation, or backup process. The absence of suspicious network or port activity rules out most malware persistence scenarios.",
    recommendations: [
      "Confirm the schedule of known cron jobs and systemd timers",
      "Check journalctl for the exact window to identify the triggering unit",
      "If unexplained, audit crontab entries (crontab -l and /etc/cron.*)",
      "Add the pattern to an allowlist if confirmed benign",
    ],
    riskNotes:
      "Low risk. However, if this pattern recurs at unusual hours (e.g., 03:00-05:00), investigate for persistence mechanisms.",
    actions: [
      "Run systemctl list-timers --all to see scheduled jobs",
      "Inspect grep CRON /var/log/syslog for that window",
      "Check /etc/cron.d/ and user crontabs",
    ],
  },
  {
    id: 3,
    severity: "INFO",
    confidence: 92,
    time: "8m ago",
    title: "Memory usage trending upward steadily — possible memory leak in long-running process",
    metrics: ["memory_usage", "process_count"],
    summary:
      "Over the last 24 hours, memory usage has grown from a stable 55% to a persistent 82%. This is a slow, monotonic increase that does not correlate with user activity or new process spawns.",
    evidence: [
      "Memory usage: 55% to 82% over 24h (monotonic)",
      "Process count remained stable at ~140",
      "RAM total: 7.67 GiB; used: 6.29 GiB",
      "Swap usage is stable at 22%",
    ],
    rootCause:
      "A long-running user-space process is likely leaking memory. The most common culprits are browsers with many tabs, Electron apps, or IDEs with large projects.",
    recommendations: [
      "Use the Memory panel's per-process RSS trend to spot the leaker",
      "Restart the offending process to reclaim memory",
      "Consider adding a periodic restart timer for known-leaky services",
    ],
    riskNotes:
      "Not critical today, but on an 8 GiB system, this will eventually trigger swap thrashing and system unresponsiveness.",
    actions: [
      "Open System Overview -> Memory Usage -> Top consumers table",
      "Look for a process whose RES column grows without plateau",
      "Set a reminder to investigate at the next 24h mark",
    ],
  },
  {
    id: 4,
    severity: "CRITICAL",
    confidence: 88,
    time: "15m ago",
    title: "CPU temperature spike without corresponding load — possible thermal event",
    metrics: ["cpu_temp"],
    summary:
      "CPU package temperature reached 91.2 C at 14:17 UTC while CPU utilization was only 24%. Baseline is 68.4 C (Z-score: 3.8 sigma). This uncorrelated spike suggests a cooling problem rather than a workload event.",
    evidence: [
      "CPU temp: 91.2 C (baseline 68.4 C, +33%)",
      "CPU load: 24% (well below threshold)",
      "Fan speed: 2400 RPM (unchanged from idle)",
      "No new thermal-intensive process detected",
    ],
    rootCause:
      "The temperature spike without a load increase indicates degraded cooling — likely dust accumulation on the heatsink, a failing fan bearing, or thermal paste degradation. Ambient temperature rise is a less likely secondary cause.",
    recommendations: [
      "Physically inspect the fan for dust or obstruction",
      "Clean the heatsink and vents with compressed air",
      "Check if fan RPM ramps up under sustained load (if not, fan is failing)",
      "Consider reapplying thermal paste if the laptop is >3 years old",
    ],
    riskNotes:
      "High. Sustained temperatures above 90 C can cause CPU throttling, sudden shutdowns, and long-term hardware degradation. Address within 24 hours.",
    actions: [
      "Run sensors repeatedly to watch the trend",
      "Run a 5-minute stress-ng --cpu 4 test while monitoring temp and fan",
      "If fan RPM stays flat during stress, the fan or its controller is failing",
    ],
  },
  {
    id: 5,
    severity: "WARNING",
    confidence: 71,
    time: "22m ago",
    title: "Disk I/O dropped 93% below baseline — possible stuck I/O wait or caching stall",
    metrics: ["disk_io"],
    summary:
      "Disk I/O throughput fell to 1.71 MB/s from a baseline of 25.06 MB/s (IQR score 4.39). This is unusual and may indicate a hung I/O thread or filesystem cache behavior.",
    evidence: [
      "Read/write throughput: 1.71 MB/s (baseline 25.06 MB/s)",
      "I/O wait on CPU rose from 0.2% to 0.8%",
      "No errors in dmesg output",
      "SMART status: healthy",
    ],
    rootCause:
      "Two possibilities: (a) the workload genuinely went idle, or (b) a thread is stuck in uninterruptible disk sleep (D-state). Check for D-state processes.",
    recommendations: [
      "Check for D-state processes: ps -eo state,pid,cmd | grep ^D",
      "Run iostat -x 1 5 to confirm the drop is real and not a measurement artifact",
      "Monitor for a few minutes to see if I/O recovers naturally",
    ],
    riskNotes:
      "If D-state processes persist, they may be waiting on a failing disk. Back up important data as a precaution.",
    actions: [
      "Run ps -eo state,pid,cmd | grep ^D",
      "Run sudo smartctl -a /dev/sda to check disk health",
      "Consider fsck on next reboot if the issue persists",
    ],
  },
  {
    id: 6,
    severity: "CRITICAL",
    confidence: 82,
    time: "35m ago",
    title: "Unusually high TIME_WAIT connections — possible port exhaustion risk",
    metrics: ["network"],
    summary:
      "TCP TIME_WAIT count reached 1,258 (typical is <200). This can cause ephemeral port exhaustion, slowing new outbound connections from browsers and tools.",
    evidence: [
      "TIME_WAIT: 1,258",
      "ESTABLISHED: 32",
      "Kernel ephemeral port range: 32768-60999 (~28k ports)",
      "Recent spike correlates with Chrome activity",
    ],
    rootCause:
      "Chrome and its extensions open many short-lived HTTP connections. Without HTTP keep-alive or connection pooling, each closes into TIME_WAIT for 60 seconds. At 20 req/s, that is 1,200 TIME_WAIT sockets.",
    recommendations: [
      "Enable TCP reuse: sysctl net.ipv4.tcp_tw_reuse=1",
      "Increase ephemeral range if needed",
      "Reduce connection churn in high-frequency clients",
    ],
    riskNotes:
      "Medium. Not an attack, but can degrade new-connection throughput on busy systems.",
    actions: [
      "Run ss -tan state time-wait | wc -l",
      "Set net.ipv4.tcp_tw_reuse=1 in /etc/sysctl.conf",
      "Restart Chrome if the count stays above 1,500",
    ],
  },
  {
    id: 7,
    severity: "WARNING",
    confidence: 68,
    time: "48m ago",
    title: "GPU utilization dropped to 0% while display was active — possible driver stall",
    metrics: ["gpu_usage"],
    summary:
      "GPU utilization hovered at 0% for 3 minutes while the display was actively rendering. This can indicate a driver hiccup, or the compositor offloading to the CPU.",
    evidence: [
      "GPU util: 0.0% for ~3 min",
      "CPU rose by ~8% during the same window",
      "No GPU errors in dmesg",
      "Wayland compositor logs show no crash",
    ],
    rootCause:
      "Likely a transient i915 driver event or compositor fallback. If recurrent, investigate power management or firmware updates.",
    recommendations: [
      "Check dmesg | grep -i i915 for driver messages",
      "Update Mesa and kernel if older than 6 months",
      "Consider disabling aggressive GPU power saving if on battery",
    ],
    riskNotes:
      "Low if isolated; if weekly, escalate to driver investigation.",
    actions: [
      "Run dmesg | tail -50 | grep -i gpu",
      "Check current GPU freq: cat /sys/class/drm/card0/gt_cur_freq_mhz",
    ],
  },
  {
    id: 8,
    severity: "INFO",
    confidence: 90,
    time: "1h ago",
    title: "Boot time regression: 22s to 1m 40s over last 3 boots",
    metrics: ["boot_time"],
    summary:
      "Boot time has regressed steadily across the last three startups. The largest contributor is a 45-second delay in NetworkManager-wait-online.service.",
    evidence: [
      "Boot times: 22s (5 boots ago) to 1m 40s (current)",
      "NetworkManager-wait-online: 45s",
      "systemd-analyze blame identifies 3 other services >10s",
    ],
    rootCause:
      "The wait-online service is timing out waiting for a network that isn't available at boot. Common after Wi-Fi password changes or DHCP changes on a router.",
    recommendations: [
      "Check Wi-Fi credentials and router DHCP scope",
      "Consider disabling wait-online if not needed",
      "Review other slow services via systemd-analyze blame",
    ],
    riskNotes:
      "Cosmetic; boot still completes. But a 78-second regression deserves investigation.",
    actions: [
      "Run systemd-analyze blame | head -20",
      "Run systemd-analyze critical-chain",
      "Optionally disable: sudo systemctl disable NetworkManager-wait-online.service",
    ],
  },
  {
    id: 9,
    severity: "CRITICAL",
    confidence: 94,
    time: "1h 12m ago",
    title: "Multiple failed SSH login attempts from a single external IP",
    metrics: ["auth"],
    summary:
      "67 failed SSH login attempts were logged from 45.148.10.54 within 6 minutes. This is consistent with a password brute-force attack on sshd.",
    evidence: [
      "Source IP: 45.148.10.54 (Netherlands, known scanner)",
      "67 failures across 6 minutes (targeting user root, admin, test)",
      "sshd is listening on 0.0.0.0:22 (publicly exposed)",
      "No successful logins observed",
    ],
    rootCause:
      "Externally exposed SSH service is being brute-forced. This is opportunistic, not targeted, but must be mitigated.",
    recommendations: [
      "Immediately disable password authentication (use keys only)",
      "Install and configure fail2ban",
      "Consider changing the SSH port and/or using a VPN",
      "Block the source IP at the firewall",
    ],
    riskNotes:
      "High. Even with strong passwords, sustained brute-force creates log noise and wastes resources. If any weak account exists, compromise is possible.",
    actions: [
      "Edit /etc/ssh/sshd_config: set PasswordAuthentication no, restart sshd",
      "Install fail2ban: sudo apt install fail2ban",
      "Block source: sudo ufw deny from 45.148.10.54",
    ],
  },
  {
    id: 10,
    severity: "WARNING",
    confidence: 77,
    time: "1h 30m ago",
    title: "Steal time on CPU is elevated — likely noisy neighbour on hypervisor",
    metrics: ["cpu"],
    summary:
      "CPU steal time reached 4.2% sustained for 10 minutes. On a VM, this means the hypervisor was busy running other guests, stealing cycles from this VM.",
    evidence: [
      "CPU steal: 4.2% (typical healthy: <1%)",
      "Total CPU util: 42%",
      "No increase in user/system time",
      "Correlated with an external VM infrastructure event",
    ],
    rootCause:
      "Hypervisor contention. Common in shared cloud environments or during physical host maintenance.",
    recommendations: [
      "If on cloud: consider moving to a dedicated instance",
      "If self-hosted: check host-level load",
      "Monitor for sustained >5% steal as that impacts SLAs",
    ],
    riskNotes:
      "Medium. Persistent steal time causes latency spikes that are invisible to process-level tools.",
    actions: [
      "Run vmstat 1 10 and watch the st column",
      "Check with hosting provider if this persists",
    ],
  },
];

export const topProcesses = [
  { pid:1,     name:"systemd",         user:"root", cpu:0.0,  mem:0.1, state:"S" },
  { pid:2,     name:"kthreadd",        user:"root", cpu:0.0,  mem:0.0, state:"S" },
  { pid:14,    name:"ksoftirqd/0",     user:"root", cpu:0.3,  mem:0.0, state:"S" },
  { pid:1567,  name:"mysqld",          user:"mysql",cpu:1.0,  mem:0.2, state:"S" },
  { pid:2710,  name:"gnome-shell",     user:"dev",  cpu:6.3,  mem:2.6, state:"S" },
  { pid:3145,  name:"systemd-journal", user:"root", cpu:0.4,  mem:0.3, state:"S" },
  { pid:3481,  name:"NetworkManager",  user:"root", cpu:0.1,  mem:0.2, state:"S" },
  { pid:3546,  name:"chrome",          user:"dev",  cpu:15.6, mem:1.7, state:"S" },
  { pid:3560,  name:"chrome",          user:"dev",  cpu:9.9,  mem:0.6, state:"S" },
  { pid:3620,  name:"chrome",          user:"dev",  cpu:4.2,  mem:1.1, state:"S" },
  { pid:3640,  name:"chrome",          user:"dev",  cpu:3.8,  mem:1.4, state:"S" },
  { pid:36403, name:"chrome",          user:"dev",  cpu:23.5, mem:3.3, state:"R" },
  { pid:3642,  name:"chrome",          user:"dev",  cpu:2.1,  mem:0.9, state:"S" },
  { pid:3701,  name:"chrome",          user:"dev",  cpu:1.8,  mem:0.7, state:"S" },
  { pid:3755,  name:"chrome",          user:"dev",  cpu:1.2,  mem:0.5, state:"S" },
  { pid:3902,  name:"code",            user:"dev",  cpu:12.4, mem:3.8, state:"S" },
  { pid:31459, name:"code",            user:"dev",  cpu:60.6, mem:6.7, state:"S" },
  { pid:4001,  name:"code",            user:"dev",  cpu:5.3,  mem:2.1, state:"S" },
  { pid:4718,  name:"gnome-terminal-", user:"dev",  cpu:0.3,  mem:1.2, state:"S" },
  { pid:4720,  name:"chrome",          user:"dev",  cpu:17.9, mem:4.4, state:"S" },
  { pid:7801,  name:"firefox",         user:"dev",  cpu:2.1,  mem:6.3, state:"S" },
  { pid:7802,  name:"firefox",         user:"dev",  cpu:1.4,  mem:2.4, state:"S" },
  { pid:8432,  name:"pipewire",        user:"dev",  cpu:0.4,  mem:0.3, state:"S" },
  { pid:8451,  name:"pipewire-pulse",  user:"dev",  cpu:0.1,  mem:0.2, state:"S" },
  { pid:9012,  name:"dbus-daemon",     user:"dev",  cpu:0.2,  mem:0.2, state:"S" },
  { pid:9123,  name:"gjs",             user:"dev",  cpu:0.6,  mem:0.5, state:"S" },
  { pid:9455,  name:"gnome-software",  user:"dev",  cpu:0.1,  mem:0.4, state:"S" },
  { pid:10201, name:"tracker-miner-fs",user:"dev",  cpu:0.8,  mem:0.5, state:"S" },
  { pid:11345, name:"evolution-alarm", user:"dev",  cpu:0.0,  mem:0.3, state:"S" },
  { pid:12098, name:"snapd",           user:"root", cpu:0.1,  mem:0.4, state:"S" },
  { pid:12345, name:"unattended-upgr", user:"root", cpu:0.0,  mem:0.2, state:"S" },
  { pid:14201, name:"packagekitd",     user:"root", cpu:0.2,  mem:0.3, state:"S" },
  { pid:15600, name:"python3",         user:"dev",  cpu:3.4,  mem:1.1, state:"S" },
  { pid:15601, name:"python3",         user:"dev",  cpu:0.9,  mem:0.7, state:"S" },
  { pid:18023, name:"node",            user:"dev",  cpu:8.7,  mem:2.8, state:"S" },
  { pid:18024, name:"node",            user:"dev",  cpu:2.1,  mem:1.3, state:"S" },
  { pid:21001, name:"docker-containe", user:"root", cpu:1.2,  mem:0.6, state:"S" },
  { pid:22010, name:"containerd",      user:"root", cpu:0.4,  mem:0.5, state:"S" },
  { pid:32877, name:"language_server", user:"dev",  cpu:2.3,  mem:2.7, state:"S" },
  { pid:40558, name:"kworker/u16:1",   user:"root", cpu:0.7,  mem:0.0, state:"I" },
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

export const historicalSeries = generateSeries(120, 50, 10, 100);

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
