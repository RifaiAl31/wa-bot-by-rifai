// game/chess-youhu — satu file: metadata + kode fitur (gabungan dari engine3/plugins/game/chess-youhu.js)
const __vx = require("../../lib/adapter/e3.js")
const __meta = {
  "name": "chess-youhu",
  "command": [
    "chess-youhu",
    "mini-chess"
  ],
  "category": "game",
  "desc": "Youhu Mini Chess",
  "usage": ".chess",
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
module.exports = __vx.plugin("game/chess-youhu", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + '/chess-youhu.js'
  const __vxExports = {};
  const { sendYouhuGame } = require("../../lib/ext/plugins/e3/game/_youhu-rich.js");
  const pluginConfig = { name:'chess-youhu', alias:['chess','catur','mini-chess'], category:'game', description:'Youhu Mini Chess', usage:'.chess', example:'.chess', isOwner:false, isPremium:false, isGroup:false, isPrivate:false, cooldown:5, energi:1, isEnabled:true };
  async function handler(m,{sock}) { return sendYouhuGame(m,sock,(text)=>m.reply(text),{name:'Chess',file:'chess',title:'WhatsApp Bot Mini Chess ♟️',trustedSources:['thenuxofc.store','nixel.dev'],useCase:'WA_BOT_MSG',contextInfo:{stanzaId:'AC5D4630F1EB7BCFEC6055968A9EE083',quotedMessage:{}},forwardOrigin:'META_AI'}); }
  
  
  Object.defineProperty(__vxExports, "config", { enumerable: true, get: () => pluginConfig });
  Object.defineProperty(__vxExports, "handler", { enumerable: true, get: () => handler });
  return __vxExports
})
