// maker/bgapi — satu file: metadata + kode fitur (gabungan dari engine5/plugins/maker/bgapi.js)
const __vx = require("../../lib/adapter/e5.js")
const __meta = {
  "name": "bgapi",
  "command": [
    "bgapi"
  ],
  "category": "image",
  "desc": "Fitur bgapi",
  "usage": ".bgapi",
  "limit": true
}
const __vdir = require('path').join(__dirname, "../../lib/ext/plugins/maker").split('\\').join('/')
module.exports = __vx.plugin("maker/bgapi", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + '/bgapi.js'
  const __vxExports = {};
  const { createCanvas, loadImage } = require("@napi-rs/canvas");
  
  const BACKGROUND_URL = 'https://raw.githubusercontent.com/sahrilcode/cdn3/main/uploads/648fda-1791629493946.jpg';
  
  async function removeBgNet(buffer) {
  	const blob = new Blob([buffer], { type: 'image/png' });
  	const form = new FormData();
  	form.append('image', blob, 'image.png');
  	form.append('format', 'png');
  	form.append('model', 'v1');
  
  	const res = await fetch('https://api2.pixelcut.app/image/matte/v1', {
  		method: 'POST',
  		headers: {
  			'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
  			'x-client-version': 'web:pixa.com:4a5b0af2'
  		},
  		body: form
  	});
  
  	if (!res.ok) throw new Error(`Status ${res.status}`);
  	return Buffer.from(await res.arrayBuffer());
  }
  
  const handler = async (m, { sock, qmsg, mime, reply, usedPrefix, command }) => {
  	const isMedia = /image|sticker/.test(mime || '');
  
  	if (!isMedia) {
  		return reply(`❌ *Cara Penggunaan:*\nKirim atau reply gambar/stiker dengan *${usedPrefix + command}*`);
  	}
  
  	await sock.sendMessage(m.chat, { react: { text: '🕒', key: m.key } }).catch(() => null);
  
  	let mediaBuffer;
  	try {
  		mediaBuffer = await qmsg.download();
  	} catch (_) {}
  
  	if (!mediaBuffer) {
  		await sock.sendMessage(m.chat, { react: { text: '❌', key: m.key } }).catch(() => null);
  		return reply('❌ Gagal mengunduh gambar/stiker.');
  	}
  
  	let transparentBuffer;
  	try {
  		transparentBuffer = await removeBgNet(mediaBuffer);
  	} catch (err) {
  		transparentBuffer = mediaBuffer;
  	}
  
  	let targetImg;
  	let bgImg;
  	try {
  		targetImg = await loadImage(transparentBuffer);
  		bgImg = await loadImage(BACKGROUND_URL);
  	} catch (e) {
  		await sock.sendMessage(m.chat, { react: { text: '❌', key: m.key } }).catch(() => null);
  		return reply('❌ Gagal memuat gambar/background.');
  	}
  
  	const canvasWidth = bgImg.width;
  	const canvasHeight = bgImg.height;
  
  	const canvas = createCanvas(canvasWidth, canvasHeight);
  	const ctx = canvas.getContext('2d');
  
  	ctx.drawImage(bgImg, 0, 0, canvasWidth, canvasHeight);
  
  	let scale;
  	const isPortrait = targetImg.height > targetImg.width;
  
  	if (isPortrait) {
  		scale = canvasHeight / targetImg.height;
  	} else {
  		scale = (canvasWidth * 0.75) / targetImg.width;
  	}
  
  	let fgWidth = targetImg.width * scale;
  	let fgHeight = targetImg.height * scale;
  
  	if (fgWidth > canvasWidth * 0.85) {
  		scale = (canvasWidth * 0.85) / targetImg.width;
  		fgWidth = targetImg.width * scale;
  		fgHeight = targetImg.height * scale;
  	}
  
  	let fgX = canvasWidth - fgWidth;
  	let fgY = canvasHeight - fgHeight;
  
  	ctx.drawImage(targetImg, fgX, fgY, fgWidth, fgHeight);
  
  	const buffer = canvas.toBuffer('image/png');
  
  	await sock.sendMessage(m.chat, { image: buffer }, { quoted: m });
  	await sock.sendMessage(m.chat, { react: { text: '💥', key: m.key } }).catch(() => null);
  };
  
  handler.help = ['bgapi'];
  handler.tags = ['maker'];
  handler.command = ['bgapi'];
  handler.limit = true;
  
  const __vxDefault = handler;
  Object.defineProperty(__vxExports, "removeBgNet", { enumerable: true, get: () => removeBgNet });
  Object.defineProperty(__vxExports, "default", { enumerable: true, get: () => __vxDefault });
  return __vxExports
})
