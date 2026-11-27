// tools/caribug — satu file: metadata + kode fitur (gabungan dari engine3/plugins/tools/caribug.js)
const __vx = require("../../lib/adapter/e3.js")
const __meta = {
  "name": "caribug",
  "command": [
    "caribug",
    "debug",
    "findbug"
  ],
  "category": "tools",
  "desc": "Cari bug di kode pemrograman",
  "usage": ".caribug [kode] atau reply kode",
  "owner": false,
  "group": false,
  "private": false,
  "premium": false,
  "admin": false,
  "botAdmin": false,
  "cooldown": 20,
  "energi": 1,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
}
const __vdir = require('path').join(__dirname, "../../lib/ext/plugins/tools").split('\\').join('/')
module.exports = __vx.plugin("tools/caribug", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + '/caribug.js'
  const __vxDef = (m) => (m && m.__esModule ? m.default : m);
  const __vxExports = {};
  const axios = __vxDef(require("axios"));
  const config = __vxDef(require("../../lib/ext/config.e3.js"));
  const te = __vxDef(require("../../lib/ext/src/lib/vanxone-error.js"));
  
  const pluginConfig = {
    name: "caribug",
    alias: ["debug", "findbug"],
    category: "tools",
    description: "Cari bug di kode pemrograman",
    usage: ".caribug [kode] atau reply kode",
    example: ".caribug function test() {}",
    cooldown: 20,
    energi: 1,
    isEnabled: true,
  };
  
  async function handler(m, { args }) {
    let code = m.quoted?.text || args.join(" ");
  
    if (!code) {
      return m.reply(
        `*🐛 CARI BUG*\n\nKirim kode atau reply pesan kode untuk mencari bug.\n\nContoh:\n\`${m.prefix}caribug function test() {}\``
      );
    }
  
    m.react("🕕");
  
    try {
      const apiUrl = `https://api.cuki.biz.id/api/aicode/caribug`;
      const res = await axios.get(apiUrl, {
        params: {
          apikey: config.APIkey.cuki,
          code: code,
          language: "auto"
        },
        timeout: 60000
      });
  
      const data = res.data;
  
      if (!data.success || !data.data) {
        throw new Error("Gagal menganalisa kode dari server");
      }
  
      const info = data.data;
      const meta = info.metadata;
      const bugInfo = info.bugsFound;
      
      let text = `🐛 *HASIL ANALISA BUG*\n\n`;
      text += `*Bahasa:* ${meta.detectedLanguage}\n`;
      text += `*Tingkat:* ${meta.severityInfo.level} ${meta.severityInfo.icon}\n`;
      text += `*Bug Ditemukan:* ${bugInfo.total}\n\n`;
      
      if (bugInfo.summary) {
        text += `*📝 Ringkasan:*\n${bugInfo.summary}\n\n`;
      }
      
      if (info.codeAnalysis?.fixed?.code) {
        text += `*✨ Kode Perbaikan:*\n\`\`\`${meta.detectedLanguage}\n${info.codeAnalysis.fixed.code}\n\`\`\`\n\n`;
      }
      
      if (bugInfo.details && bugInfo.details.length > 0) {
        text += `*📌 Detail:* \n`;
        bugInfo.details.forEach((d, i) => {
          text += `- ${d.type || d.description}\n`;
        });
      }
  
      m.react("✅");
      await m.reply(text.trim());
    } catch (err) { globalThis.__vanxoneCatch?.(err);
      console.error("[CariBug]", err.message);
      m.react("☢");
      m.reply(te(m.prefix, m.command, m.pushName));
    }
  }
  
  
  
  Object.defineProperty(__vxExports, "config", { enumerable: true, get: () => pluginConfig });
  Object.defineProperty(__vxExports, "handler", { enumerable: true, get: () => handler });
  return __vxExports
})
