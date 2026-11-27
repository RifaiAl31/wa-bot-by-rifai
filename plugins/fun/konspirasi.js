// fun/konspirasi — satu file: metadata + kode fitur (gabungan dari engine5/plugins/fun/konspirasi.js)
const __vx = require("../../lib/adapter/e5.js")
const __meta = {
  "name": "konspirasi",
  "command": [
    "konspirasi",
    "conspiracy"
  ],
  "category": "fun",
  "desc": "Fitur konspirasi",
  "usage": ".konspirasi",
  "limit": true
}
const __vdir = require('path').join(__dirname, "../../lib/ext/plugins/fun").split('\\').join('/')
module.exports = __vx.plugin("fun/konspirasi", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + '/konspirasi.js'
  const __vxExports = {};
  const CONSPIRACY_FUN = [
  	'Burung itu sebenarnya drone pengawas pemerintah.',
  	'Kucing tidur 16 jam sehari karena merencanakan dominasi dunia.',
  	'Setiap kali WiFi lambat, itu karena tetangga lagi download alam semesta paralel.',
  	'Semua kaus kaki yang hilang di mesin cuci sebenarnya diculik dimensi lain.',
  	'Bulan sebenarnya adalah satelit buatan raksasa yang dipakai untuk pemancar mimpi manusia.',
  	'Cermin di rumah kita sebenarnya pintu ke dimensi lain yang cuma terbuka kalau kita gak lihat.'
  ];
  
  const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
  
  const handler = async (m, { sock }) => {
  	await sock.sendMessage(m.chat, { react: { text: '👽', key: m.key } }).catch(() => null);
  
  	const caption = `👽 *TEORI KONSPIRASI RANDOM* 👽\n\n` +
  		`${pick(CONSPIRACY_FUN)}\n\n` +
  		`_(murni untuk hiburan ya!)_\n\n` +
  		`© ${global.namaBot}`;
  
  	return sock.sendMessage(m.chat, { text: caption }, { quoted: m });
  };
  
  handler.help = ['konspirasi'];
  handler.tags = ['fun'];
  handler.command = ['konspirasi', 'conspiracy'];
  handler.limit = true
  
  const __vxDefault = handler;
  Object.defineProperty(__vxExports, "default", { enumerable: true, get: () => __vxDefault });
  return __vxExports
})
