// tools/am-data — satu file: metadata + kode fitur (gabungan dari engine4/plugins/tools/am-data.js)
const __vx = require("../../lib/adapter/e4.js")
const __meta = {
  "name": "am-data",
  "command": [
    "am-data",
    "alightmotion-data"
  ],
  "category": "tools",
  "desc": "Lihat data project Alight Motion dari link share",
  "usage": ".am-data <url>",
  "owner": false,
  "group": false,
  "private": false,
  "premium": false,
  "cooldown": 15,
  "energi": 1,
  "needs": {
    "apikeys": [
      "obscura"
    ],
    "scrapers": [],
    "assets": []
  }
}
const __vdir = require('path').join(__dirname, "../../lib/ext/plugins/tools").split('\\').join('/')
module.exports = __vx.plugin("tools/am-data", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + '/am-data.js'
  const __vxDef = (m) => (m && m.__esModule ? m.default : m);
  const __vxExports = {};
  const te = __vxDef(require("../../lib/ext/src/lib/vanxone-error.e4.js"));
  const config = __vxDef(require("../../lib/ext/config.e4.js"));
  
  const pluginConfig = {
    name: "am-data",
    alias: ["alightmotion-data"],
    category: "tools",
    description: "Lihat data project Alight Motion dari link share",
    usage: ".am-data <url>",
    example: ".am-data https://alightcreative.com/am/share/...",
    cooldown: 15,
    energi: 1,
    isEnabled: true,
  };
  
  const API = "https://api.obscuraworks.org/api/tools/amdata";
  const KEY = config.APIkey.obscura;
  
  function fmtSize(b) {
    if (!b) return "-";
    if (b < 1024) return b + " B";
    if (b < 1048576) return (b / 1024).toFixed(1) + " KB";
    return (b / 1048576).toFixed(1) + " MB";
  }
  
  function fmtDate(ts) {
    if (!ts?._seconds) return "-";
    return new Date(ts._seconds * 1000).toLocaleDateString("id-ID", {
      dateStyle: "long",
    });
  }
  
  async function handler(m, { sock }) {
    const url = m.text?.trim();
    if (!url || !url.includes("alightcreative.com")) {
      return m.reply(
        `📱 *ᴀʟɪɢʜᴛ ᴍᴏᴛɪᴏɴ ᴅᴀᴛᴀ*\n\n` +
          `- Lihat info project AM dari link share\n` +
          `- Masukkan URL share Alight Motion\n\n` +
          `\`${m.prefix}am-data <url>\``,
      );
    }
  
    m.react("🕕");
  
    try {
      const r = await fetch(API, {
        method: "POST",
        headers: {
          Accept: "application/json, image/*, audio/*, video/*",
          Authorization: `Bearer ${KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url }),
      });
  
      const res = await r.json();
      const d = res?.data;
      const info = d?.info;
  
      if (!res?.status || !info) {
        m.react("❌");
        return m.reply(
          `📱 *ɢᴀɢᴀʟ ᴍᴇᴍʙᴀᴄᴀ ᴅᴀᴛᴀ*\n\n` + `- Pastikan URL share valid`,
        );
      }
  
      m.react("✅");
  
      const projects =
        info.projects
          ?.map((p) => `  - *${p.title}* (${p.type}, ${fmtSize(p.size)})`)
          .join("\n") || "  - Tidak ada";
  
      const effects = info.requiredEffects?.length
        ? info.requiredEffects.slice(0, 8).join(", ") +
          (info.requiredEffects.length > 8
            ? `, +${info.requiredEffects.length - 8} lagi`
            : "")
        : "-";
  
      let msg =
        `📱 *ᴀʟɪɢʜᴛ ᴍᴏᴛɪᴏɴ ᴅᴀᴛᴀ*\n\n` +
        `- *Judul* → ${info.title || "-"}\n` +
        `- *Ukuran* → ${fmtSize(info.size)}\n` +
        `- *Download* → ${info.downloads ?? 0}x\n` +
        `- *Likes* → ${info.likes ?? 0}\n` +
        `- *Versi* → \`${info.amVersionString || "-"}\`\n` +
        `- *Platform* → ${info.amPlatform || "-"}\n` +
        `- *Max FF* → v${info.maxFFVer || "-"}\n` +
        `- *Tanggal* → ${fmtDate(info.shareDate)}\n\n` +
        `🎬 *Project*\n${projects}\n\n` +
        `✨ *Effects* → ${effects}`;
  
      if (info.largeThumbUrl) {
        await sock.sendMedia(m.chat, info.largeThumbUrl, null, m, {
          type: "image",
          caption: msg,
        });
      } else {
        m.reply(msg);
      }
    } catch (e) {
      console.log(e);
      m.react("☢");
      m.reply(te(m.prefix, m.command, m.pushName));
    }
  }
  
  
  
  Object.defineProperty(__vxExports, "config", { enumerable: true, get: () => pluginConfig });
  Object.defineProperty(__vxExports, "handler", { enumerable: true, get: () => handler });
  return __vxExports
})
