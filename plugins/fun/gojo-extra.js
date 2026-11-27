// fun/gojo-extra — satu file: metadata + kode fitur (gabungan dari engine7/plugins/fun/gojo-extra.js)
const __vx = require("../../lib/adapter/e7.js")
const __meta = {
  "name": "gojoquote",
  "command": [
    "gojoquote",
    "gojofact",
    "gojohype",
    "gojopower",
    "gojotech"
  ],
  "category": "fun",
  "desc": "Fitur tema Gojo sederhana yang tidak tersedia di WhatsApp Bot.",
  "usage": ".gquote",
  "owner": false,
  "group": false,
  "private": false,
  "premium": false,
  "cooldown": 3,
  "energi": 0,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
}
const __vdir = require('path').join(__dirname, "../../lib/ext/plugins/fun").split('\\').join('/')
module.exports = __vx.plugin("fun/gojo-extra", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + '/gojo-extra.js'
  const __vxExports = {};
  const pluginConfig = {
    name:["gquote","gfact","ghype","gpower","gtech"],
    alias:["gojoquote","gojofact","gojohype","gojopower","gojotech"],
    category:"fun",
    description:"Fitur tema Gojo sederhana yang tidak tersedia di WhatsApp Bot.",
    usage:".gquote",
    example:".gquote",
    isOwner:false,isPremium:false,isGroup:false,isPrivate:false,cooldown:3,energi:0,isEnabled:true
  };
  
  const DATA={
   gquote:[
    "Percaya diri boleh, tapi tetap belajar dari kesalahan.",
    "Kekuatan terbaik adalah kemampuan untuk tetap tenang saat keadaan kacau.",
    "Jangan menunggu sempurna untuk mulai menjadi lebih baik."
   ],
   gfact:[
    "Satoru Gojo adalah karakter dari Jujutsu Kaisen.",
    "Gojo dikenal sebagai penyihir jujutsu yang sangat kuat.",
    "Six Eyes dan Limitless adalah bagian penting dari kemampuan Gojo."
   ],
   ghype:[
    "⚡ Fokus. Tenang. Jangan panik.",
    "🔥 Saatnya naik level, bukan menyerah.",
    "🌀 Mode serius aktif. Tetap santai, tetap tajam."
   ],
   gpower:[
    "🔵 Limitless — manipulasi ruang.",
    "🟣 Hollow Purple — teknik gabungan Blue dan Red.",
    "👁️ Six Eyes — kemampuan mata khusus Gojo."
   ],
   gtech:[
    "🔵 Blue — teknik tarik berbasis Limitless.",
    "🔴 Red — teknik dorong berbasis Limitless.",
    "🟣 Purple — serangan gabungan Blue dan Red."
   ]
  };
  
  async function handler(m){
   const c=(m.command||"").toLowerCase();
   const list=DATA[c]||DATA.gquote;
   return m.reply(list[Math.floor(Math.random()*list.length)]);
  }
  
  
  Object.defineProperty(__vxExports, "config", { enumerable: true, get: () => pluginConfig });
  Object.defineProperty(__vxExports, "handler", { enumerable: true, get: () => handler });
  return __vxExports
})
