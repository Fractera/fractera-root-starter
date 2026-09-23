import { NextResponse } from "next/server"

// The watchdog's door. It needs neither a session nor a key and runs this site's
// own code, so a 200 here means the site answers — not only that the process lives.
// `pid` and `startedAt` let the node tell THIS process from any other one that
// happens to answer on the same name.
export const dynamic = "force-dynamic"

const startedAt = new Date().toISOString()

export function GET() {
  return NextResponse.json(
    { ok: true, service: "root", pid: process.pid, startedAt },
    { headers: { "Cache-Control": "no-store" } },
  )
}
