'use client';

import { useEffect, useState } from "react";

type Data = {
  device: { name: string; hostname: string; os: string; last_seen: string; status: string } | null;
  metric: { cpu_percent: number; memory_percent: number; disk_percent: number; temperature_c: number | null; load_1m: number | null } | null;
  anomalies: { metric: string; severity: string; message: string; detected_at: string }[];
  diagnosis: { root_cause: string; confidence: number; summary: string; recommendations: string[] } | null;
};

function Metric({ label, value, unit }: { label: string; value: number | null | undefined; unit: string }) {
  return <div className="card"><div className="label">{label}</div><div className="value">{value == null ? "—" : value.toFixed(1)}<span className="unit">{value == null ? "" : unit}</span></div></div>;
}

export default function Home() {
  const [data, setData] = useState<Data | null>(null);
  const [error, setError] = useState(false);

  async function refresh() {
    try {
      const res = await fetch("/api/dashboard", { cache: "no-store" });
      if (!res.ok) throw new Error();
      setData(await res.json()); setError(false);
    } catch { setError(true); }
  }

  useEffect(() => { refresh(); const id = setInterval(refresh, 5000); return () => clearInterval(id); }, []);

  const online = data?.device?.status === "online";
  return <main className="container">
    <header className="header">
      <div><div className="brand">Agent<span>X</span></div><div className="muted">AI-powered PC monitoring & diagnostics</div></div>
      <div className="status"><span className="dot" style={{ background: online ? undefined : "#ff8f8f" }} />{online ? "Agent online" : "Waiting for agent"}</div>
    </header>

    {error && <div className="card section">Unable to reach the monitoring backend. Check Vercel environment variables.</div>}
    {!data?.device && !error && <div className="card section"><div className="value">Waiting for telemetry</div><p className="muted">Start the local AgentX Python process to begin monitoring this PC.</p></div>}

    {data?.device && <>
      <div className="grid">
        <Metric label="CPU" value={data.metric?.cpu_percent} unit="%" />
        <Metric label="Memory" value={data.metric?.memory_percent} unit="%" />
        <Metric label="Disk" value={data.metric?.disk_percent} unit="%" />
        <Metric label="Temperature" value={data.metric?.temperature_c} unit="°C" />
      </div>
      <section className="card section"><div className="label">Device</div><h2>{data.device.name}</h2><div className="muted">{data.device.hostname} · {data.device.os}</div><div className="footer">Last seen: {new Date(data.device.last_seen).toLocaleString()}</div></section>
      <section className="card section"><h2>Recent anomalies</h2>{data.anomalies.length === 0 ? <div className="empty">No anomalies detected.</div> : data.anomalies.map((a, i) => <div className="row" key={`${a.detected_at}-${i}`}><div><b>{a.metric}</b><div className="muted">{a.message}</div></div><span className={`badge ${a.severity}`}>{a.severity}</span></div>)}</section>
      <section className="card section"><h2>Latest diagnosis</h2>{data.diagnosis ? <><div><b>{data.diagnosis.root_cause}</b> · {(data.diagnosis.confidence * 100).toFixed(0)}% confidence</div><p className="muted">{data.diagnosis.summary}</p><ul>{data.diagnosis.recommendations.map((r, i) => <li key={i}>{r}</li>)}</ul></> : <div className="empty">Diagnosis will appear when an anomaly is detected.</div>}</section>
    </>}
    <div className="footer">AgentX prototype · polling every 5 seconds · deterministic anomaly engine + evidence-based diagnosis.</div>
  </main>;
}
