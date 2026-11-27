// tools/readmore — satu file: metadata + kode fitur (gabungan dari engine3/plugins/tools/readmore.js)
const __vx = require("../../lib/adapter/e3.js")
const __meta = {
  "name": "readmore",
  "command": [
    "readmore",
    "selengkapnya",
    "spoiler"
  ],
  "category": "tools",
  "desc": "Membuat teks baca selengkapnya (spoiler)",
  "usage": ".readmore <text_awal>|<text_akhir>",
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
module.exports = __vx.plugin("tools/readmore", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + '/readmore.js'
  const __vxExports = {};
  const pluginConfig = {
      name: 'readmore',
      alias: ['selengkapnya', 'spoiler'],
      category: 'tools',
      description: 'Membuat teks baca selengkapnya (spoiler)',
      usage: '.readmore <text_awal>|<text_akhir>',
      example: '.readmore Hai|Ini adalah pesan rahasia',
      isGroup: false,
      isBotAdmin: false,
      isAdmin: false,
      cooldown: 5,
      energi: 1,
      isEnabled: true
  };
  
  function handler(m, { sock }) {
      const text = m.text;
      
      if (!text) {
          return m.reply(`⚠️ Masukan text!\nContoh: \`${m.prefix}${m.command} Halo|Ini teks tersembunyi\``);
      }
      
      let [l, r] = text.split('|');
      if (!l) l = '';
      if (!r) r = '';
      
      const readmore = String.fromCharCode(8206).repeat(4001);
      
      m.reply(l + readmore + r);
  }
  
  
  Object.defineProperty(__vxExports, "config", { enumerable: true, get: () => pluginConfig });
  Object.defineProperty(__vxExports, "handler", { enumerable: true, get: () => handler });
  return __vxExports
})
