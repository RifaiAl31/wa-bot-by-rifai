// game/ttc-youhu — satu file: metadata + kode fitur (gabungan dari engine3/plugins/game/ttc-youhu.js)
const __vx = require("../../lib/adapter/e3.js")
const __meta = {
  "name": "ttc-youhu",
  "command": [
    "ttc-youhu",
    "ttc"
  ],
  "category": "game",
  "desc": "Youhu Tic-Tac-Toe",
  "usage": ".ttc",
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
const __vdir = require('path').join(__dirname, "../../lib/ext/plugins/game").split('\\').join('/')
module.exports = __vx.plugin("game/ttc-youhu", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + '/ttc-youhu.js'
  const __vxExports = {};
  const { sendYouhuGame } = require("../../lib/ext/plugins/e3/game/_youhu-rich.js");
  const pluginConfig = { name:'ttc-youhu', alias:['ttc'], category:'game', description:'Youhu Tic-Tac-Toe', usage:'.ttc', example:'.ttc', isOwner:false, isGroup:false, isPrivate:false, cooldown:5, energi:1, isEnabled:true };
  async function handler(m,{sock}) { return sendYouhuGame(m,sock,(text)=>m.reply(text),{name:'Tic-Tac-Toe',file:'ttc',title:'Tic-Tac-Toe',trustedSources:['pastebin.com'],useCase:'WA_BOT_MSG',forwardOrigin:'META_AI'}); }
  
  
  Object.defineProperty(__vxExports, "config", { enumerable: true, get: () => pluginConfig });
  Object.defineProperty(__vxExports, "handler", { enumerable: true, get: () => handler });
  return __vxExports
})
