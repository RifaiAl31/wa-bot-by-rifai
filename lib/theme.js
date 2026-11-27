// =====================================================================
//  lib/theme.js — TEMA tampilan bot (tersimpan, ganti lewat chat tanpa restart: .tema)
//
//   rich   : tema warna kartu HTML (aurora, sunset, ocean, ...)
//   unify  : true = semua kartu rich pakai warna tema (false = warna per kategori seperti biasa)
//
//  Pilihan tersimpan di database/uitheme.json (menang atas settings.js: global.uiTheme / global.uiFrame).
// =====================================================================
'use strict'

const { createStore } = require('./store')

const store = createStore('uitheme', { rich: '', unify: null })

// accent = [warna1, warna2] (gradien utama) • glow = warna cahaya latar • deep = warna dasar kartu
// css (opsional) = gaya tambahan khusus tema, disisipkan setelah CSS bawaan kartu • unify:true = semua kartu pakai warna tema ini
const RICH = {
  aurora: { name: 'Aurora', emoji: '🌌', accent: ['#7c5cff', '#00d4ff'], glow: ['#7c5cff', '#00d4ff', '#ff5ecb'], deep: '#0d0a16' },
  sunset: { name: 'Sunset', emoji: '🌇', accent: ['#ff7a45', '#ff3d81'], glow: ['#ff7a45', '#ff3d81', '#ffd200'], deep: '#160a0e' },
  ocean: { name: 'Ocean', emoji: '🌊', accent: ['#00c6ff', '#0072ff'], glow: ['#00c6ff', '#0072ff', '#2dd4bf'], deep: '#06101a' },
  emerald: { name: 'Emerald', emoji: '🍀', accent: ['#22c55e', '#2dd4bf'], glow: ['#22c55e', '#2dd4bf', '#a3e635'], deep: '#06130e' },
  sakura: { name: 'Sakura', emoji: '🌸', accent: ['#ff8fb8', '#c084fc'], glow: ['#ff8fb8', '#c084fc', '#fda4af'], deep: '#160b14' },
  gold: { name: 'Royal Gold', emoji: '👑', accent: ['#f7b733', '#fc4a1a'], glow: ['#f7b733', '#fc4a1a', '#ffe27a'], deep: '#150f06' },
  ruby: { name: 'Ruby', emoji: '💎', accent: ['#ff416c', '#ff4b2b'], glow: ['#ff416c', '#ff4b2b', '#a855f7'], deep: '#16080b' },
  mono: { name: 'Mono Neon', emoji: '🖤', accent: ['#e5e7eb', '#9ca3af'], glow: ['#e5e7eb', '#6b7280', '#38bdf8'], deep: '#0a0a0c' },
  // ---- TEMA UTAMA: Tinta 墨 (putih dominan, hitam-putih MURNI ala komik + lukisan tinta abstrak donghua) — gaya lengkap di lib/inkui.js ----
  tinta: {
    name: 'Tinta (Komik Donghua)', emoji: '🖋️', accent: ['#000000', '#000000'], glow: ['#000000', '#000000', '#000000'], deep: '#ffffff', unify: true,
    get css() { return require('./inkui').menuCss() }
  },
  // ---- Koboy Noir (hitam-putih ala foto koboy bertopi: konco perak, jahitan kulit, siluet daun) ----
  koboy: {
    name: 'Koboy Noir (Outlaw)', emoji: '🤠', accent: ['#f1efe9', '#8c8a85'], glow: ['#f1efe9', '#8c8a85', '#3a3a3a'], deep: '#060606', unify: true,
    banner: 'assets/koboy-banner.jpg',
    css: `
:root{--muted:#a6a39c;--ink:#f6f3ec;--line:rgba(236,232,222,.26);--g3:#3a3a3a;--serif:Georgia,'Times New Roman','Palatino Linotype',serif}
.card{--a:#f1efe9!important;--b:#8c8a85!important;--ac:#f1efe9!important;background:#060606;border-radius:22px;box-shadow:0 0 0 1px rgba(240,236,226,.55),0 0 0 4px #050505,0 0 0 5px rgba(240,236,226,.18),0 24px 56px rgba(0,0,0,.92)}
.card::after{border-radius:22px;box-shadow:inset 0 0 0 1px rgba(255,255,255,.07),inset 0 0 90px rgba(0,0,0,.9),inset 0 -70px 80px rgba(0,0,0,.6)}
.veil{background:linear-gradient(180deg,rgba(6,6,6,0) 0%,rgba(5,5,5,.55) 30%,rgba(3,3,3,.93) 56%,#030303 100%)}
.grid{opacity:.62;background:url("data:image/jpeg;base64,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") no-repeat 50% 0/100% auto;-webkit-mask-image:linear-gradient(180deg,#000 30%,transparent 78%);mask-image:linear-gradient(180deg,#000 30%,transparent 78%)}
.app .grid{background:none}
.grain{opacity:.55;background-image:radial-gradient(rgba(255,255,255,.2) .6px,transparent 1.1px),radial-gradient(rgba(255,255,255,.1) .5px,transparent 1px);background-size:7px 7px,11px 11px;background-position:0 0,3px 5px}
.o1{display:none}
.o2{background:#9b9b9b;opacity:.07;width:260px;height:160px;left:-80px;bottom:-60px}
.o3{display:none}
.topline{height:7px;z-index:3;background:repeating-linear-gradient(90deg,transparent 0 5px,#ece8de 5px 13px,transparent 13px 18px),linear-gradient(180deg,#1b1b1b,#070707);background-size:18px 2px,100% 100%;background-repeat:repeat-x,no-repeat;background-position:0 50%,0 0;border-bottom:1px solid rgba(236,232,222,.35);animation:none;box-shadow:none}
.sp{background:#fff;width:2px;height:2px;box-shadow:0 0 5px 1px rgba(255,255,255,.55)}
.content{padding-top:22px}
.ico{border-radius:50%;background:radial-gradient(circle at 34% 28%,#fff 0,#e3e1dc 24%,#8f8d88 58%,#2c2c2c 100%);box-shadow:0 0 0 2px #060606,0 0 0 3px rgba(240,236,226,.7),0 8px 18px rgba(0,0,0,.85);animation:none}
.ico::before{inset:-6px;border-radius:50%;border:1px dashed rgba(240,236,226,.55);box-shadow:none}
.ico::after{inset:5px;border-radius:50%;background:none;border:1px solid rgba(0,0,0,.5)}
.ico .fi{color:#0a0a0a;filter:none}
.eyebrow{color:#b3afa6;letter-spacing:.26em;font-family:var(--serif)}
.eyebrow .fi{color:#ece8de}
.title{font-family:var(--serif);font-weight:800;letter-spacing:.07em;text-transform:uppercase;color:#fff;text-shadow:0 2px 0 #000,0 0 14px rgba(0,0,0,.95),0 0 3px #000}
.badge{font-family:var(--serif);background:rgba(0,0,0,.55);border:1px solid rgba(240,236,226,.6);color:#f6f3ec;letter-spacing:.14em}
.badge::before{background:#f6f3ec;box-shadow:0 0 6px rgba(255,255,255,.7);border-radius:1px;transform:rotate(45deg);width:5px;height:5px}
.h{font-family:var(--serif);color:#f1eee6;letter-spacing:.2em}
.h::before{width:5px;height:5px;border-radius:50%;background:radial-gradient(circle,#0a0a0a 0 28%,#f1efe9 32%);box-shadow:none}
.h::after{background:repeating-linear-gradient(90deg,rgba(236,232,222,.5) 0 4px,transparent 4px 8px);height:1px}
.h .fi{color:#ece8de}
.panel,.tile,.sec,.hero,.reel{background:linear-gradient(165deg,rgba(24,24,24,.9),rgba(8,8,8,.92));border:1px dashed rgba(236,232,222,.34);box-shadow:0 0 0 2px #060606,0 0 0 3px rgba(236,232,222,.1),0 6px 16px rgba(0,0,0,.65)}
.tile::before{background:linear-gradient(90deg,#ece8de,transparent)}
.hero::before,.hb::before,.cathead::before{background:#fff;opacity:.1}
.row{border-bottom:1px dotted rgba(236,232,222,.2)}
.k{color:var(--muted)}
.v{color:#fbf9f4}
.v.pos{color:#fff;text-shadow:0 0 8px rgba(255,255,255,.35)}.v.neg{color:#8e8c87}
.h-gold,.h-sky,.h-vio,.h-rose,.h-mint,.h-amber,.h-cyan,.h-pink,.h-slate{--h:#e4e0d6;--hb:rgba(236,232,222,.12)}
.ki{border-radius:50%;background:radial-gradient(circle at 35% 30%,#3a3a3a,#0c0c0c);box-shadow:inset 0 0 0 1px rgba(236,232,222,.4)}
.ki .fi{color:#f1efe9}
.kd{background:radial-gradient(circle,#0a0a0a 0 28%,#f1efe9 32%);box-shadow:0 0 0 1px rgba(0,0,0,.6)}
.p{color:#efece4}.p b,.v b,.li b{color:#fff}
.p i,.li i{color:#b9b5ab}
.mn,.lk{color:#fff;text-decoration:underline;text-decoration-style:dotted}
.callout{background:linear-gradient(90deg,rgba(236,232,222,.12),rgba(8,8,8,.7));border:1px dashed rgba(236,232,222,.3);border-left:3px solid #f1efe9;color:#f6f3ec}
.note{border-left:2px solid rgba(236,232,222,.5);color:#aaa69d}
.li{background:rgba(22,22,22,.85);border:1px dotted rgba(236,232,222,.22)}
.li .dot{width:9px;height:9px;margin-top:5px;background:radial-gradient(circle,#0a0a0a 0 28%,#f1efe9 32%);box-shadow:0 0 0 1px rgba(0,0,0,.7)}
.li .n{background:radial-gradient(circle at 35% 28%,#fff,#bdbab3 40%,#5a5955);color:#0a0a0a;border-radius:50%}
.li.g1,.li.g2,.li.g3{background:linear-gradient(90deg,rgba(236,232,222,.2),rgba(8,8,8,.7));box-shadow:inset 0 0 0 1px rgba(236,232,222,.35)}
.code{background:rgba(0,0,0,.78);border:1px dashed rgba(236,232,222,.3);border-left:3px solid #f1efe9;color:#efece4}
code{background:rgba(236,232,222,.14);color:#fff}
.cmd{background:linear-gradient(90deg,rgba(26,26,26,.95),rgba(6,6,6,.92));border:1px dashed rgba(236,232,222,.36);color:#fff;font-family:ui-monospace,Menlo,Consolas,monospace}
.cmd .fi{color:#ece8de}
.chip{background:rgba(0,0,0,.6);border:1px solid rgba(236,232,222,.4);color:#f6f3ec}
.chip .fi{color:#ece8de}
.tr{background:rgba(255,255,255,.12)}
.fl{background:linear-gradient(90deg,#6d6b66,#f1efe9);box-shadow:0 0 10px rgba(255,255,255,.3)}
.ring{background:conic-gradient(#f1efe9 calc(var(--p)*1%),rgba(255,255,255,.13) 0)!important}
.ring::before{background:#0a0a0a}
.g .gl .fi{color:#f1efe9}
.tone{background:linear-gradient(90deg,rgba(236,232,222,.12),rgba(8,8,8,.8));border:1px solid rgba(236,232,222,.3)}
.tone::before{background:#f1efe9;box-shadow:0 0 10px rgba(255,255,255,.35)}
.tone .tic{background:radial-gradient(circle at 35% 28%,#fff,#c9c6bf 45%,#5d5c58);border-radius:50%}
.tone .tic .fi{color:#0a0a0a}
.t-ok,.t-err,.t-warn,.t-denied,.t-usage,.t-gold{--tc:#f1efe9;--tb:rgba(236,232,222,.12)}
.t-err::before,.t-denied::before{background:repeating-linear-gradient(180deg,#f1efe9 0 6px,#050505 6px 12px);box-shadow:none}
.t-warn::before{background:repeating-linear-gradient(180deg,#f1efe9 0 3px,#050505 3px 9px);box-shadow:none}
.meta{background:rgba(0,0,0,.6);border:1px dashed rgba(236,232,222,.28)}
.mi{background:rgba(24,24,24,.8)}
.foot{font-family:var(--serif);font-style:italic;color:#c2beb4;letter-spacing:.08em}
.foot::before{height:18px;margin:0 12px 8px;border-radius:9px;background:radial-gradient(ellipse 8px 4px at 50% 50%,#050505 0 88%,transparent 100%),radial-gradient(ellipse 19px 9px at 50% 50%,#f4f2ec 0 76%,#5c5b57 82%,#050505 90%,transparent 100%),linear-gradient(180deg,transparent 5px,#242424 5px 13px,transparent 13px);border:0}
.foot .fi{color:#ece8de}
.pgb{background:rgba(0,0,0,.65);border:1px solid rgba(236,232,222,.4);color:#f6f3ec}
.pgb:active{background:#f1efe9;color:#050505}
.sr{background:rgba(0,0,0,.72);border:1px solid rgba(236,232,222,.4);color:#fff}
.sr:focus{border-color:#fff;box-shadow:0 0 0 3px rgba(255,255,255,.12)}
.tabs{background:rgba(0,0,0,.75);border:1px solid rgba(236,232,222,.4);border-radius:18px}
.tab{font-family:var(--serif);letter-spacing:.04em}
.tab.on,.bigbtn,.lvp,.hl{color:#050505;background:linear-gradient(135deg,#faf8f2,#a9a69e)}
.bigbtn{font-family:var(--serif);letter-spacing:.08em;text-transform:uppercase}
.ce,.sech .e,.catrow .ce,.cathead .ce,.k3 .ce{background:radial-gradient(circle at 34% 28%,#fff 0,#d3d0c9 30%,#77756f 68%,#262626 100%);border-radius:50%;box-shadow:0 0 0 2px #050505,0 0 0 3px rgba(236,232,222,.55),0 5px 12px rgba(0,0,0,.7)}
.ce .fi,.sech .e .fi,.catrow .ce .fi,.cathead .ce .fi,.k3 .ce .fi{color:#0a0a0a;filter:none}
.hb,.cathead,.catrow{background:linear-gradient(135deg,rgba(30,30,30,.9),rgba(7,7,7,.92));border:1px dashed rgba(236,232,222,.36)}
.hot .fi{color:#f1efe9}
.rnd{border:1px dashed rgba(236,232,222,.36);background:rgba(10,10,10,.8)}
.rnd .e .fi{color:#f1efe9}
.dice{background:rgba(236,232,222,.14);color:#f6f3ec}
.catrow .bar i{background:linear-gradient(90deg,#6d6b66,#f1efe9)}
.catrow .cnt,.sech .c{background:rgba(236,232,222,.16);color:#f6f3ec;font-family:var(--serif)}
.bk{background:rgba(0,0,0,.65);border:1px solid rgba(236,232,222,.4)}
.empty .fi{color:#ece8de}
.toast{background:#0b0b0b;border:1px solid rgba(236,232,222,.5);color:#fff}
.avr{background:#f1efe9;box-shadow:0 0 18px rgba(255,255,255,.2)}
.avr::before{background:conic-gradient(from 0deg,#f1efe9,transparent 35%,#7b7973,transparent 75%,#f1efe9)}
.live{background:#f1efe9;box-shadow:0 0 8px rgba(255,255,255,.7)}
.banw{border-bottom:1px solid rgba(236,232,222,.45)}
.banw img{filter:grayscale(1) contrast(1.08)}
.k3 .tc{color:#b9b5ab}
.av{background:#141414;color:#f6f3ec}
.banw{height:100px}
.title{text-shadow:0 2px 0 #000,0 0 10px #000,0 0 18px rgba(0,0,0,.95),0 0 3px #000}
.eyebrow{text-shadow:0 0 6px #000,0 0 3px #000}
.fi[style]{color:#f1efe9!important}
.pc .bl{background:linear-gradient(180deg,#f1efe9,#8c8a85)!important}
`
  },
  // ---- TEMA UTAMA: dark elegan (midnight neon: ungu-cyan di atas hitam kebiruan) ----
  obsidian: {
    name: 'Obsidian (Midnight Neon)', emoji: '🌑', accent: ['#7c5cff', '#22d3ee'], glow: ['#7c5cff', '#22d3ee', '#312e81'], deep: '#07080f', unify: true,
    css: `
:root{--muted:#9aa4c7;--ink:#eef2ff;--line:rgba(124,92,255,.3);--g3:#312e81}
.card{background:#07080f;box-shadow:0 0 0 1px rgba(124,92,255,.5),0 0 32px rgba(80,70,255,.28),0 26px 56px rgba(0,0,0,.85)}
.card::after{box-shadow:inset 0 1px 0 rgba(160,180,255,.18),inset 0 -50px 70px rgba(49,46,129,.28)}
.veil{background:radial-gradient(120% 60% at 50% 0%,rgba(76,60,200,.38),rgba(0,0,0,0) 62%),linear-gradient(180deg,rgba(10,10,24,.5) 0%,rgba(6,7,15,.93) 42%,#04050b 100%)}
.grid{opacity:.55;background-image:linear-gradient(rgba(124,92,255,.07) 1px,transparent 1px),linear-gradient(90deg,rgba(34,211,238,.05) 1px,transparent 1px);background-size:26px 26px;-webkit-mask-image:none;mask-image:none}
.grain{opacity:.7;background-image:radial-gradient(rgba(140,160,255,.12) 1px,transparent 1.4px);background-size:15px 15px}
.o1{background:#5b3df5;opacity:.45;width:240px;height:240px}
.o2{background:#0e7490;opacity:.4;width:300px;height:200px;left:-60px;bottom:-60px}
.o3{background:#c026d3;opacity:.16;width:110px;height:110px}
.topline{height:4px;background:linear-gradient(90deg,#1e1b4b,#7c5cff,#22d3ee,#7c5cff,#1e1b4b);background-size:300% 100%;animation:slide 4s linear infinite;box-shadow:0 0 14px rgba(124,92,255,.7)}
.sp{background:#67e8f9;box-shadow:0 0 8px 2px rgba(34,211,238,.7)}
.ico{background:linear-gradient(145deg,#1e1b4b,#5b3df5 60%,#22d3ee);box-shadow:0 0 22px rgba(124,92,255,.55),0 10px 22px rgba(0,0,0,.7)}
.ico::before{border-color:rgba(160,180,255,.45);box-shadow:0 0 28px rgba(124,92,255,.7)}
.ico .fi{color:#f5f3ff}
.eyebrow{color:#8f9bd1;letter-spacing:.22em}
.title{font-weight:800;letter-spacing:.04em;color:#f5f7ff;text-shadow:0 0 14px rgba(124,92,255,.85),0 2px 0 #14123a}
.badge{background:rgba(91,61,245,.26);border:1px solid rgba(160,140,255,.5);color:#e8e6ff}
.badge::before{background:#22d3ee;box-shadow:0 0 10px #22d3ee}
.h{color:#dbe2ff;letter-spacing:.18em}
.h::before{background:linear-gradient(180deg,#22d3ee,#5b3df5);box-shadow:0 0 10px #5b3df5}
.h::after{background:linear-gradient(90deg,rgba(124,92,255,.55),transparent)}
.panel,.tile,.sec,.hero,.reel{background:linear-gradient(160deg,rgba(30,27,75,.62),rgba(9,10,22,.86));border:1px solid rgba(124,92,255,.3);box-shadow:inset 0 1px 0 rgba(170,190,255,.1),0 4px 14px rgba(0,0,0,.5)}
.tile::before{background:linear-gradient(90deg,#22d3ee,transparent)}
.row{border-bottom-color:rgba(124,92,255,.18)}
.k{color:var(--muted)}
.v{color:#f5f7ff}
.v.pos{color:#6ee7b7}.v.neg{color:#fca5a5}
.h-gold,.h-sky,.h-vio,.h-rose,.h-mint,.h-amber,.h-cyan,.h-pink,.h-slate{--h:#8b9dff;--hb:rgba(91,61,245,.3)}
.ki{background:rgba(91,61,245,.3);box-shadow:inset 0 0 0 1px rgba(160,140,255,.24)}
.ki .fi{color:#93c5fd}
.kd{background:#22d3ee;box-shadow:0 0 9px #22d3ee}
.p{color:#e6e9fb}.p b,.v b,.li b{color:#fff}
.p i,.li i{color:#b6bfe6}
.mn,.lk{color:#67e8f9}
.callout{background:linear-gradient(90deg,rgba(91,61,245,.3),rgba(10,11,26,.65));border-color:rgba(124,92,255,.35);border-left-color:#22d3ee;color:#eef0ff}
.note{border-left-color:rgba(34,211,238,.55);color:#a9b3da}
.li{background:rgba(49,46,129,.3);border:1px solid rgba(124,92,255,.2)}
.li .dot{background:#22d3ee;box-shadow:0 0 9px #22d3ee}
.li .n{background:linear-gradient(135deg,#4338ca,#1e1b4b);color:#e8e6ff}
.code{background:rgba(0,0,0,.6);border-color:rgba(124,92,255,.35);border-left-color:#22d3ee;color:#dbe4ff}
code{background:rgba(91,61,245,.3);color:#e8e6ff}
.cmd{background:linear-gradient(90deg,rgba(30,27,75,.8),rgba(8,9,20,.8));border-color:rgba(124,92,255,.38);color:#eef2ff}
.cmd .fi{color:#67e8f9}
.chip{background:rgba(67,56,202,.32);border-color:rgba(140,120,255,.4);color:#ecebff}
.chip .fi{color:#67e8f9}
.tr{background:rgba(255,255,255,.1)}
.fl{background:linear-gradient(90deg,#5b3df5,#22d3ee,#a78bfa);box-shadow:0 0 12px rgba(34,211,238,.6)}
.tone{background:linear-gradient(90deg,var(--tb),rgba(10,11,26,.72));border-color:rgba(124,92,255,.3)}
.meta{background:rgba(0,0,0,.5);border-color:rgba(124,92,255,.28)}
.mi{background:rgba(49,46,129,.26)}
.foot{color:#8791c4;letter-spacing:.1em}
.foot::before{background:linear-gradient(90deg,transparent,rgba(124,92,255,.6),transparent)}
.pgb{background:rgba(67,56,202,.36);border-color:rgba(140,120,255,.4)}
.sr{background:rgba(0,0,0,.6);border-color:rgba(124,92,255,.4)}
.tabs{background:rgba(0,0,0,.6);border-color:rgba(124,92,255,.38)}
.tab.on,.bigbtn,.lvp,.hl{color:#fff;background:linear-gradient(135deg,#5b3df5,#0891b2)}
.ce,.sech .e{background:linear-gradient(145deg,#1e1b4b,#4338ca)}
.hb,.cathead,.catrow{background:linear-gradient(135deg,rgba(49,46,129,.6),rgba(9,10,22,.82));border-color:rgba(124,92,255,.36)}
.ring::before{background:#0a0b1a}
`
  },
  // ---- tema gelap & seram (kripta berdarah) ----
  angker: {
    name: 'Angker (Kripta)', emoji: '💀', accent: ['#d10a22', '#ff5a1f'], glow: ['#d10a22', '#ff5a1f', '#4a0010'], deep: '#050102', unify: true,
    css: `
:root{--muted:#c4a29c;--ink:#fff1ee;--line:rgba(200,25,40,.32);--g3:#7a0014}
.card{background:#050102;box-shadow:0 0 0 1px rgba(190,18,34,.6),0 0 34px rgba(170,0,18,.4),0 26px 56px rgba(0,0,0,.9)}
.card::after{box-shadow:inset 0 0 0 1px rgba(255,70,70,.14),inset 0 -60px 70px rgba(130,0,12,.22)}
.veil{background:radial-gradient(120% 60% at 50% 0%,rgba(110,0,10,.5),rgba(0,0,0,0) 62%),linear-gradient(180deg,rgba(18,2,4,.5) 0%,rgba(7,1,2,.93) 42%,#030001 100%)}
.grid{opacity:.7;background-image:repeating-linear-gradient(0deg,rgba(255,255,255,.028) 0 1px,transparent 1px 3px);-webkit-mask-image:none;mask-image:none}
.grain{opacity:.8;background-image:radial-gradient(rgba(255,70,60,.1) 1px,transparent 1.4px);background-size:13px 13px}
.grain::after{content:'';position:absolute;right:52px;top:74px;width:9px;height:4px;border-radius:50%;background:#ff3030;box-shadow:0 0 9px 2px #f00,24px 0 0 0 #ff3030,24px 0 9px 2px #f00;animation:blink 6.5s infinite}
.grain::before{content:'';position:absolute;left:0;right:0;bottom:0;height:90px;background:linear-gradient(0deg,rgba(150,0,14,.38),rgba(0,0,0,0));animation:breathe 4.5s ease-in-out infinite alternate}
.o1{background:#9a0012;opacity:.6;width:240px;height:240px}
.o2{background:#40000a;opacity:.75;width:300px;height:200px;left:-60px;bottom:-60px}
.o3{background:#ff3b1f;opacity:.12;width:110px;height:110px}
.content{padding-top:30px}.topline{z-index:1;height:5px;background:linear-gradient(90deg,#2a0005,#d10a22,#ff5a1f,#d10a22,#2a0005);background-size:300% 100%;animation:slide 3.8s linear infinite;box-shadow:0 0 18px rgba(255,30,40,.85)}
.topline::after{content:'';position:absolute;left:0;right:0;top:4px;height:30px;background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='96' height='38'%3E%3Cpath fill='%23a3001a' d='M0 0h96v6c-5 0-7 3-8 8-1 10 0 17-5 17s-5-9-5-17c0-5-2-8-7-8-6 0-8 4-9 9-1 8 1 12-4 12s-4-7-4-12c0-6-3-9-8-9s-7 3-8 8c-1 6-1 8-4 8s-4-3-4-8c0-5-2-8-7-8-4 0-6 2-7 6-1 5 0 10-4 10s-4-6-4-10c0-4-1-6-5-6z'/%3E%3C/svg%3E");background-repeat:repeat-x;background-size:96px 38px;opacity:.9;filter:drop-shadow(0 2px 3px rgba(0,0,0,.7))}
.sp{background:#ff7a3a;box-shadow:0 0 9px 2px rgba(255,50,20,.9);animation:ember 4.6s ease-in infinite}
.s1{top:94%}.s2{top:98%}.s3{top:90%}.s4{top:96%}.s5{top:92%}
.ico{background:linear-gradient(145deg,#2b0007,#a30018 60%,#e0301a);box-shadow:0 0 24px rgba(255,20,40,.6),0 10px 22px rgba(0,0,0,.7)}
.ico::before{border-color:rgba(255,70,70,.5);box-shadow:0 0 30px rgba(220,0,25,.8)}
.ico .fi{color:#ffe9e4}
.eyebrow{color:#cf8f88;letter-spacing:.24em}
.title{font-family:Georgia,'Times New Roman',serif;font-weight:800;letter-spacing:.05em;text-transform:uppercase;color:#fff3ef;text-shadow:0 0 12px #ff1a2e,0 0 2px #ff1a2e,0 2px 0 #3a0006}
.badge{background:rgba(190,10,30,.28);border:1px solid rgba(255,70,80,.55);color:#ffe3de}
.badge::before{background:#ff2a3c;box-shadow:0 0 10px #ff0020}
.h{color:#ffd6d0;font-family:Georgia,serif;letter-spacing:.2em}
.h::before{background:linear-gradient(180deg,#ff2a3c,#7a0014);box-shadow:0 0 10px #d10a22}
.h::after{background:linear-gradient(90deg,rgba(255,60,70,.55),transparent)}
.panel,.tile,.sec,.hero,.reel{background:linear-gradient(160deg,rgba(78,6,12,.62),rgba(16,2,4,.82));border:1px solid rgba(200,25,40,.34);box-shadow:inset 0 1px 0 rgba(255,90,90,.12),0 4px 14px rgba(0,0,0,.45)}
.tile::before{background:linear-gradient(90deg,#ff2a3c,transparent)}
.row{border-bottom-color:rgba(200,30,40,.2)}
.k{color:var(--muted)}
.v{color:#fff6f3}
.v.pos{color:#7dffb0}.v.neg{color:#ff7a86}
.h-gold,.h-sky,.h-vio,.h-rose,.h-mint,.h-amber,.h-cyan,.h-pink,.h-slate{--h:#ff4d5e;--hb:rgba(190,10,30,.3)}
.ki{background:rgba(170,8,26,.34);box-shadow:inset 0 0 0 1px rgba(255,70,80,.22)}
.ki .fi{color:#ff6b78}
.kd{background:#ff2a3c;box-shadow:0 0 9px #ff0020}
.p{color:#f6e6e2}.p b,.v b,.li b{color:#fff}
.p i,.li i{color:#dcb9b3}
.mn,.lk{color:#ff9a8a}
.callout{background:linear-gradient(90deg,rgba(170,8,26,.34),rgba(20,2,4,.6));border-color:rgba(200,30,45,.35);border-left-color:#ff2a3c;color:#ffeae6}
.note{border-left-color:rgba(255,60,70,.55);color:#c9a7a1}
.li{background:rgba(120,6,18,.26);border:1px solid rgba(190,25,40,.18)}
.li .dot{background:#ff2a3c;box-shadow:0 0 9px #ff0020}
.li .n{background:linear-gradient(135deg,#8c0016,#2a0006);color:#ffe3de}
.code{background:rgba(0,0,0,.6);border-color:rgba(200,25,40,.35);border-left-color:#ff2a3c;color:#ffd9d3}
code{background:rgba(190,15,30,.3);color:#ffe3de}
.cmd{background:linear-gradient(90deg,rgba(60,4,10,.75),rgba(12,1,3,.75));border-color:rgba(200,25,40,.38);color:#fff1ee}
.cmd .fi{color:#ff4d5e}
.chip{background:rgba(150,8,24,.32);border-color:rgba(230,50,65,.4);color:#ffe9e5}
.chip .fi{color:#ff5a68}
.tr{background:rgba(255,255,255,.1)}
.fl{background:linear-gradient(90deg,#8c0016,#ff2a3c,#ff7a3a);box-shadow:0 0 12px rgba(255,30,40,.8)}
.tone{background:linear-gradient(90deg,var(--tb),rgba(20,2,4,.7));border-color:rgba(200,30,45,.3)}
.meta{background:rgba(0,0,0,.5);border-color:rgba(200,25,40,.28)}
.mi{background:rgba(120,6,18,.22)}
.foot{color:#b58880;letter-spacing:.1em}
.foot::before{background:linear-gradient(90deg,transparent,rgba(255,60,70,.55),transparent)}
.pgb{background:rgba(150,8,24,.38);border-color:rgba(230,50,65,.4)}
.sr{background:rgba(0,0,0,.6);border-color:rgba(200,25,40,.4)}
.tabs{background:rgba(0,0,0,.6);border-color:rgba(200,25,40,.38)}
.tab.on,.bigbtn,.lvp,.hl{color:#fff1ee;background:linear-gradient(135deg,#a3001a,#e0301a)}
.ce,.sech .e{background:linear-gradient(145deg,#3a0008,#b0001c)}
.hb,.cathead,.catrow{background:linear-gradient(135deg,rgba(100,6,14,.6),rgba(14,2,4,.8));border-color:rgba(200,25,40,.36)}
.ring::before{background:#12030a}
@keyframes ember{0%{opacity:0;transform:translate(0,6px) scale(.5)}18%{opacity:.95}100%{opacity:0;transform:translate(10px,-130px) scale(.15)}}
@keyframes blink{0%,44%,48%,100%{opacity:1}46%{opacity:0}70%{opacity:.25}72%{opacity:1}}
@keyframes breathe{from{opacity:.55}to{opacity:1}}
`
  },
  // ---- tema gelap bergaya neraka ----
  neraka: {
    name: 'Neraka (Hellfire)', emoji: '🔥', accent: ['#ff2a12', '#ff9100'], glow: ['#ff2a12', '#ff9100', '#7a0010'], deep: '#080102', unify: true,
    css: ':root{--muted:#c9a39b}.card{box-shadow:0 0 0 1px rgba(255,60,25,.38),0 0 36px rgba(255,35,10,.3),0 26px 56px rgba(0,0,0,.75)}.card::after{box-shadow:inset 0 1px 0 rgba(255,140,90,.28),inset 0 -40px 60px rgba(255,40,10,.1),inset 0 0 50px rgba(120,0,0,.2)}.veil{background:linear-gradient(180deg,rgba(34,3,3,.5) 0%,rgba(16,1,2,.86) 38%,rgba(6,0,1,.98) 100%)}.grid{background-image:repeating-linear-gradient(115deg,rgba(255,70,25,.06) 0 1px,transparent 1px 23px),repeating-linear-gradient(25deg,rgba(255,70,25,.035) 0 1px,transparent 1px 37px)}.grain{background-image:radial-gradient(rgba(255,120,40,.1) 1px,transparent 1.3px)}.o1{background:#ff2a12;opacity:.5}.o2{width:320px;height:180px;left:-50px;bottom:-96px;background:radial-gradient(ellipse at 50% 100%,#ff6a00,#ff2a12 55%,transparent 72%);opacity:.62;animation:flare 3.4s ease-in-out infinite alternate}.o3{background:#7a0010;opacity:.3}.topline{height:4px;background:linear-gradient(90deg,#3b0006,#ff2a12,#ffb000,#ff2a12,#3b0006);background-size:300% 100%;animation:slide 3.6s linear infinite;box-shadow:0 0 16px rgba(255,60,20,.8)}.sp{background:#ffb066;box-shadow:0 0 9px 2px rgba(255,90,20,.85);animation:ember 4.4s ease-in infinite}.s1{top:92%}.s2{top:96%}.s3{top:88%}.s4{top:94%}.s5{top:90%}.ico{background:linear-gradient(135deg,#6b0010,#ff2a12 55%,#ff9100);box-shadow:0 0 24px rgba(255,40,10,.6),0 10px 22px rgba(0,0,0,.55)}.ico::before{border-color:rgba(255,100,50,.45);box-shadow:0 0 30px rgba(255,40,10,.7)}.title{background:linear-gradient(90deg,#fff 20%,#ffb9a0);-webkit-background-clip:text;background-clip:text;filter:drop-shadow(0 0 9px rgba(255,45,10,.6))}.eyebrow{letter-spacing:.22em;color:#d9958a}.badge{background:rgba(255,40,10,.16);border-color:rgba(255,90,50,.45);color:#ffd9cc}.foot{color:#b57a70}@keyframes ember{0%{opacity:0;transform:translate(0,8px) scale(.5)}18%{opacity:.95}100%{opacity:0;transform:translate(10px,-120px) scale(.15)}}@keyframes flare{from{transform:translate(0,0) scale(1);opacity:.5}to{transform:translate(8px,-10px) scale(1.12);opacity:.72}}'
  },
  iblis: {
    name: 'Iblis (Demon Sigil)', emoji: '😈', accent: ['#ff1f5a', '#b44cff'], glow: ['#ff1f5a', '#b44cff', '#3a0057'], deep: '#060109', unify: true,
    css: ':root{--muted:#b7a3c9}.card{box-shadow:0 0 0 1px rgba(200,40,110,.4),0 0 38px rgba(150,40,255,.26),0 26px 56px rgba(0,0,0,.78)}.card::after{box-shadow:inset 0 1px 0 rgba(255,120,190,.26),inset 0 0 60px rgba(90,0,120,.22)}.veil{background:linear-gradient(180deg,rgba(22,3,30,.55) 0%,rgba(11,2,18,.88) 38%,rgba(4,0,8,.985) 100%)}.grid{background-image:linear-gradient(rgba(255,40,110,.05) 1px,transparent 1px),linear-gradient(90deg,rgba(150,60,255,.05) 1px,transparent 1px);background-size:30px 30px}.grain{background-image:radial-gradient(rgba(220,120,255,.09) 1px,transparent 1.3px)}.grain::after{content:\'\';position:absolute;width:250px;height:250px;right:-80px;top:56px;border-radius:50%;border:1.5px dashed rgba(255,40,110,.34);box-shadow:inset 0 0 0 16px transparent,inset 0 0 0 17px rgba(170,70,255,.24),0 0 34px rgba(255,31,90,.16);animation:spin 46s linear infinite}.grain::before{content:\'\';position:absolute;width:150px;height:150px;left:-50px;bottom:40px;border-radius:50%;border:1.5px dotted rgba(170,70,255,.3);animation:spin 30s linear infinite reverse}.o1{background:#ff1f5a;opacity:.46}.o2{background:#7a1cff;opacity:.42}.o3{background:#2a0044;opacity:.45}.topline{height:4px;background:linear-gradient(90deg,#1d0030,#ff1f5a,#b44cff,#ff1f5a,#1d0030);background-size:300% 100%;animation:slide 4.5s linear infinite;box-shadow:0 0 16px rgba(255,31,90,.7)}.sp{background:#e9a6ff;box-shadow:0 0 9px 2px rgba(190,80,255,.85)}.ico{background:linear-gradient(135deg,#3a0057,#ff1f5a);box-shadow:0 0 24px rgba(255,31,90,.55),0 10px 22px rgba(0,0,0,.55)}.ico::before{border-color:rgba(220,110,255,.4);box-shadow:0 0 30px rgba(170,70,255,.7)}.title{background:linear-gradient(90deg,#fff 20%,#f0b4ff);-webkit-background-clip:text;background-clip:text;filter:drop-shadow(0 0 9px rgba(200,60,255,.55))}.eyebrow{letter-spacing:.22em;color:#c293dd}.badge{background:rgba(200,40,120,.18);border-color:rgba(220,90,170,.45);color:#ffd9f0}.foot{color:#9c78b3}'
  }
}

const ALIAS = {
  aurora: 'aurora', ungu: 'aurora',
  sunset: 'sunset', senja: 'sunset', oranye: 'sunset', orange: 'sunset',
  ocean: 'ocean', laut: 'ocean', biru: 'ocean',
  emerald: 'emerald', hijau: 'emerald', green: 'emerald',
  sakura: 'sakura', pink: 'sakura', bunga: 'sakura',
  gold: 'gold', emas: 'gold', royal: 'gold', kuning: 'gold',
  ruby: 'ruby', merah: 'ruby', red: 'ruby',
  mono: 'mono', abu: 'mono',
  tinta: 'tinta', tinta2: 'tinta', ink: 'tinta', komik: 'tinta', comic: 'tinta', donghua: 'tinta', putih: 'tinta', white: 'tinta', lukisan: 'tinta', manga: 'tinta', sumi: 'tinta',
  koboy: 'koboy', noir: 'koboy', cowboy: 'koboy', western: 'koboy', outlaw: 'koboy', koboi: 'koboy', bw: 'koboy', hitamputih: 'koboy', monokrom: 'koboy', topi: 'koboy', koboynoir: 'koboy',
  obsidian: 'obsidian', midnight: 'obsidian', malam: 'obsidian', night: 'obsidian', neon: 'obsidian', gelap: 'obsidian', dark: 'obsidian', hitam: 'koboy', default: 'tinta',
  angker: 'angker', serem: 'angker', darkness: 'angker', horror: 'angker', kripta: 'angker', crypt: 'angker', necro: 'angker', hantu: 'angker',
  neraka: 'neraka', hell: 'neraka', hellfire: 'neraka', inferno: 'neraka', api: 'neraka', jahanam: 'neraka',
  iblis: 'iblis', setan: 'iblis', demon: 'iblis', devil: 'iblis', lucifer: 'iblis', sigil: 'iblis'
}
const normRich = (v) => ALIAS[String(v || '').trim().toLowerCase()] || ''

const richId = () => normRich(store.data.rich) || normRich(global.uiTheme) || 'tinta'
const rich = () => RICH[richId()]
// tema neraka/iblis selalu satu warna (warna per kategori akan merusak suasananya); tema lain mengikuti .tema warna
const unify = () => (rich().unify === true ? true : typeof store.data.unify === 'boolean' ? store.data.unify : global.uiUnify === true)

function setRich(v) {
  const id = normRich(v)
  if (!id) return null
  store.data.rich = id
  store.flush()
  return id
}
function setUnify(v) {
  store.data.unify = !!v
  store.flush()
  return !!v
}

module.exports = { RICH, richId, rich, unify, setRich, setUnify, normRich }
