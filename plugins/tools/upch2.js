// tools/upch2 — satu file: metadata + kode fitur (gabungan dari engine7/plugins/tools/upch2.js)
const __vx = require("../../lib/adapter/e7.js")
const __meta = {
  "name": "upch2",
  "command": [
    "upch2",
    "setchid2",
    "addchid2",
    "getchid2"
  ],
  "category": "tools",
  "desc": "Varian broadcast ke channel dari WhatsApp Bot.",
  "usage": ".upch2 <teks>",
  "owner": true,
  "group": false,
  "private": false,
  "premium": false,
  "cooldown": 5,
  "energi": 1,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
}
const __vdir = require('path').join(__dirname, "../../lib/ext/plugins/tools").split('\\').join('/')
module.exports = __vx.plugin("tools/upch2", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + '/upch2.js'
  const __vxExports = {};
  const FEATURE_CREDIT = "Fitur by: Owner Bot";
  
  
  const channels = {}; 
  
  const handler = async (m, { sock, text, command }) => {
    const user = m.sender;
    
    if (command === "setchid") {
      if (!text) return await m.reply("Gunakan: .setchid <id channel>");
      channels[user] = [text];
      return await m.reply(`ID channel berhasil disimpan: ${text}`);
    }
  
    if (command === "addchid") {
      if (!text) return await m.reply("Gunakan: .addchid <id channel>");
      if (!channels[user]) channels[user] = [];
      if (!channels[user].includes(text)) {
        channels[user].push(text);
        return await m.reply(`ID channel berhasil ditambahkan: ${text}`);
      } else {
        return await m.reply("ID channel sudah ada dalam daftar.");
      }
    }
  
    if (command === "getchid") {
      const chidList = channels[user];
      return await m.reply(chidList ? `ID channel Anda:\n${chidList.join("\n")}` : "Belum ada ID channel yang disimpan.");
    }
  
    const chidList = channels[user];
    if (!chidList || chidList.length === 0) return await m.reply("Set dulu ID channel dengan .setchid atau .addchid");
  
    if (!text && !m.quoted) return await m.reply("Masukkan teks atau reply media dengan teks");
  
    let messageOptions = {};
  
    if (m.quoted && m.quoted.mimetype) {
      let mime = m.quoted.mimetype;
  
      if (/image/.test(mime)) {
        messageOptions = {
          image: await m.quoted.download(),
          caption: text || m.quoted.text || ""
        };
      } else if (/video/.test(mime)) {
        messageOptions = {
          video: await m.quoted.download(),
          caption: text || m.quoted.text || "",
          mimetype: mime
        };
      } else if (/audio/.test(mime)) {
        messageOptions = {
          audio: await m.quoted.download(),
          mimetype: "audio/mp4",
          fileName: "audio.mp3",
          ptt: true,
          contextInfo: {
            forwardingScore: 1,
            isForwarded: true,
            forwardedNewsletterMessageInfo: {
              newsletterJid: chidList[0], 
              serverMessageId: null,
              newsletterName: "WhatsApp Bot",
            },
            externalAdReplyOffOffOff: {
              title: "Cihuyy",
              body: text || "Pesan audio",
              thumbnailUrl: "https://files.catbox.moe/liodxn.jpg", // Ubah sama thumbnail bot kalian
              sourceUrl: null,
              mediaType: 1,
              renderLargerThumbnail: false,
            },
          }
        };
      } else if (/sticker/.test(mime)) {
        messageOptions = {
          sticker: await m.quoted.download()
        };
      }
    } else {
      messageOptions = { text: text };
    }
  
    for (const chid of chidList) {
      await sock.sendMessage(chid, messageOptions);
    }
  
    await m.reply("Pesan berhasil dikirim ke semua channel.");
  };
  
  
  const __vxDefault = handler;
  const pluginConfig = {
    name: 'upch2',
    alias: ['setchid2', 'addchid2', 'getchid2'],
    category: 'tools',
    description: 'Varian broadcast ke channel dari WhatsApp Bot.',
    usage: '.upch2 <teks>',
    example: '.upch2 <teks>',
    isOwner: true,
    isPremium: false,
    isGroup: false,
    isPrivate: false,
    cooldown: 5,
    energi: 1,
    isEnabled: true,
  };
  
  
  
  Object.defineProperty(__vxExports, "FEATURE_CREDIT", { enumerable: true, get: () => FEATURE_CREDIT });
  Object.defineProperty(__vxExports, "default", { enumerable: true, get: () => __vxDefault });
  Object.defineProperty(__vxExports, "config", { enumerable: true, get: () => pluginConfig });
  Object.defineProperty(__vxExports, "handler", { enumerable: true, get: () => handler });
  return __vxExports
})
