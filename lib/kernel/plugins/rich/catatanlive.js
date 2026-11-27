import { dioRun, dioRegister } from '../../lib/engine/plugins.js'
import { oneCommand } from '../../lib/engine/plugins.js'

// ───────── logika fitur (sebelumnya di lib/) ─────────
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
    "cards/catatan": (module, exports, require) => {
    // Kartu HTML statis: CATATAN & TO-DO (To-do list dengan progres + catatan cepat)
    // Semua jalan di dalam kartu, tanpa fetch. By PIX.
    const { BASE_CSS, safeJson } = require("../htmlcard");

    const BODY = String.raw`
    <style>
    __BASECSS__
    .tabs{display:flex;gap:6px;margin-bottom:10px}.tabs .chip{flex:1;text-align:center}
    .it{display:flex;align-items:center;gap:9px;background:var(--card);border:1px solid var(--line);border-radius:11px;padding:9px 10px;margin-bottom:6px}
    .it.d span{text-decoration:line-through;color:var(--soft)}.it span{flex:1;font-size:13.5px;word-break:break-word}
    .ck{width:22px;height:22px;border-radius:7px;border:2px solid var(--line);background:none;color:#ffffff;font-weight:900;cursor:pointer;flex:none}.it.d .ck{background:var(--acc);border-color:var(--acc)}
    .x{border:0;background:none;color:var(--red);font-size:16px;cursor:pointer}
    .nt{background:var(--card);border:1px solid var(--line);border-left:4px solid var(--acc);border-radius:11px;padding:10px;margin-bottom:7px;font-size:13px;white-space:pre-wrap;word-break:break-word}
    .nt small{display:block;color:var(--soft);font-size:10px;margin-top:5px}
    textarea.inp{min-height:70px;resize:vertical}
    .prog{height:6px;background:var(--card2);border-radius:5px;overflow:hidden;margin:2px 0 10px}.prog i{display:block;height:100%;width:0;background:var(--acc);transition:width .3s}
    </style>
    <div class="stage"><div class="app">
     <div class="top"><div class="logo">📝</div><div class="meta"><div class="title">Catatan &amp; To-Do</div><div class="sub" id="who"></div></div></div>
     <div class="tabs"><button class="chip on" id="tt">✅ To-Do</button><button class="chip" id="tn">🗒 Catatan</button></div>
     <div id="pt"><div class="row" style="margin-bottom:8px"><input class="inp" id="ti" placeholder="Tugas baru..." maxlength="120"><button class="btn" id="ta">+</button></div><div class="prog"><i id="pg"></i></div><div id="tl"></div><div class="row" style="margin-top:6px"><button class="btn alt" style="flex:1" id="tc">Hapus yang selesai</button></div></div>
     <div id="pn" class="hide"><textarea class="inp" id="ni" placeholder="Tulis catatan..." maxlength="600"></textarea><button class="btn" style="width:100%;margin:8px 0" id="na">Simpan Catatan</button><div id="nl"></div></div>
     <div class="muted" style="text-align:center;margin-top:8px">Tersimpan di perangkat ini selama kartu dipakai</div>
    </div></div>
    <script>
    (function(){
    var CFG=__CFG__;document.getElementById('who').textContent=CFG.nama;
    var $=function(i){return document.getElementById(i)};
    var S={t:[],n:[]};try{S=JSON.parse(localStorage.getItem('pix_cat')||'{"t":[],"n":[]}');}catch(e){}
    function save(){try{localStorage.setItem('pix_cat',JSON.stringify(S));}catch(e){}}
    function esc(s){return String(s).replace(/[&<>"]/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]})}
    function rt(){var h='',d=0;S.t.forEach(function(x,i){if(x.d)d++;h+='<div class="it'+(x.d?' d':'')+'"><button class="ck" data-k="'+i+'">'+(x.d?'✓':'')+'</button><span>'+esc(x.s)+'</span><button class="x" data-x="'+i+'">✕</button></div>';});
     $('tl').innerHTML=h||'<div class="muted" style="text-align:center;padding:14px">Belum ada tugas</div>';$('pg').style.width=(S.t.length?d*100/S.t.length:0)+'%';}
    function rn(){$('nl').innerHTML=S.n.map(function(x,i){return '<div class="nt">'+esc(x.s)+'<small>'+esc(x.w)+' • <a data-n="'+i+'" style="color:var(--red)">hapus</a></small></div>'}).join('')||'<div class="muted" style="text-align:center;padding:14px">Belum ada catatan</div>';}
    $('ta').onclick=function(){var v=$('ti').value.trim();if(!v)return;S.t.unshift({s:v,d:0});$('ti').value='';save();rt();};
    $('ti').onkeydown=function(e){if(e.key==='Enter')$('ta').onclick();};
    $('tl').onclick=function(e){var k=e.target.dataset;if(k.k!==undefined)S.t[+k.k].d^=1;else if(k.x!==undefined)S.t.splice(+k.x,1);else return;save();rt();};
    $('tc').onclick=function(){S.t=S.t.filter(function(x){return !x.d});save();rt();};
    $('na').onclick=function(){var v=$('ni').value.trim();if(!v)return;S.n.unshift({s:v,w:new Date().toLocaleString('id-ID')});$('ni').value='';save();rn();};
    $('nl').onclick=function(e){var k=e.target.dataset.n;if(k===undefined)return;S.n.splice(+k,1);save();rn();};
    $('tt').onclick=function(){$('pt').classList.remove('hide');$('pn').classList.add('hide');$('tt').classList.add('on');$('tn').classList.remove('on');};
    $('tn').onclick=function(){$('pn').classList.remove('hide');$('pt').classList.add('hide');$('tn').classList.add('on');$('tt').classList.remove('on');};
    rt();rn();
    })();
    </script>
    `;

    function buildCatatanHtml({ playerName = "Kamu" } = {}) {
      return BODY.replace("__BASECSS__", () => BASE_CSS).replace("__CFG__", () => safeJson({ nama: String(playerName) }));
    }

    module.exports = { buildCatatanHtml };
        }
}

const feature = (module, exports, require) => {
// KARTU LIVE: Catatan & To-Do — To-do list + catatan cepat
const { buildCatatanHtml } = require('../../lib/cards/catatan')
const { sendHtmlCard } = require('../../lib/htmlcard')

module.exports = {
  name: 'catatan',
  alias: [],
  category: 'rich',
  desc: "To-do list + catatan cepat",
  run: async ({ sock, m, pushname }) => {
    const html = buildCatatanHtml({ playerName: pushname || String(m.sender).split('@')[0] })
    await sendHtmlCard(sock, m, html, 'Catatan & To-Do', '📝')
  },
}
    }

dioRegister("rich/catatanlive", feature, libs)

let handler = (m, ctx) => dioRun("rich/catatanlive", m, ctx)

handler.command = ['catatan']
handler.help = ['catatan']
handler.tags = ['rich']

const __plugin = handler

// satu command = nama file; command lama dibuang (alias)
export default oneCommand(__plugin, 'catatanlive', { subs: false })
