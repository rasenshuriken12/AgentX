import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer, Legend } from "recharts";
import { Thermometer, Fan, BatteryCharging, AlertTriangle } from "lucide-react";
import PanelShell from "./PanelShell";
import {
  tempSensors, fanSensors, battery, tempSeries, cpuLoadSeries, throttleDetected,
} from "../../data/systemData";

const tempColor = (v, crit) => {
  const r = v / crit;
  if (r >= 0.9) return "#dc2626";
  if (r >= 0.75) return "#f59e0b";
  return "#16a34a";
};

export default function TempPanel() {
  const hottest = tempSensors.reduce((a, b) => (a.value > b.value ? a : b));

  return (
    <PanelShell
      icon={<Thermometer className="w-4 h-4 text-agentx-red" />}
      title="CPU Temperature"
      subtitle={`Hottest: ${hottest.label} ${hottest.value}${hottest.unit} · headroom ${hottest.critical - hottest.value}${hottest.unit}`}
      badge={
        throttleDetected ? (
          <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-agentx-redSoft text-agentx-red">
            <AlertTriangle className="w-3 h-3" /> THROTTLING
          </span>
        ) : (
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-agentx-greenSoft text-agentx-green">
            NORMAL
          </span>
        )
      }
    >
      {/* 8 sensor cards: 4 per row on desktop */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
        {tempSensors.map((s) => {
          const pct = Math.min(100, (s.value / s.critical) * 100);
          const color = tempColor(s.value, s.critical);
          return (
            <div key={s.label} className="p-3 rounded-lg bg-agentx-bg border border-agentx-border">
              <div className="flex items-baseline justify-between gap-2">
                <span className="text-xs text-agentx-muted truncate">{s.label}</span>
                <span className="text-sm font-bold flex-shrink-0" style={{ color }}>
                  {s.value}{s.unit}
                </span>
              </div>
              <div className="h-1.5 rounded-full bg-agentx-border mt-2 overflow-hidden">
                <div className="h-full rounded-full" style={{ width: `${pct}%`, background: color }} />
              </div>
              <p className="text-[10px] text-agentx-muted mt-2">
                Critical at {s.critical}{s.unit}
              </p>
            </div>
          );
        })}
      </div>

      {/* Correlation chart */}
      <SubTitle>Temperature vs CPU load — last 60s</SubTitle>
      <div className="h-40 mb-4">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="t" type="number" domain={[0, 59]} tick={{ fontSize: 10, fill: "#9ca3af" }} />
            <YAxis yAxisId="left"  domain={[30, 100]} tick={{ fontSize: 10, fill: "#9ca3af" }} />
            <YAxis yAxisId="right" orientation="right" domain={[0, 100]} tick={{ fontSize: 10, fill: "#9ca3af" }} />
            <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8 }} />
            <Legend wrapperStyle={{ fontSize: 11 }} />
            <Line yAxisId="left"  name="CPU temp (°C)" data={tempSeries}    type="monotone" dataKey="v" stroke="#dc2626" strokeWidth={2} dot={false} />
            <Line yAxisId="right" name="CPU load (%)"  data={cpuLoadSeries} type="monotone" dataKey="v" stroke="#0d9488" strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Fans + battery */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <SubTitle>Fans (RPM + temperature)</SubTitle>
          <div className="space-y-2">
            {fanSensors.map((f) => {
              const pct = Math.min(100, (f.rpm / f.max) * 100);
              const color = f.tempC >= 60 ? "#dc2626" : f.tempC >= 50 ? "#f59e0b" : "#16a34a";
              return (
                <div key={f.label} className="p-3 rounded-lg bg-agentx-bg border border-agentx-border">
                  <div className="flex items-center justify-between gap-2">
                    <span className="flex items-center gap-2 text-xs text-agentx-muted">
                      <Fan className="w-3 h-3" /> {f.label}
                    </span>
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-bold">
                        {f.rpm} <span className="text-xs text-agentx-muted">RPM</span>
                      </span>
                      <span className="text-sm font-bold" style={{ color }}>
                        {f.tempC}°C
                      </span>
                    </div>
                  </div>
                  <div className="h-1.5 rounded-full bg-agentx-border mt-2 overflow-hidden">
                    <div className="h-full rounded-full bg-agentx-teal" style={{ width: `${pct}%` }} />
                  </div>
                  <p className="text-[10px] text-agentx-muted mt-1">Max {f.max} RPM</p>
                </div>
              );
            })}
          </div>
        </div>

        <div>
          <SubTitle>Battery</SubTitle>
          {battery.present ? (
            <div className="p-3 rounded-lg bg-agentx-bg border border-agentx-border">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-xs text-agentx-muted">
                  <BatteryCharging className="w-3 h-3" /> {battery.pluggedIn ? "Charging" : "On battery"}
                </span>
                <span className="text-sm font-bold">{battery.percent}%</span>
              </div>
              <div className="h-1.5 rounded-full bg-agentx-border mt-2 overflow-hidden">
                <div className="h-full rounded-full bg-agentx-green" style={{ width: `${battery.percent}%` }} />
              </div>
            </div>
          ) : (
            <p className="text-xs text-agentx-muted">No battery detected</p>
          )}
        </div>
      </div>
    </PanelShell>
  );
}

function SubTitle({ children }) {
  return <h4 className="text-xs font-semibold text-agentx-muted uppercase tracking-wider mt-4 mb-2">{children}</h4>;
}
