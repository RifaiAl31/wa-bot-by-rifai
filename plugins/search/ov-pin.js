// search/pin — satu file: metadata + kode fitur (gabungan dari engine3/plugins/search/pin.js)
const __vx = require("../../lib/adapter/e3.js")
const __meta = {
  "name": "pin",
  "command": [
    "pinsearch",
    "pinterestsearch",
    "pins"
  ],
  "category": "search",
  "desc": "Cari gambar di Pinterest (album)",
  "usage": ".pin <query>",
  "owner": false,
  "group": false,
  "private": false,
  "premium": false,
  "admin": false,
  "botAdmin": false,
  "cooldown": 10,
  "energi": 1,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  },
  "override": true
}
const __vdir = require('path').join(__dirname, "../../lib/ext/plugins/search").split('\\').join('/')
module.exports = __vx.plugin("search/pin", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + '/pin.js'
  const __vxDef = (m) => (m && m.__esModule ? m.default : m);
  const __vxExports = {};
  const { generateWAMessage, generateWAMessageFromContent, jidNormalizedUser } = require("../../lib/baileys-compat.mjs");
  const axios = __vxDef(require("axios"));
  const crypto = __vxDef(require("crypto"));
  const te = __vxDef(require("../../lib/ext/src/lib/vanxone-error.js"));
  const { f } = require("../../lib/ext/src/lib/vanxone-http.js");
  const { AIRich } = require("../../lib/MessageBuilder.js");
  
  const pluginConfig = {
    name: "pin",
    alias: ["pinsearch", "pinterestsearch", "pins"],
    category: "search",
    description: "Cari gambar di Pinterest (album)",
    usage: ".pin <query>",
    example: ".pin Zhao Lusi",
    isOwner: false,
    isPremium: false,
    isGroup: false,
    isPrivate: false,
    cooldown: 10,
    energi: 1,
    isEnabled: true,
  };
  
  async function handler(m, { sock }) {
    const query = m.text?.trim();
    if (!query) {
      return m.reply(
        `🔍 *ᴘɪɴᴛᴇʀᴇsᴛ sᴇᴀʀᴄʜ*\n\n` +
        `> Contoh:\n` +
        `\`${m.prefix}pin Zhao Lusi\``,
      );
    }
    m.react("🕕");
  
    try {
      const data = await f(
        `https://api.cuki.biz.id/api/search/pinterest?apikey=${(global.apiKeys && global.apiKeys.cuki) || ''}&query=${encodeURIComponent(query)}&type=image`
      );
  
      const results = data?.data?.results?.filter(item => item.image_url)?.slice(0, 10);
      if (!results || results.length === 0) {
        m.react("❌");
        return m.reply(`❌ Tidak ditemukan hasil untuk: ${query}`);
      }
  
      const mediaList = [];
  
      for (const item of results) {
        const imageUrl = item.image_url;
        if (!imageUrl) continue;
  
        try {
          const imgRes = await axios.get(imageUrl, {
            responseType: "arraybuffer",
            timeout: 15000,
          });
          const imgBuffer = Buffer.from(imgRes.data);
  
          if (imgBuffer.length > 1000) {
            mediaList.push({ image: imgBuffer });
          }
        } catch (e) {
          continue;
        }
      }
  
      if (mediaList.length === 0) {
        m.react("❌");
        return m.reply("❌ Gagal memuat gambar");
      }
  
      try {
        const opener = generateWAMessageFromContent(
          m.chat,
          {
            messageContextInfo: { messageSecret: crypto.randomBytes(32) },
            albumMessage: {
              expectedImageCount: mediaList.length,
              expectedVideoCount: 0,
            },
          },
          {
            userJid: jidNormalizedUser(sock.user.id),
            quoted: m,
            upload: sock.waUploadToServer,
          },
        );
  
        await sock.relayMessage(opener.key.remoteJid, opener.message, {
          messageId: opener.key.id,
        });
  
        for (const content of mediaList) {
          const msg = await generateWAMessage(opener.key.remoteJid, content, {
            upload: sock.waUploadToServer,
          });
  
          msg.message.messageContextInfo = {
            messageSecret: crypto.randomBytes(32),
            messageAssociation: {
              associationType: 1,
              parentMessageKey: opener.key,
            },
          };
  
          await sock.relayMessage(msg.key.remoteJid, msg.message, {
            messageId: msg.key.id,
          });
        }
  
        m.react("✅");
      } catch (albumErr) {
        console.log("[Pins] Album gagal, kirim satu-satu:", albumErr.message);
  
        const saluranId = (global.config || {}).saluran?.id || global.channel || "";
        const saluranName =
          (global.config || {}).saluran?.name || global.channeln || "WhatsApp Bot";
  
        for (const content of mediaList) {
          await sock.sendMessage(
            m.chat,
            {
              image: content.image,
              contextInfo: {
                forwardingScore: 9999,
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                  newsletterJid: saluranId,
                  newsletterName: saluranName,
                  serverMessageId: 127,
                },
              },
            },
            { quoted: m },
          );
        }
      }
      m.react("✅");
    } catch (err) {
      console.error("[Pins] Error:", err.message);
      m.react("☢");
      m.reply(te(m.prefix, m.command, m.pushName));
    }
  }
  
  
  
  Object.defineProperty(__vxExports, "config", { enumerable: true, get: () => pluginConfig });
  Object.defineProperty(__vxExports, "handler", { enumerable: true, get: () => handler });
  return __vxExports
})
