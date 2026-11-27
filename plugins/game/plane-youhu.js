// game/plane-youhu — satu file: metadata + kode fitur (gabungan dari engine3/plugins/game/plane-youhu.js)
const __vx = require("../../lib/adapter/e3.js")
const __meta = {
  "name": "plane-youhu",
  "command": [
    "plane-youhu",
    "plane",
    "spacerush"
  ],
  "category": "game",
  "desc": "Youhu Space Rush",
  "usage": ".plane",
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
module.exports = __vx.plugin("game/plane-youhu", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + '/plane-youhu.js'
  const __vxExports = {};
  const { sendYouhuGame } = require("../../lib/ext/plugins/e3/game/_youhu-rich.js");
  const pluginConfig = { name:'plane-youhu', alias:['plane','spacerush'], category:'game', description:'Youhu Space Rush', usage:'.plane', example:'.plane', isOwner:false, isPremium:false, isGroup:false, isPrivate:false, cooldown:5, energi:1, isEnabled:true };
  async function handler(m,{sock}) { return sendYouhuGame(m,sock,(text)=>m.reply(text),{name:'Space Rush',file:'plane',title:'Space Rush 🚀',trustedSources:['noxXza.js','noxXza.dev'],useCase:'NOXZA_EXE',contextInfo:{stanzaId:'A5FBA758891A16FD260767C2569F87E4',quotedMessage:{extendedTextMessage:{previewType:'NONE',inviteLinkGroupTypeV2:'DEFAULT'}}},forwardOrigin:'META_AI'}); }
  
  
  Object.defineProperty(__vxExports, "config", { enumerable: true, get: () => pluginConfig });
  Object.defineProperty(__vxExports, "handler", { enumerable: true, get: () => handler });
  return __vxExports
})
