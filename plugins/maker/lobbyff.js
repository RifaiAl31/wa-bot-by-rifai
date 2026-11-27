// maker/lobbyff — fitur tambahan (plugins.zip), disesuaikan untuk WhatsApp Bot
const __vx = require("../../lib/adapter/e2.js")
const __meta = {
  "command": [
    "lobbyff"
  ],
  "category": "maker",
  "owner": false,
  "group": false,
  "admin": false,
  "botAdmin": false,
  "desc": "Fitur lobbyff",
  "usage": ".lobbyff <nama>"
}
const __vdir = __dirname.split('\\').join('/')
module.exports = __vx.plugin("vxnew/maker/lobbyff", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + "/lobbyff.js"
  const __vxDef = (m) => (m && m.__esModule ? m.default : m);
  const __vxImp = async (m) => { const r = require(m); return r && r.__esModule ? r : Object.assign({ default: r }, r) };
  const __vxExports = {};
  const fetch = __vxDef(require("../../lib/newlib/fetch.js"));
  
  let handler = async (m, { conn, text, usedPrefix, command }) => {
      try {
          const API_KEY = global.apikey?.vxapi;
          if (!API_KEY || API_KEY === "MASUKAN_API_KEY_KAMU_DISINI") {
              return m.reply("❌ API Key WhatsApp Bot API belum dikonfigurasi di config.js!");
          }
  
          if (!text) {
              return m.reply(`🎮 *Fake Lobby Free Fire*\n\nCara penggunaan:\n${usedPrefix + command} <nama>\n\nContoh:\n${usedPrefix + command} WhatsApp Bot`);
          }
  
          await conn.sendMessage(m.chat, { react: { text: "⏳", key: m.key } });
  
          const apiUrl = `${global.web}/api/maker/fakelobbyff?apikey=${global.apikey?.vxapi}&nama=${encodeURIComponent(text.trim())}`;
  
          const response = await fetch(apiUrl);
          if (!response.ok) {
              let errJson = await response.json().catch(() => ({}));
              throw new Error(errJson.error || errJson.message || `Status HTTP ${response.status}`);
          }
  
          const buffer = await response.arrayBuffer();
          if (response.headers.get('content-type')?.includes('application/json')) {
              let errJson = JSON.parse(Buffer.from(buffer).toString());
              throw new Error(errJson.error || errJson.message || 'Gagal membuat fake lobby');
          }
  
          await conn.sendFile(m.chat, Buffer.from(buffer), 'lobbyff.jpg', `🎮 *Fake Lobby Free Fire*\n\n👤 Nama: ${text}\n✨ Request by: ${m.pushName || 'User'}`, m);
          await conn.sendMessage(m.chat, { react: { text: "✅", key: m.key } });
  
      } catch (e) {
          console.error('LobbyFF Error:', e);
          await conn.sendMessage(m.chat, { react: { text: "❌", key: m.key } });
          m.reply(`❌ Gagal membuat fake lobby: ${e.message || e}`);
      }
  };
  
  handler.help = ['lobbyff <nama>'];
  handler.tags = ['maker'];
  handler.command = /^(lobbyff)$/i;
  handler.limit = true;
  
  const __vxDefault = handler

  Object.defineProperty(__vxExports, "default", { enumerable: true, get: () => __vxDefault });
  for (const k of ['before', 'all']) { if (typeof __vxExports[k] === 'function' && typeof __vxDefault === 'function' && !__vxDefault[k]) __vxDefault[k] = __vxExports[k] }
  return __vxExports
})
