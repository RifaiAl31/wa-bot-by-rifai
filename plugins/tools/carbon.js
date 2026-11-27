// tools/carbon — satu file: metadata + kode fitur (gabungan dari engine3/plugins/tools/carbon.js)
const __vx = require("../../lib/adapter/e3.js")
const __meta = {
  "name": "carbon",
  "command": [
    "carbon",
    "carbonify",
    "carboncode"
  ],
  "category": "tools",
  "desc": "Membuat gambar kode dengan tampilan carbon style",
  "usage": ".carbon <kode>",
  "owner": false,
  "group": false,
  "private": false,
  "premium": false,
  "admin": false,
  "botAdmin": false,
  "cooldown": 10,
  "energi": 1,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
}
const __vdir = require('path').join(__dirname, "../../lib/ext/plugins/tools").split('\\').join('/')
module.exports = __vx.plugin("tools/carbon", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + '/carbon.js'
  const __vxDef = (m) => (m && m.__esModule ? m.default : m);
  const __vxExports = {};
  const mql = __vxDef(require("@microlink/mql"));
  const te = __vxDef(require("../../lib/ext/src/lib/vanxone-error.js"));
  
  const pluginConfig = {
      name: "carbon",
      alias: ["carbonify", "carboncode"],
      category: "tools",
      description: "Membuat gambar kode dengan tampilan carbon style",
      usage: ".carbon <kode>",
      example: '.carbon console.log("Hello World")',
      isOwner: false,
      isPremium: false,
      isGroup: false,
      isPrivate: false,
      cooldown: 10,
      energi: 1,
      isEnabled: true
  }
  
  const THEMES = [
      "dracula-pro", "monokai", "nord", "solarized-dark", "solarized-light",
      "one-dark", "material", "panda-syntax", "night-owl", "cobalt2"
  ]
  
  const FONTS = [
      "Fira Code", "JetBrains Mono", "Hack", "Source Code Pro", "Inconsolata",
      "Droid Sans Mono", "Anonymous Pro"
  ]
  
  function buildCarbonUrl(config) {
      const theme = THEMES.includes(config.theme) ? config.theme : "dracula-pro"
      const font = FONTS.includes(config.font) ? config.font : "Fira Code"
  
      const params = new URLSearchParams({
          bg: config.background,
          t: theme,
          wt: "none",
          l: config.language || "auto",
          ds: "false",
          dsyoff: "20px",
          dsblur: "68px",
          wc: "true",
          wa: "true",
          pv: "56px",
          ph: "56px",
          ln: config.lineNumbers ? "true" : "false",
          fl: "1",
          fm: font,
          fs: config.fontSize || "14px",
          lh: "152%",
          si: "false",
          es: "2x",
          wm: "false"
      })
  
      params.append("code", config.code)
      return `https://carbon.now.sh/?${params.toString()}`
  }
  
  async function handler(m, { sock }) {
      const text = m.text || m.quoted?.text
  
      if (!text) {
          return m.reply(
              `🖥️ *CARBON CODE*\n\n` +
              `Fitur ini mengubah teks kode program kamu menjadi gambar cantik ala Carbon\n\n` +
              `*Cara pakai:*\n` +
              `> \`${m.prefix}carbon <kode>\`\n` +
              `> Atau kamu bisa reply pesan yang berisi kode\n\n` +
              `*Contoh:*\n` +
              `> \`${m.prefix}carbon console.log("Halo")\``
          )
      }
  
      await m.react("🕕")
  
      try {
          const config = {
              code: text,
              language: "auto",
              theme: "dracula-pro",
              font: "Fira Code",
              fontSize: "14px",
              background: "rgba(226,233,239,1)",
              lineNumbers: true,
              width: 1024,
              height: 768,
              waitFor: 3000
          }
  
          const targetUrl = buildCarbonUrl(config)
  
          const res = await mql(targetUrl, {
              screenshot: {
                  element: ".export-container",
                  optimizeForSpeed: true
              },
              viewport: {
                  width: config.width,
                  height: config.height
              },
              waitFor: config.waitFor,
              meta: false
          })
  
          const imageUrl = res.data?.screenshot?.url || null
  
          if (!imageUrl) throw new Error("Gagal generate carbon gambar")
  
          await sock.sendMedia(m.chat, imageUrl, null, m, {
              type: "image"
          })
  
      } catch (err) { globalThis.__vanxoneCatch?.(err);
          return m.reply(te(m.prefix, m.command, m.pushName))
      }
  }
  
  
  Object.defineProperty(__vxExports, "config", { enumerable: true, get: () => pluginConfig });
  Object.defineProperty(__vxExports, "handler", { enumerable: true, get: () => handler });
  return __vxExports
})
