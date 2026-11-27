// main/test — satu file: metadata + kode fitur (gabungan dari engine3/plugins/main/test.js)
const __vx = require("../../lib/adapter/e3.js")
const __meta = {
  "name": "test",
  "command": [
    "test"
  ],
  "category": "owner",
  "desc": "Test Poll Menu Interaktif",
  "usage": ".poll",
  "owner": false,
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
const __vdir = require('path').join(__dirname, "../../lib/ext/plugins/main").split('\\').join('/')
module.exports = __vx.plugin("main/test", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + '/test.js'
  const __vxDef = (m) => (m && m.__esModule ? m.default : m);
  const __vxExports = {};
  const config = __vxDef(require("../../lib/ext/config.e3.js"));
  const { generateWAMessageFromContent } = require("../../lib/ext/src/lib/baileys.js");
  
  const pluginConfig = {
    name: "test",
    alias: ["poll"],
    category: "test",
    description: "Test Poll Menu Interaktif",
    usage: ".poll",
    example: ".poll",
    isOwner: false,
    isPremium: false,
    isGroup: false,
    isPrivate: false,
    cooldown: 5,
    energi: 0,
    isEnabled: true,
  };
  
  async function handler(m, { sock }) {
    try {
      await m.reply("test")
      const msg = generateWAMessageFromContent(m.chat, {
        pollCreationMessageV6: {
          name: "🔥 PILIH MENU INTERAKTIF 🔥",
          options: [
            { optionName: "Anime" },
            { optionName: "Game" },
            { optionName: "Profile" }
          ],
          selectableOptionsCount: 1
        }
      }, { quoted: m });
  
      await sock.relayMessage(m.chat, msg.message, { messageId: msg.key.id });
    } catch (error) {
      console.error("[TestPoll] Gagal:", error);
      m.reply("Gagal membuat poll menu.");
    }
  }
  
  
  
  Object.defineProperty(__vxExports, "config", { enumerable: true, get: () => pluginConfig });
  Object.defineProperty(__vxExports, "handler", { enumerable: true, get: () => handler });
  return __vxExports
})
