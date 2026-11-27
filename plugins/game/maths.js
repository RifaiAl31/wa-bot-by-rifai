// game/maths — satu file: metadata + kode fitur (gabungan dari engine7/plugins/game/maths.js)
const __vx = require("../../lib/adapter/e7.js")
const __meta = {
  "name": "maths",
  "command": [
    "maths"
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
module.exports = __vx.plugin("game/maths", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + '/maths.js'
  const __vxDef = (m) => (m && m.__esModule ? m.default : m);
  const __vxExports = {};
  const FEATURE_CREDIT = "Fitur by: Owner Bot";
  
  
  const axios = __vxDef(require("axios"));
  
  const modes = {
    noob: [-3, 3, -3, 3, "+-", 15000, 10],
    easy: [-10, 10, -10, 10, "*/+-", 20000, 40],
    medium: [-40, 40, -20, 20, "*/+-", 40000, 150],
    hard: [-100, 100, -70, 70, "*/+-", 60000, 350],
    extreme: [-999999, 999999, -999999, 999999, "*/", 99999, 9999],
    impossible: [-99999999999, 99999999999, -99999999999, 999999999999, "*/", 30000, 35000],
    impossible2: [-999999999999999, 999999999999999, -999, 999, "/", 30000, 50000],
    impossible3: [-999999999999999999, 999999999999999999, -999999999999999999, 999999999999999999, "*/", 100000, 100000],
    impossible4: [-999999999999999999999, 999999999999999999999, -999999999999999999999, 999999999999999999999, "*/", 500000, 500000],
    impossible5: [-999999999999999999999999, 999999999999999999999999, -999999999999999999999999, 999999999999999999999999, "*/", 1000000, 1000000]
  }
  
  const operators = {
    "+": "+",
    "-": "-",
    "*": "×",
    "/": "÷"
  }
  
  function randomInt(from, to) {
    if (from > to) [from, to] = [to, from]
    from = Math.floor(from)
    to = Math.floor(to)
    return Math.floor((to - from) * Math.random() + from)
  }
  
  function pickRandom(arr) {
    return arr[Math.floor(Math.random() * arr.length)]
  }
  
  async function generateMath(level) {
    const [a1, a2, b1, b2, ops] = modes[level]
    let a = randomInt(a1, a2)
    let b = randomInt(b1, b2)
    const op = pickRandom([...ops])
    let result
  
    if (op === "/") {
      while (b === 0) b = randomInt(b1, b2)
      result = a
      a = result * b
    } else {
      result = new Function(`return ${a} ${op.replace("/", "*")} ${b < 0 ? `(${b})` : b}`)()
    }
  
    return {
      str: `${a} ${operators[op]} ${b}`,
      answer: result
    }
  }
  
  const pluginConfig = {
    name: "maths",
    alias: [],
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
  
  async function handler(m, { sock, text }) {
      const conn = sock;
    const level = text && modes[text] ? text : pickRandom(Object.keys(modes))
  
    global.maths = global.maths || {}
    const chat = m.chat
  
    const data = await generateMath(level)
  
    await conn.reply(
      chat,
      `➗ *TEBAK MATEMATIKA*\n\nMode: *${level.toUpperCase()}*\nSoal:\n👉 *${data.str}*\n\n⏳ Waktu: *60 detik*\nKirim jawabannya langsung.`,
      m
    )
  
    global.maths[chat] = {
      answer: Number(data.answer),
      player: m.sender,
      timer: setTimeout(() => {
        conn.reply(chat, `❌ Waktu habis!\nJawaban: *${data.answer}*`)
        delete global.maths[chat]
      }, 60000)
    }
  }
  
  
  // Auto-check jawaban
  handler.all = async function (m) {
    global.maths = global.maths || {}
    const room = global.maths[m.chat]
    if (!room?.answer) return
  
    const t = (m.text || "").trim()
  
    if (!/^-?\d+$/i.test(t)) return
  
    if (Number(t) === Number(room.answer)) {
      clearTimeout(room.timer)
      this.reply(
        m.chat,
        `✅ Benar! 🎉\nJawaban: *${room.answer}*`,
        m
      )
      delete global.maths[m.chat]
    }
  }
  
  
  
  Object.defineProperty(__vxExports, "FEATURE_CREDIT", { enumerable: true, get: () => FEATURE_CREDIT });
  Object.defineProperty(__vxExports, "config", { enumerable: true, get: () => pluginConfig });
  Object.defineProperty(__vxExports, "handler", { enumerable: true, get: () => handler });
  return __vxExports
})
