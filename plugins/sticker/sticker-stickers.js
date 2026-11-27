// sticker/sticker-stickers — satu file: metadata + kode fitur (gabungan dari engine2/plugins/sticker/sticker-stickers.js)
const __vx = require("../../lib/adapter/e2.js")
const __meta = {
  "command": [
    "stickergif",
    "stikergif"
  ],
  "category": "sticker",
  "owner": false,
  "group": false,
  "admin": false,
  "botAdmin": false,
  "desc": "Fitur stickergif (dari Bot package)"
}
const __vdir = require('path').join(__dirname, "../../lib/ext/plugins/sticker").split('\\').join('/')
module.exports = __vx.plugin("sticker/sticker-stickers", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + '/sticker-stickers.js'
  const __vxExports = {};
  let handler = async (m, { text }) => {
  	let q = m.quoted ? m.quoted : m;
  	let mime = (q.msg || q).mimetype || '';
  
  	if (/image|video|webp/.test(mime)) {
  		if ((q.msg?.seconds || q.seconds) > 10) {
  			return m.reply('Video harus berdurasi di bawah 10 detik.');
  		}
  
  		let media = await q.download();
  		let exif;
  		if (text) {
  			const [packname, author] = text.split(/[,|\-+&]/);
  			exif = { packName: packname || '', packPublish: author || '' };
  		}
  		conn.sendSticker(m.chat, media, m, exif);
  	} else {
  		m.reply('Kirim atau reply media untuk dijadikan stiker.');
  	}
  };
  
  handler.help = ['sticker'];
  handler.tags = ['sticker'];
  handler.command = /^s(tic?ker)?(gif)?$/i;
  handler.register = true;
  
  const __vxDefault = handler;
  
  Object.defineProperty(__vxExports, "default", { enumerable: true, get: () => __vxDefault });
  return __vxExports
})
