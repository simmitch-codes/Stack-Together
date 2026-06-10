import os from 'os';
import { statfs } from 'fs/promises';

export const dynamic = 'force-dynamic';

// CPU usage needs two samples; keep the last one across requests so the
// polling client gets a real delta-based percentage.
let lastCpu = null;

function cpuUsagePercent() {
  const cpus = os.cpus();
  const totals = cpus.reduce((acc, c) => {
    for (const k in c.times) acc[k] = (acc[k] || 0) + c.times[k];
    return acc;
  }, {});
  const idle = totals.idle || 0;
  const total = Object.values(totals).reduce((a, b) => a + b, 0);
  let pct = 0;
  if (lastCpu) {
    const dIdle = idle - lastCpu.idle;
    const dTotal = total - lastCpu.total;
    pct = dTotal > 0 ? 100 * (1 - dIdle / dTotal) : 0;
  }
  lastCpu = { idle, total };
  return Math.max(0, Math.min(100, Math.round(pct)));
}

export async function GET() {
  const total = os.totalmem();
  const free = os.freemem();

  let disk = null;
  try {
    const s = await statfs('/');
    disk = {
      total: s.blocks * s.bsize,
      free: s.bfree * s.bsize,
      used: (s.blocks - s.bfree) * s.bsize,
      usage: Math.round(((s.blocks - s.bfree) / s.blocks) * 100),
    };
  } catch {
    // statfs unavailable on this platform; client falls back to placeholder
  }

  const nets = [];
  const ifaces = os.networkInterfaces();
  for (const [name, addrs] of Object.entries(ifaces)) {
    for (const a of addrs || []) {
      if (a.family === 'IPv4' && !a.internal) nets.push({ name, address: a.address });
    }
  }

  return Response.json({
    hostname: os.hostname(),
    platform: os.platform(),
    arch: os.arch(),
    release: os.release(),
    uptime: os.uptime(),
    cpu: {
      model: os.cpus()[0]?.model || 'Unknown CPU',
      cores: os.cpus().length,
      usage: cpuUsagePercent(),
      load: os.loadavg(),
    },
    ram: {
      total,
      free,
      used: total - free,
      usage: Math.round(((total - free) / total) * 100),
    },
    disk,
    network: nets,
    time: Date.now(),
  });
}
