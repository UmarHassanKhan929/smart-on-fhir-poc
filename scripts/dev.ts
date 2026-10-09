import { spawn, type ChildProcess } from "node:child_process";

// Spins up all three services with prefixed, colorized output.
// If any service exits, everything shuts down — Ctrl+C stops all.
const SERVICES = [
  { name: "fhir",   file: "packages/fhir-server/server.ts",   color: "\x1b[36m" }, // cyan
  { name: "auth",   file: "packages/auth-server/server.ts",   color: "\x1b[33m" }, // yellow
  { name: "client", file: "packages/client-app/server.ts",    color: "\x1b[35m" }, // magenta
];
const RESET = "\x1b[0m";

const tsxCli = require.resolve("tsx/cli");

const children: ChildProcess[] = [];
let shuttingDown = false;

function prefix(name: string, color: string, chunk: Buffer): void {
  const text = chunk.toString().trimEnd();
  if (!text) return;
  for (const line of text.split(/\r?\n/)) {
    process.stdout.write(`${color}[${name}]${RESET} ${line}\n`);
  }
}

function shutdown(code = 0): void {
  if (shuttingDown) return;
  shuttingDown = true;
  for (const child of children) child.kill();
  process.exit(code);
}

console.log("Starting all services (Ctrl+C to stop)...\n");

for (const { name, file, color } of SERVICES) {
  const child = spawn(process.execPath, [tsxCli, file], {
    stdio: ["ignore", "pipe", "pipe"],
  });
  children.push(child);
  child.stdout!.on("data", (chunk: Buffer) => prefix(name, color, chunk));
  child.stderr!.on("data", (chunk: Buffer) => prefix(name, color, chunk));
  child.on("exit", (code) => {
    if (shuttingDown) return;
    console.log(`\n[${name}] exited (code ${code}) — shutting down all services.`);
    shutdown(code ?? 1);
  });
}

process.on("SIGINT", () => shutdown(0));
process.on("SIGTERM", () => shutdown(0));
process.on("exit", () => {
  for (const child of children) child.kill();
});
