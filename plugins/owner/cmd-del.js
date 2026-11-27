// _system/cmd-del — satu file: metadata + kode fitur (gabungan dari engine6/plugins/_system/cmd-del.js)
const __vx = require("../../lib/adapter/e6.js")
const __meta = {
  "name": "delcmd",
  "command": [
    "delcmd"
  ],
  "category": "owner",
  "desc": "Perintah delcmd",
  "usage": "delcmd",
  "owner": false,
  "group": false,
  "admin": false,
  "botAdmin": false,
  "premium": false
}
const __vdir = require('path').join(__dirname, "../../lib/ext/plugins/_system").split('\\').join('/')
module.exports = __vx.plugin("_system/cmd-del", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + '/cmd-del.js'
  const module = { exports: {} }; const exports = module.exports;
  module.exports = async function (__vanxone_imp, __vanxone_meta) {
  
  
  let handler = async (m) => {
  	let hash;
  	if (m.quoted && m.quoted.fileSha256) hash = m.quoted.fileSha256;
  	if (!hash) throw `Tidak ada hash`;
  	let sticker = global.db.data.sticker;
  	if (sticker[hash] && sticker[hash].locked) throw 'Kamu tidak memiliki izin untuk menghapus perintah stiker ini';
  	delete sticker[hash];
  	m.reply(`Berhasil!`);
  };
  
  handler.help = ['delcmd'];
  handler.tags = ['database'];
  handler.command = ['delcmd'];
  
  const __vanxone_default = handler;;
  
  ;return { default: __vanxone_default };
  }
  
  return module.exports
})
