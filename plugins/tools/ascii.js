// tools/ascii — satu file: metadata + kode fitur (gabungan dari engine7/plugins/tools/ascii.js)
const __vx = require("../../lib/adapter/e7.js")
const __meta = {
  "name": "imagetoasci",
  "command": [
    "imagetoasci",
    "imgascii"
  ],
  "category": "tools",
  "desc": "Imported from WhatsApp Bot V4.6",
  "usage": "",
  "owner": false,
  "group": false,
  "private": false,
  "premium": false,
  "cooldown": 3,
  "energi": 1,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
}
const __vdir = require('path').join(__dirname, "../../lib/ext/plugins/tools").split('\\').join('/')
module.exports = __vx.plugin("tools/ascii", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + '/ascii.js'
  const __vxNs = (m) => (m && m.__esModule ? m : (m !== null && (typeof m === 'object' || typeof m === 'function') ? Object.assign(Object.create(null), m, { default: m }) : { default: m }));
  const __vxExports = {};
  const FEATURE_CREDIT = "Fitur by: Owner Bot";
  
  
  /**
   ╔══════════════════════
        ⧉  [Ascii] — [Tools]
   ╚══════════════════════
  
    ✺ Type     : Plugin ESM
    ✺ Creator  : Owner Bot
    ✺ Scrape      : 
    [ https://codeshare.cloudku.click/view/f2db48ac ]
    [  ]
    ✺ Scrape Maker : WhatsApp Bot
    ✺ Note    : Ga tau buat apa, biar jelas liat sini aja (  )
  */
  
  const ch = __vxNs(require("cheerio"));
  
  const pluginConfig = {
    name: "imagetoasci",
    alias: ["imgascii", "ascii"],
    category: "tools",
    description: "Imported from WhatsApp Bot V4.6",
    usage: "",
    example: "",
    isOwner: false,
    isPremium: false,
    isGroup: false,
    isPrivate: false,
    cooldown: 3,
    energi: 1,
    isEnabled: true,
  };
  
  async function handler(m, { sock, text, prefix, command }) {
      const conn = sock;
      const usedPrefix = prefix || m.prefix || ".";
      try {
          if (!m.quoted && !(text && text.startsWith("http"))) {
              return m.reply(`*🍂 Butuh input gambar!*\n*Contoh: ${usedPrefix + command} (reply gambar atau kirim URL)*`);
          }
          await conn.sendMessage(m.chat, { react: { text: "⏳", key: m.key } });
  
          let buffer = null;
          let sourceUrl = null;
          if (m.quoted?.mimetype && /image\/(jpe?g|png|webp)/i.test(m.quoted.mimetype)) {
          buffer = await m.quoted.download();
            } else if (text && text.startsWith("http")) {
      sourceUrl = text.trim();
      try {
          const r = await fetch(sourceUrl);
          if (!r.ok) return m.reply(`*🍂 Gagal ambil gambar!*\n*Status:* ${r.status} ${r.statusText}`);
          buffer = Buffer.from(await r.arrayBuffer());
      } catch {
          buffer = null;
          }
      }
  
          if (!buffer && !sourceUrl) {
              return m.reply(`*🍂 Format tidak valid!*\n*Gunakan: reply gambar atau URL gambar.*`);
          }
  
          const size = buffer ? buffer.length : 0;
          let width = 60;
          if (size && size < 150_000) width = 50;
          else if (size && size < 350_000) width = 65;
          else if (size && size < 700_000) width = 80;
          else width = 100;
  
          const siteBase = "https://www.text-image.com";
          const asciiPage = "/convert/ascii.html";
  
          const getHeaders = {
              "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
              Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
              "Accept-Language": "en-US,en;q=0.9"
          };
  
          const getController = new AbortController();
          const getTimeout = setTimeout(() => getController.abort(), 10000);
          const getRes = await fetch(siteBase + asciiPage, {
              method: "GET",
              signal: getController.signal,
              headers: getHeaders
          });
          clearTimeout(getTimeout);
  
          const setCookie = getRes.headers.get("set-cookie") ?? "";
          const initialHtml = await getRes.text();
  
          const buildForm = (w, useImageUrlOnly = false) => {
              const f = new FormData();
              f.append("format", "ascii");
              f.append("width", String(w));
              f.append("textcolor", "#000000");
              f.append("bgcolor", "#ffffff");
              f.append("invert", "0");
              f.append("contrast", "1");
              if (!useImageUrlOnly && buffer) f.append("image", new Blob([buffer], { type: "image/jpeg" }), "image.jpg");
              if (sourceUrl) f.append("imageurl", sourceUrl);
              return f;
          };
  
          const postHeadersBase = {
              Origin: siteBase,
              Referer: siteBase + asciiPage,
              "User-Agent": getHeaders["User-Agent"],
              Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
              "Accept-Language": getHeaders["Accept-Language"]
          };
  
          const tryConvert = async (form) => {
              const controller = new AbortController();
              const timeout = setTimeout(() => controller.abort(), 25000);
              const headers = { ...postHeadersBase };
              if (setCookie) headers.Cookie = setCookie.split(",").map(s => s.split(";")[0]).join("; ");
              const res = await fetch(siteBase + "/convert/result.cgi", {
                  method: "POST",
                  body: form,
                  signal: controller.signal,
                  headers
              });
              clearTimeout(timeout);
              const text = await res.text();
              return { ok: res.ok, status: res.status, text };
          };
  
          let res = await tryConvert(buildForm(width, false));
          if ((!res.ok || !res.text.includes('id="tiresult"')) && width !== 65) {
              res = await tryConvert(buildForm(65, false));
          }
          if ((!res.ok || !res.text.includes('id="tiresult"')) && sourceUrl) {
              res = await tryConvert(buildForm(width, true));
          }
  
          if (!res.ok || !res.text.includes('id="tiresult"')) {
      const html = res.text || "";
  
      if (html.includes("Error:")) {
          const cleanErr = html
              .split("Error:")[1]
              .split("<")[0]
              .trim();
  
          return m.reply(`*🍂 Gagal convert — gambar tidak dapat diproses!*\n*Alasan:* ${cleanErr}`);
      }
  
      return m.reply(`*🍂 Gagal convert — hasil kosong!*\n*Width:* ${width}\n*Status:* ${res.status}`);
      }
  
          const $ = ch.load(res.text);
          const ascii = $("#tiresult").text().trim();
          const share = $("#sharebutton").parent().find("a").attr("href") ?? null;
  
          if (!ascii) {
              const snippet = res.text.slice(0, 1200).replace(/\s+/g, " ");
              return m.reply(`*🍂 Gagal convert — hasil kosong!*  
  *Width:* ${width}  
  *HTML:* ${snippet}`);
          }
  
          let out = `*✨ Image To Ascii (Auto-Width) ✨*\n\n`;
          out += `*🖼️ Width otomatis:* *${width}*\n\n`;
          out += `*📄 Hasil ASCII:*\n\`\`\`\n${ascii}\n\`\`\``;
          if (share) out += `\n*🔗 Share Link:* ${share}`;
  
          await m.reply(out);
      } catch (e) {
          const msg = e?.message ?? "unknown error";
          m.reply(`*🍂 Terjadi kesalahan saat memproses gambar!*  
  *Error:* ${msg}`);
      } finally {
          await conn.sendMessage(m.chat, { react: { text: "", key: m.key } });
      }
  };
  
  handler.register = false; // true kan jika ada fitur register atau daftar di bot mu.
  
  
  
  Object.defineProperty(__vxExports, "FEATURE_CREDIT", { enumerable: true, get: () => FEATURE_CREDIT });
  Object.defineProperty(__vxExports, "config", { enumerable: true, get: () => pluginConfig });
  Object.defineProperty(__vxExports, "handler", { enumerable: true, get: () => handler });
  return __vxExports
})
