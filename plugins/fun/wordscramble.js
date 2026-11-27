// fun/wordscramble — satu file: metadata + kode fitur (gabungan dari engine5/plugins/fun/wordscramble.js)
const __vx = require("../../lib/adapter/e5.js")
const __meta = {
  "name": "wordscramble",
  "command": [
    "wordscramble",
    "scramble",
    "jawabscramble"
  ],
  "category": "fun",
  "desc": "Fitur wordscramble",
  "usage": ".wordscramble",
  "limit": true
}
const __vdir = require('path').join(__dirname, "../../lib/ext/plugins/fun").split('\\').join('/')
module.exports = __vx.plugin("fun/wordscramble", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + '/wordscramble.js'
  const __vxExports = {};
  const SESSIONS = new Map();
  
  const SCRAMBLE_DATA = [
  	{ word: 'KOMPUTER', hint: 'Alat elektronik untuk mengolah data' },
  	{ word: 'PETUALANGAN', hint: 'Perjalanan penuh tantangan dan eksplorasi' },
  	{ word: 'PERSAHABATAN', hint: 'Hubungan dekat dan tulus antar teman' },
  	{ word: 'KEBAHAGIAAN', hint: 'Perasaan senang, tenang, dan puas' },
  	{ word: 'TEKNOLOGI', hint: 'Ilmu terapan untuk memudahkan kehidupan manusia' },
  	{ word: 'IMAJINASI', hint: 'Daya khayal atau kreativitas dalam pikiran' },
  	{ word: 'PROGRAMMER', hint: 'Profesi pembuat dan pengembang perangkat lunak' },
  	{ word: 'KECERDASAN', hint: 'Kemampuan berpikir dan menyelesaikan masalah' },
  	{ word: 'ASTRONOT', hint: 'Orang yang dilatih untuk menjelajahi luar angkasa' },
  	{ word: 'NUSANTARA', hint: 'Sebutan kepulauan di wilayah Indonesia' },
  	{ word: 'MATEMATIKA', hint: 'Ilmu tentang bilangan, rumus, dan kalkulasi' },
  	{ word: 'SMARTPHONE', hint: 'Ponsel pintar dengan beragam fitur dan aplikasi' },
  	{ word: 'LABORATORIUM', hint: 'Ruangan khusus untuk riset dan eksperimen ilmiah' },
  	{ word: 'HEMISFER', hint: 'Belahan bola bumi atau otak' },
  	{ word: 'FOTOSINTESIS', hint: 'Proses tumbuhan hijau membuat makanannya sendiri' }
  ];
  
  const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
  const randInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
  
  function scrambleWord(word) {
  	const arr = word.split('');
  	for (let i = arr.length - 1; i > 0; i--) {
  		const j = randInt(0, i);
  		[arr[i], arr[j]] = [arr[j], arr[i]];
  	}
  	return arr.join('');
  }
  
  const handler = async (m, { sock, text, args, usedPrefix, command }) => {
  	const cmd = command.toLowerCase();
  	const prefix = usedPrefix || '.';
  
  	if (cmd === 'wordscramble' || cmd === 'scramble' || cmd === 'tebakkata') {
  		const item = pick(SCRAMBLE_DATA);
  		SESSIONS.set(m.chat, item.word.toLowerCase());
  
  		await sock.sendMessage(m.chat, { react: { text: '🔀', key: m.key } }).catch(() => null);
  
  		const message = `🔀 *TEBAK KATA ACAK* 🔀\n\n` +
  			`Susunan huruf: *${scrambleWord(item.word)}*\n` +
  			`💡 Hint: _${item.hint}_\n\n` +
  			`Jawab dengan: *${prefix}jawabscramble [kata]*\n\n` +
  			`© ${global.namaBot}`;
  
  		return sock.sendMessage(m.chat, { text: message }, { quoted: m });
  	}
  
  	if (cmd === 'jawabscramble') {
  		const ans = (args.join(' ') || text || '').toLowerCase().trim();
  		const correct = SESSIONS.get(m.chat);
  
  		if (!correct) {
  			return sock.sendMessage(m.chat, {
  				text: `❌ Belum ada game aktif di chat ini!\nKetik *${prefix}wordscramble* untuk memulai game baru.\n\n© ${global.namaBot}`
  			}, { quoted: m });
  		}
  
  		if (!ans) {
  			return sock.sendMessage(m.chat, {
  				text: `📌 *Format Salah!*\nKetik kata tebakanmu: *${prefix}jawabscramble <kata>*\n\nContoh: *${prefix}jawabscramble komputer*\n\n© ${global.namaBot}`
  			}, { quoted: m });
  		}
  
  		if (ans === correct) {
  			SESSIONS.delete(m.chat);
  			await sock.sendMessage(m.chat, { react: { text: '🎉', key: m.key } }).catch(() => null);
  
  			const message = `🎉 *BENAR SEKALI!* 🎉\n\n` +
  				`Kata yang tepat adalah: *${correct.toUpperCase()}*! Hebat!\n\n` +
  				`© ${global.namaBot}`;
  
  			return sock.sendMessage(m.chat, { text: message }, { quoted: m });
  		} else {
  			await sock.sendMessage(m.chat, { react: { text: '❌', key: m.key } }).catch(() => null);
  
  			const message = `❌ *SALAH!*\n\n` +
  				`Tebakanmu belum tepat, ayo coba tebak lagi!\n\n` +
  				`© ${global.namaBot}`;
  
  			return sock.sendMessage(m.chat, { text: message }, { quoted: m });
  		}
  	}
  };
  
  handler.help = ['wordscramble', 'jawabscramble'];
  handler.tags = ['fun'];
  handler.command = ['wordscramble', 'scramble', 'tebakkata', 'jawabscramble'];
  handler.limit = true
  
  const __vxDefault = handler;
  Object.defineProperty(__vxExports, "default", { enumerable: true, get: () => __vxDefault });
  return __vxExports
})
