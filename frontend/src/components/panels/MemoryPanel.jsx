import { PieChart, Pie, Cell, ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, BarChart, Bar } from "recharts";
import { MemoryStick, AlertTriangle } from "lucide-react";
import PanelShell from "./PanelShell";
import {
  memInfo, memBreakdown, swapSeries, topMemoryProcesses,
} from "../../data/systemData";

export default function MemoryPanel() {
  return (
    <PanelShell
      icon={<MemoryStick className="w-4 h-4 text-agentx-blue" />}
      title="Memory Usage"
      subtitle={`${memInfo.usedGB} / ${memInfo.totalGB} GB used · ${memInfo.percent}% · swap ${memInfo.swapPercent}%`}
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Donut */}
        <div className="lg:col-span-1">
          <SubTitle>Breakdown</SubTitle>
          <div className="h-44">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={memBreakdown} cx="50%" cy="50%" innerRadius={45} outerRadius={70} paddingAngle={3} dataKey="value">
                  {memBreakdown.map((d, i) => <Cell key={i} fill={d.color} />)}
                </Pie>
                <Tooltip formatter={(v) => `${v.toFixed(2)} GB`} contentStyle={{ fontSize: 12, borderRadius: 8 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-1 mt-2">
            {memBreakdown.map((d) => (
              <div key={d.name} className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full" style={{ background: d.color }} />
                  {d.name}
                </span>
                <span className="font-semibold">{d.value.toFixed(2)} GB</span>
              </div>
            ))}
          </div>
        </div>

        {/* KPIs + swap chart */}
        <div className="lg:col-span-2">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-4">
            <KPI label="Total"     value={`${memInfo.totalGB} GB`} />
            <KPI label="Used"      value={`${memInfo.usedGB} GB`} />
            <KPI label="Available" value={`${memInfo.availableGB} GB`} />
            <KPI label="Cached"    value={`${memInfo.cachedGB} GB`} />
            <KPI label="Buffers"   value={`${memInfo.buffersGB} GB`} />
            <KPI label="Swap used" value={`${memInfo.swapUsedGB} / ${memInfo.swapTotalGB} GB`} />
            <KPI label="Swap in"   value={`${memInfo.swapInMBps} MB/s`} />
            <KPI label="Swap out"  value={`${memInfo.swapOutMBps} MB/s`} />
          </div>

          <SubTitle>Swap utilization (last 60s)</SubTitle>
          <div className="h-28">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={swapSeries} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="t" tick={{ fontSize: 10, fill: "#9ca3af" }} />
                <YAxis domain={[0, 100]} tick={{ fontSize: 10, fill: "#9ca3af" }} />
                <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8 }} />
                <Line type="monotone" dataKey="v" stroke="#f59e0b" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Top consumers table */}
      <SubTitle>Top 10 memory consumers (VIRT / RES / SHR)</SubTitle>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-xs text-agentx-muted border-b border-agentx-border">
              <th className="text-left  px-3 py-2 font-medium">PID</th>
              <th className="text-left  px-3 py-2 font-medium">Name</th>
              <th className="text-left  px-3 py-2 font-medium">User</th>
              <th className="text-right px-3 py-2 font-medium">VIRT (MB)</th>
              <th className="text-right px-3 py-2 font-medium">RES (MB)</th>
              <th className="text-right px-3 py-2 font-medium">SHR (MB)</th>
              <th className="text-left  px-3 py-2 font-medium">Trend</th>
            </tr>
          </thead>
          <tbody>
            {topMemoryProcesses.map((p) => (
              <tr key={p.pid} className="border-b border-agentx-border last:border-0 hover:bg-agentx-bg/60">
                <td className="px-3 py-2 font-mono text-xs">{p.pid}</td>
                <td className="px-3 py-2 font-medium">{p.name}</td>
                <td className="px-3 py-2 text-agentx-muted">{p.user}</td>
                <td className="px-3 py-2 text-right font-mono">{p.virtMB.toFixed(1)}</td>
                <td className="px-3 py-2 text-right font-mono">{p.resMB.toFixed(1)}</td>
                <td className="px-3 py-2 text-right font-mono">{p.shrMB.toFixed(1)}</td>
                <td className="px-3 py-2">
                  {p.rssTrend === "leak" && (
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-agentx-redSoft text-agentx-red">
                      <AlertTriangle className="w-3 h-3" /> leak?
                    </span>
                  )}
                  {p.rssTrend === "growing" && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-agentx-yellowSoft text-agentx-yellow">
                      growing
                    </span>
                  )}
                  {p.rssTrend === "stable" && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-agentx-greenSoft text-agentx-green">
                      stable
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
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
