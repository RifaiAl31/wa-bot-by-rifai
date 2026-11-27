// game/game-caklontong_ans — satu file: metadata + kode fitur (gabungan dari engine2/plugins/game/game-caklontong_ans.js)
const __vx = require("../../lib/adapter/e2.js")
const __vdir = require('path').join(__dirname, "../../lib/ext/plugins/game").split('\\').join('/')
module.exports = __vx.module("game/game-caklontong_ans", async function () {
  const __dirname = __vdir, __filename = __vdir + '/game-caklontong_ans.js'
  const __vxDef = (m) => (m && m.__esModule ? m.default : m);
  const __vxExports = {};
  const similarity = __vxDef(require("similarity"));
  const threshold = 0.72
  async function before(m) {
      let id = m.chat
      if (!m.quoted || !m.quoted.fromMe  || !m.text || !/Ketik.*calo/i.test(m.quoted.text) || /.*(calo|bantuan)/i.test(m.text))
          return !0
      this.caklontong = this.caklontong ? this.caklontong : {}
      if (!(id in this.caklontong))
          return m.reply('Soal itu telah berakhir')
      if (m.quoted.id == this.caklontong[id][0].id) {
          let json = JSON.parse(JSON.stringify(this.caklontong[id][1]))
          if (m.text.toLowerCase() == json.jawaban.toLowerCase().trim()) {
              global.db.data.users[m.sender].exp += this.caklontong[id][2]
              await this.reply(m.chat, `*Benar!* +${this.caklontong[id][2]} XP\n${json.deskripsi}`, m)
              clearTimeout(this.caklontong[id][3])
              delete this.caklontong[id]
          } else if (similarity(m.text.toLowerCase(), json.jawaban.toLowerCase().trim()) >= threshold)
              m.reply(`*Dikit Lagi!*`)
          else
              m.reply(`*Salah!*`)
      }
      return !0
  }
  const exp = 0
  Object.defineProperty(__vxExports, "before", { enumerable: true, get: () => before });
  Object.defineProperty(__vxExports, "exp", { enumerable: true, get: () => exp });
  return __vxExports
})
