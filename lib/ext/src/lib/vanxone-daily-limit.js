'use strict'
Object.defineProperty(exports, "__esModule", { value: true });
const __vxExports = {};
const { resolveAnyLidToJid } = require("./vanxone-lid.e4.js");

const DAILY_FEATURE_LIMIT = 10;
const DAILY_LIMIT_STORE_KEY = "dailyFeatureLimits";

// Command informasi penting tetap bisa dipakai untuk melihat pemakaian/akses bot.
const DAILY_LIMIT_EXEMPT_COMMANDS = new Set([
  "menu", "allmenu", "fullmenu", "am", "allcommand", "semua", "help",
  "bot", "statusbot", "energi", "cekenergi", "myenergi", "energy",
  "limit", "ceklimit",
]);

function isDailyLimitExemptCommand(command) {
  return DAILY_LIMIT_EXEMPT_COMMANDS.has(String(command || "").toLowerCase());
}

function getJakartaDateKey(date = new Date()) {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Jakarta",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(date);
  const values = Object.fromEntries(parts.map(({ type, value }) => [type, value]));
  return `${values.year}-${values.month}-${values.day}`;
}

function getIdentity(jid, participants = []) {
  const resolved = resolveAnyLidToJid(jid, participants) || jid;
  const raw = String(resolved || jid || "").split("@")[0];
  const digits = raw.replace(/\D/g, "");
  if (!digits) return `jid:${String(jid || "unknown").toLowerCase()}`;
  // Nomor telepon normal maksimal 15 digit; angka yang lebih panjang biasanya LID.
  return digits.length > 15 ? `lid:${digits}` : digits;
}

function readStore(db) {
  const store = db.setting(DAILY_LIMIT_STORE_KEY);
  return store && typeof store === "object" && !Array.isArray(store) ? store : {};
}

function getDailyFeatureStatus(db, jid, participants = []) {
  const identity = getIdentity(jid, participants);
  const store = readStore(db);
  const previous = store[identity] && typeof store[identity] === "object"
    ? store[identity]
    : {};
  const date = getJakartaDateKey();
  const used = previous.date === date
    ? Math.max(0, Math.floor(Number(previous.used) || 0))
    : 0;

  return {
    identity,
    date,
    used,
    limit: DAILY_FEATURE_LIMIT,
    remaining: Math.max(0, DAILY_FEATURE_LIMIT - used),
    unlimited: previous.unlimited === true,
    unlimitedAt: previous.unlimitedAt || null,
  };
}

function consumeDailyFeature(db, jid, participants = []) {
  const status = getDailyFeatureStatus(db, jid, participants);
  if (status.unlimited || status.remaining <= 0) return { ...status, allowed: status.unlimited };

  const store = readStore(db);
  const previous = store[status.identity] && typeof store[status.identity] === "object"
    ? store[status.identity]
    : {};
  store[status.identity] = {
    ...previous,
    date: status.date,
    used: status.used + 1,
  };
  db.setting(DAILY_LIMIT_STORE_KEY, store);

  return {
    ...status,
    used: status.used + 1,
    remaining: Math.max(0, DAILY_FEATURE_LIMIT - status.used - 1),
    allowed: true,
  };
}

function enableUnlimitedDailyFeature(db, jid, participants = []) {
  const status = getDailyFeatureStatus(db, jid, participants);
  const store = readStore(db);
  const previous = store[status.identity] && typeof store[status.identity] === "object"
    ? store[status.identity]
    : {};
  store[status.identity] = {
    ...previous,
    date: status.date,
    used: status.used,
    unlimited: true,
    unlimitedAt: previous.unlimitedAt || new Date().toISOString(),
  };
  db.setting(DAILY_LIMIT_STORE_KEY, store);
  return { ...status, unlimited: true };
}

Object.defineProperty(__vxExports, "DAILY_FEATURE_LIMIT", { enumerable: true, get: () => DAILY_FEATURE_LIMIT });
Object.defineProperty(__vxExports, "isDailyLimitExemptCommand", { enumerable: true, get: () => isDailyLimitExemptCommand });
Object.defineProperty(__vxExports, "getJakartaDateKey", { enumerable: true, get: () => getJakartaDateKey });
Object.defineProperty(__vxExports, "getDailyFeatureStatus", { enumerable: true, get: () => getDailyFeatureStatus });
Object.defineProperty(__vxExports, "consumeDailyFeature", { enumerable: true, get: () => consumeDailyFeature });
Object.defineProperty(__vxExports, "enableUnlimitedDailyFeature", { enumerable: true, get: () => enableUnlimitedDailyFeature });
Object.defineProperties(exports, Object.getOwnPropertyDescriptors(__vxExports));
