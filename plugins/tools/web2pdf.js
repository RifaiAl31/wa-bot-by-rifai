// tools/web2pdf — fitur tambahan (plugins.zip), disesuaikan untuk WhatsApp Bot
const __vx = require("../../lib/adapter/e2.js")
const __meta = {
  "command": [
    "web2pdf",
    "url2pdf",
    "html2pdf",
    "webtopdf"
  ],
  "category": "tools",
  "owner": false,
  "group": false,
  "admin": false,
  "botAdmin": false,
  "desc": "Fitur web2pdf",
  "usage": ".web2pdf <url>"
}
const __vdir = __dirname.split('\\').join('/')
module.exports = __vx.plugin("vxnew/tools/web2pdf", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + "/web2pdf.js"
  const __vxDef = (m) => (m && m.__esModule ? m.default : m);
  const __vxImp = async (m) => { const r = require(m); return r && r.__esModule ? r : Object.assign({ default: r }, r) };
  const __vxExports = {};
  const fetch = __vxDef(require("../../lib/newlib/fetch.js"));
  
  let handler = async (m, { conn, text, usedPrefix, command }) => {
      if (!text) {
          return m.reply(`📄 *WEB TO PDF CONVERTER*\n\nUbah halaman website menjadi dokumen PDF!\nContoh:\n${usedPrefix + command} https://wikipedia.org`);
      }
  
      try {
          await conn.sendMessage(m.chat, { react: { text: "⏳", key: m.key } });
  
          let url = text.trim();
          if (!url.startsWith('http://') && !url.startsWith('https://')) url = 'https://' + url;
  
          let pdfApi = `https://api.html2pdf.app/v1/generate?url=${encodeURIComponent(url)}&apiKey=public`;
          let res = await fetch(pdfApi);
  
          if (!res.ok) {
              // Fallback to webtopdf render service
              pdfApi = `https://webtopdf.xyz/api/pdf?url=${encodeURIComponent(url)}`;
              res = await fetch(pdfApi);
          }
  
          if (!res.ok) throw new Error(`Gagal mengonversi web ke PDF (Status ${res.status})`);
  
          let pdfBuffer = await res.buffer();
          if (!pdfBuffer || pdfBuffer.length < 500) throw new Error("Dokumen PDF yang dihasilkan kosong.");
  
          let host = new URL(url).hostname;
          let fileName = `Web_${host}_${Date.now()}.pdf`;
  
          let caption = `📄 *WEB TO PDF BERHASIL*\n\n`;
          caption += `🔗 *URL:* ${url}\n`;
          caption += `✅ *Request by:* ${m.pushName || 'User'}`;
  
          await conn.sendMessage(m.chat, {
              document: pdfBuffer,
              fileName: fileName,
              mimetype: 'application/pdf',
              caption: caption
          }, { quoted: m });
  
          await conn.sendMessage(m.chat, { react: { text: "✅", key: m.key } });
  
      } catch (e) {
          console.error(e);
          await conn.sendMessage(m.chat, { react: { text: "❌", key: m.key } });
          m.reply(`❌ *Web2PDF Gagal*\nError: ${e.message}`);
      }
  };
  
  handler.help = ['web2pdf <url>', 'url2pdf <url>'];
  handler.tags = ['tools'];
  handler.command = /^(web2pdf|url2pdf|html2pdf|webtopdf)$/i;
  
  handler.limit = 1;
  
  
  const __vxDefault = handler

  Object.defineProperty(__vxExports, "default", { enumerable: true, get: () => __vxDefault });
  for (const k of ['before', 'all']) { if (typeof __vxExports[k] === 'function' && typeof __vxDefault === 'function' && !__vxDefault[k]) __vxDefault[k] = __vxExports[k] }
  return __vxExports
})
