// owner/bcpc — satu file: metadata + kode fitur (gabungan dari engine3/plugins/owner/bcpc.js)
const __vx = require("../../lib/adapter/e3.js")
const __meta = {
  "name": "bcpc",
  "command": [
    "bcpc",
    "broadcastpc",
    "bcprivate"
  ],
  "category": "owner",
  "desc": "Broadcast pesan ke semua kontak private chat",
  "usage": ".bcpc <pesan>",
  "owner": true,
  "group": false,
  "private": false,
  "premium": false,
  "admin": false,
  "botAdmin": false,
  "cooldown": 10,
  "energi": 0,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
}
const __vdir = require('path').join(__dirname, "../../lib/ext/plugins/owner").split('\\').join('/')
module.exports = __vx.plugin("owner/bcpc", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + '/bcpc.js'
  const __vxDef = (m) => (m && m.__esModule ? m.default : m);
  const __vxExports = {};
  const { getDatabase } = require("../../lib/ext/src/lib/vanxone-database.js");
  const { decodeAndNormalize } = require("../../lib/ext/src/lib/vanxone-lid.js");
  const config = __vxDef(require("../../lib/ext/config.e3.js"));
  
  const pluginConfig = {
    name: "bcpc",
    alias: ["broadcastpc", "bcprivate"],
    category: "owner",
    description: "Broadcast pesan ke semua kontak private chat",
    usage: ".bcpc <pesan>",
    isOwner: true,
    isPremium: false,
    isGroup: false,
    isPrivate: false,
    cooldown: 10,
    energi: 0,
    isEnabled: true,
  };
  
  function getBcContextInfo() {
    const saluranId = config.saluran?.id || "";
    const saluranName = config.saluran?.name || config.bot?.name || "";
    const ctx = {
      forwardingScore: 1,
      isForwarded: true,
    };
    if (saluranId && saluranId !== "-@newsletter") {
      ctx.forwardedNewsletterMessageInfo = {
        newsletterJid: saluranId,
        newsletterName: saluranName,
        serverMessageId: Math.floor(Math.random() * 1000) + 1,
      };
    }
    return ctx;
  }
  
  async function handler(m, { sock }) {
    const db = getDatabase();
    const input = m.fullArgs?.trim() || m.text?.trim() || "";
  
    if (!input) {
      const jeda = db.setting("jedaBcpc") || 5000;
      return m.reply(
        `📱 *BROADCAST PRIVATE CHAT*\n\n` +
          `Jeda: ${jeda}ms (${(jeda / 1000).toFixed(1)}s)\n\n` +
          `*PENGGUNAAN:*\n` +
          `• \`${m.prefix}bcpc <pesan>\` — Kirim ke semua kontak\n` +
          `• \`${m.prefix}bcpc (reply media)\` — Kirim dengan media\n\n` +
          `⚠️ *Peringatan:* Bot akan mengirim pesan ke semua kontak yang tersimpan!\n\n` +
          `ℹ️ *Note:* Kontak hanya terdeteksi jika mereka sudah pernah mengirim pesan ke bot. Kontak yang hanya disimpan tapi belum pernah chat tidak akan muncul.`,
      );
    }
  
    if (global.statusBcpc) {
      return m.reply(
        `❌ Broadcast private sedang berjalan.\nKetik \`${m.prefix}stopbcpc\` untuk menghentikan.`,
      );
    }
  
    m.react("📱");
  
    try {
      let mediaBuffer = null;
      let mediaType = null;
      const qmsg = m.quoted || m;
  
      if (qmsg.isImage) {
        try {
          mediaBuffer = await qmsg.download();
          mediaType = "image";
        } catch {}
      } else if (qmsg.isVideo) {
        try {
          mediaBuffer = await qmsg.download();
          mediaType = "video";
        } catch {}
      }
  
      const privateJids = new Set();
      const botNum = sock.user?.id?.split(":")[0] || "";
  
      const chatsMap = sock.store?.chats;
      if (chatsMap) {
        for (const [jid] of chatsMap.entries()) {
          const decoded = decodeAndNormalize(jid);
          if (decoded && decoded.endsWith("@s.whatsapp.net")) {
            const num = decoded.split("@")[0];
            if (num !== botNum) privateJids.add(decoded);
          }
        }
      }
  
      const messagesMap = sock.store?.messages;
      if (messagesMap) {
        for (const [jid] of messagesMap.entries()) {
          const decoded = decodeAndNormalize(jid);
          if (decoded && decoded.endsWith("@s.whatsapp.net")) {
            const num = decoded.split("@")[0];
            if (num !== botNum) privateJids.add(decoded);
          }
        }
      }
  
      const contactsObj = sock.store?.contacts;
      if (contactsObj) {
        for (const jid of Object.keys(contactsObj)) {
          const decoded = decodeAndNormalize(jid);
          if (decoded && decoded.endsWith("@s.whatsapp.net")) {
            const num = decoded.split("@")[0];
            if (num !== botNum) privateJids.add(decoded);
          }
        }
      }
  
      if (privateJids.size === 0) {
        m.react("❌");
        return m.reply(
          "❌ Tidak ada kontak ditemukan.\n\nPastikan bot sudah pernah menerima pesan dari kontak tersebut.",
        );
      }
  
      const filtered = [...privateJids];
  
      const jeda = db.setting("jedaBcpc") || 5000;
      const ctx = getBcContextInfo();
  
      await sock.sendMessage(
        m.chat,
        {
          text:
            `📱 *ʙʀᴏᴀᴅᴄᴀsᴛ ᴘʀɪᴠᴀᴛᴇ*\n\n` +
            `╭┈┈⬡「 📋 *ᴅᴇᴛᴀɪʟ* 」\n` +
            `┃ 📝 ᴘᴇsᴀɴ: \`${input.substring(0, 50)}${input.length > 50 ? "..." : ""}\`\n` +
            `┃ 📷 ᴍᴇᴅɪᴀ: \`${mediaBuffer ? mediaType : "Tidak"}\`\n` +
            `┃ 👥 ᴛᴀʀɢᴇᴛ: \`${filtered.length}\` kontak\n` +
            `┃ ⏱️ ᴊᴇᴅᴀ: \`${jeda}ms\`\n` +
            `┃ 📊 ᴇsᴛɪᴍᴀsɪ: \`${Math.ceil((filtered.length * jeda) / 60000)} menit\`\n` +
            `╰┈┈⬡\n\n` +
            `> Memulai broadcast...`,
          contextInfo: ctx,
        },
        { quoted: m },
      );
  
      global.statusBcpc = true;
      let success = 0;
      let failed = 0;
  
      for (const jid of filtered) {
        if (global.stopBcpc) {
          delete global.stopBcpc;
          break;
        }
        try {
          if (mediaBuffer) {
            await sock.sendMedia(jid, mediaBuffer, input, null, {
              type: mediaType,
              contextInfo: ctx,
            });
          } else {
            await sock.sendText(jid, input, null, { contextInfo: ctx });
          }
          success++;
        } catch {
          failed++;
        }
        await new Promise((r) => setTimeout(r, jeda));
      }
  
      delete global.statusBcpc;
      m.react("✅");
  
      await sock.sendMessage(
        m.chat,
        {
          text:
            `✅ *ʙʀᴏᴀᴅᴄᴀsᴛ ᴘʀɪᴠᴀᴛᴇ sᴇʟᴇsᴀɪ*\n\n` +
            `╭┈┈⬡「 📊 *ʜᴀsɪʟ* 」\n` +
            `┃ ✅ ʙᴇʀʜᴀsɪʟ: \`${success}\`\n` +
            `┃ ❌ ɢᴀɢᴀʟ: \`${failed}\`\n` +
            `┃ 📊 ᴛᴏᴛᴀʟ: \`${filtered.length}\`\n` +
            `╰┈┈⬡`,
          contextInfo: ctx,
        },
        { quoted: m },
      );
    } catch (e) {
      delete global.statusBcpc;
      m.react("❌");
      m.reply("Gagal: " + e.message);
    }
  }
  
  
  
  Object.defineProperty(__vxExports, "config", { enumerable: true, get: () => pluginConfig });
  Object.defineProperty(__vxExports, "handler", { enumerable: true, get: () => handler });
  return __vxExports
})
