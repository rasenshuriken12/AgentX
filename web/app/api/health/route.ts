import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase";

export async function GET() {
  try {
    const supabase = getSupabaseAdmin();
    const { error } = await supabase.from("devices").select("id").limit(1);
    if (error) throw error;
    return NextResponse.json({ ok: true, service: "agentx-api" });
  } catch {
    return NextResponse.json({ ok: false, service: "agentx-api" }, { status: 503 });
  }
}
