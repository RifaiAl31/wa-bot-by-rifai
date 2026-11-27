// fun/randomemoji — satu file: metadata + kode fitur (gabungan dari engine5/plugins/fun/randomemoji.js)
const __vx = require("../../lib/adapter/e5.js")
const __meta = {
  "name": "randomemoji",
  "command": [
    "randomemoji"
  ],
  "category": "fun",
  "desc": "Fitur randomemoji",
  "usage": ".randomemoji",
  "limit": true
}
const __vdir = require('path').join(__dirname, "../../lib/ext/plugins/fun").split('\\').join('/')
module.exports = __vx.plugin("fun/randomemoji", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + '/randomemoji.js'
  const __vxExports = {};
  const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
  
  const EMOJIS = ['😀','😎','🤔','🥳','😴','🤯','🥶','😇','🤖','👻','🦄','🔥','💎','🌈','⚡','✨','🦊','🐱','🌸','🎉'];
  
  const handler = async (m, { sock }) => {
  	const emoji = pick(EMOJIS);
  
  	await sock.sendMessage(m.chat, { react: { text: emoji, key: m.key } }).catch(() => null);
  
  	const caption = `🎲 *Emoji Random:* ${emoji}\n\n` +
  		`© ${global.namaBot}`;
  
  	return sock.sendMessage(m.chat, { text: caption }, { quoted: m });
  };
  
  handler.help = ['randomemoji'];
  handler.tags = ['fun'];
  handler.command = ['randomemoji'];
  handler.limit = true
  
  const __vxDefault = handler;
  Object.defineProperty(__vxExports, "default", { enumerable: true, get: () => __vxDefault });
  return __vxExports
})
