// maker/hotline — satu file: metadata + kode fitur (gabungan dari engine7/plugins/maker/hotline.js)
const __vx = require("../../lib/adapter/e7.js")
const __meta = {
  "name": "hotline",
  "command": [
    "hotline"
  ],
  "category": "maker",
  "desc": "Imported from WhatsApp Bot V4.6",
  "usage": "",
  "owner": false,
  "group": false,
  "private": false,
  "premium": false,
  "cooldown": 3,
  "energi": 1,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
}
const __vdir = require('path').join(__dirname, "../../lib/ext/plugins/maker").split('\\').join('/')
module.exports = __vx.plugin("maker/hotline", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + '/hotline.js'
  const __vxDef = (m) => (m && m.__esModule ? m.default : m);
  const __vxExports = {};
  const FEATURE_CREDIT = "Fitur by: Owner Bot";
  
  
  const axios = __vxDef(require("axios"));
  
  const pluginConfig = {
    name: "hotline",
    alias: [],
    category: "maker",
    description: "Imported from WhatsApp Bot V4.6",
    usage: "",
    example: "",
    isOwner: false,
    isPremium: false,
    isGroup: false,
    isPrivate: false,
    cooldown: 3,
    energi: 1,
    isEnabled: true,
  };
  
  const handler = async (m, { conn, usedPrefix, command }) => {
      await m.react("🕐");
  
      const raw = (m.text || '').slice((usedPrefix + command).length).trim();
  
      if (!raw)
          return m.reply(
              `Format:\n${usedPrefix + command} teks atas|teks bawah\n\nContoh:\n${usedPrefix + command} p|salam`
          );
  
      if (!raw.includes("|"))
          return m.reply(
              `Gunakan pemisah |\n\nContoh:\n${usedPrefix + command} hello|world`
          );
  
      const [text1Raw, text2Raw] = raw.split("|");
  
      const imgUrl =
          `https://api.cuki.biz.id/api/canvas/meme/hotline` +
          `?apikey=${(global.apiKeys && global.apiKeys.cuki) || ''}&text1=${encodeURIComponent(text1Raw.trim())}` +
          `&text2=${encodeURIComponent(text2Raw.trim())}`;
  
      try {
          const res = await axios.get(imgUrl, { responseType: "arraybuffer" });
  
          await conn.sendFile(
              m.chat,
              res.data,
              "hotline.png",
              "🖼️ Hotline Meme",
              m
          );
  
          await m.react("✅");
      } catch (e) {
          console.error("❌ hotline error:", e);
          await m.react("❌");
          m.reply(`*ERROR:* ${e.message}`);
      }
  };
  
  
  
  Object.defineProperty(__vxExports, "FEATURE_CREDIT", { enumerable: true, get: () => FEATURE_CREDIT });
  Object.defineProperty(__vxExports, "config", { enumerable: true, get: () => pluginConfig });
  Object.defineProperty(__vxExports, "handler", { enumerable: true, get: () => handler });
  return __vxExports
})
