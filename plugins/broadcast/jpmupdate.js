// jpm/jpmupdate — satu file: metadata + kode fitur (gabungan dari engine1/plugins/jpm/jpmupdate.js)
const gcsel = require("../../lib/gcselect.js")
const __vx = require("../../lib/adapter/e1.js")
const __meta = {
  "name": "jpmupdate",
  "command": [
    "jpmupdate",
    "updatejpm",
    "broadcastupdate",
    "shareupdate"
  ],
  "category": "broadcast",
  "desc": "Kirim update/changelog ke semua grup",
  "usage": ".jpmupdate <versi> | <changelog>",
  "owner": true,
  "group": false,
  "private": false,
  "premium": false,
  "cooldown": 60,
  "energi": 0,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
}
const __vdir = require('path').join(__dirname, "../../lib/ext/plugins/jpm").split('\\').join('/')
module.exports = __vx.plugin("jpm/jpmupdate", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + '/jpmupdate.js'
  const module = { exports: {} }; const exports = module.exports;
  const hsAsset = require("../../lib/ext/src/lib/assets.js")
  const { getDatabase } = require("../../lib/ext/src/lib/database.js");
  const timeHelper = require("../../lib/ext/src/lib/timeHelper.js");
  const { fetchGroupsSafe } = require("../../lib/ext/src/lib/jpmHelper.js");
  const config = require("../../lib/ext/config.js");
  const fs = require("fs");
  
  let cachedThumb = null;
  hsAsset.tryBuffer('images/vx').then(b => { if (b) cachedThumb = b }).catch(() => {})
  
  const pluginConfig = {
    name: "jpmupdate",
    alias: ["updatejpm", "broadcastupdate", "shareupdate"],
    category: "jpm",
    description: "Kirim update/changelog ke semua grup",
    usage: ".jpmupdate <versi> | <changelog>",
    example: ".jpmupdate v2.0 | Fitur baru:\\n- Quiz Battle\\n- Confession",
    isOwner: true,
    isPremium: false,
    isGroup: false,
    isPrivate: false,
    cooldown: 60,
    energi: 0,
    isEnabled: true,
  };
  
  async function handler(m, { sock }) {
  
    gcsel.parseM(m)
    const db = getDatabase();
  
    if (global.statusjpm) {
      return m.reply(
        `❌ *ɢᴀɢᴀʟ*\n\n> JPM sedang berjalan. Ketik \`${m.prefix}stopjpm\` untuk menghentikan.`,
      );
    }
  
    let input = m.text?.trim();
  
    if (!input) {
      return m.reply(
        `📢 *JPM UPDATE (PENGUMUMAN)*\n\n` +
          `Kirim informasi update / changelog ke seluruh grup!\n\n` +
          `*FORMAT PENGGUNAAN:*\n` +
          `• \`.jpmupdate <versi> | <isi changelog>\`\n\n` +
          `*CONTOH:*\n` +
          `> \`.jpmupdate v3.0 | ✨ Fitur Baru:\\n- JPM Hidetag\\n- Sistem AFK Baru\\n- Perbaikan bug system\`\n\n` +
          `_(Note: Gunakan \\n untuk membuat baris baru/enter)_`
      );
    }
  
    let version = config.bot?.version || "v1.0";
    let changelog = input;
  
    if (input.includes("|")) {
      const parts = input.split("|");
      version = parts[0].trim();
      changelog = parts.slice(1).join("|").trim();
    }
  
    if (!changelog) {
      return m.reply(`❌ *Ehh~* Changelog tidak boleh kosong~ 🥺`);
    }
  
    await m.react("🕕");
  
    try {
      let allGroups = await fetchGroupsSafe(sock)
      allGroups = await gcsel.pickM(m, allGroups)
      if (!allGroups) return
      let groupIds = Object.keys(allGroups);
  
      const blacklist = db.setting("jpmBlacklist") || [];
      const blacklistedCount = groupIds.filter((id) =>
        blacklist.includes(id),
      ).length;
      groupIds = groupIds.filter((id) => !blacklist.includes(id));
  
      if (groupIds.length === 0) {
        await m.react("❌");
        return m.reply(
          `❌ *ɢᴀɢᴀʟ*\n\n> Tidak ada grup yang ditemukan${blacklistedCount > 0 ? ` (${blacklistedCount} grup di-blacklist)` : ""}`,
        );
      }
  
      const jedaJpm = db.setting("jedaJpm") || 5000;
      const botName = config.bot?.name || "WhatsApp Bot";
      const saluranId = config.saluran?.id || "";
      const saluranName = config.saluran?.name || botName;
  
      const dateStr = timeHelper.formatDate("DD MMMM YYYY");
  
      const updateMessage =
        `🚀 *UPDATE !! | ${version}*\n\n` +
        `📅 *Tanggal:* ${dateStr}\n\n` +
        `*CHANGELOG:*\n` +
        `${changelog}\n\n` +
        `*CATATAN TERBARU:*\n` +
        `> 💡 Ketik *${m.prefix}menu* untuk mengeksplorasi fitur-fitur ini.\n` +
        `> 📢 _Terima kasih telah menggunakan ${botName}_`;
  
      await m.reply(
        `📢 *ᴊᴘᴍ ᴜᴘᴅᴀᴛᴇ*\n\n` +
          `╭┈┈⬡「 📋 *ᴅᴇᴛᴀɪʟ* 」\n` +
          `┃ 🏷️ ᴠᴇʀsɪ: \`${version}\`\n` +
          `┃ 👥 ᴛᴀʀɢᴇᴛ: \`${groupIds.length}\` grup\n` +
          `┃ ⏱️ ᴊᴇᴅᴀ: \`${jedaJpm}ms\`\n` +
          `┃ 📊 ᴇsᴛɪᴍᴀsɪ: \`${Math.ceil((groupIds.length * jedaJpm) / 60000)} menit\`\n` +
          `╰┈┈⬡\n\n` +
          `> Memulai broadcast update...`,
      );
  
      global.statusjpm = true;
      let successCount = 0;
      let failedCount = 0;
  
      for (const groupId of groupIds) {
        if (global.stopjpm) {
          delete global.stopjpm;
          delete global.statusjpm;
  
          await m.reply(
            `⏹️ *ᴊᴘᴍ ᴜᴘᴅᴀᴛᴇ ᴅɪʜᴇɴᴛɪᴋᴀɴ*\n\n` +
              `> ✅ Berhasil: \`${successCount}\`\n` +
              `> ❌ Gagal: \`${failedCount}\`\n` +
              `> ⏸️ Sisa: \`${groupIds.length - successCount - failedCount}\``,
          );
          return;
        }
  
        try {
          await sock.sendMessage(groupId, {
            text: updateMessage,
            contextInfo: {
              forwardingScore: 9999,
              isForwarded: true,
              forwardedNewsletterMessageInfo: {
                newsletterJid: saluranId,
                newsletterName: saluranName,
                serverMessageId: 127,
              },
            },
          });
          successCount++;
        } catch {
          failedCount++;
        }
  
        await new Promise((resolve) => setTimeout(resolve, jedaJpm));
      }
  
      global.statusjpm = false;
      global.stopjpm = false;
  
      await m.react("✅");
      await m.reply(
        `✅ *ᴊᴘᴍ ᴜᴘᴅᴀᴛᴇ sᴇʟᴇsᴀɪ!*\n\n` +
          `╭┈┈⬡「 📊 *ʀᴇsᴜʟᴛ* 」\n` +
          `┃ ✅ Sukses: ${successCount}\n` +
          `┃ ❌ Gagal: ${failedCount}\n` +
          `┃ 📊 Total: ${groupIds.length}\n` +
          `╰┈┈┈┈┈┈┈┈⬡`,
      );
    } catch (error) {
      global.statusjpm = false;
      global.stopjpm = false;
      await m.react("❌");
      await m.reply(`❌ *Gomen ne~* ✦\n\n> ${error.message}\n\n_Ai udah coba yang terbaik tapi gagal juga... coba lagi nanti ya~ 🌸_`);
    }
  }
  
  module.exports = {
    config: pluginConfig,
    handler,
  };
  return module.exports
})
