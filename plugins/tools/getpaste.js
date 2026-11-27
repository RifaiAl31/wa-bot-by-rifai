// tools/getpaste — satu file: metadata + kode fitur (gabungan dari engine3/plugins/tools/getpaste.js)
const __vx = require("../../lib/adapter/e3.js")
const __meta = {
  "name": "getpaste",
  "command": [
    "getpaste",
    "getpb",
    "pastebin"
  ],
  "category": "tools",
  "desc": "Ambil konten dari Pastebin",
  "usage": ".getpaste <link pastebin>",
  "owner": false,
  "group": false,
  "private": false,
  "premium": false,
  "admin": false,
  "botAdmin": false,
  "cooldown": 5,
  "energi": 1,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
}
const __vdir = require('path').join(__dirname, "../../lib/ext/plugins/tools").split('\\').join('/')
module.exports = __vx.plugin("tools/getpaste", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + '/getpaste.js'
  const __vxDef = (m) => (m && m.__esModule ? m.default : m);
  const __vxNs = (m) => (m && m.__esModule ? m : (m !== null && (typeof m === 'object' || typeof m === 'function') ? Object.assign(Object.create(null), m, { default: m }) : { default: m }));
  const __vxExports = {};
  const axios = __vxDef(require("axios"));
  const timeHelper = __vxNs(require("../../lib/ext/src/lib/vanxone-time.js"));
  const te = __vxDef(require("../../lib/ext/src/lib/vanxone-error.js"));
  const pluginConfig = {
    name: "getpaste",
    alias: ["pastebin", "getpb"],
    category: "tools",
    description: "Ambil konten dari Pastebin",
    usage: ".getpaste <link pastebin>",
    example: ".getpaste https://pastebin.com/Gu8RZaqv",
    isOwner: false,
    isPremium: false,
    isGroup: false,
    isPrivate: false,
    cooldown: 5,
    energi: 1,
    isEnabled: true,
  };
  
  class GetPastebin {
    constructor() {
      this.url = "https://pastebin.com/raw/";
    }
  
    _id(link) {
      const match = link.match(/pastebin\.com\/(?:raw\/)?([a-zA-Z0-9]+)/);
      return match ? match[1] : link;
    }
  
    async fetch(link) {
      const id = this._id(link);
      if (!id) return null;
  
      try {
        const req = await fetch(this.url + id);
        if (!req.ok) return null;
        return await req.text();
      } catch {
        return null;
      }
    }
  }
  
  async function handler(m, { sock }) {
    const text = m.text?.trim();
  
    if (!text || !text.includes("pastebin.com")) {
      return m.reply(
        `📋 *ɢᴇᴛ ᴘᴀsᴛᴇʙɪɴ*\n\n` +
        `> Masukkan link Pastebin yang valid\n\n` +
        `> Contoh: \`${m.prefix}getpaste https://pastebin.com/Gu8RZaqv\``,
      );
    }
  
    m.react("📋");
  
    try {
      const data = await new GetPastebin().fetch(text);
      await m.reply(data);
      m.react("✅");
    } catch (err) { globalThis.__vanxoneCatch?.(err);
      m.react('☢');
      m.reply(te(m.prefix, m.command, m.pushName))
    }
  }
  
  
  Object.defineProperty(__vxExports, "config", { enumerable: true, get: () => pluginConfig });
  Object.defineProperty(__vxExports, "handler", { enumerable: true, get: () => handler });
  return __vxExports
})
