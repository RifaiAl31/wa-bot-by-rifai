// fun/thisorthat — satu file: metadata + kode fitur (gabungan dari engine5/plugins/fun/thisorthat.js)
const __vx = require("../../lib/adapter/e5.js")
const __meta = {
  "name": "thisorthat",
  "command": [
    "thisorthat",
    "pilihmana"
  ],
  "category": "fun",
  "desc": "Fitur thisorthat",
  "usage": ".thisorthat",
  "limit": true
}
const __vdir = require('path').join(__dirname, "../../lib/ext/plugins/fun").split('\\').join('/')
module.exports = __vx.plugin("fun/thisorthat", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + '/thisorthat.js'
  const __vxExports = {};
  const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
  
  const PAIRS = [
  	['Kucing', 'Anjing'], ['Pagi Hari', 'Malam Hari'], ['Pantai', 'Gunung'],
  	['Teh Manis', 'Kopi Susu'], ['Nonton Film', 'Baca Buku'], ['Musim Panas', 'Musim Hujan'],
  	['Mie Goreng', 'Mie Kuah'], ['Game PC', 'Game Mobile'], ['Uang Banyak', 'Waktu Luang']
  ];
  
  const handler = async (m, { sock }) => {
  	await sock.sendMessage(m.chat, { react: { text: '⚖️', key: m.key } }).catch(() => null);
  
  	const [a, b] = pick(PAIRS);
  	const caption = `⚖️ *THIS OR THAT* ⚖️\n\n` +
  		`*${a}* 🆚 *${b}*\n\n` +
  		`Pilih salah satu dan tuliskan alasanmu!\n\n` +
  		`© ${global.namaBot}`;
  
  	return sock.sendMessage(m.chat, { text: caption }, { quoted: m });
  };
  
  handler.help = ['thisorthat'];
  handler.tags = ['fun'];
  handler.command = ['thisorthat', 'pilihmana'];
  handler.limit = true
  
  const __vxDefault = handler;
  Object.defineProperty(__vxExports, "default", { enumerable: true, get: () => __vxDefault });
  return __vxExports
})
