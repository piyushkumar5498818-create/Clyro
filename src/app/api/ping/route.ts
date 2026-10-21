export const runtime = "edge";
export const dynamic = "force-dynamic";

export async function GET() {
  const timestamp = Date.now();
  return new Response(
    JSON.stringify({
      status: "healthy",
      service: "GitClub Edge Telemetry",
      serverTime: new Date().toISOString(),
      timestamp,
      targetLatency: "< 200ms",
      region: process.env.VERCEL_REGION || "edge-global",
    }),
    {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "public, max-age=0, s-maxage=2, stale-while-revalidate=10",
        "X-Edge-Performance": "optimized-sub-200ms",
        "Access-Control-Allow-Origin": "*",
      },
    }
  );
}
