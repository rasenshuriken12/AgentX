import {
  LineChart, Line, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid,
  BarChart, Bar, Cell, Legend,
} from "recharts";
import { Cpu } from "lucide-react";
import PanelShell from "./PanelShell";
import {
  cpuTimes, cpuInfo, coreHeatmap, cpuTotalSeries,
} from "../../data/systemData";

const TIME_LABELS = {
  us: "us — user",
  sy: "sy — system",
  ni: "ni — nice",
  id: "id — idle",
  wa: "wa — iowait",
  hi: "hi — hw IRQ",
  si: "si — sw IRQ",
  st: "st — steal",
};

function heatColor(v) {
  // 0 → green, 50 → yellow, 100 → red
  const h = 120 - (v / 100) * 120;
  return `hsl(${h}, 70%, 55%)`;
}

export default function CPUPanel() {
  const timesData = Object.entries(cpuTimes).map(([k, v]) => ({
    key: k, name: TIME_LABELS[k], value: v,
  }));

  return (
    <PanelShell
      icon={<Cpu className="w-4 h-4 text-agentx-teal" />}
      title="CPU Usage"
      subtitle={`${cpuInfo.physicalCores} physical cores · ${cpuInfo.logicalThreads} logical threads · ${cpuInfo.totalUtilization}% used`}
      badge={
        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-agentx-greenSoft text-agentx-green">
          HEALTHY
        </span>
      }
    >
      {/* KPI row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
        <KPI label="Total"          value={`${cpuInfo.totalUtilization}%`} />
        <KPI label="Physical cores" value={cpuInfo.physicalCores} />
        <KPI label="Logical threads" value={cpuInfo.logicalThreads} />
        <KPI label="Current Clock freq"   value={`${cpuInfo.perCoreFreqMHz[0]} / ${cpuInfo.maxFreqMHz} MHz`} />
        <KPI label="Context switches/s" value={cpuInfo.contextSwitchesPerSec.toLocaleString()} />
        <KPI label="Interrupts/s"   value={cpuInfo.interruptsPerSec.toLocaleString()} />
        <KPI label="Load Avg"        value={cpuInfo.totalUtilization > 0 ? "1.80" : "—"} />
        <KPI label="Steal"          value={`${cpuTimes.st}%`} />
      </div>

      {/* Total utilization chart */}
      <SubTitle>Total utilization (last 60s)</SubTitle>
      <div className="h-40 mb-4">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={cpuTotalSeries} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="t" tick={{ fontSize: 10, fill: "#9ca3af" }} />
            <YAxis domain={[0, 100]} tick={{ fontSize: 10, fill: "#9ca3af" }} />
            <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8 }} />
            <Line type="monotone" dataKey="v" stroke="#0d9488" strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* CPU time breakdown bar chart */}
      <SubTitle>CPU time breakdown — % of total</SubTitle>
      <div className="h-44 mb-4">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={timesData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="key" tick={{ fontSize: 10, fill: "#9ca3af" }} />
            <YAxis tick={{ fontSize: 10, fill: "#9ca3af" }} />
            <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8 }} />
            <Bar dataKey="value" radius={[4, 4, 0, 0]}>
              {timesData.map((d) => {
                const colors = { us:"#0d9488", sy:"#7c3aed", ni:"#f59e0b", id:"#cbd5e1",
                                 wa:"#ef4444", hi:"#06b6d4", si:"#3b82f6", st:"#a855f7" };
                return <Cell key={d.key} fill={colors[d.key] || "#94a3b8"} />;
              })}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs text-agentx-muted mb-4">
        {Object.entries(TIME_LABELS).map(([k, label]) => (
          <span key={k}>{label}</span>
        ))}
      </div>

      {/* Per-core utilization + frequency */}
      <SubTitle>Per-core utilization</SubTitle>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
        {cpuInfo.perCore.map((v, i) => (
          <div key={i} className="p-3 rounded-lg bg-agentx-bg border border-agentx-border">
            <div className="flex items-baseline justify-between">
              <span className="text-xs text-agentx-muted">Core {i}</span>
              <span className="text-sm font-bold">{v}%</span>
            </div>
            <div className="h-1.5 rounded-full bg-agentx-border mt-2 overflow-hidden">
              <div className="h-full rounded-full transition-all"
                   style={{ width: `${v}%`, background: heatColor(v) }} />
            </div>
            <p className="text-[10px] text-agentx-muted mt-2">
              {cpuInfo.perCoreFreqMHz[i]} MHz · max {cpuInfo.maxFreqMHz}
            </p>
          </div>
        ))}
      </div>

      {/* Core heatmap over time */}
      <SubTitle>Core heatmap (cores × last 30 ticks)</SubTitle>
      <div className="overflow-x-auto">
        <table className="border-separate border-spacing-0.5">
          <tbody>
            {coreHeatmap.map((row, c) => (
              <tr key={c}>
                <td className="text-[10px] text-agentx-muted pr-2">Core {c}</td>
                {row.map((v, t) => (
                  <td key={t} style={{ background: heatColor(v) }}
                      className="w-3 h-3 rounded-sm" title={`${v.toFixed(0)}%`} />
                ))}
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
