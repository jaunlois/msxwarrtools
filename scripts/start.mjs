import { spawn } from "node:child_process";

const PORT = process.env.PORT || "8080";
const PING_URL = process.env.PING_URL || `http://localhost:${PORT}/`;
const PING_INTERVAL_MS = Number(process.env.PING_INTERVAL_MS) || 10 * 60 * 1000;
const INITIAL_DELAY_MS = 60 * 1000;

const vite = spawn("vite", ["preview"], {
  stdio: "inherit",
  shell: true,
  env: process.env,
});

vite.on("exit", (code) => {
  console.log(`[start] vite preview exited with code ${code}`);
  process.exit(code ?? 0);
});

let intervalHandle;

async function ping() {
  const ts = new Date().toISOString();
  try {
    const res = await fetch(PING_URL, { method: "GET" });
    console.log(`[keep-alive] ${ts} ${PING_URL} -> ${res.status}`);
  } catch (err) {
    console.error(`[keep-alive] ${ts} ${PING_URL} failed:`, err.message);
  }
}

console.log(
  `[keep-alive] starting; first ping in ${INITIAL_DELAY_MS / 1000}s, then every ${PING_INTERVAL_MS / 1000}s -> ${PING_URL}`
);

setTimeout(() => {
  ping();
  intervalHandle = setInterval(ping, PING_INTERVAL_MS);
}, INITIAL_DELAY_MS);

for (const sig of ["SIGINT", "SIGTERM"]) {
  process.on(sig, () => {
    console.log(`[start] received ${sig}, shutting down`);
    if (intervalHandle) clearInterval(intervalHandle);
    vite.kill(sig);
  });
}
