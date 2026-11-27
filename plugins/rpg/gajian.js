// rpg/gajian — satu file: metadata + kode fitur (gabungan dari engine7/plugins/rpg/gajian.js)
const __vx = require("../../lib/adapter/e7.js")
const __meta = {
  "name": "gaji",
  "command": [
    "gaji",
    "gajian"
  ],
  "category": "rpg",
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
const __vdir = require('path').join(__dirname, "../../lib/ext/plugins/rpg").split('\\').join('/')
module.exports = __vx.plugin("rpg/gajian", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + '/gajian.js'
  const __vxExports = {};
  const FEATURE_CREDIT = "Fitur by: Owner Bot";
  
  
  const pluginConfig = {
    name: "gaji",
    alias: ["gajian"],
    category: "rpg",
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
  
  async function handler(m, { sock }) {
      const conn = sock;
    let LastClaim = global.db.data.users[m.sender].lastclaim
    let cdm = `${MeNit(new Date - LastClaim)}`
    let cds = `${DeTik(new Date - LastClaim)}`
    let cd1 = Math.ceil(44 - cdm)
    let cd2 = Math.ceil(59 - cds)
    if (new Date - global.db.data.users[m.sender].lastclaim > 2700000) {
      global.db.data.users[m.sender].money += 50000
      global.db.data.users[m.sender].exp += 100
      m.reply('Nih gaji lu +Rp50.000')
      global.db.data.users[m.sender].lastclaim = new Date * 1
    } else return m.reply(`Lu udah ambil jatah hari ini.\n\nTunggu ${cd1} Menit ${cd2} Detik!`)
  }
  handler.register = true
  function JaM(ms) {
    let h = isNaN(ms) ? '60' : Math.floor(ms / 3600000) % 60
    return [h].map(v => v.toString().padStart(2, 0) ).join(':')
  }
  
  function MeNit(ms) {
    let m = isNaN(ms) ? '60' : Math.floor(ms / 60000) % 60
    return [m].map(v => v.toString().padStart(2, 0) ).join(':')
  }
  
  function DeTik(ms) {
    let s = isNaN(ms) ? '60' : Math.floor(ms / 1000) % 60
    return [s].map(v => v.toString().padStart(2, 0) ).join(':')
  }
  
  
  
  Object.defineProperty(__vxExports, "FEATURE_CREDIT", { enumerable: true, get: () => FEATURE_CREDIT });
  Object.defineProperty(__vxExports, "config", { enumerable: true, get: () => pluginConfig });
  Object.defineProperty(__vxExports, "handler", { enumerable: true, get: () => handler });
  return __vxExports
})
