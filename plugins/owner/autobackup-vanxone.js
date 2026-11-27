// owner/autobackup — satu file: metadata + kode fitur (gabungan dari engine3/plugins/owner/autobackup.js)
const __vx = require("../../lib/adapter/e3.js")
const __meta = {
  "name": "autobackup",
  "command": [
    "autobackup",
    "ab"
  ],
  "category": "owner",
  "desc": "Kelola sistem auto backup",
  "usage": ".autobackup <on/off/status/now> [interval]",
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
module.exports = __vx.plugin("owner/autobackup", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + '/autobackup.js'
  const __vxDef = (m) => (m && m.__esModule ? m.default : m);
  const __vxNs = (m) => (m && m.__esModule ? m : (m !== null && (typeof m === 'object' || typeof m === 'function') ? Object.assign(Object.create(null), m, { default: m }) : { default: m }));
  const __vxExports = {};
  const { enableAutoBackup, disableAutoBackup, getBackupStatus, triggerManualBackup, formatInterval } = require("../../lib/ext/src/lib/vanxone-auto-backup.js");
  const timeHelper = __vxNs(require("../../lib/ext/src/lib/vanxone-time.js"));
  const config = __vxDef(require("../../lib/ext/config.e3.js"));
  const te = __vxDef(require("../../lib/ext/src/lib/vanxone-error.js"));
  const pluginConfig = {
    name: "autobackup",
    alias: ["backup", "ab"],
    category: "owner",
    description: "Kelola sistem auto backup",
    usage: ".autobackup <on/off/status/now> [interval]",
    example: ".autobackup on 5h",
    isOwner: true,
    isPremium: false,
    isGroup: false,
    isPrivate: false,
    cooldown: 5,
    energi: 0,
    isEnabled: true,
  };
  
  async function handler(m, { sock }) {
    const args = m.text?.trim().split(/\s+/) || [];
    const action = args[0]?.toLowerCase();
  
    if (!action) {
      const status = getBackupStatus();
      const ownerNum = config.owner?.number?.[0] || "Tidak diset";
  
      let txt = `🗂️ *ᴀᴜᴛᴏ ʙᴀᴄᴋᴜᴘ sʏsᴛᴇᴍ*\n\n`;
      txt += `╭┈┈⬡「 📊 *sᴛᴀᴛᴜs* 」\n`;
      txt += `┃ 🔘 Status: ${status.enabled ? "✅ *ON*" : "❌ *OFF*"}\n`;
      txt += `┃ ⏱️ Interval: ${status.interval}\n`;
      txt += `┃ 📅 Last Backup: ${status.lastBackup ? timeHelper.fromTimestamp(status.lastBackup, "DD MMMM YYYY HH:mm:ss") : "-"}\n`;
      txt += `┃ #️⃣ Total: ${status.backupCount} backup\n`;
      txt += `┃ 📤 Dikirim ke: ${ownerNum}\n`;
      txt += `╰┈┈┈┈┈┈┈┈⬡\n\n`;
  
      txt += `*ᴄᴀʀᴀ ᴘᴀᴋᴀɪ:*\n`;
      txt += `> \`${m.prefix}autobackup on <interval>\`\n`;
      txt += `> \`${m.prefix}autobackup off\`\n`;
      txt += `> \`${m.prefix}autobackup status\`\n`;
      txt += `> \`${m.prefix}autobackup now\`\n\n`;
  
      txt += `*ꜰᴏʀᴍᴀᴛ ɪɴᴛᴇʀᴠᴀʟ:*\n`;
      txt += `> • \`5m\` = 5 menit\n`;
      txt += `> • \`1h\` = 1 jam\n`;
      txt += `> • \`6h\` = 6 jam\n`;
      txt += `> • \`1d\` = 1 hari\n\n`;
  
      txt += `*ᴄᴏɴᴛᴏʜ:*\n`;
      txt += `> \`${m.prefix}autobackup on 6h\` - backup setiap 6 jam`;
  
      return m.reply(txt);
    }
  
    switch (action) {
      case "on":
      case "enable":
      case "start": {
        const interval = args[1];
  
        if (!interval) {
          return m.reply(
            `⚠️ *ɪɴᴛᴇʀᴠᴀʟ ᴅɪʙᴜᴛᴜʜᴋᴀɴ*\n\n` +
              `> \`${m.prefix}autobackup on <interval>\`\n\n` +
              `*ᴄᴏɴᴛᴏʜ:*\n` +
              `> \`${m.prefix}autobackup on 30m\` - tiap 30 menit\n` +
              `> \`${m.prefix}autobackup on 6h\` - tiap 6 jam\n` +
              `> \`${m.prefix}autobackup on 1d\` - tiap 1 hari`,
          );
        }
  
        const result = enableAutoBackup(interval, sock);
  
        if (!result.success) {
          return m.reply(`❌ *ɢᴀɢᴀʟ*\n\n> ${result.error}`);
        }
  
        const ownerNum = config.owner?.number?.[0] || "Owner #1";
  
        await m.react("✅");
        return m.reply(
          `✅ *ᴀᴜᴛᴏ ʙᴀᴄᴋᴜᴘ ᴅɪᴀᴋᴛɪꜰᴋᴀɴ*\n\n` +
            `╭┈┈⬡「 ⚙️ *sᴇᴛᴛɪɴɢs* 」\n` +
            `┃ ⏱️ Interval: ${result.interval}\n` +
            `┃ 📤 Dikirim ke: ${ownerNum}\n` +
            `┃ 📦 Exclude: node_modules, .git, storages, dll\n` +
            `╰┈┈┈┈┈┈┈┈⬡\n\n` +
            `> Backup pertama akan dikirim dalam ${result.interval}`,
        );
      }
  
      case "off":
      case "disable":
      case "stop": {
        disableAutoBackup();
  
        await m.react("✅");
        return m.reply(
          `❌ *ᴀᴜᴛᴏ ʙᴀᴄᴋᴜᴘ ᴅɪɴᴏɴᴀᴋᴛɪꜰᴋᴀɴ*\n\n` +
            `> Backup otomatis sudah dihentikan.\n` +
            `> Gunakan \`${m.prefix}autobackup on <interval>\` untuk mengaktifkan kembali.`,
        );
      }
  
      case "status":
      case "info": {
        const status = getBackupStatus();
        const ownerNum = config.owner?.number?.[0] || "Tidak diset";
  
        let txt = `🗂️ *sᴛᴀᴛᴜs ᴀᴜᴛᴏ ʙᴀᴄᴋᴜᴘ*\n\n`;
        txt += `╭┈┈⬡「 📊 *ɪɴꜰᴏ* 」\n`;
        txt += `┃ 🔘 Enabled: ${status.enabled ? "✅ Ya" : "❌ Tidak"}\n`;
        txt += `┃ ⏱️ Interval: ${status.interval}\n`;
        txt += `┃ 🔄 Running: ${status.isRunning ? "✅ Ya" : "❌ Tidak"}\n`;
        txt += `┃ 📅 Last: ${status.lastBackup ? timeHelper.fromTimestamp(status.lastBackup, "DD MMMM YYYY HH:mm:ss") : "-"}\n`;
        txt += `┃ #️⃣ Total: ${status.backupCount} backup\n`;
        txt += `┃ 📤 Target: ${ownerNum}\n`;
        txt += `╰┈┈┈┈┈┈┈┈⬡`;
  
        return m.reply(txt);
      }
  
      case "now":
      case "manual":
      case "trigger": {
        await m.react("🕕");
        await m.reply(
          `🕕 *ᴍᴇᴍʙᴜᴀᴛ ʙᴀᴄᴋᴜᴘ...*\n\n> Mohon tunggu, sedang membuat backup...`,
        );
  
        try {
          await triggerManualBackup(sock);
          await m.react("✅");
          return m.reply(
            `✅ *ʙᴀᴄᴋᴜᴘ sᴇʟᴇsᴀɪ*\n\n> Backup telah dikirim ke owner!`,
          );
        } catch (error) {
          await m.react('☢');
          await m.reply(te(m.prefix, m.command, m.pushName));
        }
      }
  
      default:
        return m.reply(
          `⚠️ *ᴀᴄᴛɪᴏɴ ᴛɪᴅᴀᴋ ᴠᴀʟɪᴅ*\n\n` +
            `> Pilih: \`on\`, \`off\`, \`status\`, atau \`now\`\n` +
            `> Contoh: \`${m.prefix}autobackup on 6h\``,
        );
    }
  }
  
  
  Object.defineProperty(__vxExports, "config", { enumerable: true, get: () => pluginConfig });
  Object.defineProperty(__vxExports, "handler", { enumerable: true, get: () => handler });
  return __vxExports
})
