// _system/@verify — satu file: metadata + kode fitur (gabungan dari engine6/plugins/_system/@verify.js)
const __vx = require("../../lib/adapter/e6.js")
const __meta = {
  "name": "@verify",
  "command": [
    "@verify"
  ],
  "category": "owner",
  "desc": "Perintah @verify",
  "usage": "@verify",
  "owner": false,
  "group": false,
  "admin": false,
  "botAdmin": false,
  "premium": false
}
const __vdir = require('path').join(__dirname, "../../lib/ext/plugins/_system").split('\\').join('/')
module.exports = __vx.plugin("_system/@verify", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + '/@verify.js'
  const module = { exports: {} }; const exports = module.exports;
  module.exports = async function (__vanxone_imp, __vanxone_meta) {
  
  const __ni_0 = await __vanxone_imp("crypto"); const createHash = __ni_0["createHash"];
  
  let handler = async (m, { text, usedPrefix }) => {
  let user = global.db.data.users[m.sender]
  if(user.registered !== false) throw 'Kamu Sudah mendaftar!!\nIngin daftar ulang? ketik unreg'
      user.registered = true
      let sn = createHash('md5').update(m.sender).digest('hex')
      let p = `*Selamat Kamu sudah Mendaftar ✅*\n•Ketik Menu Untuk Melanjutkan\n\n•Sn Kamu: *${sn}*`
      const arr = [
          { text: `*[ V ]*\n\n${p}`, timeout: 100 },
          { text:  `*[ V E ]*\n\n${p}`, timeout: 100 },
          { text:  `*[ V E R ]*\n\n${p}`, timeout: 100 },
          { text:  `*[ V E R I ]*\n\n${p}`, timeout: 100 },
          { text:  `*[ V E R I F ]*\n\n${p}`, timeout: 100 },
          { text:  `*[ V E R I F Y ]*\n\n${p}`, timeout: 100 },
          { text:  `*[ V E R I F Y   S ]*\n\n${p}`, timeout: 100 },
          { text:  `*[ V E R I F Y   S U ]*\n\n${p}`, timeout: 100 },
          { text:  `*[ V E R I F Y   S U C ]*\n\n${p}`, timeout: 100 },
          { text:  `*[ V E R I F Y   S U C C ]*\n\n${p}`, timeout: 100 },
          { text:  `*[ V E R I F Y   S U C C E ]*\n\n${p}`, timeout: 100 },
          { text:  `*[ V E R I F Y   S U C C E S ]*\n\n${p}`, timeout: 100 },
          { text:  `*[ V E R I F Y   S U C C E S S ]*\n\n${p}`, timeout: 100 },
      ];
  
      const lll = await conn.sendMessage(m.chat, { text: 'Sedang menverifikasi....' }, { quoted: m });
  
      for (let i = 0; i < arr.length; i++) {
          await new Promise(resolve => setTimeout(resolve, arr[i].timeout));
          await conn.relayMessage(m.chat, {
              protocolMessage: {
                  key: lll.key,
                  type: 14,
                  editedMessage: {
                      conversation: arr[i].text
                  }
              }
          }, {});
      }
  }
  
  handler.help = ['@verify']
  handler.tags = ['main']
  handler.customPrefix = /^(@verify)$/i
  handler.command = new RegExp
  
  const __vanxone_default = handler;
  ;return { default: __vanxone_default };
  }
  
  return module.exports
})
