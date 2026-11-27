// game/dino-youhu — satu file: metadata + kode fitur (gabungan dari engine3/plugins/game/dino-youhu.js)
const __vx = require("../../lib/adapter/e3.js")
const __meta = {
  "name": "dino-youhu",
  "command": [
    "dino-youhu",
    "runner"
  ],
  "category": "game",
  "desc": "Youhu Dino Runner",
  "usage": ".dino",
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
module.exports = __vx.plugin("game/dino-youhu", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + '/dino-youhu.js'
  const __vxExports = {};
  const { sendYouhuGame } = require("../../lib/ext/plugins/e3/game/_youhu-rich.js");
  const pluginConfig = { name:'dino-youhu', alias:['dino','runner'], category:'game', description:'Youhu Dino Runner', usage:'.dino', example:'.dino', isOwner:false, isPremium:false, isGroup:false, isPrivate:false, cooldown:5, energi:1, isEnabled:true };
  async function handler(m,{sock}) { return sendYouhuGame(m,sock,(text)=>m.reply(text),{name:'Dino Runner',file:'dino',title:'Fiora Sylvie',trustedSources:['nox.dev'],useCase:1,messageType:1,submessageType:2,forwardOrigin:4}); }
  
  
  Object.defineProperty(__vxExports, "config", { enumerable: true, get: () => pluginConfig });
  Object.defineProperty(__vxExports, "handler", { enumerable: true, get: () => handler });
  return __vxExports
})
