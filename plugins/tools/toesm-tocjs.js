// tools/toesm-tocjs — satu file: metadata + kode fitur (gabungan dari engine7/plugins/tools/toesm-tocjs.js)
const __vx = require("../../lib/adapter/e7.js")
const __meta = {
  "name": "toesm",
  "command": [
    "toesm",
    "tocjs"
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
module.exports = __vx.plugin("tools/toesm-tocjs", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + '/toesm-tocjs.js'
  const __vxExports = {};
  const FEATURE_CREDIT = "Fitur by: Owner Bot";
  
  
  /*
  fitur : to esm to cjs 
  creator : WhatsApp Bot
  follow my channel 
  */
  
  const pluginConfig = {
    name: "toesm",
    alias: ["tocjs"],
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
  
  async function handler(m, { command }) {
    if (!m.quoted) return m.reply('✨ reply code nya')
  
    let q = m.quoted
    let text =
      q.text ||
      q.caption ||
      q.msg?.text ||
      q.msg?.caption ||
      q.msg?.conversation ||
      q.msg?.extendedTextMessage?.text ||
      q.message?.conversation ||
      q.message?.extendedTextMessage?.text ||
      ''
  
    let input = text.trim()
    let output = ''
  
    if (command === 'toesm') {
      output = input
        .replace(/const (.*?) = require\(['"](.*?)['"]\)/g, 'import $1 from "$2"')
        .replace(/let (.*?) = require\(['"](.*?)['"]\)/g, 'import $1 from "$2"')
        .replace(/var (.*?) = require\(['"](.*?)['"]\)/g, 'import $1 from "$2"')
        .replace(/module\.exports\s*=\s*/g, 'export default ')
        .replace(/exports\.(\w+)\s*=\s*/g, 'export const $1 = ')
    }
  
    if (command === 'tocjs') {
      output = input
        .replace(/import\s+(.*?)\s+from\s+['"](.*?)['"]/g, 'const $1 = require("$2")')
        .replace(/export default /g, 'module.exports = ')
        .replace(/export const (\w+)/g, 'exports.$1')
        .replace(/export function (\w+)/g, 'exports.$1 = function')
    }
  
    m.reply(output)
  }
  
  
  
  Object.defineProperty(__vxExports, "FEATURE_CREDIT", { enumerable: true, get: () => FEATURE_CREDIT });
  Object.defineProperty(__vxExports, "config", { enumerable: true, get: () => pluginConfig });
  Object.defineProperty(__vxExports, "handler", { enumerable: true, get: () => handler });
  return __vxExports
})
