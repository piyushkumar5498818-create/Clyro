import { db } from "../src/lib/store";

interface LoadTestResult {
  concurrency: number;
  totalRequests: number;
  successfulRequests: number;
  duplicateOrExpectedRejections: number;
  unexpectedFailures: number;
  p50Ms: number;
  p95Ms: number;
  p99Ms: number;
  avgMs: number;
}

async function simulateCheckIns(concurrency: number): Promise<LoadTestResult> {
  const activityId = "a0000000-0000-0000-0000-000000000001";
  const token = db.generateAttendanceToken(activityId, "u0000000-0000-0000-0000-000000000005", 120);

  const latencies: number[] = [];
  let successfulRequests = 0;
  let duplicateOrExpectedRejections = 0;
  let unexpectedFailures = 0;

  const tasks: Promise<void>[] = [];

  for (let i = 0; i < concurrency; i++) {
    // Generate distinct simulated student users for load test
    const simulatedUserId = `sim_student_${i}_${Date.now()}`;

    tasks.push(
      (async () => {
        const start = performance.now();
        try {
          db.checkInStudent(activityId, simulatedUserId, token.tokenCode, "qr_code");
          successfulRequests++;
        } catch (err: any) {
          if (err.message.includes("already recorded") || err.message.includes("expired")) {
            duplicateOrExpectedRejections++;
          } else {
            unexpectedFailures++;
          }
        } finally {
          const duration = performance.now() - start;
          latencies.push(duration);
        }
      })()
    );
  }

  await Promise.all(tasks);

  latencies.sort((a, b) => a - b);
  const p50 = latencies[Math.floor(latencies.length * 0.50)];
  const p95 = latencies[Math.floor(latencies.length * 0.95)];
  const p99 = latencies[Math.floor(latencies.length * 0.99)];
  const avg = latencies.reduce((acc, curr) => acc + curr, 0) / latencies.length;

  return {
    concurrency,
    totalRequests: concurrency,
    successfulRequests,
    duplicateOrExpectedRejections,
    unexpectedFailures,
    p50Ms: Number(p50.toFixed(2)),
    p95Ms: Number(p95.toFixed(2)),
    p99Ms: Number(p99.toFixed(2)),
    avgMs: Number(avg.toFixed(2)),
  };
}

async function runLoadTests() {
  console.log("=== CLYRO HIGH-CONCURRENCY CHECK-IN LOAD TEST (SATURDAY MORNING SPIKE) ===");
  console.log("Requirement: 500 concurrent check-ins with p95 < 1000ms\n");

  const concurrencyTiers = [100, 300, 500];
  const results: LoadTestResult[] = [];

  for (const tier of concurrencyTiers) {
    const res = await simulateCheckIns(tier);
    results.push(res);
    console.log(
      `Tier: ${res.concurrency.toString().padEnd(4)} concurrent | ` +
      `Success: ${res.successfulRequests.toString().padEnd(4)} | ` +
      `p50: ${res.p50Ms.toFixed(2)}ms | ` +
      `p95: ${res.p95Ms.toFixed(2)}ms | ` +
      `p99: ${res.p99Ms.toFixed(2)}ms | ` +
      `Errors: ${res.unexpectedFailures}`
    );
  }

  console.log("\nLoad Test Summary Table:");
  console.table(results);

  const p95Pass = results.every((r) => r.p95Ms < 1000);
  const errorPass = results.every((r) => r.unexpectedFailures === 0);

  if (p95Pass && errorPass) {
    console.log("\n[SUCCESS] All concurrency tiers passed scalability requirements (p95 < 1000ms, 0% unexpected errors).");
  } else {
    console.error("\n[FAILURE] Concurrency test failed threshold requirements.");
    process.exit(1);
  }
}

runLoadTests().catch((err) => {
  console.error("Load test runner failed:", err);
  process.exit(1);
});
