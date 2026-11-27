import { dioRun, dioRegister } from '../../lib/engine/plugins.js'

// ───────── lib bersama (sama seperti live/dinolive.js) ─────────
const libs = {
    "htmlcard": (module, exports, require) => {
// Pengirim kartu HTML (rich response) untuk WhatsApp Bot.
// Kartu statis: semua data ditanam di HTML, tanpa fetch (sandbox WA memblokir jaringan).
const DEFAULT_BOT_JID = "867051314767696@bot"
const KAPABILITAS = [34, 58, 29, 1, 67, 60, 55, 8]
const hex = (n) => Array.from({ length: n }, () => Math.floor(Math.random() * 16).toString(16)).join("")
const randomResponseId = () => `${hex(8)}-${hex(4)}-4${hex(3)}-a${hex(3)}-${hex(12)}`

function buildRichHtmlPayload(html, title = "Card", opts = {}) {
  // opts.quoted = objek pesan (m) yang mau di-reply: kutipannya tampil di dalam kartu, seperti balasan biasa
  const q = require('./dquote').quoteOf(opts.quoted), qCtx = q && q.message ? { stanzaId: q.key.id, participant: q.key.participant || q.sender, remoteJid: q.chat, quotedMessage: q.message } : {}
  return {
    messageContextInfo: { deviceListMetadata: {}, deviceListMetadataVersion: 2, botMetadata: { capabilityMetadata: { capabilities: KAPABILITAS } } },
    botForwardedMessage: { message: { richResponseMessage: {
      messageType: 1,
      submessages: [{ messageType: 2, messageText: title }],
      unifiedResponse: { data: Buffer.from(JSON.stringify({
        response_id: randomResponseId(),
        sections: [{ view_model: { primitive: { __typename: "GenAIaeacdsnwHtmlPrimitive", payload: html, trusted_sources: [] }, __typename: "GenAISingleLayoutViewModel" } }],
      })).toString("base64") },
      contextInfo: { forwardingScore: 1, isForwarded: true, forwardedAiBotMessageInfo: { botJid: DEFAULT_BOT_JID }, forwardOrigin: 4, ...qCtx },
    } } },
  }
}

async function sendHtmlCard(sock, m, html, title, emoji = "✨", opts = {}) {
  try {
    await sock.relayMessage(m.chat, buildRichHtmlPayload(html, title, opts), {})
    try { await sock.sendMessage(m.chat, { react: { text: emoji, key: m.key } }) } catch {}
    return true
  } catch (err) {
    console.error(`[HTMLCARD:${title}] gagal kirim:`, err.message)
    await sock.sendMessage(m.chat, { text: "❌ Kartu gagal dikirim. Fitur ini butuh WhatsApp versi terbaru." }, { quoted: m })
    return false
  }
}

const safeJson = (obj) => JSON.stringify(obj).replace(/</g, "\\u003c").replace(/>/g, "\\u003e").replace(/&/g, "\\u0026").replace(/\u2028|\u2029/g, "")
const escapeHtml = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]))

const BASE_CSS = String.raw`
:root{--bg:#070914;--card:#12162b;--card2:#1b2040;--ink:#fff;--soft:#98a2cc;--line:#2a3158;--acc:#8b5cf6;--acc2:#22d3ee;--warn:#f59e0b;--red:#ef4444;--blue:#38bdf8;--sys:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;}
*{margin:0;padding:0;box-sizing:border-box;-webkit-tap-highlight-color:transparent;}
html,body{background:transparent;color:var(--ink);font-family:var(--sys);min-height:100vh;overflow-x:hidden;-webkit-font-smoothing:antialiased;}
.stage{min-height:100vh;display:flex;align-items:flex-start;justify-content:center;padding:14px 10px;}
.app{width:100%;max-width:380px;border-radius:16px;overflow:hidden;position:relative;background:linear-gradient(160deg,#1c1446 0%,#0d1124 45%,var(--bg) 100%);box-shadow:0 18px 40px rgba(0,0,0,.55);padding:14px 12px 16px;}
.top{display:flex;align-items:center;gap:9px;margin-bottom:12px;}
.logo{width:30px;height:30px;border-radius:9px;background:var(--acc);flex:none;display:flex;align-items:center;justify-content:center;font-size:16px;}
.meta{min-width:0;flex:1;}
.title{font-size:14px;font-weight:800;}
.sub{font-size:10.5px;color:var(--soft);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;margin-top:2px;}
.chips{display:flex;gap:6px;overflow-x:auto;padding-bottom:8px;margin-bottom:8px;scrollbar-width:none;}
.chips::-webkit-scrollbar{display:none;}
.chip{flex:none;border:1px solid var(--line);background:var(--card);color:var(--soft);border-radius:20px;padding:6px 12px;font-size:12px;font-weight:700;cursor:pointer;}
.chip.on{background:var(--acc);border-color:var(--acc);color:#ffffff;}
.btn{border:0;border-radius:10px;padding:10px 12px;font-size:13px;font-weight:800;cursor:pointer;background:var(--acc);color:#ffffff;}
.btn.alt{background:var(--card2);color:var(--ink);border:1px solid var(--line);}
.btn.red{background:var(--red);color:#fff;}
.inp{width:100%;background:var(--card);border:1px solid var(--line);border-radius:10px;padding:10px 12px;color:var(--ink);font-size:14px;outline:none;font-family:var(--sys);}
.inp:focus{border-color:var(--acc);}
.box{background:var(--card);border:1px solid var(--line);border-radius:12px;padding:10px 12px;}
.row{display:flex;gap:8px;align-items:center;}
.muted{color:var(--soft);font-size:11px;}
.hide{display:none!important;}
`;

module.exports = { buildRichHtmlPayload, sendHtmlCard, safeJson, escapeHtml, BASE_CSS }
    },
    "dquote": (module, exports, require) => {
// kutipan untuk kartu HTML: pakai pesan user apa adanya (header palsu bisnis tidak dipakai)
const quoteOf = (q) => { try { return q && q.key && q.message && q.chat ? q : null } catch { return null } }
module.exports = { quoteOf, apply: (o) => o, enabled: () => false }
    },
}

const feature = (module, exports, require) => {
const { sendHtmlCard, safeJson } = require('../htmlcard')
const os = require('os'), fs = require('fs')
const mb = (n) => Math.round(n / 1048576)
function cpuPct() { const c = os.cpus(); const l = os.loadavg()[0]; return Math.min(100, Math.round((l / Math.max(1, c.length)) * 100)) }
function upText(sec) { sec = Math.floor(sec); const d = Math.floor(sec / 86400), h = Math.floor(sec % 86400 / 3600), mi = Math.floor(sec % 3600 / 60); return (d ? d + 'h ' : '') + (h ? h + 'j ' : '') + mi + 'm' }
async function pingData(m) {
  const tot = os.totalmem(), free = os.freemem(), mu = process.memoryUsage()
  let disk = 0, diskText = '-'
  try { const st = fs.statfsSync('/'); const t = st.blocks * st.bsize, f = st.bavail * st.bsize; disk = Math.round((1 - f / t) * 100); diskText = (Math.round((t - f) / 1073741824 * 10) / 10) + ' GB / ' + (Math.round(t / 1073741824 * 10) / 10) + ' GB' } catch {}
  const ts = Number(m?.messageTimestamp?.low ?? m?.messageTimestamp ?? 0)
  const latency = ts ? Math.max(1, Date.now() - ts * 1000) : 0
  return { latency, uptime: upText(process.uptime()), platform: os.platform() + ' ' + os.arch(), cpu: cpuPct(), ram: Math.round((1 - free / tot) * 100), ramText: mb(tot - free) + ' MB / ' + mb(tot) + ' MB', disk, diskText, os: os.type() + ' ' + os.release().split('-')[0], arch: os.arch(), cores: os.cpus().length, heap: mb(mu.heapUsed), rss: mb(mu.rss), swap: '-', node: process.version, bot: global.namebot || 'WhatsApp Bot' }
}


async function loadHtml() {
  const fs = require('fs'), path = require('path')
  return fs.readFileSync(path.join(global.kRichDir, 'ping.html'), 'utf8')
}

module.exports = {
  name: 'pingx',
  alias: [],
  category: 'rich',
  desc: 'Cek kecepatan bot ditampilkan sebagai kartu rich',
  run: async ({ sock, m, reply }) => {
    try {
      const __d = await pingData(m)
      const html = (await loadHtml()).replace(/\/\*DATA_START\*\/[\s\S]*?\/\*DATA_END\*\//, () => '/*DATA_START*/' + safeJson(__d) + '/*DATA_END*/')
      await sendHtmlCard(sock, m, html, 'Ping Card', '📶')
    } catch (e) {
      reply(`❌ Gagal memuat kartu: ${e.message}`)
    }
  },
}
}

dioRegister("rich/pingx", feature, libs)

let handler = (m, ctx) => dioRun("rich/pingx", m, ctx)

handler.command = ['pingx']
handler.help = ['pingx']
handler.tags = ['rich']

export default handler
