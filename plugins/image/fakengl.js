// canvas/fakengl — satu file: metadata + kode fitur (gabungan dari engine7/plugins/canvas/fakengl.js)
const __vx = require("../../lib/adapter/e7.js")
const __meta = {
  "name": "fakengl",
  "command": [
    "fakengl",
    "fngl",
    "nglfake"
  ],
  "category": "image",
  "desc": "Membuat screenshot pesan NGL palsu (have fun only)",
  "usage": ".fakengl <teks>",
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
const __vdir = require('path').join(__dirname, "../../lib/ext/plugins/canvas").split('\\').join('/')
module.exports = __vx.plugin("canvas/fakengl", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + '/fakengl.js'
  const __vxExports = {};
  // plugins/fakengl.js
  const pluginConfig = {
    name: "fakengl",
    alias: ['fngl', 'nglfake'],
    category: "canvas",
    description: "Membuat screenshot pesan NGL palsu (have fun only)",
    usage: ".fakengl <teks>",
    example: ".fakengl Gw tuh sebenarnya ultramen",
    isOwner: false,
    isPremium: false,
    isGroup: false,
    isPrivate: false,
    cooldown: 5,
    energi: 0,
    isEnabled: true,
  };
  
  const API_BASE = "https://api.synoxcloud.xyz/canvas/fake-ngl";
  const API_KEY = "FREE";
  
  const DISCLAIMER =
    "\n\n⚠️ _Ini hasil editan untuk have fun / prank saja. " +
    "Dilarang digunakan untuk menipu atau tindakan ilegal._";
  
  async function handler(m, ctx = {}) {
    const conn = ctx.conn || ctx.client || ctx.sock || m?.conn || m?.client;
    const usedPrefix = ctx.usedPrefix ?? ctx.prefix ?? m?.prefix ?? ".";
    const command = ctx.command ?? ctx.cmd ?? m?.command ?? "fakengl";
  
    try {
      let text =
        (ctx.text ?? ctx.body ?? m?.text ?? m?.body ?? "").trim() ||
        (ctx.args ? ctx.args.join(" ") : "");
  
      if (text.startsWith(usedPrefix)) text = text.slice(usedPrefix.length);
      const parts = text.split(/\s+/);
      if (parts[0]?.toLowerCase() === command.toLowerCase()) parts.shift();
      text = parts.join(" ").trim();
  
      if (!text) {
        return m.reply(
          `📩 *Fake NGL Screenshot*\n\n` +
          `*Cara pakai:*\n` +
          `${usedPrefix}${command} <teks pesan>\n\n` +
          `*Contoh:*\n` +
          `${usedPrefix}${command} Gw tuh sebenarnya ultramen`
        );
      }
  
      await m.reply("📩 Membuat screenshot NGL...");
  
      const url = `${API_BASE}?text=${encodeURIComponent(text)}&apikey=${API_KEY}`;
      const buffer = await fetchImage(url);
  
      await conn.sendMessage(
        m.chat,
        {
          image: buffer,
          caption: `📩 *Fake NGL*\n\n_"${text}"_${DISCLAIMER}`,
        },
        { quoted: m }
      );
    } catch (err) {
      console.error("[fakengl] error:", err);
      try { await m.reply(`❌ Gagal: ${err.message || err}`); } catch (_) {}
    }
  }
  
  async function fetchImage(url) {
    const res = await fetch(url, { method: "GET" });
    if (!res.ok) throw new Error(`HTTP ${res.status} ${res.statusText}`);
    const ct = res.headers.get("content-type") || "";
    if (ct.includes("application/json")) {
      const json = await res.json();
      const imgUrl = json?.result?.url || json?.result || json?.url || json?.data?.url || json?.data;
      if (typeof imgUrl !== "string" || !/^https?:\/\//.test(imgUrl)) {
        throw new Error("Response JSON tidak mengandung URL gambar.");
      }
      const r2 = await fetch(imgUrl);
      if (!r2.ok) throw new Error(`Gagal unduh gambar: ${r2.status}`);
      return Buffer.from(await r2.arrayBuffer());
    }
    const buf = Buffer.from(await res.arrayBuffer());
    if (!buf.length) throw new Error("Response kosong.");
    return buf;
  }
  
  
  const __vxDefault = { config: pluginConfig, handler };
  Object.defineProperty(__vxExports, "config", { enumerable: true, get: () => pluginConfig });
  Object.defineProperty(__vxExports, "handler", { enumerable: true, get: () => handler });
  Object.defineProperty(__vxExports, "default", { enumerable: true, get: () => __vxDefault });
  return __vxExports
})
