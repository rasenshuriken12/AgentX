import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer, Legend } from "recharts";
import { HardDrive } from "lucide-react";
import PanelShell from "./PanelShell";
import {
  diskInfo, diskReadSeries, diskWriteSeries, diskIopsSeries, iowaitSeries,
  diskPartitions, topDiskProcesses,
} from "../../data/systemData";

export default function DiskPanel() {
  return (
    <PanelShell
      icon={<HardDrive className="w-4 h-4 text-agentx-green" />}
      title="Disk I/O"
      subtitle={`Read ${diskInfo.readMBps} MB/s · Write ${diskInfo.writeMBps} MB/s · Busy ${diskInfo.busyPercent}%`}
    >
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
        <KPI label="Read"         value={`${diskInfo.readMBps} MB/s`} />
        <KPI label="Write"        value={`${diskInfo.writeMBps} MB/s`} />
        <KPI label="Read IOPS"    value={diskInfo.readIOPS} />
        <KPI label="Write IOPS"   value={diskInfo.writeIOPS} />
        <KPI label="Avg req size" value={`${diskInfo.avgRequestSizeKB} KB`} />
        <KPI label="Avg latency"  value={`${diskInfo.avgLatencyMs} ms`} />
        <KPI label="Busy"         value={`${diskInfo.busyPercent}%`} />
        <KPI label="Queue depth"  value="—" />
      </div>

      {/* Throughput chart */}
      <SubTitle>Read + Write throughput (MB/s, last 60s)</SubTitle>
      <div className="h-40 mb-4">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="t" type="number" domain={[0, 59]} tick={{ fontSize: 10, fill: "#9ca3af" }} />
            <YAxis domain={[0, 100]} tick={{ fontSize: 10, fill: "#9ca3af" }} />
            <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8 }} />
            <Legend wrapperStyle={{ fontSize: 11 }} />
            <Line name="Read"  data={diskReadSeries}  type="monotone" dataKey="v" stroke="#2563eb" strokeWidth={2} dot={false} />
            <Line name="Write" data={diskWriteSeries} type="monotone" dataKey="v" stroke="#dc2626" strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* IOPS + iowait */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <SubTitle>IOPS (reads + writes / s)</SubTitle>
          <div className="h-32">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={diskIopsSeries} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="t" tick={{ fontSize: 10, fill: "#9ca3af" }} />
                <YAxis tick={{ fontSize: 10, fill: "#9ca3af" }} />
                <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8 }} />
                <Line type="monotone" dataKey="v" stroke="#7c3aed" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div>
          <SubTitle>CPU iowait % (correlation)</SubTitle>
          <div className="h-32">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={iowaitSeries} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="t" tick={{ fontSize: 10, fill: "#9ca3af" }} />
                <YAxis domain={[0, 10]} tick={{ fontSize: 10, fill: "#9ca3af" }} />
                <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8 }} />
                <Line type="monotone" dataKey="v" stroke="#f59e0b" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Partitions */}
      <SubTitle>Partitions</SubTitle>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
        {diskPartitions.map((p) => (
          <div key={p.mount} className="p-3 rounded-lg bg-agentx-bg border border-agentx-border">
            <div className="flex items-baseline justify-between">
              <span className="text-sm font-bold">{p.mount}</span>
              <span className="text-xs text-agentx-muted">{p.device} · {p.fstype}</span>
            </div>
            <div className="h-1.5 rounded-full bg-agentx-border mt-2 overflow-hidden">
              <div
                className="h-full rounded-full"
                style={{
                  width: `${p.percent}%`,
                  background: p.percent > 85 ? "#dc2626" : p.percent > 70 ? "#f59e0b" : "#16a34a",
                }}
              />
            </div>
            <p className="text-[10px] text-agentx-muted mt-1">
              {p.usedGB} / {p.totalGB} GB · {p.percent}%
            </p>
          </div>
        ))}
      </div>

      {/* Per-process I/O */}
      <SubTitle>Per-process disk I/O (Linux: proc.io_counters)</SubTitle>
      <table className="w-full text-sm">
        <thead>
          <tr className="text-xs text-agentx-muted border-b border-agentx-border">
            <th className="text-left px-3 py-2 font-medium">PID</th>
            <th className="text-left px-3 py-2 font-medium">Name</th>
            <th className="text-right px-3 py-2 font-medium">Read (MB/s)</th>
            <th className="text-right px-3 py-2 font-medium">Write (MB/s)</th>
          </tr>
        </thead>
        <tbody>
          {topDiskProcesses.map((p) => (
            <tr key={p.pid} className="border-b border-agentx-border last:border-0 hover:bg-agentx-bg/60">
              <td className="px-3 py-2 font-mono text-xs">{p.pid}</td>
              <td className="px-3 py-2 font-medium">{p.name}</td>
              <td className="px-3 py-2 text-right font-mono">{p.readMBps.toFixed(2)}</td>
              <td className="px-3 py-2 text-right font-mono">{p.writeMBps.toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </PanelShell>
  );
}

function KPI({ label, value }) {
  return (
    <div className="p-3 rounded-lg bg-agentx-bg border border-agentx-border">
      <p className="text-[10px] uppercase tracking-wider text-agentx-muted">{label}</p>
      <p className="text-sm font-bold mt-1">{value}</p>
    </div>
  );
}
function SubTitle({ children }) {
  return <h4 className="text-xs font-semibold text-agentx-muted uppercase tracking-wider mt-4 mb-2">{children}</h4>;
}
