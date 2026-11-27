// _system/cmd-lock — satu file: metadata + kode fitur (gabungan dari engine6/plugins/_system/cmd-lock.js)
const __vx = require("../../lib/adapter/e6.js")
const __meta = {
  "name": "unlockcmd",
  "command": [
    "unlockcmd"
  ],
  "category": "owner",
  "desc": "Perintah unlockcmd",
  "usage": "un",
  "owner": false,
  "group": false,
  "admin": false,
  "botAdmin": false,
  "premium": false
}
const __vdir = require('path').join(__dirname, "../../lib/ext/plugins/_system").split('\\').join('/')
module.exports = __vx.plugin("_system/cmd-lock", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + '/cmd-lock.js'
  const module = { exports: {} }; const exports = module.exports;
  module.exports = async function (__vanxone_imp, __vanxone_meta) {
  
  
  let handler = async (m, { command }) => {
  	if (!m.quoted) throw 'Tag Pesan!';
  	if (!m.quoted.fileSha256) throw 'SHA256 Hash Missing';
  	let sticker = db.data.sticker;
  	let hash = m.quoted.fileSha256;
  	if (!(hash in sticker)) throw 'Hash not found in database';
  	sticker[hash].locked = !/^un/i.test(command);
  	m.reply('Done!');
  };
  handler.help = ['un', ''].map((v) => v + 'lockcmd');
  handler.tags = ['database'];
  handler.command = /^(un)?lockcmd$/i;
  
  const __vanxone_default = handler;;
  
  ;return { default: __vanxone_default };
  }
  
  return module.exports
})
