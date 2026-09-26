import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer, Legend } from "recharts";
import { Network } from "lucide-react";
import PanelShell from "./PanelShell";
import {
  netInfo, netDownSeries, netUpSeries, netInterfaces,
  topTalkers, newExternalIps,
} from "../../data/systemData";

/* Byte formatting helper */
function fmtBytes(bytes) {
  if (!bytes && bytes !== 0) return "—";
  const gb = bytes / (1024 ** 3);
  const mb = bytes / (1024 ** 2);
  if (gb >= 1) return `${gb.toFixed(2)} GiB`;
  return `${mb.toFixed(1)} MiB`;
}

export default function NetworkPanel() {
  return (
    <PanelShell
      icon={<Network className="w-4 h-4 text-agentx-teal" />}
      title="Network Throughput"
      subtitle={`↓ ${netInfo.downloadMbps} Mbps · ↑ ${netInfo.uploadMbps} Mbps · ${netInfo.established} established`}
    >
      {/* Row 1: rates */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-3">
        <KPI label="Download"        value={`${netInfo.downloadMbps} Mbps`} />
        <KPI label="Upload"          value={`${netInfo.uploadMbps} Mbps`} />
        <KPI label="Established"     value={netInfo.established} />
        <KPI label="Listening"       value={netInfo.listening} />
        <KPI label="TIME_WAIT"       value={netInfo.timeWait} />
        <KPI label="External conns"  value={netInfo.externalConnections} />
      </div>

      {/* Row 2: totals (bytes + packets) */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
        <KPI label="Bytes received"  value={fmtBytes(netInfo.totalBytesRecv)} />
        <KPI label="Bytes sent"      value={fmtBytes(netInfo.totalBytesSent)} />
        <KPI label="Packets received" value={netInfo.totalPacketsRecv.toLocaleString()} />
        <KPI label="Packets sent"    value={netInfo.totalPacketsSent.toLocaleString()} />
      </div>

      {/* Live chart */}
      <SubTitle>Inbound / outbound (Mbps, last 60s)</SubTitle>
      <div className="h-40 mb-4">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="t" type="number" domain={[0, 59]} tick={{ fontSize: 10, fill: "#9ca3af" }} />
            <YAxis domain={[0, 50]} tick={{ fontSize: 10, fill: "#9ca3af" }} />
            <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8 }} />
            <Legend wrapperStyle={{ fontSize: 11 }} />
            <Line name="Down" data={netDownSeries} type="monotone" dataKey="v" stroke="#0d9488" strokeWidth={2} dot={false} />
            <Line name="Up"   data={netUpSeries}   type="monotone" dataKey="v" stroke="#7c3aed" strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Per-interface — scrollable on mobile */}
      <SubTitle>Per-interface breakdown</SubTitle>
      <div className="overflow-x-auto -mx-5 px-5 mb-4">
        <table className="w-full text-sm min-w-[1000px]">
          <thead>
            <tr className="text-xs text-agentx-muted border-b border-agentx-border">
              <th className="text-left px-3 py-2 font-medium">Interface</th>
              <th className="text-left px-3 py-2 font-medium">State</th>
              <th className="text-left px-3 py-2 font-medium">IP</th>
              <th className="text-right px-3 py-2 font-medium">↓ Mbps</th>
              <th className="text-right px-3 py-2 font-medium">↑ Mbps</th>
              <th className="text-right px-3 py-2 font-medium">Bytes recv</th>
              <th className="text-right px-3 py-2 font-medium">Bytes sent</th>
              <th className="text-right px-3 py-2 font-medium">Pkts recv</th>
              <th className="text-right px-3 py-2 font-medium">Pkts sent</th>
              <th className="text-right px-3 py-2 font-medium">Drops</th>
              <th className="text-right px-3 py-2 font-medium">Errors</th>
            </tr>
          </thead>
          <tbody>
            {netInterfaces.map((n) => (
              <tr key={n.name} className="border-b border-agentx-border last:border-0 hover:bg-agentx-bg/60">
                <td className="px-3 py-2 font-medium">{n.name}</td>
                <td className="px-3 py-2">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    n.state === "up" ? "bg-agentx-greenSoft text-agentx-green" : "bg-agentx-redSoft text-agentx-red"
                  }`}>{n.state.toUpperCase()}</span>
                </td>
                <td className="px-3 py-2 font-mono text-xs">{n.ip}</td>
                <td className="px-3 py-2 text-right font-mono">{n.downMbps.toFixed(2)}</td>
                <td className="px-3 py-2 text-right font-mono">{n.upMbps.toFixed(2)}</td>
                <td className="px-3 py-2 text-right font-mono">{fmtBytes(n.bytesRecv)}</td>
                <td className="px-3 py-2 text-right font-mono">{fmtBytes(n.bytesSent)}</td>
                <td className="px-3 py-2 text-right font-mono">{n.packetsRecv.toLocaleString()}</td>
                <td className="px-3 py-2 text-right font-mono">{n.packetsSent.toLocaleString()}</td>
                <td className="px-3 py-2 text-right font-mono">
                  <span className={n.dropsOut > 0 ? "text-agentx-yellow" : ""}>
                    {n.dropsIn + n.dropsOut}
                  </span>
                </td>
                <td className="px-3 py-2 text-right font-mono">{n.errorsIn + n.errorsOut}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Top talkers + New IPs */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div>
          <SubTitle>Top talkers (by traffic)</SubTitle>
          <div className="overflow-x-auto -mx-5 px-5">
            <table className="w-full text-sm min-w-[480px]">
              <thead>
                <tr className="text-xs text-agentx-muted border-b border-agentx-border">
                  <th className="text-left px-3 py-2 font-medium">PID</th>
                  <th className="text-left px-3 py-2 font-medium">Name</th>
                  <th className="text-right px-3 py-2 font-medium">↓ Mbps</th>
                  <th className="text-right px-3 py-2 font-medium">↑ Mbps</th>
                  <th className="text-right px-3 py-2 font-medium">Conns</th>
                </tr>
              </thead>
              <tbody>
                {topTalkers.map((t) => (
                  <tr key={t.pid} className="border-b border-agentx-border last:border-0 hover:bg-agentx-bg/60">
                    <td className="px-3 py-2 font-mono text-xs">{t.pid}</td>
                    <td className="px-3 py-2 font-medium">{t.name}</td>
                    <td className="px-3 py-2 text-right font-mono">{t.downMbps.toFixed(2)}</td>
                    <td className="px-3 py-2 text-right font-mono">{t.upMbps.toFixed(2)}</td>
                    <td className="px-3 py-2 text-right font-mono">{t.connections}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div>
          <SubTitle>New external IPs contacted this session</SubTitle>
          <div className="space-y-2">
            {newExternalIps.map((ip) => (
              <div key={ip.ip} className="p-3 rounded-lg bg-agentx-bg border border-agentx-border">
                <div className="flex items-baseline justify-between gap-2">
                  <span className="font-mono text-xs truncate">{ip.ip}</span>
                  <span className="text-[10px] text-agentx-muted flex-shrink-0">{ip.firstSeen}</span>
                </div>
                <p className="text-xs text-agentx-muted mt-1 truncate">
                  {ip.hostname} · {ip.country} · via <span className="font-semibold text-agentx-text">{ip.process}</span>
                </p>
              </div>
            ))}
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
