// islamic/murotal — satu file: metadata + kode fitur (gabungan dari engine7/plugins/islamic/murotal.js)
const __vx = require("../../lib/adapter/e7.js")
const __meta = {
  "name": "murothal",
  "command": [
    "murothal"
  ],
  "category": "islam",
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
const __vdir = require('path').join(__dirname, "../../lib/ext/plugins/islamic").split('\\').join('/')
module.exports = __vx.plugin("islamic/murotal", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + '/murotal.js'
  const __vxExports = {};
  const FEATURE_CREDIT = "Fitur by: Owner Bot";
  
  
  const pluginConfig = {
    name: "murothal",
    alias: [],
    category: "islamic",
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
  
  async function handler(m, { sock, prefix: _p }) {
      const conn = sock;
      const usedPrefix = prefix || m.prefix || ".";
  let elaina = `
  QUR'AN BOT:
  Via Copas {SEBARKAN}
  
  *YouTube:*
  _~Drawl Nag_
  
  Juz 1 ⇨ http://j.mp/2b8SiNO
  Juz 2 ⇨ http://j.mp/2b8RJmQ
  Juz 3 ⇨ http://j.mp/2bFSrtF
  Juz 4 ⇨ http://j.mp/2b8SXi3
  Juz 5 ⇨ http://j.mp/2b8RZm3
  Juz 6 ⇨ http://j.mp/28MBohs
  Juz 7 ⇨ http://j.mp/2bFRIZC
  Juz 8 ⇨ http://j.mp/2bufF7o
  Juz 9 ⇨ http://j.mp/2byr1bu
  Juz 10 ⇨ http://j.mp/2bHfyUH
  Juz 11 ⇨ http://j.mp/2bHf80y
  Juz 12 ⇨ http://j.mp/2bWnTby
  Juz 13 ⇨ http://j.mp/2bFTiKQ
  Juz 14 ⇨ http://j.mp/2b8SUTA
  Juz 15 ⇨ http://j.mp/2bFRQIM
  Juz 16 ⇨ http://j.mp/2b8SegG
  Juz 17 ⇨ http://j.mp/2brHsFz
  Juz 18 ⇨ http://j.mp/2b8SCfc
  Juz 19 ⇨ http://j.mp/2bFSq95
  Juz 20 ⇨ http://j.mp/2brI1zc
  Juz 21 ⇨ http://j.mp/2b8VcBO
  Juz 22 ⇨ http://j.mp/2bFRxNP
  Juz 23 ⇨ http://j.mp/2brItxm
  Juz 24 ⇨ http://j.mp/2brHKw5
  Juz 25 ⇨ http://j.mp/2brImlf
  Juz 26 ⇨ http://j.mp/2bFRHF2
  Juz 27 ⇨ http://j.mp/2bFRXno
  Juz 28 ⇨ http://j.mp/2brI3ai
  Juz 29 ⇨ http://j.mp/2bFRyBF
  Juz 30 ⇨ http://j.mp/2bFREcc`
     await conn.relayMessage(m.chat,  {
      requestPaymentMessage: {
        currencyCodeIso4217: 'IDR',
        amount1000: 30 * 1000,
        requestFrom: '0@s.whatsapp.net',
        noteMessage: {
        extendedTextMessage: {
        text: elaina, 
        contextInfo: {
        mentionedJid: [m.sender],
        }}}}}, {})
  }
  handler.mods = false
  handler.private = false
  
  handler.admin = false
  handler.botAdmin = false
  
  handler.fail = null
  
  
  
  Object.defineProperty(__vxExports, "FEATURE_CREDIT", { enumerable: true, get: () => FEATURE_CREDIT });
  Object.defineProperty(__vxExports, "config", { enumerable: true, get: () => pluginConfig });
  Object.defineProperty(__vxExports, "handler", { enumerable: true, get: () => handler });
  return __vxExports
})
