import { NextResponse } from "next/server";

export function GET() {
  return NextResponse.json({ service: "AgentX API", version: "0.1.0", status: "ready" });
}
