// search/lirikspotify — fitur tambahan (plugins.zip), disesuaikan untuk WhatsApp Bot
const __vx = require("../../lib/adapter/e2.js")
const __meta = {
  "command": [
    "lirikspotify",
    "spotlyrics",
    "spotifylirik"
  ],
  "category": "search",
  "owner": false,
  "group": false,
  "admin": false,
  "botAdmin": false,
  "desc": "Fitur lirikspotify",
  "usage": ".lirikspotify <link>"
}
const __vdir = __dirname.split('\\').join('/')
module.exports = __vx.plugin("vxnew/search/lirikspotify", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + "/lirikspotify.js"
  const __vxDef = (m) => (m && m.__esModule ? m.default : m);
  const __vxImp = async (m) => { const r = require(m); return r && r.__esModule ? r : Object.assign({ default: r }, r) };
  const __vxExports = {};
  const fetch = __vxDef(require("../../lib/newlib/fetch.js"));
  
  let handler = async (m, { conn, text, usedPrefix, command }) => {
    if (!text) return m.reply(`⚠️ *Masukkan Link / ID Track Spotify!*\nContoh: ${usedPrefix + command} https://open.spotify.com/track/4PTG3Z6ehGkBF3zI7Y9G78`);
  
    await conn.sendMessage(m.chat, { react: { text: "⏳", key: m.key } });
    try {
      const apiKey = global.apikey?.vxapi;
      const res = await fetch(`${global.web}/api/search/lirikspotify?apikey=${apiKey}&url=${encodeURIComponent(text)}`);
      const json = await res.json();
  
      if (!json.status || !json.result || !json.result.metadata) {
        await conn.sendMessage(m.chat, { react: { text: "❌", key: m.key } });
        return m.reply("❌ Metadata atau lirik Spotify tidak ditemukan.");
      }
  
      const meta = json.result.metadata;
      const lyr = json.result.lyrics;
  
      let output = `🎧 *SPOTIFY TRACK & LYRICS*\n\n`;
      output += `🎵 *Judul:* ${meta.title || '-'}\n`;
      output += `👤 *Artis:* ${meta.artists?.join(', ') || '-'}\n`;
      output += `💿 *Album:* ${meta.album?.name || '-'} (${meta.album?.releaseDate || '-'})
  `;
      output += `⏱️ *Durasi:* ${meta.duration || '-'}\n`;
      if (meta.spotifyUrl) output += `🔗 *Spotify:* ${meta.spotifyUrl}\n`;
      output += `\n📃 *Lirik Lagu:*\n${lyr?.plain || '_Lirik tidak tersedia untuk lagu ini._'}\n\n`;
      output += `✨ *WhatsApp Bot API Spotify Engine*`;
  
      if (meta.cover) {
        await conn.sendMessage(m.chat, {
          image: { url: meta.cover },
          caption: output.trim()
        }, { quoted: m }).catch(() => m.reply(output.trim()));
      } else {
        await m.reply(output.trim());
      }
  
      await conn.sendMessage(m.chat, { react: { text: "✅", key: m.key } });
    } catch (e) {
      console.error(e);
      await conn.sendMessage(m.chat, { react: { text: "❌", key: m.key } });
      m.reply("❌ Gagal memuat lirik Spotify: " + e.message);
    }
  };
  
  handler.help = ['lirikspotify <link>', 'spotlyrics <link>'];
  handler.tags = ['search'];
  handler.command = /^(lirikspotify|spotlyrics|spotifylirik)$/i;
  
  handler.limit = 1;
  
  
  const __vxDefault = handler

  Object.defineProperty(__vxExports, "default", { enumerable: true, get: () => __vxDefault });
  for (const k of ['before', 'all']) { if (typeof __vxExports[k] === 'function' && typeof __vxDefault === 'function' && !__vxDefault[k]) __vxDefault[k] = __vxExports[k] }
  return __vxExports
})
