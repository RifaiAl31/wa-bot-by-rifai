// maker/textlogo — satu file: metadata + kode fitur (gabungan dari engine7/plugins/maker/textlogo.js)
const __vx = require("../../lib/adapter/e7.js")
const __meta = {
  "name": "textlogo",
  "command": [
    "textlogo"
  ],
  "category": "maker",
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
const __vdir = require('path').join(__dirname, "../../lib/ext/plugins/maker").split('\\').join('/')
module.exports = __vx.plugin("maker/textlogo", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + '/textlogo.js'
  const __vxExports = {};
  const FEATURE_CREDIT = "Fitur by: Owner Bot";
  
  
  let effects = [
    'snow3d','anonymhacker','aovwallpaper','avatarlolnew','beautifulflower',
    'birthdaycake','birthdayday','cartoongravity','codwarzone','cutegravity',
    'fpslogo','freefire','galaxybat','galaxystyle','galaxywallpaper','glittergold',
    'greenbush','greenneon','heartshaped','hologram3d','juventusshirt','lighttext',
    'logogaming','lolbanner','luxurygold','metallogo','mlwallpaper','multicolor3d',
    'noeltext','pubgmaskot','puppycute','realvintage','royaltext','silverplaybutton',
    'starsnight','textbyname','textcake','valorantbanner','watercolor','wetglass',
    'wooden3d','writegalaxy'
  ]
  
  const pluginConfig = {
    name: "textlogo",
    alias: [],
    category: "maker",
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
  
  async function handler(m, { sock, text, prefix, command }) {
      const conn = sock;
      const usedPrefix = prefix || m.prefix || ".";
    if (!text) {
      return m.reply(
  `🖼️ *TEXT LOGO MAKER*
  
  Contoh:
  ${usedPrefix + command} snow3d|WhatsApp Bot
  
  📜 *List Efek:*
  ${effects.map(v => '• ' + v).join('\n')}`
      )
    }
  
    let [effect, txt] = text.split('|')
    if (!effect || !txt) {
      return m.reply(`Gunakan format:\n${usedPrefix + command} efek|teks`)
    }
  
    effect = effect.toLowerCase().trim()
    txt = txt.trim()
  
    if (!effects.includes(effect)) {
      return m.reply(
  `Efek tidak tersedia!
  
  ✨ *List Efek:*
  ${effects.map(v => '• ' + v).join('\n')}`
      )
    }
  
    await conn.sendMessage(m.chat, {
      react: { text: '🕒', key: m.key }
    })
  
    let url = `https://api.lolhuman.xyz/api/ephoto1/${effect}?apikey=${global.APIKeys['https://api.lolhuman.xyz']}&text=${encodeURIComponent(txt)}`
  
    await conn.sendFile(m.chat, url, 'textlogo.jpg', 'Done', m)
  }
  
  
  
  Object.defineProperty(__vxExports, "FEATURE_CREDIT", { enumerable: true, get: () => FEATURE_CREDIT });
  Object.defineProperty(__vxExports, "config", { enumerable: true, get: () => pluginConfig });
  Object.defineProperty(__vxExports, "handler", { enumerable: true, get: () => handler });
  return __vxExports
})
