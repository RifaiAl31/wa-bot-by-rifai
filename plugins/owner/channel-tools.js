// owner/channel-tools — satu file: metadata + kode fitur (gabungan dari engine7/plugins/owner/channel-tools.js)
const __vx = require("../../lib/adapter/e7.js")
const __meta = {
  "name": "followch",
  "command": [
    "followch",
    "unfollowch",
    "setnamech"
  ],
  "category": "owner",
  "desc": "Manajemen channel/newsletter tambahan dari Aqua",
  "usage": ".followch <channelJid> / .createch <nama>",
  "owner": true,
  "group": false,
  "private": false,
  "premium": false,
  "cooldown": 3,
  "energi": 0,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
}
const __vdir = require('path').join(__dirname, "../../lib/ext/plugins/owner").split('\\').join('/')
module.exports = __vx.plugin("owner/channel-tools", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + '/channel-tools.js'
  const __vxExports = {};
  const pluginConfig = {
    name: "followch",
    alias: ["followch", "unfollowch", "setnamech"],
    category: "owner",
    description: "Manajemen channel/newsletter tambahan dari Aqua",
    usage: ".followch <channelJid> / .createch <nama>",
    example: ".followch CHANNEL_ID",
    isOwner: true,
    isPremium: false,
    isGroup: false,
    isPrivate: false,
    cooldown: 3,
    energi: 0,
    isEnabled: true,
  };
  
  async function handler(m, { sock }) {
    const cmd = String(m.command || "").toLowerCase();
    try {
      if (cmd === "followch") {
        const id = String(m.args?.[0] || "").trim();
        if (!id) return m.reply(`Contoh: ${m.prefix}followch CHANNEL_ID`);
        if (typeof sock.newsletterFollow !== "function") return m.reply("❌ Baileys WhatsApp Bot tidak menyediakan newsletterFollow.");
        await sock.newsletterFollow(id.includes("@newsletter") ? id : `${id}@newsletter`);
        return m.reply(`✅ Berhasil follow channel ${id}`);
      }
  
      if (cmd === "unfollowch") {
        const id = String(m.args?.[0] || "").trim();
        if (!id) return m.reply(`Contoh: ${m.prefix}unfollowch CHANNEL_ID`);
        if (typeof sock.newsletterUnfollow !== "function") return m.reply("❌ Baileys WhatsApp Bot tidak menyediakan newsletterUnfollow.");
        await sock.newsletterUnfollow(id.includes("@newsletter") ? id : `${id}@newsletter`);
        return m.reply(`✅ Berhasil unfollow channel ${id}`);
      }
  
      if (cmd === "setnamech") {
        const raw = String(m.args?.join(" ") || "").trim();
        if (!raw) return m.reply(`Contoh: ${m.prefix}setnamech Nama Channel Baru\nAtau: ${m.prefix}setnamech 120363...@newsletter|Nama Channel Baru`);
        let channel = "";
        let name = raw;
        if (raw.includes("|")) [channel, name] = raw.split("|", 2).map(v => v.trim());
        channel ||= m.chat?.endsWith("@newsletter") ? m.chat : null;
        if (!channel && sock.newsletterMetadata) channel = (await sock.newsletterMetadata("jid", m.chat))?.id;
        if (!channel) return m.reply("Masukkan ID/JID channel dengan format `channelJid|Nama Baru`.");
        if (typeof sock.newsletterUpdateName !== "function") return m.reply("❌ Baileys WhatsApp Bot tidak menyediakan newsletterUpdateName.");
        await sock.newsletterUpdateName(channel, name);
        return m.reply(`✅ Nama channel berhasil diubah menjadi ${name}`);
      }
  
    } catch (e) {
      console.error(`[AQUA-${cmd}]`, e?.message || e);
      return m.reply(`❌ Gagal menjalankan ${m.prefix}${cmd}: ${e?.message || e}`);
    }
  }
  
  
  
  Object.defineProperty(__vxExports, "config", { enumerable: true, get: () => pluginConfig });
  Object.defineProperty(__vxExports, "handler", { enumerable: true, get: () => handler });
  return __vxExports
})
