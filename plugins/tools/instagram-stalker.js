// tools/instagram-stalker — fitur tambahan (plugins.zip), disesuaikan untuk WhatsApp Bot
const __vx = require("../../lib/adapter/e2.js")
const __meta = {
  "command": [
    "instagram-stalker",
    "igstalker"
  ],
  "category": "tools",
  "owner": false,
  "group": false,
  "admin": false,
  "botAdmin": false,
  "desc": "Fitur instagram-stalker",
  "usage": ".instagram-stalker <username>"
}
const __vdir = __dirname.split('\\').join('/')
module.exports = __vx.plugin("vxnew/tools/instagram-stalker", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + "/instagram-stalker.js"
  const __vxDef = (m) => (m && m.__esModule ? m.default : m);
  const __vxImp = async (m) => { const r = require(m); return r && r.__esModule ? r : Object.assign({ default: r }, r) };
  const __vxExports = {};
  const fetch = __vxDef(require("../../lib/newlib/fetch.js"));
  
  let handler = async (m, { conn, text, usedPrefix, command }) => {
      if (!text) {
          return m.reply(`📸 *INSTAGRAM STALKER*\n\nMasukkan username Instagram!\nContoh:\n${usedPrefix + command} cristiano`);
      }
  
      try {
          await conn.sendMessage(m.chat, { react: { text: "⏳", key: m.key } });
  
          let username = text.replace(/[@\s]/g, '').trim();
          let apiKey = global.apikey?.vxapi;
          let apiUrl = `${global.web}/api/tools/instagram-stalker?apikey=${apiKey}&username=${encodeURIComponent(username)}`;
  
          let res = await fetch(apiUrl);
          let json = await res.json();
  
          if (!json.status) throw new Error(json.error || json.message || "Profil Instagram tidak ditemukan atau akun di-private.");
  
          let data = json.result || {};
          let caption = `📸 *INSTAGRAM PROFILE STALKER*\n\n`;
          caption += `👤 *Username:* @${data.username || username}\n`;
          caption += `📛 *Nama:* ${data.fullName || data.name || '-'}\n`;
          caption += `👥 *Followers:* ${data.followers || data.follower_count || '-'}\n`;
          caption += `🫂 *Following:* ${data.following || data.following_count || '-'}\n`;
          caption += `🖼️ *Postingan:* ${data.posts || data.media_count || '-'}\n`;
          caption += `🔒 *Private:* ${data.is_private ? 'Ya 🔒' : 'Tidak 🔓'}\n`;
          caption += `✅ *Verified:* ${data.is_verified ? 'Ya 🔵' : 'Tidak'}\n`;
          if (data.bio || data.biography) caption += `📝 *Bio:*\n${data.bio || data.biography}\n`;
          caption += `\n✅ *Request by:* ${m.pushName || 'User'}`;
  
          let pp = data.profile_pic_url || data.profilePic || data.avatar;
          if (pp) {
              await conn.sendMessage(m.chat, {
                  image: { url: pp },
                  caption: caption
              }, { quoted: m });
          } else {
              await m.reply(caption);
          }
  
          await conn.sendMessage(m.chat, { react: { text: "✅", key: m.key } });
  
      } catch (e) {
          console.error(e);
          await conn.sendMessage(m.chat, { react: { text: "❌", key: m.key } });
          m.reply(`❌ *IG Stalker Gagal*\nError: ${e.message}`);
      }
  };
  
  handler.help = ['instagram-stalker <username>', 'igstalker <username>'];
  handler.tags = ['tools'];
  handler.command = /^(instagram-stalker|igstalker|stalkig|igstalk)$/i;
  
  handler.limit = 1;
  
  
  const __vxDefault = handler

  Object.defineProperty(__vxExports, "default", { enumerable: true, get: () => __vxDefault });
  for (const k of ['before', 'all']) { if (typeof __vxExports[k] === 'function' && typeof __vxDefault === 'function' && !__vxDefault[k]) __vxDefault[k] = __vxExports[k] }
  return __vxExports
})
