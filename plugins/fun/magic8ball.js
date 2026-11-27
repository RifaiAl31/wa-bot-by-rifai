// fun/magic8ball — satu file: metadata + kode fitur (gabungan dari engine5/plugins/fun/magic8ball.js)
const __vx = require("../../lib/adapter/e5.js")
const __meta = {
  "name": "magic8ball",
  "command": [
    "magic8ball"
  ],
  "category": "fun",
  "desc": "Fitur magic8ball",
  "usage": ".magic8ball",
  "limit": true
}
const __vdir = require('path').join(__dirname, "../../lib/ext/plugins/fun").split('\\').join('/')
module.exports = __vx.plugin("fun/magic8ball", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + '/magic8ball.js'
  const __vxExports = {};
  const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
  
  const ANSWERS = [
  	'Ya, pasti!', 'Tidak diragukan lagi.', 'Sepertinya begitu.',
  	'Tanya lagi nanti.', 'Lebih baik tidak kuberitahu sekarang.',
  	'Jangan terlalu berharap.', 'Sangat meragukan.', 'Tidak mungkin.', 'Bisa jadi.',
  	'Peluangnya 100%!'
  ];
  
  const handler = async (m, { sock, text, args }) => {
  	const q = (args.join(' ') || text || '').trim();
  
  	await sock.sendMessage(m.chat, { react: { text: '🎱', key: m.key } }).catch(() => null);
  
  	const caption = `🎱 *MAGIC 8-BALL* 🎱\n\n` +
  		(q ? `❓ *Pertanyaan:* "${q}"\n\n` : '') +
  		`🔮 *Jawaban:* *${pick(ANSWERS)}*\n\n` +
  		`© ${global.namaBot}`;
  
  	return sock.sendMessage(m.chat, { text: caption }, { quoted: m });
  };
  
  handler.help = ['magic8ball'];
  handler.tags = ['fun'];
  handler.command = ['magic8ball', '8ball'];
  handler.limit = true
  
  const __vxDefault = handler;
  Object.defineProperty(__vxExports, "default", { enumerable: true, get: () => __vxDefault });
  return __vxExports
})
