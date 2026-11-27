// main/script — satu file: metadata + kode fitur (gabungan dari engine5/plugins/main/script.js)
const __vx = require("../../lib/adapter/e5.js")
const __meta = {
  "name": "script",
  "command": [
    "sc"
  ],
  "category": "info",
  "desc": "Informasi source code bot",
  "usage": ".sc"
}
const __vdir = require('path').join(__dirname, "../../lib/ext/plugins/main").split('\\').join('/')
module.exports = __vx.plugin("main/script", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + '/script.js'
  const __vxExports = {};
  const handler = async (m, { sock, usedPrefix, text, getPluginStats }) => {
  	const info = getPluginStats()

    const botName = global.botname || global.namaBot || "WhatsApp Bot"
    const ownerName = global.ownername || global.namaOwner || "Owner Bot"
  	let teks = `Hai @${m.sender.split("@")[0]}, berikut informasi *${botName}*.

  *Informasi Bot*
  - Nama bot : ${botName}
  - Owner : ${ownerName}
  - Script type : ${global.typeSc}
  - Total plugins : *${info.totalFiles}*
  - Library : ${global.library}
  - Version : ${global.versi}
  - Runtime : ${global.rtBot}
  - Database : ${global.data}

  *Fitur*
  - Pengelolaan perintah dan kategori
  - Pemuatan ulang plugin
  - Menu dan tampilan interaktif`

  await sock.sendMessage(m.chat, {
    text: teks,
    mentions: [m.sender],
    footer: global.footer || botName,
    contextInfo: { mentionedJid: [m.sender] }
  }, { quoted: m })
  }
  
  handler.command = ['sc', 'script']
  const __vxDefault = handler
  Object.defineProperty(__vxExports, "default", { enumerable: true, get: () => __vxDefault });
  return __vxExports
})
