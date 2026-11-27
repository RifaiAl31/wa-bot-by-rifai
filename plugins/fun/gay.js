// fun/gay — satu file: metadata + kode fitur (gabungan dari engine3/plugins/fun/gay.js)
const __vx = require("../../lib/adapter/e3.js")
const __meta = {
  "name": "gay",
  "command": [
    "gay",
    "howgay"
  ],
  "category": "fun",
  "desc": "Menunjuk member paling gay di grup",
  "usage": ".gay",
  "owner": false,
  "group": true,
  "private": false,
  "premium": false,
  "admin": false,
  "botAdmin": false,
  "cooldown": 10,
  "energi": 2,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
}
const __vdir = require('path').join(__dirname, "../../lib/ext/plugins/fun").split('\\').join('/')
module.exports = __vx.plugin("fun/gay", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + '/gay.js'
  const __vxDef = (m) => (m && m.__esModule ? m.default : m);
  const __vxExports = {};
  const config = __vxDef(require("../../lib/ext/config.e3.js"));
  const pluginConfig = {
      name: 'gay',
      alias: ['howgay'],
      category: 'fun',
      description: 'Menunjuk member paling gay di grup',
      usage: '.gay',
      isGroup: true,
      isBotAdmin: false,
      isAdmin: false,
      cooldown: 10,
      energi: 2,
      isEnabled: true
  };
  
  async function handler(m, { sock }) {
      if (!m.isGroup) return m.reply(config.messages.groupOnly);
      const groupMetadata = m.groupMetadata;
      const participants = groupMetadata.participants;
      const member = participants.map(u => u.jid);
      const orang1 = member[Math.floor(Math.random() * member.length)];
      const orang2 = member[Math.floor(Math.random() * member.length)];
      const text = `@${orang1.split('@')[0]} *Nge gay sama* @${orang2.split('@')[0]}`;
      await m.reply(text, { mentions: [orang1, orang2] })
  }
  
  
  Object.defineProperty(__vxExports, "config", { enumerable: true, get: () => pluginConfig });
  Object.defineProperty(__vxExports, "handler", { enumerable: true, get: () => handler });
  return __vxExports
})
