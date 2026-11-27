// game/perangsarung — satu file: metadata + kode fitur (gabungan dari engine7/plugins/game/perangsarung.js)
const __vx = require("../../lib/adapter/e7.js")
const __meta = {
  "name": "perangsarung",
  "command": [
    "perangsarung"
  ],
  "category": "game",
  "desc": "Imported from WhatsApp Bot V4.6",
  "usage": "",
  "owner": false,
  "group": true,
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
const __vdir = require('path').join(__dirname, "../../lib/ext/plugins/game").split('\\').join('/')
module.exports = __vx.plugin("game/perangsarung", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + '/perangsarung.js'
  const __vxExports = {};
  const FEATURE_CREDIT = "Fitur by: Owner Bot";
  
  
  const pluginConfig = {
    name: "perangsarung",
    alias: [],
    category: "game",
    description: "Imported from WhatsApp Bot V4.6",
    usage: "",
    example: "",
    isOwner: false,
    isPremium: false,
    isGroup: true,
    isPrivate: false,
    cooldown: 3,
    energi: 1,
    isEnabled: true,
  };
  
  async function handler(m, { sock, text }) {
      const conn = sock;
    if (!m.mentionedJid[0]) return conn.reply(m.chat, `Tag 1 orang untuk menantangnya bermain perang sarung!`, m)
  
    let target = m.mentionedJid[0]
    let player1 = { jid: m.sender, name: conn.getName(m.sender) }
    let player2 = { jid: target, name: conn.getName(target) }
  
    let players = [player1, player2]
  
    let intro = `⚔️ *PERANG SARUNG DIMULAI!!*\n\n${player1.name} vs ${player2.name}\n\nSiapakah yang akan menang?\n\n*Loading...*`
    await conn.reply(m.chat, intro, m, { mentions: [player1.jid, player2.jid] })
  
   
    const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))
  
    await conn.sendPresenceUpdate('composing', m.chat)
    await delay(3000)
    await conn.reply(m.chat, `💥 Keduanya mulai memutar sarung dengan gaya ninja!`, m)
  
    await conn.sendPresenceUpdate('composing', m.chat)
    await delay(3000)
    await conn.reply(m.chat, `⚡ Terdengar suara *"Plakkk!"* di udara...`, m)
  
    await conn.sendPresenceUpdate('composing', m.chat)
    await delay(2500)
  
    let winner = players[Math.floor(Math.random() * players.length)]
    let loser = players.find(p => p.jid !== winner.jid)
  
    await conn.reply(m.chat, `☠️ ${loser.name} tumbang terkena sarung karpet masjid`, m)
    await delay(2000)
    await conn.reply(m.chat, `🏆 *Pemenangnya adalah:* ${winner.name.toUpperCase()}!`, m)
  }
  
  handler.register = true
  
  /*
  SCRIPT BY © VYNAA VALERIE 
  Modifikasi: By ZenzXD
  */
  
  
  
  Object.defineProperty(__vxExports, "FEATURE_CREDIT", { enumerable: true, get: () => FEATURE_CREDIT });
  Object.defineProperty(__vxExports, "config", { enumerable: true, get: () => pluginConfig });
  Object.defineProperty(__vxExports, "handler", { enumerable: true, get: () => handler });
  return __vxExports
})
