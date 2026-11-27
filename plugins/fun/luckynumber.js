// fun/luckynumber — satu file: metadata + kode fitur (gabungan dari engine5/plugins/fun/luckynumber.js)
const __vx = require("../../lib/adapter/e5.js")
const __meta = {
  "name": "luckynumber",
  "command": [
    "luckynumber",
    "angkehoki"
  ],
  "category": "fun",
  "desc": "Fitur luckynumber",
  "usage": ".luckynumber",
  "limit": true
}
const __vdir = require('path').join(__dirname, "../../lib/ext/plugins/fun").split('\\').join('/')
module.exports = __vx.plugin("fun/luckynumber", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + '/luckynumber.js'
  const __vxExports = {};
  const randInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
  
  const handler = async (m, { sock }) => {
  	await sock.sendMessage(m.chat, { react: { text: '🍀', key: m.key } }).catch(() => null);
  
  	const number = randInt(1, 99);
  	const text = `🍀 *ANGKA KEBERUNTUNGAN HARI INI* 🍀\n\n` +
  		`🎯 Angka Hoki: *${number}*\n\n` +
  		`Semoga harimu penuh keberuntungan!\n\n` +
  		`© ${global.namaBot}`;
  
  	return sock.sendMessage(m.chat, { text }, { quoted: m });
  };
  
  handler.help = ['luckynumber'];
  handler.tags = ['fun'];
  handler.command = ['luckynumber', 'angkehoki'];
  handler.limit = true
  
  const __vxDefault = handler;
  Object.defineProperty(__vxExports, "default", { enumerable: true, get: () => __vxDefault });
  return __vxExports
})
