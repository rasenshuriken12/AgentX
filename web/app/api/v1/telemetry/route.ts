import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase";

export const runtime = "nodejs";

const METRICS = [
  { key: "cpu_percent", label: "CPU", hardLimit: 90 },
  { key: "memory_percent", label: "Memory", hardLimit: 90 },
  { key: "disk_percent", label: "Disk", hardLimit: 95 },
  { key: "temperature_c", label: "Temperature", hardLimit: 85 },
] as const;

type Payload = {
  device: { id: string; name: string; hostname: string; os?: string; agent_version?: string };
  metrics: Record<string, number | null>;
};

function severityFor(value: number, baseline: number | null, std: number | null, hardLimit: number) {
  if (value >= hardLimit) return value >= hardLimit + 5 ? "critical" : "high";
  if (baseline !== null && std !== null && std > 0) {
    const z = Math.abs((value - baseline) / std);
    if (z >= 3) return "high";
    if (z >= 2.5) return "medium";
  }
  return null;
}

export async function POST(request: Request) {
  const expected = process.env.AGENTX_INGEST_KEY;
  const auth = request.headers.get("authorization");
  if (!expected || auth !== `Bearer ${expected}`) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = (await request.json()) as Payload;
    if (!body.device?.id || !body.device?.name || !body.metrics) return NextResponse.json({ error: "Invalid telemetry payload" }, { status: 400 });

    const supabase = getSupabaseAdmin();
    const now = new Date().toISOString();
    const { error: deviceError } = await supabase.from("devices").upsert({ ...body.device, status: "online", last_seen: now }, { onConflict: "id" });
    if (deviceError) throw deviceError;

    const { data: metric, error: metricError } = await supabase.from("metrics").insert({ device_id: body.device.id, recorded_at: now, ...body.metrics }).select().single();
    if (metricError) throw metricError;

    const anomalies: Array<Record<string, unknown>> = [];
    for (const item of METRICS) {
      const value = body.metrics[item.key];
      if (typeof value !== "number") continue;

      const { data: history, error: historyError } = await supabase.from("metrics").select(item.key).eq("device_id", body.device.id).order("recorded_at", { ascending: false }).limit(60);
      if (historyError) throw historyError;
      const values = (history ?? []).map((row) => Number((row as Record<string, unknown>)[item.key])).filter(Number.isFinite).slice(1);
      const baseline = values.length >= 10 ? values.reduce((a, b) => a + b, 0) / values.length : null;
      const std = values.length >= 10 && baseline !== null ? Math.sqrt(values.reduce((sum, x) => sum + (x - baseline) ** 2, 0) / values.length) : null;
      const severity = severityFor(value, baseline, std, item.hardLimit);
      if (!severity) continue;

      const score = std && baseline !== null ? Math.abs((value - baseline) / std) : null;
      const anomaly = { device_id: body.device.id, metric_id: metric.id, metric: item.key, severity, score, value, baseline, message: `${item.label} is elevated at ${value.toFixed(1)}` };
      const { data: saved, error: anomalyError } = await supabase.from("anomalies").insert(anomaly).select().single();
      if (anomalyError) throw anomalyError;
      anomalies.push(saved);
    }

    if (anomalies.length > 0) {
      const top = anomalies[0];
      const metric = String(top.metric);
      const rootCause = metric === "temperature_c" ? "Thermal stress" : metric === "cpu_percent" ? "CPU saturation" : metric === "memory_percent" ? "Memory pressure" : "Disk capacity pressure";
      const recommendations = metric === "temperature_c" ? ["Check airflow and fan activity", "Inspect sustained CPU load"] : metric === "cpu_percent" ? ["Inspect top CPU-consuming processes", "Check whether the load is sustained"] : metric === "memory_percent" ? ["Inspect memory-heavy processes", "Check for sustained memory growth"] : ["Remove unnecessary files", "Check large application caches"];
      await supabase.from("diagnoses").insert({ device_id: body.device.id, anomaly_id: top.id, root_cause: rootCause, confidence: 0.78, summary: `${rootCause} is the leading explanation for the ${metric} anomaly.`, evidence: anomalies, recommendations });
    }

    return NextResponse.json({ ok: true, metricId: metric.id, anomalies });
  } catch (error) {
    console.error("telemetry ingestion error", error);
    return NextResponse.json({ error: "Telemetry ingestion failed" }, { status: 500 });
  }
}
