// ai/txt2video-v2 — fitur tambahan (plugins.zip), disesuaikan untuk WhatsApp Bot
const __vx = require("../../lib/adapter/e2.js")
const __meta = {
  "command": [
    "txt2video-v2",
    "txt2videov2",
    "t2vv2"
  ],
  "category": "ai",
  "owner": false,
  "group": false,
  "admin": false,
  "botAdmin": false,
  "desc": "Fitur txt2video-v2",
  "usage": ".txt2video-v2 <prompt>"
}
const __vdir = __dirname.split('\\').join('/')
module.exports = __vx.plugin("vxnew/ai/txt2video-v2", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + "/txt2video-v2.js"
  const __vxDef = (m) => (m && m.__esModule ? m.default : m);
  const __vxImp = async (m) => { const r = require(m); return r && r.__esModule ? r : Object.assign({ default: r }, r) };
  const __vxExports = {};
  let handler = async (m, { conn, usedPrefix, command, text }) => {
    try {
      if (!text) return m.reply(`⚠️ Masukkan prompt video!\nContoh: ${usedPrefix + command} an astronaut riding a glowing horse on Mars`);
      await conn.sendMessage(m.chat, { react: { text: "⏳", key: m.key } });
      m.reply("🎬 Sedang memproses Text to Video V2... Mohon tunggu (estimasi 1 - 2 menit).");
  
      const response = await fetch(`${global.web}/api/ai/txt2video-v2?apikey=${global.apikey?.vxapi}&prompt=${encodeURIComponent(text)}`);
      const json = await response.json();
      
      let videoUrl = json.data?.video_url || json.data?.video || json.data?.url || json.result?.video_url || json.result?.video || json.result?.url || json.video_url || json.result || json.data;
      if (typeof videoUrl === 'object' && videoUrl !== null) {
        videoUrl = videoUrl.video_url || videoUrl.url || videoUrl.video || JSON.stringify(videoUrl);
      }
  
      if (json.status && typeof videoUrl === 'string' && videoUrl.startsWith('http')) {
        await conn.sendMessage(m.chat, {
          video: { url: videoUrl },
          caption: `🎬 *Text to Video V2 Success!*\n\n📝 *Prompt:* ${text}`
        }, { quoted: m }).catch(e => m.reply("Gagal mengirim video, ini linknya: " + videoUrl));
        await conn.sendMessage(m.chat, { react: { text: "✅", key: m.key } });
      } else {
        throw new Error(json.error || json.message || "Gagal menghasilkan video AI dari prompt");
      }
    } catch (e) {
      console.error(e);
      await conn.sendMessage(m.chat, { react: { text: "❌", key: m.key } });
      m.reply("❌ Error: " + (e.message || e));
    }
  };
  
  handler.help = ['txt2video-v2 <prompt>'];
  handler.tags = ['ai'];
  handler.command = ["txt2video-v2", "txt2videov2", "t2vv2"];
  handler.limit = 3;
  
  
  
  const __vxDefault = handler

  Object.defineProperty(__vxExports, "default", { enumerable: true, get: () => __vxDefault });
  for (const k of ['before', 'all']) { if (typeof __vxExports[k] === 'function' && typeof __vxDefault === 'function' && !__vxDefault[k]) __vxDefault[k] = __vxExports[k] }
  return __vxExports
})
