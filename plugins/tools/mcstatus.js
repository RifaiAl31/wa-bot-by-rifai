// tools/mcstatus — satu file: metadata + kode fitur (gabungan dari engine7/plugins/tools/mcstatus.js)
const __vx = require("../../lib/adapter/e7.js")
const __meta = {
  "name": "mcstatus",
  "command": [
    "mcstatus",
    "mcstat"
  ],
  "category": "tools",
  "desc": "Mengecek status server Minecraft Java",
  "usage": ".mcstatus <ip/domain[:port]>",
  "owner": false,
  "group": false,
  "private": false,
  "premium": false,
  "cooldown": 5,
  "energi": 0,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
}
const __vdir = require('path').join(__dirname, "../../lib/ext/plugins/tools").split('\\').join('/')
module.exports = __vx.plugin("tools/mcstatus", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + '/mcstatus.js'
  const __vxDef = (m) => (m && m.__esModule ? m.default : m);
  const __vxExports = {};
  const axios = __vxDef(require("axios"));
  
  const pluginConfig = {
    name: "mcstatus",
    alias: ["mcstat"],
    category: "tools",
    description: "Mengecek status server Minecraft Java",
    usage: ".mcstatus <ip/domain[:port]>",
    example: ".mcstatus play.example.net",
    isOwner: false,
    isPremium: false,
    isGroup: false,
    isPrivate: false,
    cooldown: 5,
    energi: 0,
    isEnabled: true,
  };
  
  async function handler(m) {
    const address = (m.args || []).join(" ").trim();
    if (!address) {
      return m.reply(
        `🎮 *MINECRAFT SERVER STATUS*\n\n` +
        `Masukkan IP/domain server Minecraft Java.\n\n` +
        `Contoh:\n${m.prefix}mcstatus play.example.net\n` +
        `${m.prefix}mcstat play.example.net:25565`,
      );
    }
  
    try {
      const url = `https://api.mcsrvstat.us/3/${encodeURIComponent(address)}`;
      const { data } = await axios.get(url, { timeout: 15000 });
  
      if (!data?.online) {
        return m.reply(`❌ Server *${address}* sedang offline atau tidak ditemukan.`);
      }
  
      const host = data.hostname || address;
      const port = data.port || 25565;
      const version = data.version || "Tidak diketahui";
      const online = data.players?.online ?? 0;
      const max = data.players?.max ?? 0;
      const motd = Array.isArray(data.motd?.clean)
        ? data.motd.clean.join(" ").trim()
        : String(data.motd?.clean || "").trim();
  
      let text =
        `🎮 *MINECRAFT SERVER STATUS*\n\n` +
        `🌐 Host: *${host}*\n` +
        `🔌 Port: *${port}*\n` +
        `🛠️ Version: *${version}*\n` +
        `👥 Players: *${online}/${max}*\n` +
        `🟢 Status: *Online*`;
  
      if (motd) text += `\n📝 MOTD: ${motd}`;
  
      if (data.players?.list?.length) {
        const players = data.players.list.slice(0, 10).map((p) => p.name).join(", ");
        text += `\n👤 Online: ${players}${data.players.list.length > 10 ? "..." : ""}`;
      }
  
      return m.reply(text);
    } catch (error) {
      console.error("[mcstatus]", error);
      return m.reply(
        `❌ Gagal mengecek server.\n\n` +
        `Pastikan IP/domain benar dan coba lagi beberapa saat.`,
      );
    }
  }
  
  
  
  Object.defineProperty(__vxExports, "config", { enumerable: true, get: () => pluginConfig });
  Object.defineProperty(__vxExports, "handler", { enumerable: true, get: () => handler });
  return __vxExports
})
