// rpg/rpg-buah — satu file: metadata + kode fitur (gabungan dari engine2/plugins/rpg/rpg-buah.js)
const __vx = require("../../lib/adapter/e2.js")
const __meta = {
  "command": [
    "buah",
    "fruit",
    "listfruit",
    "listfruits"
  ],
  "category": "rpg",
  "owner": false,
  "group": false,
  "admin": false,
  "botAdmin": false,
  "desc": "Fitur buah (dari Bot package)"
}
const __vdir = require('path').join(__dirname, "../../lib/ext/plugins/rpg").split('\\').join('/')
module.exports = __vx.plugin("rpg/rpg-buah", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + '/rpg-buah.js'
  const __vxExports = {};
  let handler = async (m, { usedPrefix }) => {
  	let user = global.db.data.users[m.sender];
  	let ini_txt = `[ *GUDANG BUAH KAMU* ]\n\n`;
  	ini_txt += `${user.pisang} Pisang\n`;
  	ini_txt += `${user.anggur} Anggur\n`;
  	ini_txt += `${user.mangga} Mangga\n`;
  	ini_txt += `${user.jeruk} Jeruk\n`;
  	ini_txt += `${user.apel} Apel\n\n`;
  	ini_txt += `Ketik *${usedPrefix}jual* Untuk Menjual.`;
  	m.reply(ini_txt);
  };
  
  handler.help = ['listbuah'];
  handler.tags = ['rpg'];
  handler.command = /^((list)?(buah|fruits?))$/i;
  
  const __vxDefault = handler;
  
  Object.defineProperty(__vxExports, "default", { enumerable: true, get: () => __vxDefault });
  return __vxExports
})
