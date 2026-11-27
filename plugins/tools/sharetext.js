// tools/sharetext — satu file: metadata + kode fitur (gabungan dari engine7/plugins/tools/sharetext.js)
const __vx = require("../../lib/adapter/e7.js")
const __meta = {
  "name": "shareteks",
  "command": [
    "shareteks",
    "bagiteks"
  ],
  "category": "tools",
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
const __vdir = require('path').join(__dirname, "../../lib/ext/plugins/tools").split('\\').join('/')
module.exports = __vx.plugin("tools/sharetext", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + '/sharetext.js'
  const __vxDef = (m) => (m && m.__esModule ? m.default : m);
  const __vxExports = {};
  const FEATURE_CREDIT = "Fitur by: Owner Bot";
  
  
  /*
   • Fitur By WhatsApp Bot
   • Created : WhatsApp Bot
   • Share teks *(Plugins)*
   • 
  */
  
  const axios = __vxDef(require("axios"));
  
  const pluginConfig = {
    name: "shareteks",
    alias: ["bagiteks"],
    category: "tools",
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
  
  const handler = async (m, {
      conn,
      text
  }) => {
      if (!text) throw 'Kasih teks yang mau dishare dong...';
  
      try {
          const link = await bikinLink(text);
          await conn.reply(m.chat, `Nih link teks lu: ${link}`, m);
      } catch (e) {
          await conn.reply(m.chat, `Waduh error: ${e}`, m);
      }
  };
  
  
  const bikinLink = async (teks) => {
      const {
          data
      } = await axios.post('https://sharetext.io/api/text', {
          text: teks
      }, {
          headers: {
              'User-Agent': 'Mozilla/5.0',
              'Referer': 'https://sharetext.io/'
          }
      });
  
      if (!data) throw 'Gagal bikin link';
      return `https://sharetext.io/${data}`;
  };
  
  // kok simple bang? Ya emng gini simple webnya 😹
  
  
  
  Object.defineProperty(__vxExports, "FEATURE_CREDIT", { enumerable: true, get: () => FEATURE_CREDIT });
  Object.defineProperty(__vxExports, "config", { enumerable: true, get: () => pluginConfig });
  Object.defineProperty(__vxExports, "handler", { enumerable: true, get: () => handler });
  return __vxExports
})
