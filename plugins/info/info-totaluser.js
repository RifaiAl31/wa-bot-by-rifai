// info/info-totaluser — satu file: metadata + kode fitur (gabungan dari engine2/plugins/info/info-totaluser.js)
const __vx = require("../../lib/adapter/e2.js")
const __meta = {
  "command": [
    "database"
  ],
  "category": "info",
  "owner": false,
  "group": false,
  "admin": false,
  "botAdmin": false,
  "desc": "Fitur database (dari Bot package)"
}
const __vdir = require('path').join(__dirname, "../../lib/ext/plugins/info").split('\\').join('/')
module.exports = __vx.plugin("info/info-totaluser", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + '/info-totaluser.js'
  const __vxExports = {};
  let handler = async (m) => {
  	let totalreg = Object.keys(global.db.data.users).length;
  	let rtotalreg = Object.values(global.db.data.users).filter((user) => user.registered == true).length;
  	let kon = `乂 *U S E R*
      
  ╭╾• *Current Database ${totalreg} User*
  =
  ╰╾• *Currently Registered ${rtotalreg} User*`;
  	await m.reply(kon);
  };
  handler.help = ['totaluser'];
  handler.tags = ['info'];
  handler.command = /^(pengguna|(jumlah)?database|totaluser)$/i;
  
  const __vxDefault = handler;
  
  Object.defineProperty(__vxExports, "default", { enumerable: true, get: () => __vxDefault });
  return __vxExports
})
