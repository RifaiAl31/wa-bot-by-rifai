// game/zonic — satu file: metadata + kode fitur (gabungan dari engine4/plugins/game/zonic.js)
const __vx = require("../../lib/adapter/e4.js")
const __meta = {
  "name": "zonic",
  "command": [
    "zonic",
    
  ],
  "category": "game",
  "desc": "ZONIC Speed Adventure - Dual Platforms Edition",
  "usage": ".zonic",
  "owner": false,
  "group": false,
  "private": false,
  "premium": false,
  "cooldown": 5,
  "energi": 0,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
}
const __vdir = require('path').join(__dirname, "../../lib/ext/plugins/game").split('\\').join('/')
module.exports = __vx.plugin("game/zonic", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + '/zonic.js'
  const __vxUrl = require('url').pathToFileURL(__filename).href;
  const __vxExports = {};
  const { readFileSync } = require("node:fs");
  const { AIRich } = require("../../lib/MessageBuilder.js");
  
  const pluginConfig = {
    name: "zonic",
    alias: [],
    category: "game",
    description: "ZONIC Speed Adventure - Dual Platforms Edition",
    usage: ".zonic",
    example: ".zonic",
    cooldown: 5,
    isOwner: false,
    isPremium: false,
    isGroup: false,
    isPrivate: false,
    isEnabled: true,
  };
  
  const htmlUrl = new URL("./zonic.html", __vxUrl);
  
  const handler = async (m, { sock }) => {
    if (!m?.chat || !sock) return;
  
    try {
      // Read the provided HTML directly; do not rewrite or transform the game source.
      const html = readFileSync(htmlUrl, "utf8");
      const aiRich = new AIRich(sock)
        .addSubmessage({
          messageType: 2,
          messageText: "🔵 ZONIC SPEED ADVENTURE",
        })
        .addSection(
          AIRich.newLayout("Single", {
            __typename: "GenAIaeacdsnwHtmlPrimitive",
            payload: html,
            trusted_sources: [],
          }),
        );
  
      await aiRich.send(m.chat, { quoted: m });
      try { await m.react("🎮"); } catch {}
      return { handled: true };
    } catch (error) {
      console.error("[ZONIC] Error:", error);
      try { await m.react("❌"); } catch {}
      return m.reply(`❌ *Gagal menjalankan ZONIC*\n\n> ${error.message}`);
    }
  };
  
  
  
  Object.defineProperty(__vxExports, "config", { enumerable: true, get: () => pluginConfig });
  Object.defineProperty(__vxExports, "handler", { enumerable: true, get: () => handler });
  return __vxExports
})
