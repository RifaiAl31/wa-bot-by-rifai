// game/tebakff — satu file: metadata + kode fitur (gabungan dari engine7/plugins/game/tebakff.js)
const __vx = require("../../lib/adapter/e7.js")
const __meta = {
  "name": "tebakff",
  "command": [
    "tebakff",
    "whoff"
  ],
  "category": "game",
  "desc": "Imported from WhatsApp Bot V4.6",
  "usage": "",
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
const __vdir = require('path').join(__dirname, "../../lib/ext/plugins/game").split('\\').join('/')
module.exports = __vx.plugin("game/tebakff", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + '/tebakff.js'
  const __vxDef = (m) => (m && m.__esModule ? m.default : m);
  const __vxExports = {};
  const FEATURE_CREDIT = "Fitur by: Owner Bot";
  
  
  const axios = __vxDef(require("axios"));
  
  let timeout = 60000
  let poin = 4999
  
  const pluginConfig = {
    name: "tebakff",
    alias: ["whoff"],
    category: "game",
    description: "Imported from WhatsApp Bot V4.6",
    usage: "",
    example: "",
    isOwner: false,
    isPremium: false,
    isGroup: false,
    isPrivate: false,
    cooldown: 3,
    energi: 0,
    isEnabled: true,
  };
  
  async function handler(m, { sock, prefix, command }) {
      const conn = sock;
      const usedPrefix = prefix || m.prefix || ".";
    conn.game = conn.game || {}
    const id = "tebakff-" + m.chat
  
    if (command === "tebakff") {
      if (id in conn.game)
        return m.reply("Masih ada soal yang belum terjawab!")
  
      let data
      try {
        const res = await axios.get("https://api.deline.web.id/game/tebakff")
        if (!res.data?.result) throw new Error()
        data = res.data.result
      } catch {
        return m.reply("Gagal mengambil data FF, coba lagi.")
      }
  
      const answer = data.jawaban.toLowerCase()
      const clue = data.deskripsi || "Tidak ada deskripsi."
  
      const caption = `
  🔥 *TEBAK KARAKTER FREE FIRE*
  
  Lihat gambar berikut dan tebak namanya!
  
  Timeout: *${timeout / 1000} detik*
  Clue: ${clue}
  Ketik *${usedPrefix}whoff* untuk bantuan
  Bonus: ${poin} XP
  `.trim()
  
      let msg = await conn.sendFile(m.chat, data.img, "ff.jpg", caption, m)
  
      conn.game[id] = [
        msg,
        { answer },
        poin,
        setTimeout(() => {
          if (conn.game[id]) {
            conn.reply(
              m.chat,
              `⏳ *Waktu habis!*\nJawabannya adalah: *${answer.toUpperCase()}*`,
              conn.game[id][0]
            )
            delete conn.game[id]
          }
        }, timeout)
      ]
    }
  
    if (command === "whoff") {
      if (!(id in conn.game)) return m.reply("Tidak ada game aktif.")
  
      let ans = conn.game[id][1].answer
      let hint = ans[0] + "_".repeat(Math.max(ans.length - 2, 1)) + ans.slice(-1)
  
      return m.reply(`🧩 *Hint:* ${hint}`)
    }
  }
  
  handler.all = async function (m) {
    const id = "tebakff-" + m.chat
    if (!(id in this.game)) return
  
    let text = (m.text || "").trim().toLowerCase()
    if (!text) return
  
    let ans = this.game[id][1].answer
  
    if (text === ans) {
      clearTimeout(this.game[id][3])
      this.reply(
        m.chat,
        `🎉 *Benar!* Karakter tersebut adalah *${ans.toUpperCase()}*`,
        this.game[id][0]
      )
      delete this.game[id]
    }
  }
  
  
  
  Object.defineProperty(__vxExports, "FEATURE_CREDIT", { enumerable: true, get: () => FEATURE_CREDIT });
  Object.defineProperty(__vxExports, "config", { enumerable: true, get: () => pluginConfig });
  Object.defineProperty(__vxExports, "handler", { enumerable: true, get: () => handler });
  return __vxExports
})
