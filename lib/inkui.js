// lib/inkui.js — sistem desain tema "TINTA 墨": hitam-putih MURNI (tanpa abu-abu / gradasi pudar), dominan putih,
// gaya panel komik (garis tebal + bayangan keras + halftone) berpadu lukisan tinta abstrak donghua (gunung berkabut, bambu, enso).
// Dipakai oleh: kartu pemutar (play2 / ytlive / spotifylive / ttlive) dan tema kartu menu rich (lib/theme.js -> tinta).
'use strict'

const art = require('./inkart')

const FONT_HD = "'Arial Black','Roboto Black','sans-serif-black',Impact,'Helvetica Neue',Arial,sans-serif"
const FONT_SYS = "-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',Arial,sans-serif"
const FONT_CJK = "'Noto Serif CJK SC','Noto Serif SC','Source Han Serif SC','Songti SC','STSong','SimSun',serif"

// gambar dibuat sekali (deterministik) lalu dipakai ulang
let _art = null
const A = () => (_art = _art || {
  mount: art.mountains({ w: 346, h: 150 }),
  bamboo: art.bamboo({ w: 90, h: 220 }),
  enso: art.enso({ s: 230 }),
  under: art.underline({ w: 300, h: 12 }),
  splat: art.splatter({ w: 120, h: 80, n: 22, seed: 5 })
})

// ================================================================= KARTU PEMUTAR
function playerCss() {
  const a = A()
  return `
:root{--hd:${FONT_HD};--sys:${FONT_SYS};--cjk:${FONT_CJK}}
*{margin:0;padding:0;box-sizing:border-box;-webkit-tap-highlight-color:transparent}
html,body{background:transparent;color:#000;font-family:var(--sys);-webkit-font-smoothing:antialiased}
button,input{font-family:var(--sys);color:#000}
.wrap{padding:10px 10px 14px;display:flex;justify-content:center}
.sheet{position:relative;width:346px;max-width:100%;margin:0 auto;background:#fff;border:3px solid #000;box-shadow:6px 6px 0 #000;overflow:hidden}
.art{position:absolute;pointer-events:none;background-repeat:no-repeat}
.ht{position:absolute;right:0;top:0;width:346px;height:260px;pointer-events:none;overflow:hidden}
.ht i{position:absolute;display:block;border-radius:50%;overflow:hidden}
.ht .h3{width:520px;height:520px;right:-260px;top:-260px;background:radial-gradient(circle,#000 1.1px,transparent 1.7px) 0 0/6px 6px}
.ht .h2{width:380px;height:380px;right:-190px;top:-190px;background:#fff radial-gradient(circle,#000 1.9px,transparent 2.5px) 0 0/7px 7px}
.ht .h1{width:244px;height:244px;right:-122px;top:-122px;background:#fff radial-gradient(circle,#000 3px,transparent 3.6px) 0 0/8px 8px}
.ht .h0{width:110px;height:110px;right:-55px;top:-55px;background:#000}
.a-bam{left:-8px;top:46px;width:90px;height:220px;background-image:url("${a.bamboo}");background-size:90px 220px}
.a-spl{right:2px;top:150px;width:120px;height:80px;background-image:url("${a.splat}");background-size:120px 80px}
.in{position:relative;z-index:2;padding:14px 14px 0}
.tb{display:flex;align-items:center;justify-content:space-between;margin-bottom:10px}
.np{display:flex;align-items:center;background:#000;color:#fff;padding:6px 16px 6px 9px;font:900 10px var(--hd);letter-spacing:.16em;clip-path:polygon(0 0,100% 0,calc(100% - 9px) 100%,0 100%)}
.eq{display:flex;align-items:flex-end;height:13px;margin-right:8px}
.eq i{display:block;width:3px;height:4px;margin-right:2px;background:#fff}
.sheet.on .eq i{animation:eq .8s ease-in-out infinite alternate}
.eq i:nth-child(2){animation-delay:-.25s}.eq i:nth-child(3){animation-delay:-.5s}.eq i:nth-child(4){animation-delay:-.12s}
@keyframes eq{from{height:3px}to{height:13px}}
.tag{background:#fff;border:2.5px solid #000;box-shadow:3px 3px 0 #000;padding:3px 8px;font:900 10px var(--hd);letter-spacing:.1em}
.seal{display:flex;align-items:center;justify-content:center;width:28px;height:28px;background:#000;color:#fff;font:900 16px var(--cjk);box-shadow:inset 0 0 0 2px #fff,0 0 0 2px #000;margin-left:8px}
.deck{position:relative;height:222px;margin:0 0 10px;display:flex;align-items:center;justify-content:center}
.enso{position:absolute;left:50%;top:50%;width:230px;height:230px;margin:-115px 0 0 -115px;background:url("${a.enso}") center/230px 230px no-repeat}
.disc{position:relative;width:188px;height:188px;border-radius:50%;background:#000;box-shadow:0 0 0 3px #fff,0 0 0 6px #000;animation:spin 8s linear infinite;animation-play-state:paused}
.sheet.on .disc{animation-play-state:running}
@keyframes spin{to{transform:rotate(360deg)}}
.grv{position:absolute;left:7px;top:7px;right:7px;bottom:7px;border-radius:50%;background:repeating-radial-gradient(circle at 50% 50%,#000 0,#000 3px,#fff 3px,#fff 3.8px)}
.shn{position:absolute;left:0;top:0;right:0;bottom:0;border-radius:50%;background:conic-gradient(from 20deg,transparent 0 8deg,#000 8deg 22deg,transparent 22deg 188deg,#000 188deg 202deg,transparent 202deg 360deg)}
.lab{position:absolute;left:50%;top:50%;width:84px;height:84px;margin:-42px 0 0 -42px;border-radius:50%;overflow:hidden;background:#fff;box-shadow:0 0 0 4px #000,0 0 0 7px #fff,0 0 0 10px #000}
.lab img{display:block;width:100%;height:100%;object-fit:cover;filter:grayscale(1) contrast(1.45)}
.lab b{display:flex;align-items:center;justify-content:center;width:100%;height:100%;font:900 30px var(--cjk)}
.hole{position:absolute;left:50%;top:50%;width:13px;height:13px;margin:-6.5px 0 0 -6.5px;border-radius:50%;background:#fff;border:3px solid #000}
.arm{position:absolute;right:10px;top:-2px;width:7px;height:114px;background:#000;border-radius:4px;transform-origin:50% 9px;transform:rotate(-34deg);transition:transform .7s cubic-bezier(.3,.9,.3,1)}
.arm::before{content:'';position:absolute;top:-8px;left:-8px;width:23px;height:23px;border-radius:50%;background:#fff;border:4px solid #000}
.arm::after{content:'';position:absolute;bottom:-10px;left:-5px;width:17px;height:16px;background:#000;transform:rotate(10deg)}
.sheet.on .arm{transform:rotate(-8deg)}
.scr{position:relative;margin:2px 3px 14px;border:3px solid #000;box-shadow:5px 5px 0 #000;background:#000}
.scr video{display:block;width:100%;max-height:310px;background:#000}
.scr .cap{position:absolute;left:0;top:0;z-index:2;background:#000;color:#fff;font:900 9px var(--hd);padding:4px 8px;letter-spacing:.16em}
.meta{text-align:center;margin:0 2px 8px}
.ti{font:900 21px/1.15 var(--hd);letter-spacing:-.01em;max-height:49px;overflow:hidden;word-break:break-word}
.ul{height:9px;width:72%;margin:3px auto 4px;background:url("${a.under}") center/100% 100% no-repeat}
.ar{font:800 12px var(--sys);letter-spacing:.05em;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.bar{position:relative;height:30px;display:flex;align-items:center;cursor:pointer;touch-action:none}
.trk{position:relative;width:100%;height:13px;border:3px solid #000;background:#fff}
.fil{position:absolute;left:0;top:0;bottom:0;width:0;background:#000}
.kn{position:absolute;top:50%;left:0;width:22px;height:22px;margin:-11px 0 0 -11px;border-radius:50%;background:#fff;border:3px solid #000}
.tm{display:flex;justify-content:space-between;font:900 11px var(--sys);font-variant-numeric:tabular-nums}
.ct{position:relative;display:flex;align-items:center;justify-content:center;margin:10px 0 14px}
.bt{width:42px;height:42px;margin:0 4px;border:2.5px solid #000;background:#fff;color:#000;display:flex;align-items:center;justify-content:center;box-shadow:3px 3px 0 #000;padding:0;cursor:pointer}
.bt:active{transform:translate(3px,3px);box-shadow:0 0 0 #000}
.bt svg{width:22px;height:22px;fill:currentColor}
.bt.sm{width:36px;height:36px;box-shadow:2px 2px 0 #000}.bt.sm svg{width:18px;height:18px}
.bt.act{background:#000;color:#fff}
.pp-w{position:relative;margin:0 6px}
.pp{width:66px;height:66px;margin:0;border-radius:50%;background:#000;color:#fff;border:0;box-shadow:0 0 0 3px #fff,0 0 0 6px #000}
.pp:active{transform:scale(.94);box-shadow:0 0 0 3px #fff,0 0 0 6px #000}
.pp svg{width:30px;height:30px}
.pp .i2{display:none}.sheet.on .pp .i1{display:none}.sheet.on .pp .i2{display:block}
.tap{position:absolute;left:50%;top:-40px;width:150px;margin-left:-75px;padding:6px 0;background:#000;color:#fff;text-align:center;font:900 10px var(--hd);letter-spacing:.06em;display:none}
.tap::after{content:'';position:absolute;left:50%;bottom:-8px;margin-left:-8px;border:8px solid transparent;border-bottom:0;border-top-color:#000}
.need .tap{display:block}.need .pp{animation:pls 1.3s ease-in-out infinite}
@keyframes pls{50%{transform:scale(1.1)}}
.st{min-height:14px;margin:-6px 0 8px;text-align:center;font:800 10.5px var(--sys)}
.pn{border:3px solid #000;background:#fff;box-shadow:4px 4px 0 #000;margin:0 3px 14px}
.ph{display:flex;align-items:center;justify-content:space-between;background:#000;color:#fff;padding:5px 10px;font:900 10px var(--hd);letter-spacing:.2em}
.ph span{background:#fff;color:#000;padding:2px 7px;font-size:9px;letter-spacing:.08em}
.lw{position:relative;height:176px;overflow:hidden}
.lt{position:absolute;left:0;top:0;width:100%;transition:transform .4s cubic-bezier(.3,.8,.3,1)}
.ln{margin:3px 6px;padding:6px 6px;font:700 14.5px/1.35 var(--sys);text-align:center;color:#000;cursor:pointer;word-break:break-word}
.ln.pst{font-weight:500;font-style:italic}
.ln.on{background:#000;color:#fff;font:900 15.5px/1.35 var(--sys)}
.empty{display:flex;align-items:center;justify-content:center;height:96px;padding:0 14px;text-align:center;font:700 12px/1.6 var(--sys)}
.ri{display:flex;align-items:center;padding:7px 8px;border-bottom:2.5px solid #000;cursor:pointer}
.ri:last-child{border-bottom:0}
.ri:active,.ri.cur{background:#000;color:#fff}
.rn{flex:none;width:24px;height:24px;margin-right:8px;background:#000;color:#fff;display:flex;align-items:center;justify-content:center;font:900 12px var(--hd)}
.ri:active .rn,.ri.cur .rn{background:#fff;color:#000}
.rm{flex:none;width:46px;height:46px;margin-right:9px;border:2.5px solid #000;background:#fff;overflow:hidden}
.rm img{display:block;width:100%;height:100%;object-fit:cover;filter:grayscale(1) contrast(1.3)}
.rx{min-width:0;flex:1}
.rx b{display:block;font:800 12.5px/1.25 var(--sys);overflow:hidden;white-space:nowrap;text-overflow:ellipsis}
.rx i{display:block;margin-top:2px;font:600 10.5px var(--sys);font-style:normal;overflow:hidden;white-space:nowrap;text-overflow:ellipsis}
.rd{flex:none;margin-left:8px;border:2px solid currentColor;padding:2px 5px;font:900 10px var(--hd)}
.sr{display:flex;margin:0 3px 12px}
.sr input{flex:1;min-width:0;height:40px;border:3px solid #000;border-right:0;background:#fff;padding:0 10px;font-size:14px;outline:0;border-radius:0}
.sr button{flex:none;width:76px;height:40px;border:3px solid #000;background:#000;color:#fff;font:900 11px var(--hd);letter-spacing:.08em;cursor:pointer;border-radius:0}
.sr button:active{background:#fff;color:#000}
.acts{display:flex;margin:0 3px 14px}
.ab{flex:1;margin-right:8px;padding:10px 4px;border:2.5px solid #000;background:#fff;box-shadow:3px 3px 0 #000;font:900 10.5px var(--hd);letter-spacing:.05em;text-align:center;cursor:pointer}
.ab:last-child{margin-right:0}
.ab:active{transform:translate(3px,3px);box-shadow:0 0 0 #000}
.ab.k{background:#000;color:#fff}
.hide{display:none!important}
.nt{margin:-6px 3px 12px;text-align:center;font:700 10.5px/1.5 var(--sys)}
.ft{position:relative;height:104px;margin:0 -14px;background:url("${a.mount}") center bottom/346px 150px no-repeat}
.ft .brand{position:absolute;left:14px;top:6px;background:#fff;border:2.5px solid #000;padding:3px 9px;font:900 10px var(--hd);letter-spacing:.12em}
.ft .seal{position:absolute;right:14px;top:4px;margin:0;width:30px;height:30px;box-shadow:inset 0 0 0 2px #fff,0 0 0 2px #000}
@media (prefers-reduced-motion:reduce){*{animation:none!important}}
`
}

// ================================================================= TEMA KARTU MENU RICH (lib/theme.js -> "tinta")
// Menimpa gaya gelap bawaan lib/richui.js: kartu putih, garis hitam tebal, bayangan keras, ikon hitam, halftone & tinta.
function menuCss() {
  const a = A()
  return `
:root{--ink:#000;--muted:#000;--line:#000;--hd:${FONT_HD};--cjk:${FONT_CJK}}
html,body{color:#000}
.wrap{padding:10px 10px 14px}
.card{--a:#000!important;--b:#000!important;--ac:#000!important;--g3:#000!important;--h:#000!important;--hb:#fff!important;--tc:#000!important;--tb:#fff!important;width:346px;max-width:100%;margin:0 auto;border-radius:0!important;background:#fff!important;color:#000;border:3px solid #000;box-shadow:6px 6px 0 #000!important;animation:none}
.card::after{display:none!important}
.bg,.orb,.veil,.grid,.grain,.sp,.o1,.o2,.o3{display:none!important}
.topline{height:12px!important;background:#000!important;animation:none!important;z-index:3}
.card::before{content:'';position:absolute;right:0;top:12px;width:340px;height:340px;right:-170px;top:-158px;border-radius:50%;pointer-events:none;z-index:0;background:radial-gradient(circle,#000 2.2px,transparent 2.8px) 0 0/8px 8px}
.content{position:relative;z-index:2;padding:24px 14px 14px!important}
.head{margin-bottom:14px;gap:20px!important}
.ico{width:50px;height:50px;border-radius:0!important;background:#000!important;box-shadow:3px 3px 0 #000,0 0 0 3px #fff,0 0 0 6px #000!important;animation:none!important}
.ico::before,.ico::after{display:none!important}
.ico .fi{color:#fff!important;filter:none!important;width:26px;height:26px}
.eyebrow{color:#000!important;font:900 9px var(--hd);letter-spacing:.2em}
.eyebrow .fi{color:#000!important}
.title{font:900 21px/1.15 var(--hd)!important;color:#000!important;text-shadow:none!important;letter-spacing:-.01em}
.badge{background:#000!important;color:#fff!important;border:0!important;border-radius:0!important;padding:5px 11px!important;font:900 9.5px var(--hd);clip-path:polygon(0 0,100% 0,calc(100% - 7px) 100%,0 100%)}
.badge::before{background:#fff!important;box-shadow:none!important;border-radius:0!important}
.tone{background:#fff!important;border:3px solid #000!important;border-radius:0!important;box-shadow:4px 4px 0 #000}
.tone::before{background:#000!important;box-shadow:none!important;width:8px!important}
.tone .tic{background:#000!important;border-radius:0!important;box-shadow:none!important}
.tone .tic .fi{color:#fff!important}
.tone .tl{color:#000;font-weight:900}.tone .ts{color:#000!important}
.panel,.tile,.sec,.hero,.reel,.hb,.cathead,.catrow,.rnd,.meta,.tabs,.callout,.code,.cmd,.li,.chip,.mi{background:#fff!important;border:2.5px solid #000!important;border-radius:0!important;box-shadow:3px 3px 0 #000;color:#000}
.panel{padding:3px 12px!important;box-shadow:4px 4px 0 #000}
.hero::before,.hb::before,.cathead::before{display:none!important}
.row{border-bottom:2px solid #000!important}
.k,.ci .d,.catrow .d,.tile .tl,.hero .s,.note,.gr,.pf .sb,.empty,.foot,.pgi,.mi i,.meta .mh,.rnd .t1,.rnd .t3,.cathead .d,.k3 .tc,.sech .c{color:#000!important}
.ki,.ci .e,.sech .e,.k3 .ce,.catrow .ce,.cathead .ce,.li .n,.li.g1,.li.g2,.li.g3{background:#000!important;border-radius:0!important;box-shadow:none!important}
.ki .fi,.ci .e .fi,.sech .e .fi,.k3 .ce .fi,.catrow .ce .fi,.cathead .ce .fi,.li .n{color:#fff!important}
.kd,.li .dot{background:#000!important;box-shadow:none!important;border-radius:0!important}
.v,.p,.p b,.v b,.li b,.title,.hero .big,.pf .nm,.ci .c,.tile .tv,.tt,.cathead .n,.catrow .n,.sech .n,.rnd .t2,.gr b,.hl{color:#000!important;text-shadow:none!important}
.v.pos,.v.neg{color:#000!important;text-decoration:underline}
.mn,.lk{color:#000!important;text-decoration:underline;font-weight:900}
.p i,.li i{color:#000!important}
.h{color:#000!important;font:900 10px var(--hd)!important;letter-spacing:.18em}
.h::before{background:#000!important;box-shadow:none!important;border-radius:0!important;width:8px!important;height:14px!important}
.h::after{background:#000!important;height:2px!important}
.h .fi,.sb .fi,.gr .fi,.chip .fi,.eyebrow .fi,.chev .fi,.ci .go,.ci .go .fi,.hot .fi,.rnd .e .fi,.rnd .t2 .fi,.empty .fi,.mi .fi,.tile .tl .fi,.cmd .fi,.foot .fi,.meta .mh .fi{color:#000!important}
.tile::before{background:#000!important;height:5px!important}
.tr,.catrow .bar{background:#fff!important;border:2.5px solid #000;border-radius:0!important;height:12px!important}
.fl,.catrow .bar i{background:#000!important;box-shadow:none!important;border-radius:0!important}
.fl::after{display:none}
.callout{border-left:8px solid #000!important}
.note{border-left:4px solid #000!important}
.code,.cmd{font-weight:800}
.hl{background:#000!important;color:#fff!important;border-radius:0!important}
.avr{background:#000!important;box-shadow:none!important;border-radius:0!important;padding:3px}
.avr::before{display:none!important}
.av{border:3px solid #fff!important;background:#fff!important;color:#000!important;border-radius:0!important;filter:grayscale(1) contrast(1.3)}
.ring{background:conic-gradient(#000 calc(var(--p)*1%),#fff 0)!important;border:3px solid #000;box-shadow:none!important}
.ring::before{background:#fff!important}
.pc .bl{background:#000!important;color:#fff!important;box-shadow:none!important;border-radius:0!important}
.pc .md .fi{color:#000!important;filter:none!important}
.lvp,.tab.on,.bigbtn{background:#000!important;color:#fff!important;border-radius:0!important;box-shadow:3px 3px 0 #000!important}
.bigbtn .fi,.tab.on .fi{color:#fff!important}
.tabs{padding:5px!important;gap:5px!important}
.tab{border-radius:0!important;color:#000!important;font-weight:900}
.tab .fi{color:#000}
.tab.on .fi,.tab.on{color:#fff!important}
.pgb,.bk,.dice{background:#fff!important;color:#000!important;border:2.5px solid #000!important;border-radius:0!important;box-shadow:2px 2px 0 #000}
.pgb:active,.bk:active,.dice:active{background:#000!important;color:#fff!important}
.sr{background:#fff!important;color:#000!important;border:3px solid #000!important;border-radius:0!important}
.sr::placeholder{color:#000;font-weight:700}
.srw .fi{color:#000!important}
.chip{box-shadow:2px 2px 0 #000;font-weight:900}
.live{background:#000!important;box-shadow:none!important;border-radius:0!important}
.toast{background:#000!important;color:#fff!important;border:3px solid #fff!important;border-radius:0!important}
.ci{border-bottom:2px solid #000!important}
.foot{font-weight:800}
.foot::before{background:#000!important;height:3px!important;margin:0 0 9px!important}
.banw{border-bottom:3px solid #000}.banw img{filter:grayscale(1) contrast(1.35)}.banw::after{display:none!important}
.card::selection{background:#000;color:#fff}
@media (prefers-reduced-motion:reduce){*{animation:none!important}}
`
}

module.exports = { playerCss, menuCss, A, FONT_HD, FONT_SYS, FONT_CJK }
