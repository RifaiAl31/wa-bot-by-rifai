// economy/xp-unregister — satu file: metadata + kode fitur (gabungan dari engine6/plugins/economy/xp-unregister.js)
const __vx = require("../../lib/adapter/e6.js")
const __meta = {
  "name": "unregister",
  "command": [
    "unregister"
  ],
  "category": "rpg",
  "desc": "Perintah unregister",
  "usage": "unreg",
  "owner": false,
  "group": false,
  "admin": false,
  "botAdmin": false,
  "premium": false
}
const __vdir = require('path').join(__dirname, "../../lib/ext/plugins/economy").split('\\').join('/')
module.exports = __vx.plugin("economy/xp-unregister", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + '/xp-unregister.js'
  const module = { exports: {} }; const exports = module.exports;
  module.exports = async function (__vanxone_imp, __vanxone_meta) {
  
  
  let handler = async function (m, { args }) {
  	let user = global.db.data.users[m.sender];
  
  	if (!user.registered) {
  		return m.reply('Kamu belum terdaftar.');
  	}
  
  	if (!args[0]) {
  		return m.reply(
  `⚠️ *Konfirmasi Unregister*
  
  Ketik:
  .unreg yes
  
  untuk melanjutkan unregister.`
  		);
  	}
  
  	if (args[0].toLowerCase() !== 'yes') {
  		return m.reply('Batal unregister.');
  	}
  
  	user.registered = false;
  	user.name = '';
  	user.age = 0;
  
  	m.reply('```Success Unregister ✅```');
  };
  
  handler.help = ['unreg'];
  handler.tags = ['xp'];
  handler.command = /^unreg(ister)?$/i;
  handler.register = true;
  
  const __vanxone_default = handler;;
  ;return { default: __vanxone_default };
  }
  
  return module.exports
})
