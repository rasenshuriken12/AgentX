import { LineChart, Line, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from "recharts";
import { MonitorPlay } from "lucide-react";
import PanelShell from "./PanelShell";
import {
  gpuInfo, gpuUtilSeries, gpuMemUtilSeries, gpuClockSeries, gpuPowerSeries,
} from "../../data/systemData";

export default function GPUPanel() {
  return (
    <PanelShell
      icon={<MonitorPlay className="w-4 h-4 text-agentx-purple" />}
      title="GPU Usage"
      subtitle={`${gpuInfo.name} · ${gpuInfo.driver}`}
    >
      {/* KPI grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
        <KPI label="Utilization"     value={`${gpuInfo.utilization}%`} />
        <KPI label="Memory util"     value={`${gpuInfo.memoryUtilization}%`} />
        <KPI label="VRAM"            value={`${gpuInfo.vramUsedGB} / ${gpuInfo.vramTotalGB} GB`} />
        <KPI label="Temperature"     value={`${gpuInfo.temperature} °C`} />
        <KPI label="Power draw"      value={`${gpuInfo.powerDrawW} / ${gpuInfo.powerLimitW} W`} />
        <KPI label="Fan"             value={`${gpuInfo.fanPercent}%`} />
        <KPI label="Graphics clock"  value={`${gpuInfo.graphicsClockMHz} / ${gpuInfo.maxGraphicsClockMHz} MHz`} />
        <KPI label="Memory clock"    value={`${gpuInfo.memoryClockMHz} / ${gpuInfo.maxMemoryClockMHz} MHz`} />
        <KPI label="Encoder (NVEnc)" value={`${gpuInfo.encoderUtil}%`} />
        <KPI label="Decoder"         value={`${gpuInfo.decoderUtil}%`} />
        <KPI label="PCIe RX"         value={`${gpuInfo.pcieRxMBps} MB/s`} />
        <KPI label="PCIe TX"         value={`${gpuInfo.pcieTxMBps} MB/s`} />
      </div>

      {/* Dual util chart */}
      <SubTitle>Compute & memory utilization (last 60s)</SubTitle>
      <div className="h-40 mb-4">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="t" tick={{ fontSize: 10, fill: "#9ca3af" }}
                   type="number" domain={[0, 59]} />
            <YAxis domain={[0, 100]} tick={{ fontSize: 10, fill: "#9ca3af" }} />
            <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8 }} />
            <Legend wrapperStyle={{ fontSize: 11 }} />
            <Line name="Compute" data={gpuUtilSeries}    type="monotone" dataKey="v" stroke="#7c3aed" strokeWidth={2} dot={false} />
            <Line name="Memory"  data={gpuMemUtilSeries} type="monotone" dataKey="v" stroke="#2563eb" strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Clock + power */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <SubTitle>Graphics clock (MHz)</SubTitle>
          <div className="h-32">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={gpuClockSeries} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="t" tick={{ fontSize: 10, fill: "#9ca3af" }} />
                <YAxis domain={[500, 1000]} tick={{ fontSize: 10, fill: "#9ca3af" }} />
                <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8 }} />
                <Line type="monotone" dataKey="v" stroke="#16a34a" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div>
          <SubTitle>Power draw (W)</SubTitle>
          <div className="h-32">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={gpuPowerSeries} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="t" tick={{ fontSize: 10, fill: "#9ca3af" }} />
                <YAxis domain={[0, 20]} tick={{ fontSize: 10, fill: "#9ca3af" }} />
                <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8 }} />
                <Line type="monotone" dataKey="v" stroke="#f59e0b" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
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
