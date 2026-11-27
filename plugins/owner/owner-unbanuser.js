// owner/owner-unbanuser — satu file: metadata + kode fitur (gabungan dari engine6/plugins/owner/owner-unbanuser.js)
const __vx = require("../../lib/adapter/e6.js")
const __meta = {
  "name": "unbanuser",
  "command": [
    "unbanuser"
  ],
  "category": "owner",
  "desc": "Perintah unbanuser",
  "usage": "unban",
  "owner": true,
  "group": false,
  "admin": false,
  "botAdmin": false,
  "premium": false
}
const __vdir = require('path').join(__dirname, "../../lib/ext/plugins/owner").split('\\').join('/')
module.exports = __vx.plugin("owner/owner-unbanuser", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + '/owner-unbanuser.js'
  const module = { exports: {} }; const exports = module.exports;
  module.exports = async function (__vanxone_imp, __vanxone_meta) {
  
  
  let handler = async (m, { text }) => {
  	if (!text) throw 'Who wants to be banned?';
  	let who;
  	if (m.isGroup) who = m.mentionedJid[0];
  	else who = m.chat;
  	if (!who) throw 'Tag??';
  	global.db.data.users[who].banned = false;
  	m.reply('Success!');
  };
  handler.help = ['unban'];
  handler.tags = ['owner'];
  handler.command = /^unban(user)?$/i;
  handler.owner = true;
  
  const __vanxone_default = handler;;
  
  ;return { default: __vanxone_default };
  }
  
  return module.exports
})
