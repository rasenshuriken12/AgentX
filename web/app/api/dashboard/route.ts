import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const supabase = getSupabaseAdmin();
    const { data: devices, error: deviceError } = await supabase.from("devices").select("*").order("last_seen", { ascending: false }).limit(1);
    if (deviceError) throw deviceError;

    const device = devices?.[0] ?? null;
    if (!device) return NextResponse.json({ device: null, metric: null, anomalies: [], diagnosis: null });

    const [metrics, anomalies, diagnoses] = await Promise.all([
      supabase.from("metrics").select("*").eq("device_id", device.id).order("recorded_at", { ascending: false }).limit(1),
      supabase.from("anomalies").select("*").eq("device_id", device.id).order("detected_at", { ascending: false }).limit(10),
      supabase.from("diagnoses").select("*").eq("device_id", device.id).order("created_at", { ascending: false }).limit(1),
    ]);

    if (metrics.error) throw metrics.error;
    if (anomalies.error) throw anomalies.error;
    if (diagnoses.error) throw diagnoses.error;

    return NextResponse.json({ device, metric: metrics.data?.[0] ?? null, anomalies: anomalies.data ?? [], diagnosis: diagnoses.data?.[0] ?? null, serverTime: new Date().toISOString() });
  } catch (error) {
    console.error("dashboard error", error);
    return NextResponse.json({ error: "Dashboard data unavailable" }, { status: 500 });
  }
}
