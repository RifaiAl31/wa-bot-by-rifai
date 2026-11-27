// fun/secretadmirer — satu file: metadata + kode fitur (gabungan dari engine5/plugins/fun/secretadmirer.js)
const __vx = require("../../lib/adapter/e5.js")
const __meta = {
  "name": "secretadmirer",
  "command": [
    "secretadmirer"
  ],
  "category": "fun",
  "desc": "Fitur secretadmirer",
  "usage": ".secretadmirer",
  "limit": true
}
const __vdir = require('path').join(__dirname, "../../lib/ext/plugins/fun").split('\\').join('/')
module.exports = __vx.plugin("fun/secretadmirer", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + '/secretadmirer.js'
  const __vxExports = {};
  const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
  
  const LINES = [
  	'Seseorang di grup ini diam-diam selalu memperhatikan chat kamu.',
  	'Ada yang selalu tersenyum saat melihat foto profil atau pesanmu.',
  	'Seseorang menyimpan pesan lucumu sebagai favorit.',
  	'Ada seseorang yang merasa hari-harinya lebih berwarna karena kamu.'
  ];
  
  const handler = async (m, { sock }) => {
  	await sock.sendMessage(m.chat, { react: { text: '💌', key: m.key } }).catch(() => null);
  
  	const caption = `💌 *PESAN MISTERIUS* 💌\n\n` +
  		`"${pick(LINES)}"\n\n` +
  		`© ${global.namaBot}`;
  
  	return sock.sendMessage(m.chat, { text: caption }, { quoted: m });
  };
  
  handler.help = ['secretadmirer'];
  handler.tags = ['fun'];
  handler.command = ['secretadmirer'];
  handler.limit = true
  
  const __vxDefault = handler;
  Object.defineProperty(__vxExports, "default", { enumerable: true, get: () => __vxDefault });
  return __vxExports
})
