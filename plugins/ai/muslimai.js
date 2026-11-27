// ai/muslimai — satu file: metadata + kode fitur (gabungan dari engine3/plugins/ai/muslimai.js)
const __vx = require("../../lib/adapter/e3.js")
const __meta = {
  "name": "muslimai",
  "command": [
    "muslimai",
    "islamai",
    "quranai"
  ],
  "category": "ai",
  "desc": "AI untuk bertanya tentang Islam dan Al-Quran",
  "usage": ".muslimai <pertanyaan>",
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
const __vdir = require('path').join(__dirname, "../../lib/ext/plugins/ai").split('\\').join('/')
module.exports = __vx.plugin("ai/muslimai", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + '/muslimai.js'
  const __vxDef = (m) => (m && m.__esModule ? m.default : m);
  const __vxExports = {};
  const { f } = require("../../lib/ext/src/lib/vanxone-http.js");
  const te = __vxDef(require("../../lib/ext/src/lib/vanxone-error.js"));
  const pluginConfig = {
      name: 'muslimai',
      alias: ['islamai', 'quranai'],
      category: 'ai',
      description: 'AI untuk bertanya tentang Islam dan Al-Quran',
      usage: '.muslimai <pertanyaan>',
      example: '.muslimai Apa itu sholat?',
      isOwner: false,
      isPremium: false,
      isGroup: false,
      isPrivate: false,
      cooldown: 5,
      energi: 1,
      isEnabled: true
  }
  
  class MuslimAI {
      constructor() {
          this.url = "https://www.muslimai.io/api/chat";
          this.headers = { "Content-Type": "application/json" };
      }
  
      _id() {
          return "019e7d1d-e8a4-702d-96b8-defd87522114";
      }
  
      _body(q) {
          return JSON.stringify({
              query: q,
              distinctId: this._id()
          });
      }
  
      _opts(q) {
          return {
              method: "POST",
              headers: this.headers,
              body: this._body(q)
          };
      }
  
      _parse(res) {
          let txt = "";
          for (const l of res.split("\n")) {
              try {
                  const p = JSON.parse(l);
                  if (p.type === "text") txt += p.data;
              } catch {}
          }
          return txt || res;
      }
  
      async chat(q) {
          const req = await fetch(this.url, this._opts(q));
          const res = await req.text();
          return this._parse(res);
      }
  }
  
  async function handler(m, { sock }) {
      const text = m.args.join(' ')
      if (!text) {
          return m.reply(`☪️ *ᴍᴜsʟɪᴍ ᴀɪ*\n\n> Masukkan pertanyaan tentang Islam\n\n\`Contoh: ${m.prefix}muslimai Apa itu sholat?\``)
      }
  
      m.react('🕕')
  
      try {
          const data = await new MuslimAI().chat(`${text}`)
          let response = `${data}`
  
          m.react('✅')
          await m.reply(response)
  
      } catch (error) { globalThis.__vanxoneCatch?.(error);
          m.react('☢')
          m.reply(te(m.prefix, m.command, m.pushName))
      }
  }
  
  
  Object.defineProperty(__vxExports, "config", { enumerable: true, get: () => pluginConfig });
  Object.defineProperty(__vxExports, "handler", { enumerable: true, get: () => handler });
  return __vxExports
})
