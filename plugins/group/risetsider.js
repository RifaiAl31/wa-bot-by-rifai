// group/risetsider — satu file: metadata + kode fitur (gabungan dari engine7/plugins/group/risetsider.js)
const __vx = require("../../lib/adapter/e7.js")
const __meta = {
  "name": "risetsider",
  "command": [
    "risetsider"
  ],
  "category": "group",
  "desc": "",
  "usage": "",
  "owner": false,
  "group": true,
  "private": false,
  "premium": false,
  "cooldown": 10,
  "energi": 0,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
}
const __vdir = require('path').join(__dirname, "../../lib/ext/plugins/group").split('\\').join('/')
module.exports = __vx.plugin("group/risetsider", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + '/risetsider.js'
  const __vxExports = {};
  const { resetSider } = require("../../lib/ext/src/lib/listsider.js");
  const pluginConfig = {
  name: 'risetsider',
  alias: [],
  category: 'group',
  isGroup: true,
  isAdmin: true,
  cooldown: 10,
  isEnabled: true
  }
  
  async function handler(m){
  
  resetSider(m.chat)
  
  m.reply(`✅ List sider di group ini sudah di riset.`)
  
  }
  
  
  
  Object.defineProperty(__vxExports, "config", { enumerable: true, get: () => pluginConfig });
  Object.defineProperty(__vxExports, "handler", { enumerable: true, get: () => handler });
  return __vxExports
})
