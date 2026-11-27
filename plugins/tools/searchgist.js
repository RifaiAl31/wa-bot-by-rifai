// tools/searchgist — satu file: metadata + kode fitur (gabungan dari engine7/plugins/tools/searchgist.js)
const __vx = require("../../lib/adapter/e7.js")
const __meta = {
  "name": "searchgist",
  "command": [
    "searchgist"
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
module.exports = __vx.plugin("tools/searchgist", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + '/searchgist.js'
  const __vxExports = {};
  const FEATURE_CREDIT = "Fitur by: Owner Bot";
  
  
  /**
   * Fitur    : Search GitHub Gist
   * Type     : Plugins ESM
   * Creator  : Owner Bot
   */
  
  const pluginConfig = {
    name: "searchgist",
    alias: [],
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
  
  async function handler(m, { text, prefix, command }) {
      const usedPrefix = prefix || m.prefix || ".";
    if (!text) throw `${usedPrefix}${command} query`
  
    try {
      let hasil = []
  
      for (let page = 1; page <= 3; page++) {
        let res = await fetch(`https://gist.github.com/search?p=${page}&q=${encodeURIComponent(text)}`)
        let html = await res.text()
  
        let links = [...html.matchAll(/href="(\/[^"]+)"/g)]
          .map(v => 'https://gist.github.com' + v[1])
          .filter(v => /^https:\/\/gist\.github\.com\/[^/]+\/[a-f0-9]+$/.test(v))
  
        hasil.push(...links)
      }
  
      hasil = [...new Set(hasil)]
        .slice(0, 30)
        .map((v, i) => `❀ ${i + 1}. ${v}`)
        .join('\n\n')
  
      m.reply(hasil || 'Tidak ditemukan')
  
    } catch {
      throw 'Error'
    }
  }
  
  
  
  Object.defineProperty(__vxExports, "FEATURE_CREDIT", { enumerable: true, get: () => FEATURE_CREDIT });
  Object.defineProperty(__vxExports, "config", { enumerable: true, get: () => pluginConfig });
  Object.defineProperty(__vxExports, "handler", { enumerable: true, get: () => handler });
  return __vxExports
})
