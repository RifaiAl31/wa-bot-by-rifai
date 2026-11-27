// tools/gh — satu file: metadata + kode fitur (gabungan dari engine7/plugins/tools/gh.js)
const __vx = require("../../lib/adapter/e7.js")
const __meta = {
  "name": "ghuser",
  "command": [
    "ghuser",
    "ghsearch",
    "ghgist"
  ],
  "category": "tools",
  "desc": "Imported from WhatsApp Bot V4.6",
  "usage": "",
  "owner": false,
  "group": false,
  "private": false,
  "premium": false,
  "cooldown": 3,
  "energi": 0,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
}
const __vdir = require('path').join(__dirname, "../../lib/ext/plugins/tools").split('\\').join('/')
module.exports = __vx.plugin("tools/gh", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + '/gh.js'
  const __vxExports = {};
  const FEATURE_CREDIT = "Fitur by: Owner Bot";
  
  
  /**
   * Fitur    : GitHub Tools
   * Type     : Plugins ESM
   * Creator  : Owner Bot
   */
  
  const pluginConfig = {
    name: "ghuser",
    alias: ["ghsearch", "ghgist"],
    category: "tools",
    description: "Imported from WhatsApp Bot V4.6",
    usage: "",
    example: "",
    isOwner: false,
    isPremium: false,
    isGroup: false,
    isPrivate: false,
    cooldown: 3,
    energi: 0,
    isEnabled: true,
  };
  
  async function handler(m, { text, prefix, command }) {
      const usedPrefix = prefix || m.prefix || ".";
    if (!text) throw `${usedPrefix}${command} query`
  
    try {
  
      if (command === 'ghuser') {
        let res = await fetch(`https://api.github.com/users/${text}`)
        let json = await res.json()
  
        return m.reply(`👤 ${json.login}
  📦 Repo: ${json.public_repos}
  👥 Followers: ${json.followers}
  🔗 ${json.html_url}`)
      }
  
      if (command === 'ghsearch') {
        let res = await fetch(`https://api.github.com/search/repositories?q=${encodeURIComponent(text)}`)
        let json = await res.json()
  
        let hasil = json.items.slice(0, 5).map(v => `
  ${v.full_name}
  ⭐ ${v.stargazers_count}
  🔗 ${v.html_url}`).join('\n')
  
        return m.reply(hasil)
      }
  
      if (command === 'ghgist') {
        let url = text.trim()
  
        if (url.includes('gist.github.com')) {
          let id = url.split('/').pop()
          let res = await fetch(`https://api.github.com/gists/${id}`)
          let json = await res.json()
  
          for (let x in json.files) {
            let f = json.files[x]
            await m.reply('```' + f.content + '```')
          }
  
          return
        }
  
        if (url.includes('github.com')) {
          url = url.replace('github.com', 'raw.githubusercontent.com').replace('/blob/', '/')
        }
  
        let res = await fetch(url)
        let textFile = await res.text()
  
        return m.reply('```' + textFile + '```')
      }
  
    } catch {
      throw 'Error'
    }
  }
  
  
  
  Object.defineProperty(__vxExports, "FEATURE_CREDIT", { enumerable: true, get: () => FEATURE_CREDIT });
  Object.defineProperty(__vxExports, "config", { enumerable: true, get: () => pluginConfig });
  Object.defineProperty(__vxExports, "handler", { enumerable: true, get: () => handler });
  return __vxExports
})
