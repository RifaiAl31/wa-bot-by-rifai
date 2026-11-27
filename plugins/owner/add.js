// owner/add — satu file: metadata + kode fitur (gabungan dari engine7/plugins/owner/add.js)
const __vx = require("../../lib/adapter/e7.js")
const __meta = {
  "name": "oadd",
  "command": [
    "oadd"
  ],
  "category": "owner",
  "desc": "Imported from WhatsApp Bot V4.6",
  "usage": "",
  "owner": true,
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
const __vdir = require('path').join(__dirname, "../../lib/ext/plugins/owner").split('\\').join('/')
module.exports = __vx.plugin("owner/add", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + '/add.js'
  const __vxDef = (m) => (m && m.__esModule ? m.default : m);
  const __vxNs = (m) => (m && m.__esModule ? m : (m !== null && (typeof m === 'object' || typeof m === 'function') ? Object.assign(Object.create(null), m, { default: m }) : { default: m }));
  const __vxExports = {};
  const FEATURE_CREDIT = "Fitur by: Owner Bot";
  
  
  const fetch = __vxDef(require("node-fetch"));
  /**
   * @type {import('@adiwajshing/baileys')}
   */
  const { getBinaryNodeChild, getBinaryNodeChildren } = (await Promise.resolve().then(() => __vxNs(require("../../lib/baileys-compat.mjs")))).default
  const pluginConfig = {
    name: "oadd",
    alias: [],
    category: "owner",
    description: "Imported from WhatsApp Bot V4.6",
    usage: "",
    example: "",
    isOwner: true,
    isPremium: false,
    isGroup: true,
    isPrivate: false,
    cooldown: 3,
    energi: 1,
    isEnabled: true,
  };
  
  async function handler(m, { sock, text, participants }) {
      const conn = sock;
      let _participants = participants.map(user => user.id)
      let users = (await Promise.all(
          text.split(',')
              .map(v => v.replace(/[^0-9]/g, ''))
              .filter(v => v.length > 4 && v.length < 20 && !_participants.includes(v + '@s.whatsapp.net'))
              .map(async v => [
                  v,
                  await conn.onWhatsApp(v + '@s.whatsapp.net')
              ])
      )).filter(v => v[1][0]?.exists).map(v => v[0] + '@c.us')
      const response = await conn.query({
          tag: 'iq',
          attrs: {
              type: 'set',
              xmlns: 'w:g2',
              to: m.chat,
          },
          content: users.map(jid => ({
              tag: 'add',
              attrs: {},
              content: [{ tag: 'participant', attrs: { jid } }]
          }))
      })
      const pp = await conn.profilePictureUrl(m.chat).catch(_ => null)
      const jpegThumbnail = pp ? await (await fetch(pp)).buffer() : Buffer.alloc(0)
      const add = getBinaryNodeChild(response, 'add')
      const participant = getBinaryNodeChildren(add, 'participant')
      for (const user of participant.filter(item => item.attrs.error == 403)) {
          const jid = user.attrs.jid
          const content = getBinaryNodeChild(user, 'add_request')
          const invite_code = content.attrs.code
          const invite_code_exp = content.attrs.expiration
          let teks = `Mengundang @${jid.split('@')[0]} menggunakan invite...`
          m.reply(teks, null, {
              mentions: conn.parseMention(teks)
          })
          await conn.sendGroupV4Invite(m.chat, jid, invite_code, invite_code_exp, await conn.getName(m.chat), 'Invitation to join my WhatsApp group', jpegThumbnail)
      }
  }
  
  handler.botAdmin = true
  
  
  
  Object.defineProperty(__vxExports, "FEATURE_CREDIT", { enumerable: true, get: () => FEATURE_CREDIT });
  Object.defineProperty(__vxExports, "config", { enumerable: true, get: () => pluginConfig });
  Object.defineProperty(__vxExports, "handler", { enumerable: true, get: () => handler });
  return __vxExports
})
