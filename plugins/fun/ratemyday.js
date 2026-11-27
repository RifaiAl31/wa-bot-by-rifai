// fun/ratemyday — satu file: metadata + kode fitur (gabungan dari engine5/plugins/fun/ratemyday.js)
const __vx = require("../../lib/adapter/e5.js")
const __meta = {
  "name": "ratemyday",
  "command": [
    "ratemyday"
  ],
  "category": "fun",
  "desc": "Fitur ratemyday",
  "usage": ".ratemyday",
  "limit": true
}
const __vdir = require('path').join(__dirname, "../../lib/ext/plugins/fun").split('\\').join('/')
module.exports = __vx.plugin("fun/ratemyday", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + '/ratemyday.js'
  const __vxExports = {};
  const randInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
  
  const handler = async (m, { sock }) => {
  	await sock.sendMessage(m.chat, { react: { text: '📅', key: m.key } }).catch(() => null);
  
  	const score = randInt(1, 10);
  	const comments = {
  		low: 'Hari yang cukup berat dan melelahkan, tapi besok pasti jauh lebih baik! Tetap semangat ya!',
  		mid: 'Hari yang cukup stabil dan oke, pertahankan energi positifmu!',
  		high: 'Hari yang sangat luar biasa indah, bersyukur dan nikmati harimu!'
  	};
  	const tier = score <= 3 ? 'low' : score <= 7 ? 'mid' : 'high';
  
  	const caption = `📅 *RATING HARI INI* 📅\n\n` +
  		`📊 Skor Harimu: *${score}/10*\n` +
  		`💬 _"${comments[tier]}"_\n\n` +
  		`© ${global.namaBot}`;
  
  	return sock.sendMessage(m.chat, { text: caption }, { quoted: m });
  };
  
  handler.help = ['ratemyday'];
  handler.tags = ['fun'];
  handler.command = ['ratemyday'];
  handler.limit = true
  
  const __vxDefault = handler;
  Object.defineProperty(__vxExports, "default", { enumerable: true, get: () => __vxDefault });
  return __vxExports
})
