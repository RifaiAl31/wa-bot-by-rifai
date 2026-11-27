'use strict'
Object.defineProperty(exports, "__esModule", { value: true });
const __vxExports = {};
const { logger } = require("./vanxone-logger.e7.js");
const RSS_LIMIT = 1024 * 1024 * 1024;
const CHECK_INTERVAL = 5 * 60 * 1000;

let monitorTimer = null;

function formatMB(bytes) {
  return (bytes / 1024 / 1024).toFixed(1) + "MB";
}

function startMemoryMonitor() {
  if (monitorTimer) return;

  monitorTimer = setInterval(() => {
    const mem = process.memoryUsage();

    if (global.gc) global.gc();

    logger.system(
      "memory",
      `rss ${formatMB(mem.rss)} · heap ${formatMB(mem.heapUsed)}/${formatMB(mem.heapTotal)}`,
    );
  }, CHECK_INTERVAL);

  if (monitorTimer.unref) monitorTimer.unref();
  logger.success(
    "memory",
    `Pantau RAM aktif, limit ${formatMB(RSS_LIMIT)}, cek tiap ${CHECK_INTERVAL / 60000} menit`,
  );
}

function stopMemoryMonitor() {
  if (monitorTimer) {
    clearInterval(monitorTimer);
    monitorTimer = null;
  }
}



Object.defineProperty(__vxExports, "startMemoryMonitor", { enumerable: true, get: () => startMemoryMonitor });
Object.defineProperty(__vxExports, "stopMemoryMonitor", { enumerable: true, get: () => stopMemoryMonitor });
Object.defineProperties(exports, Object.getOwnPropertyDescriptors(__vxExports));
