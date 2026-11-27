// sticker/sticker-reaksi — satu file: metadata + kode fitur (gabungan dari engine2/plugins/sticker/sticker-reaksi.js)
const __vx = require("../../lib/adapter/e2.js")
const __meta = {
  "command": [
    "reaksi"
  ],
  "category": "sticker",
  "owner": false,
  "group": false,
  "admin": false,
  "botAdmin": false,
  "desc": "Fitur reaksi (dari Bot package)"
}
const __vdir = require('path').join(__dirname, "../../lib/ext/plugins/sticker").split('\\').join('/')
module.exports = __vx.plugin("sticker/sticker-reaksi", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + '/sticker-reaksi.js'
  const __vxExports = {};
  const { createCanvas, loadImage } = require("@napi-rs/canvas");
  
  let handler = async (m, { conn, text }) => {
      if (!text) return m.reply('Masukkan namanya, bub! Contoh: .reaksi RIN IMUP');
      
      try {
          const imageUrl = "https://raw.githubusercontent.com/ryyntwx/allimagerin/refs/heads/main/IMG-20260626-WA0295.jpg";
          const templateImg = await loadImage(imageUrl);
          
          const canvas = createCanvas(templateImg.width, templateImg.height);
          const ctx = canvas.getContext('2d');
          ctx.drawImage(templateImg, 0, 0, canvas.width, canvas.height);
          
          ctx.font = 'bold 56px Arial, sans-serif';
          ctx.fillStyle = '#000000'; // Warna hitam
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          
          const teksLengkap = `REAKSI ${text.trim().toUpperCase()}`;
          ctx.fillText(teksLengkap, 251, 80);
          
          const canvasBuffer = canvas.toBuffer('image/png');
          await conn.sendSticker(m.chat, canvasBuffer, m, {
              packName: 'RIN',  
              packPublish: 'MD'
          });
  
      } catch (e) {
          console.error(e);
          m.reply('Gagal membuat Reaksi.');
      }
  };
  
  handler.help = ['reaksi'];
  handler.tags = ['sticker'];
  handler.command = /^(reaksi)$/i;
  handler.register = true;
  
  const __vxDefault = handler;
  Object.defineProperty(__vxExports, "default", { enumerable: true, get: () => __vxDefault });
  return __vxExports
})
