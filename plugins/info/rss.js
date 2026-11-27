// main/rss — satu file: metadata + kode fitur (gabungan dari engine8/plugins/main/rss.js)
const __vx = require("../../lib/adapter/e8.js")
const __meta = {
  "name": "rss",
  "command": [
    "rss",
    "mem",
    "memoribot"
  ],
  "category": "info",
  "desc": "Lihat pemakaian memori (RSS & heap) bot saat ini",
  "usage": ".rss",
  "owner": false,
  "group": false,
  "private": false,
  "premium": false,
  "admin": false,
  "botAdmin": false,
  "cooldown": 10,
  "energi": 0,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
}
const __vdir = require('path').join(__dirname, "../../lib/ext/plugins/main").split('\\').join('/')
module.exports = __vx.plugin("main/rss", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + '/rss.js'
  const __vxDef = (m) => (m && m.__esModule ? m.default : m);
  const __vxExports = {};
  const te = __vxDef(require("../../lib/ext/src/lib/vanxone-error.e8.js"));
  const messageBuilder = __vxDef(require("../../lib/MessageBuilder.js"));
  const { AIRich } = messageBuilder;
  const { getMemoryNow } = require("../../lib/ext/src/lib/vanxone-memory-monitor.e8.js");
  const { getPanelMemory } = require("../../lib/ext/src/lib/vanxone-panel-memory.js");
  const { getActiveJadibots } = require("../../lib/ext/src/lib/vanxone-jadibot-manager.e8.js");
  
  const pluginConfig = {
      name: 'rss',
      alias: ['mem', 'memori', 'memoribot'],
      category: 'main',
      description: 'Lihat pemakaian memori (RSS & heap) bot saat ini',
      usage: '.rss',
      example: '.rss',
      isOwner: false,
      isPremium: false,
      isGroup: false,
      isPrivate: false,
      cooldown: 10,
      energi: 0,
      isEnabled: true
  }
  
  function fmt(bytes) {
      if (!bytes || bytes < 0) return '0 MB'
      const mb = bytes / 1024 / 1024
      return mb >= 1024 ? `${(mb / 1024).toFixed(2)} GB` : `${mb.toFixed(1)} MB`
  }
  
  function fmtSigned(bytes) {
      return `${bytes >= 0 ? '+' : '-'}${fmt(Math.abs(bytes))}`
  }
  
  function fmtUptime(seconds) {
      const d = Math.floor(seconds / 86400)
      const h = Math.floor((seconds % 86400) / 3600)
      const m = Math.floor((seconds % 3600) / 60)
      return d > 0 ? `${d}h ${h}j ${m}m` : h > 0 ? `${h}j ${m}m` : `${m}m ${Math.floor(seconds % 60)}s`
  }
  
  function bar(percent, width = 10) {
      const filled = Math.round((Math.min(Math.max(percent, 0), 100) / 100) * width)
      return '█'.repeat(filled) + '░'.repeat(width - filled)
  }
  
  function statusOf(percent) {
      if (percent >= 85) return '🔴 Kritis'
      if (percent >= 60) return '🟡 Tinggi'
      return '🟢 Aman'
  }
  
  function collect() {
      const s = getMemoryNow()
      // persen terhadap batas restart; kalau tidak ada batas, bandingkan dengan ambang peringatan
      const panel = getPanelMemory()
      // angka utama = yang dilihat di panel (cgroup container); kalau batas panel tidak terbaca pakai batas restart
      const ref = panel.limit || s.limit || s.warnAt
      const percent = (panel.used / ref) * 100
  
      const rows = [
          ['Metrik', 'Nilai'],
          ['Server (RAM)', `${fmt(panel.used)} / ${fmt(ref)} (${percent.toFixed(0)}%)`],
          ['RSS proses bot', fmt(s.rss)],
          ['Heap', `${fmt(s.heapUsed)} / ${fmt(s.heapTotal)}`],
          ['Buffer + ext', fmt(s.external + s.arrayBuffers)],
      ]
      if (s.peakRss) rows.push(['Puncak', fmt(s.peakRss)])
      if (s.startRss) rows.push(['Sejak start', fmtSigned(s.rss - s.startRss)])
      rows.push(['Jadibot', `${getActiveJadibots().length} sesi aktif`])
      rows.push(['Uptime', fmtUptime(process.uptime())])
  
      const note = s.limit
          ? `Bot restart otomatis kalau RSS mencapai ${fmt(s.limit)}.`
          : `Tidak ada batas restart (peringatan di ${fmt(s.warnAt)}).`
  
      return { rows, percent, note }
  }
  
  async function handler(m, { sock }) {
      try {
          const { rows, percent, note } = collect()
          const head = `${statusOf(percent)}  ${bar(percent)} ${percent.toFixed(0)}%`
  
          try {
              const rich = new AIRich(sock)
                  .addText(`# 🧠 Memori Bot (RSS)\n${head}`)
                  .addTable(rows)
                  .addText(note)
  
              await rich.send(m.chat, { quoted: m })
          } catch (richError) {
              // rich message gagal terkirim → tampilkan versi teks biasa
              console.error('[RSS] AIRich gagal, pakai teks biasa:', richError.message)
              const body = rows.slice(1).map(([k, v]) => `> ${k} : ${v}`).join('\n')
              await m.reply(`🧠 *ᴍᴇᴍᴏʀɪ ʙᴏᴛ (ʀss)*\n\n${head}\n${body}\n\n${note}`)
          }
      } catch (error) {
          await m.react('☢')
          await m.reply(te(m.prefix, m.command, m.pushName))
      }
  }
  
  
  Object.defineProperty(__vxExports, "config", { enumerable: true, get: () => pluginConfig });
  Object.defineProperty(__vxExports, "handler", { enumerable: true, get: () => handler });
  return __vxExports
})
