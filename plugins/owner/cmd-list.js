// _system/cmd-list — satu file: metadata + kode fitur (gabungan dari engine6/plugins/_system/cmd-list.js)
const __vx = require("../../lib/adapter/e6.js")
const __meta = {
  "name": "listcmd",
  "command": [
    "listcmd"
  ],
  "category": "owner",
  "desc": "Perintah listcmd",
  "usage": "listcmd",
  "owner": false,
  "group": false,
  "admin": false,
  "botAdmin": false,
  "premium": false
}
const __vdir = require('path').join(__dirname, "../../lib/ext/plugins/_system").split('\\').join('/')
module.exports = __vx.plugin("_system/cmd-list", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + '/cmd-list.js'
  const module = { exports: {} }; const exports = module.exports;
  module.exports = async function (__vanxone_imp, __vanxone_meta) {
  
  
  let handler = async (m, { conn }) => {
  	conn.reply(
  		m.chat,
  		`
  *DAFTAR CMD*
  \`\`\`
  ${Object.entries(global.db.data.sticker)
  	.map(([key, value], index) => `${index + 1}. ${value.locked ? `(Terkunci) ${key}` : key} : ${value.text}`)
  	.join('\n')}
  \`\`\`
  `.trim(),
  		null,
  		{
  			mentions: Object.values(global.db.data.sticker)
  				.map((x) => x.mentionedJid)
  				.reduce((a, b) => [...a, ...b], []),
  		}
  	);
  };
  
  handler.help = ['listcmd'];
  handler.tags = ['database'];
  handler.command = ['listcmd'];
  
  const __vanxone_default = handler;;
  
  ;return { default: __vanxone_default };
  }
  
  return module.exports
})
