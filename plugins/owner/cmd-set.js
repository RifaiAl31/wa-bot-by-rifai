// _system/cmd-set — satu file: metadata + kode fitur (gabungan dari engine6/plugins/_system/cmd-set.js)
const __vx = require("../../lib/adapter/e6.js")
const __meta = {
  "name": "setcmd",
  "command": [
    "setcmd"
  ],
  "category": "owner",
  "desc": "Perintah setcmd",
  "usage": "setcmd <teks>",
  "owner": false,
  "group": false,
  "admin": false,
  "botAdmin": false,
  "premium": false
}
const __vdir = require('path').join(__dirname, "../../lib/ext/plugins/_system").split('\\').join('/')
module.exports = __vx.plugin("_system/cmd-set", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + '/cmd-set.js'
  const module = { exports: {} }; const exports = module.exports;
  module.exports = async function (__vanxone_imp, __vanxone_meta) {
  
  
  let handler = async (m, { text, usedPrefix, command }) => {
  	if (!m.quoted) throw `Balas stiker dengan perintah *${usedPrefix + command}*`;
  	if (!m.quoted.fileSha256) throw 'SHA256 Hash Missing';
  	if (!text) throw `Penggunaan:\n${usedPrefix + command} <teks>\n\nContoh:\n${usedPrefix + command} tes`;
  	let sticker = db.data.sticker;
  	let hash = m.quoted.fileSha256;
  	if (sticker[hash] && sticker[hash].locked) throw 'Kamu tidak memiliki izin untuk mengubah perintah stiker ini';
  	sticker[hash] = {
  		text,
  		mentionedJid: m.mentionedJid,
  		creator: m.sender,
  		at: Date.now(),
  		locked: false,
  	};
  	m.reply(`Success!`);
  };
  
  handler.help = ['setcmd <teks>'];
  handler.tags = ['database'];
  handler.command = ['setcmd'];
  
  const __vanxone_default = handler;;
  
  ;return { default: __vanxone_default };
  }
  
  return module.exports
})
