// owner/renewsewa — satu file: metadata + kode fitur (gabungan dari engine3/plugins/owner/renewsewa.js)
const __vx = require("../../lib/adapter/e3.js")
const __meta = {
  "name": "renewsewa",
  "command": [
    "renewsewa"
  ],
  "category": "owner",
  "desc": "Perpanjang durasi sewa grup",
  "usage": ".renewsewa <link/id grup> <durasi>",
  "owner": true,
  "group": false,
  "private": false,
  "premium": false,
  "admin": false,
  "botAdmin": false,
  "cooldown": 5,
  "energi": 0,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
}
const __vdir = require('path').join(__dirname, "../../lib/ext/plugins/owner").split('\\').join('/')
module.exports = __vx.plugin("owner/renewsewa", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + '/renewsewa.js'
  const __vxDef = (m) => (m && m.__esModule ? m.default : m);
  const __vxNs = (m) => (m && m.__esModule ? m : (m !== null && (typeof m === 'object' || typeof m === 'function') ? Object.assign(Object.create(null), m, { default: m }) : { default: m }));
  const __vxExports = {};
  const { getDatabase } = require("../../lib/ext/src/lib/vanxone-database.js");
  const timeHelper = __vxNs(require("../../lib/ext/src/lib/vanxone-time.js"));
  const fs = __vxDef(require("fs"));
  const te = __vxDef(require("../../lib/ext/src/lib/vanxone-error.js"));
  const { saluranCtx } = require("../../lib/ext/src/lib/vanxone-context.js");
  const pluginConfig = {
    name: "renewsewa",
    alias: ["perpanjangsewa", "extendsewa"],
    category: "owner",
    description: "Perpanjang durasi sewa grup",
    usage: ".renewsewa <link/id grup> <durasi>",
    example: ".renewsewa https://chat.whatsapp.com/xxx 30d",
    isOwner: true,
    isPremium: false,
    isGroup: false,
    isPrivate: false,
    cooldown: 5,
    energi: 0,
    isEnabled: true,
  };
  
  function parseDurationMs(str) {
    if (
      ["lifetime", "permanent", "forever", "unlimited"].includes(
        str.toLowerCase(),
      )
    )
      return Infinity;
    const match = str.match(/^(\d+)([iIdDmMyYhH])$/);
    if (!match) return null;
    const value = parseInt(match[1]);
    const unit = match[2].toLowerCase();
    const multiplier = {
      i: 60000,
      h: 3600000,
      d: 86400000,
      m: 2592000000,
      y: 31536000000,
    };
    return multiplier[unit] ? value * multiplier[unit] : null;
  }
  
  function formatDuration(str) {
    if (
      ["lifetime", "permanent", "forever", "unlimited"].includes(
        str.toLowerCase(),
      )
    )
      return "Permanent";
    const match = str.match(/^(\d+)([iIdDmMyYhH])$/);
    if (!match) return str;
    const units = { i: "menit", h: "jam", d: "hari", m: "bulan", y: "tahun" };
    return `${match[1]} ${units[match[2].toLowerCase()] || match[2]}`;
  }
  
  async function resolveGroupId(sock, input) {
    if (input.includes("chat.whatsapp.com/")) {
      const inviteCode = input.split("chat.whatsapp.com/")[1]?.split(/[\s?]/)[0];
      if (!inviteCode) return null;
      try {
        const metadata = await sock.groupGetInviteInfo(inviteCode);
        if (!metadata?.id) return null;
        return { id: metadata.id, name: metadata.subject || "Unknown" };
      } catch {
        return null;
      }
    }
    const groupId = input.includes("@g.us") ? input : input + "@g.us";
    return { id: groupId, name: null };
  }
  
  async function handler(m, { sock }) {
    const db = getDatabase();
    if (!db.db.data.sewa) {
      db.db.data.sewa = { enabled: false, groups: {} };
      db.db.write();
    }
  
    const args = m.args;
    if (args.length < 2) {
      return m.reply(
        `📝 *PERPANJANG SEWA*\n\n` +
          `Format: *${m.prefix}renewsewa <link/id> <durasi>*\n\n` +
          `*FORMAT DURASI:*\n` +
          `• 30i = 30 menit\n` +
          `• 12h = 12 jam\n` +
          `• 7d = 7 hari\n` +
          `• 1m = 1 bulan\n` +
          `• 1y = 1 tahun\n` +
          `• lifetime = Permanent\n\n` +
          `*CONTOH:*\n` +
          `• ${m.prefix}renewsewa https://chat.whatsapp.com/xxx 30d\n` +
          `• ${m.prefix}renewsewa 120363xxx 1m\n\n` +
          `💡 Durasi ditambahkan ke sisa waktu yang ada, bukan di-reset`,
      );
    }
  
    const input = args[0];
    const durationStr = args[1];
    const durationMs = parseDurationMs(durationStr);
  
    if (!durationMs)
      return m.reply(
        `❌ Format durasi tidak valid\nContoh: 7d, 1m, 1y, lifetime`,
      );
  
    await m.react("🕕");
  
    try {
      const result = await resolveGroupId(sock, input);
      if (!result) {
        await m.react("❌");
        return m.reply(`❌ Grup tidak ditemukan`);
      }
  
      const { id: groupId } = result;
      const existing = db.db.data.sewa.groups[groupId];
  
      if (!existing) {
        await m.react("❌");
        return m.reply(
          `❌ Grup tidak terdaftar\nGunakan *${m.prefix}addsewa* untuk menambahkan`,
        );
      }
  
      if (durationMs === Infinity) {
        existing.expiredAt = 0;
        existing.isLifetime = true;
      } else {
        if (existing.isLifetime) {
          await m.react("❌");
          return m.reply(`❌ Grup ini sudah Permanent, tidak perlu diperpanjang`);
        }
        const baseTime =
          existing.expiredAt > Date.now() ? existing.expiredAt : Date.now();
        existing.expiredAt = baseTime + durationMs;
        existing.isLifetime = false;
      }
  
      existing.renewedAt = Date.now();
      existing.renewedBy = m.sender;
      if (existing.status) delete existing.status;
      db.db.write();
  
      const groupName = existing.name || groupId.split("@")[0];
      const expiredStr = existing.isLifetime
        ? "Permanent"
        : timeHelper.fromTimestamp(existing.expiredAt, "D MMMM YYYY HH:mm");
  
      await m.react("✅");
  
      let text = `✅ *SEWA DIPERPANJANG*\n\n`;
      text += `Grup: *${groupName}*\n`;
      text += `Tambahan: *${formatDuration(durationStr)}*\n`;
      text += `Expired baru: *${expiredStr}*`;
  
      try {
        await sock.sendText(
          groupId,
          `📢 Sewa bot telah diperpanjang!\n\nTambahan: *${formatDuration(durationStr)}*\nExpired baru: *${expiredStr}*`,
          null,
          {
            contextInfo: saluranCtx(),
          },
        );
      } catch {}
  
      return m.reply(text);
    } catch (error) {
      await m.react("☢");
      await m.reply(te(m.prefix, m.command, m.pushName));
    }
  }
  
  
  
  Object.defineProperty(__vxExports, "config", { enumerable: true, get: () => pluginConfig });
  Object.defineProperty(__vxExports, "handler", { enumerable: true, get: () => handler });
  return __vxExports
})
