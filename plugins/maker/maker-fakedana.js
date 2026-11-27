// maker/maker-fakedana — satu file: metadata + kode fitur (gabungan dari engine2/plugins/maker/maker-fakedana.js)
const __vx = require("../../lib/adapter/e2.js")
const __meta = {
  "command": [
    "fakedan"
  ],
  "category": "maker",
  "owner": false,
  "group": false,
  "admin": false,
  "botAdmin": false,
  "desc": "Fitur fakedan (dari Bot package)"
}
const __vdir = require('path').join(__dirname, "../../lib/ext/plugins/maker").split('\\').join('/')
module.exports = __vx.plugin("maker/maker-fakedana", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + '/maker-fakedana.js'
  const __vxDef = (m) => (m && m.__esModule ? m.default : m);
  const __vxExports = {};
  /**
  ‎✧ Name   : fake saldo dana
  ‎✧ Creator   : WhatsApp Bot
  ‎✧ Category : Canvas
  ‎✧ Link sumber : 
  ‎**/
  
  
  const { createCanvas, loadImage, GlobalFonts } = require("@napi-rs/canvas");
  const { writeFile, mkdir } = require("node:fs/promises");
  const { existsSync, unlinkSync } = require("node:fs");
  const { join } = require("node:path");
  const axios = __vxDef(require("axios"));
  
  let handler = async (m, { conn, text, command }) => {
      if (!text) return m.reply(`*Format salah!*\n\nContoh:\n.${command} 50.000`);
  
      try {
          await m.reply("⏳ Memproses Fake Saldo DANA...");
  
          const ASSETS_DIR = join(process.cwd(), 'assets', 'fakedana');
          const FONTS_DIR = join(ASSETS_DIR, 'fonts');
          const FONT_PATH = join(FONTS_DIR, 'PlusJakartaSans-SemiBold.ttf');
          const BG_LOCAL = join(ASSETS_DIR, 'fkedana.png');
          const EYE_LOCAL = join(ASSETS_DIR, 'eye_icon.jpg');
          const TMP_DIR = join(process.cwd(), 'tmp');
  
          const TTF_URL = 'https://cdn.jsdelivr.net/fontsource/fonts/plus-jakarta-sans@latest/latin-600-normal.ttf';
          const BG_URL = 'https://raw.githubusercontent.com/ryyntwx/Image-rinn/refs/heads/main/fkedana.png';
          const EYE_URL = 'https://raw.githubusercontent.com/ryyntwx/Image-rinn/refs/heads/main/IMG-20260726-WA1031.jpg';
  
          await mkdir(FONTS_DIR, { recursive: true });
          await mkdir(TMP_DIR, { recursive: true });
  
          if (!existsSync(FONT_PATH)) {
              const fontRes = await axios.get(TTF_URL, { 
                  responseType: 'arraybuffer',
                  headers: { 'User-Agent': 'Mozilla/5.0' } 
              });
              await writeFile(FONT_PATH, Buffer.from(fontRes.data));
          }
  
          GlobalFonts.registerFromPath(FONT_PATH, 'DANA');
  
          if (!existsSync(BG_LOCAL)) {
              const bgRes = await axios.get(BG_URL, { responseType: 'arraybuffer', headers: { 'User-Agent': 'Mozilla/5.0' } });
              await writeFile(BG_LOCAL, Buffer.from(bgRes.data));
          }
  
          if (!existsSync(EYE_LOCAL)) {
              const eyeRes = await axios.get(EYE_URL, { responseType: 'arraybuffer', headers: { 'User-Agent': 'Mozilla/5.0' } });
              await writeFile(EYE_LOCAL, Buffer.from(eyeRes.data));
          }
  
          const bgImg = await loadImage(BG_LOCAL);
          const eyeImg = await loadImage(EYE_LOCAL);
  
          const canvas = createCanvas(bgImg.width, bgImg.height);
          const ctx = canvas.getContext('2d');
  
          ctx.drawImage(bgImg, 0, 0, canvas.width, canvas.height);
  
          const valX = 138;
          const valY = 52;
          const maxFontSize = 37;
          const eyeGap = 7;
          const eyeScale = 1.3;
  
          const inputSaldo = text.trim();
  
          let currentFontSize = maxFontSize;
          const maxAllowedWidth = canvas.width - valX - 100;
  
          ctx.font = `600 ${currentFontSize}px DANA`;
          let textWidth = ctx.measureText(inputSaldo).width;
  
          while (textWidth > maxAllowedWidth && currentFontSize > 16) {
              currentFontSize -= 2;
              ctx.font = `600 ${currentFontSize}px DANA`;
              textWidth = ctx.measureText(inputSaldo).width;
          }
  
          // saldo nyaaaa
          ctx.fillStyle = '#FFFFFF';
          ctx.textAlign = 'left';
          ctx.textBaseline = 'top';
          ctx.fillText(inputSaldo, valX, valY);
  
          // icon mata dkt saldo
          const eyeHeight = currentFontSize * eyeScale;
          const eyeWidth = (eyeImg.width / eyeImg.height) * eyeHeight;
          const eyeX = valX + textWidth + eyeGap;
          const eyeY = valY + (currentFontSize - eyeHeight) / 2;
  
          ctx.drawImage(eyeImg, eyeX, eyeY, eyeWidth, eyeHeight);
  
          const outPath = join(TMP_DIR, `fakedana-${Date.now()}.png`);
          await writeFile(outPath, await canvas.encode('png'));
  
          await conn.sendFile(m.chat, outPath, 'fakedana.png', `— *FAKE SALDO DANA* —\n\n✎ *Nominal:* Rp ${inputSaldo}`, m);
  
          if (existsSync(outPath)) unlinkSync(outPath);
  
      } catch (e) {
          console.error(e);
          m.reply("❌ Gagal membuat canvas Fake DANA\n\n" + e.message);
      }
  };
  
  handler.help = ['fakedana <nominal>'];
  handler.tags = ['maker'];
  handler.command = ['fakedana', 'fakedan'];
  
  const __vxDefault = handler;
  Object.defineProperty(__vxExports, "default", { enumerable: true, get: () => __vxDefault });
  return __vxExports
})
