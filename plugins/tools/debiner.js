// tools/debiner — satu file: metadata + kode fitur (gabungan dari engine7/plugins/tools/debiner.js)
const __vx = require("../../lib/adapter/e7.js")
const __meta = {
  "name": "debiner",
  "command": [
    "debiner",
    "bintotext",
    "bin2teks",
    "decodebiner"
  ],
  "category": "tools",
  "desc": "Mengubah kode binary menjadi teks",
  "usage": ".debiner <binary>",
  "owner": false,
  "group": false,
  "private": false,
  "premium": false,
  "cooldown": 2,
  "energi": 0,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
}
const __vdir = require('path').join(__dirname, "../../lib/ext/plugins/tools").split('\\').join('/')
module.exports = __vx.plugin("tools/debiner", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + '/debiner.js'
  const __vxExports = {};
  const pluginConfig = {
    name: "debiner",
    alias: ["bintotext", "bin2teks", "decodebiner"],
    category: "tools",
    description: "Mengubah kode binary menjadi teks",
    usage: ".debiner <binary>",
    example: ".debiner 01001000 01100101",
    isOwner: false, isPremium: false, isGroup: false, isPrivate: false,
    cooldown: 2, energi: 0, isEnabled: true,
  };
  
  async function handler(m) {
    const input = String(m.args?.join(" ") || m.text || "").trim();
    if (!input) return m.reply(`📝 *DECODE BINARY*\n\nContoh: ${m.prefix}debiner 01001000 01100101`);
    const parts = input.split(/\s+/);
    if (parts.some(v => !/^[01]+$/.test(v))) {
      return m.reply("❌ Binary hanya boleh berisi 0 dan 1, dipisahkan spasi.");
    }
    try {
      const text = parts.map(v => String.fromCodePoint(parseInt(v, 2))).join("");
      await m.react?.("📝");
      return m.reply(`📝 *DECODE BINARY*\n\nInput:\n\`${input.slice(0, 500)}\`\n\nOutput:\n${text}`);
    } catch (e) {
      return m.reply(`❌ Binary tidak valid: ${e.message}`);
    }
  }
  
  
  
  Object.defineProperty(__vxExports, "config", { enumerable: true, get: () => pluginConfig });
  Object.defineProperty(__vxExports, "handler", { enumerable: true, get: () => handler });
  return __vxExports
})
