// tools/tweetss — satu file: metadata + kode fitur (gabungan dari engine7/plugins/tools/tweetss.js)
const __vx = require("../../lib/adapter/e7.js")
const __meta = {
  "name": "tweetss",
  "command": [
    "tweetss",
    "orshot",
    "tweetimage",
    "tweetimg"
  ],
  "category": "tools",
  "desc": "Membuat gambar screenshot aesthetic dari link postingan X (Twitter)",
  "usage": ".tweetss <url tweet>",
  "owner": false,
  "group": false,
  "private": false,
  "premium": false,
  "cooldown": 5,
  "energi": 1,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
}
const __vdir = require('path').join(__dirname, "../../lib/ext/plugins/tools").split('\\').join('/')
module.exports = __vx.plugin("tools/tweetss", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + '/tweetss.js'
  const __vxDef = (m) => (m && m.__esModule ? m.default : m);
  const __vxExports = {};
  /*
  Base : https://orshot.com
  Author : WhatsApp Bot
  */
  
  const axios = __vxDef(require("axios"));
  
  const pluginConfig = {
      name: 'tweetss',
      alias: ['orshot', 'tweetimage', 'tweetimg'],
      category: 'tools',
      description: 'Membuat gambar screenshot aesthetic dari link postingan X (Twitter)',
      usage: '.tweetss <url tweet>',
      example: '.tweetss https://x.com/i/status/2026539641311199692',
      isOwner: false,
      isPremium: false,
      isGroup: false,
      isPrivate: false,
      cooldown: 5,
      energi: 1,
      isEnabled: true
  };
  
  async function tweetss(tweetUrl) {
    const match = tweetUrl.match(/status\/(\d+)/);
    if (!match) throw new Error('masukin link yg benar');
    const tweetId = match[1];
  
    const payload = {
      templateSlug: 'tweet-image',
      modifications: {
        tweetUrl,
        tweetId
      },
      renderType: 'images',
      responseFormat: 'png',
      responseType: 'base64',
      userAPIKey: false
    };
  
    const { data } = await axios.post(
      'https://orshot.com/api/templates/make-playground-request',
      JSON.stringify(payload),
      {
        headers: {
          'Content-Type': 'text/plain; charset=UTF-8',
          'Origin': 'https://orshot.com',
          'Referer': 'https://orshot.com/templates/tweet-image/generate',
          'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) Chrome/107.0.0.0 Safari/537.36',
          'Accept': '*/*'
        }
      }
    );
  
    if (!data?.data?.content) {
      throw new Error('ga ada respon dari server orshot');
    }
  
    const base64Data = data.data.content.replace(/^data:image\/png;base64,/, '');
    return Buffer.from(base64Data, 'base64');
  }
  
  async function handler(m, { usedPrefix, prefix, command, text, sock, conn }) {
    const clientBot = sock || conn;
  
    if (!text || !text.trim().startsWith('http')) {
      if (typeof m.react === 'function') await m.react('❌');
      let warning = `❌ *Format Perintah Salah!*\n\n`;
      warning += `Silakan masukkan link postingan X (Twitter) yang ingin dijadikan gambar.\n\n`;
      warning += `📌 *Contoh Penggunaan:*\n`;
      warning += `> \`${prefix}${command} https://x.com/i/status/2026539641311199692\``;
      return await m.reply(warning);
    }
  
    if (typeof m.react === 'function') await m.react('⏳');
  
    try {
      const imgBuffer = await tweetss(text.trim());
  
      let caption = `🐦 *TWEET SHOT GENERATOR*\n────────────────────────────\n`;
      caption += `🔗 *Source:* ${text.trim()}\n`;
      caption += `👤 *Script by:* WhatsApp Bot\n`;
      caption += `────────────────────────────`;
  
      await clientBot.sendMessage(
        m.chat,
        {
          image: imgBuffer,
          caption: caption
        },
        { quoted: m }
      );
  
      if (typeof m.react === 'function') await m.react('✅');
  
    } catch (error) {
      console.error('TweetSS Error:', error);
      if (typeof m.react === 'function') await m.react('❌');
      await m.reply('❌ *GAGAL MEMBUAT GAMBAR TWEET*\n\n> ' + (error.message || String(error)));
    }
  }
  
  
  
  Object.defineProperty(__vxExports, "config", { enumerable: true, get: () => pluginConfig });
  Object.defineProperty(__vxExports, "handler", { enumerable: true, get: () => handler });
  return __vxExports
})
