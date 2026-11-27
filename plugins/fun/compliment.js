// fun/compliment — satu file: metadata + kode fitur (gabungan dari engine5/plugins/fun/compliment.js)
const __vx = require("../../lib/adapter/e5.js")
const __meta = {
  "name": "compliment",
  "command": [
    "compliment",
    "puji"
  ],
  "category": "fun",
  "desc": "Fitur compliment",
  "usage": ".compliment",
  "limit": true
}
const __vdir = require('path').join(__dirname, "../../lib/ext/plugins/fun").split('\\').join('/')
module.exports = __vx.plugin("fun/compliment", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + '/compliment.js'
  const __vxExports = {};
  const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
  const jidNum = (jid = '') => String(jid).split('@')[0].split(':')[0];
  
  const handler = async (m, { sock }) => {
  	const target = (m.mentionedJid && m.mentionedJid[0]) || (m.quoted ? m.quoted.sender : null);
  	const lines = [
  		'punya energi positif yang menular ke orang sekitarnya!',
  		'selalu bikin orang sekitar nyaman dan tersenyum.',
  		'punya potensi besar dan aura yang memikat!',
  		'adalah orang hebat yang pantas dibanggakan.',
  		'punya hati yang tulus dan selalu menghangatkan suasana.'
  	];
  	const puji = pick(lines);
  
  	await sock.sendMessage(m.chat, { react: { text: '✨', key: m.key } }).catch(() => null);
  
  	if (target) {
  		const text = `✨ @${jidNum(target)} ${puji}\n\n` +
  			`© ${global.namaBot}`;
  
  		return sock.sendMessage(m.chat, {
  			text,
  			mentions: [target]
  		}, { quoted: m });
  	} else {
  		const text = `✨ Kamu ${puji}\n\n` +
  			`© ${global.namaBot}`;
  
  		return sock.sendMessage(m.chat, { text }, { quoted: m });
  	}
  };
  
  handler.help = ['compliment'];
  handler.tags = ['fun'];
  handler.command = ['compliment', 'puji'];
  handler.limit = true
  
  const __vxDefault = handler;
  Object.defineProperty(__vxExports, "default", { enumerable: true, get: () => __vxDefault });
  return __vxExports
})
