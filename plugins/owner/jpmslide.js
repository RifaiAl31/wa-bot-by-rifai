// owner/jpmslide — satu file: metadata + kode fitur (gabungan dari engine7/plugins/owner/jpmslide.js)
const gcsel = require("../../lib/gcselect.js")
const __vx = require("../../lib/adapter/e7.js")
const __meta = {
  "name": "jpmslide",
  "command": [
    "jpmslide"
  ],
  "category": "owner",
  "desc": "JPM carousel/slide ke semua grup yang diikuti bot",
  "usage": ".jpmslide",
  "owner": true,
  "group": false,
  "private": false,
  "premium": false,
  "cooldown": 30,
  "energi": 0,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
}
const __vdir = require('path').join(__dirname, "../../lib/ext/plugins/owner").split('\\').join('/')
module.exports = __vx.plugin("owner/jpmslide", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + '/jpmslide.js'
  const __vxExports = {};
  const { generateWAMessageFromContent, generateWAMessage, proto } = require("@whiskeysockets/baileys");
  const FEATURE_CREDIT = "Fitur by: Owner Bot";
  const pluginConfig = {
    name: "jpmslide",
    alias: [],
    category: "owner",
    description: "JPM carousel/slide ke semua grup yang diikuti bot",
    usage: ".jpmslide",
    example: ".jpmslide",
    isOwner: true,
    isPremium: false,
    isGroup: false,
    isPrivate: false,
    cooldown: 30,
    energi: 0,
    isEnabled: true,
  };
  
  function delay(ms) { return new Promise(resolve => setTimeout(resolve, ms)); }
  
  async function handler(m, { sock, db }) {
  
    gcsel.parseM(m)
    let allGroups = await sock.groupFetchAllParticipating()
    allGroups = await gcsel.pickM(m, allGroups)
    if (!allGroups) return
    const groupIDs = Object.keys(allGroups || {});
    if (!groupIDs.length) return m.reply("❌ Tidak ada grup yang diikuti bot.");
  
    const blacklist = db?.setting?.("jpmBlacklist") || [];
    const image = globalThis.thumbbc || globalThis.thumbnail || globalThis.thumb || null;
    if (!image) return m.reply("❌ Thumbnail JPM belum tersedia di konfigurasi bot.");
  
    const processMsg = await m.reply(`⏳ *Memproses JPM Slide...*\nJumlah grup: ${groupIDs.length}\nTipe: Carousel Slide`);
    let sentCount = 0;
  
    const menuCommand = `${globalThis.prefix || "."}menu`;
    const helpCommand = `${globalThis.prefix || "."}help`;
    const dataSlide = [
      {
        title: globalThis.botname || globalThis.namebot || "WhatsApp Bot",
        caption: "Bot WhatsApp untuk membantu berbagai kebutuhan. Gunakan menu untuk melihat perintah yang tersedia.",
        button: "Lihat Menu",
        command: menuCommand,
      },
      {
        title: "Panduan Perintah",
        caption: "Gunakan perintah bantuan untuk mengetahui cara memakai bot.",
        button: "Bantuan",
        command: helpCommand,
      },
      {
        title: "Informasi Bot",
        caption: "Daftar perintah dapat dibuka kapan saja melalui menu bot.",
        button: "Buka Menu",
        command: menuCommand,
      },
    ];
  
    for (const id of groupIDs) {
      if (blacklist.includes(id)) continue;
      try {
        const cards = [];
        for (const item of dataSlide) {
          const imgMsg = await generateWAMessage(m.chat, { image: { url: image } }, { upload: sock.waUploadToServer });
          cards.push({
            body: proto.Message.InteractiveMessage.Body.fromObject({ text: item.caption }),
            header: proto.Message.InteractiveMessage.Header.fromObject({
              title: item.title,
              hasMediaAttachment: true,
              imageMessage: imgMsg.message.imageMessage,
            }),
            nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.fromObject({
              buttons: [{
                name: "quick_reply",
                buttonParamsJson: JSON.stringify({ display_text: item.button, id: item.command }),
              }],
            }),
          });
        }
  
        const bot = generateWAMessageFromContent(id, {
          viewOnceMessage: {
            message: {
              messageContextInfo: { deviceListMetadata: {}, deviceListMetadataVersion: 2 },
              interactiveMessage: proto.Message.InteractiveMessage.fromObject({
                body: proto.Message.InteractiveMessage.Body.create({ text: "*📢 Informasi Terbaru*\n*Geser slide di bawah untuk melihat semua kartu.*" }),
                header: proto.Message.InteractiveMessage.Header.create({ hasMediaAttachment: false }),
                carouselMessage: proto.Message.InteractiveMessage.CarouselMessage.fromObject({ cards }),
              }),
            },
          },
        }, { userJid: m.sender });
  
        await sock.relayMessage(id, bot.message, { messageId: bot.key.id });
        sentCount++;
        await delay(Number(globalThis.delayJpm) || 4000);
      } catch (e) {
        console.error(`[JPM Slide] ${id}:`, e?.message || e);
      }
    }
  
    return m.reply(`✅ *JPM Slide Selesai!*\nBerhasil terkirim ke *${sentCount}* grup dari total *${groupIDs.length}* grup.`);
  }
  
  
  
  Object.defineProperty(__vxExports, "FEATURE_CREDIT", { enumerable: true, get: () => FEATURE_CREDIT });
  Object.defineProperty(__vxExports, "config", { enumerable: true, get: () => pluginConfig });
  Object.defineProperty(__vxExports, "handler", { enumerable: true, get: () => handler });
  return __vxExports
})
