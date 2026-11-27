// tools/tools-8upload — satu file: metadata + kode fitur (gabungan dari engine2/plugins/tools/tools-8upload.js)
const __vx = require("../../lib/adapter/e2.js")
const __meta = {
  "command": [
    "8upload"
  ],
  "category": "tools",
  "owner": false,
  "group": false,
  "admin": false,
  "botAdmin": false,
  "desc": "Fitur 8upload (dari Bot package)"
}
const __vdir = require('path').join(__dirname, "../../lib/ext/plugins/tools").split('\\').join('/')
module.exports = __vx.plugin("tools/tools-8upload", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + '/tools-8upload.js'
  const __vxDef = (m) => (m && m.__esModule ? m.default : m);
  const __vxNs = (m) => (m && m.__esModule ? m : (m !== null && (typeof m === 'object' || typeof m === 'function') ? Object.assign(Object.create(null), m, { default: m }) : { default: m }));
  const __vxExports = {};
  /**
   ╔══════════════════════
        ⧉  [8upload] — [tool]
  ╚══════════════════════
  
    ✺ Type     : Plugin ESM
    ✺ Creator  : Owner Bot
    ✺ Scrape      :
    [  ]
    ✺ Scrape Maker : WhatsApp Bot
    ✺ Note    : waspada iseng.
  */
  
  const fs = __vxDef(require("fs"));
  const path = __vxDef(require("path"));
  const cheerio = __vxNs(require("cheerio"));
  
  const COOKIE = "PHPSESSID=l0pkhh77ohv96iockf2me4ttg9";
  
  let handler = async (m, { conn }) => {
      try {
          let q = m.quoted && (m.quoted.mimetype || m.quoted.mediaType) ? m.quoted : m;
          let mime = (q.msg || q).mimetype || q.mediaType || "";
  
          if (!mime) {
              return m.reply("*Kirim atau reply gambar / file dengan caption .8upload* 🍂");
          }
  
          await conn.sendMessage(m.chat, { react: { text: "⏳", key: m.key } });
  
          const buffer = await q.download();
          if (!buffer) {
              return m.reply("*File tidak bisa diambil.* 🍂");
          }
  
          const ext = mime.split("/")[1] || "bin";
          const fileName = `8upload-${Date.now()}.${ext}`;
          const filePath = path.join("/tmp", fileName);
  
          fs.writeFileSync(filePath, buffer);
  
          const form = new FormData();
          form.append("upload[]", new Blob([buffer]), fileName);
  
          const uploadRes = await fetch("https://8upload.com/upload/mt/", {
              method: "POST",
              headers: {
                  "User-Agent": "Mozilla/5.0",
                  "Accept": "application/json, text/javascript, */*; q=0.01",
                  "X-Requested-With": "XMLHttpRequest",
                  "Origin": "https://8upload.com",
                  "Referer": "https://8upload.com/",
                  "Cookie": COOKIE
              },
              body: form
          });
  
          const uploadText = await uploadRes.text();
          if (!uploadText || !uploadText.includes("/")) {
              return m.reply("*Upload ditolak server 8upload.* 🍂");
          }
  
          const pageUrl = "https://8upload.com" + uploadText.replace(/"/g, "");
  
          const pageRes = await fetch(pageUrl, {
              headers: {
                  "User-Agent": "Mozilla/5.0",
                  "Accept": "text/html",
                  "Referer": "https://8upload.com/",
                  "Cookie": COOKIE
              }
          });
  
          const html = await pageRes.text();
          const $ = cheerio.load(html);
  
          let display;
          let direct;
          let del;
  
          $("input#lname").each((_, el) => {
              const raw = $(el).val();
              if (typeof raw !== "string") return;
  
              if (raw.includes("/display/")) {
                  const $$ = cheerio.load(raw);
                  display = $$("a").attr("href");
              }
  
              if (raw.includes("/image/")) direct = raw;
              if (raw.includes("/delete/")) del = raw;
          });
  
          if (!direct) {
              return m.reply("*Link hasil upload tidak ditemukan.* 🍂");
          }
  
          await m.reply(`
  *📤 Upload Berhasil*
  
  *🖼️ Display:* ${display || "-"}
  *📥 Direct:* ${direct}
  *🗑️ Delete:* ${del || "-"}
  
  _Simpan link delete baik-baik._
          `.trim());
  
          fs.unlinkSync(filePath);
      } catch {
          await m.reply("*Terjadi kesalahan saat upload.* 🍂");
      } finally {
          await conn.sendMessage(m.chat, { react: { text: "", key: m.key } });
      }
  };
  
  handler.help = ["8upload"];
  handler.tags = ["tool"];
  handler.command = /^(8upload)$/i;
  handler.limit = true;
  handler.register = false; // true kan jika ada fitur register atau daftar di bot mu.
  
  const __vxDefault = handler;
  Object.defineProperty(__vxExports, "default", { enumerable: true, get: () => __vxDefault });
  return __vxExports
})
