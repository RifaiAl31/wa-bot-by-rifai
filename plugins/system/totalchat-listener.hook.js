// _system/_totalchat-listener — satu file: metadata + kode fitur (gabungan dari engine2/plugins/_system/_totalchat-listener.js)
const __vx = require("../../lib/adapter/e2.js")
const __vdir = require('path').join(__dirname, "../../lib/ext/plugins/_system").split('\\').join('/')
module.exports = __vx.module("_system/_totalchat-listener", async function () {
  const __dirname = __vdir, __filename = __vdir + '/_totalchat-listener.js'
  const __vxDef = (m) => (m && m.__esModule ? m.default : m);
  const __vxExports = {};
  const fs = __vxDef(require("fs"));
  
  
  
  const dbPath = './lib/ext/lib/chat.json'
  
  
  
  /* ================= INIT DB ================= */
  
  const ensureDB = () => {
  
      if (!fs.existsSync('./lib/ext/lib')) {
  
          fs.mkdirSync('./lib/ext/lib', { recursive: true })
  
      }
  
      if (!fs.existsSync(dbPath)) {
  
          fs.writeFileSync(dbPath, JSON.stringify({}))
  
      }
  
  }
  
  
  
  /* ================= LOAD ================= */
  
  const loadDB = () => {
  
      try {
  
          ensureDB()
  
          return JSON.parse(fs.readFileSync(dbPath))
  
      } catch {
  
          return {}
  
      }
  
  }
  
  
  
  /* ================= SAVE ================= */
  
  const saveDB = (data) => {
  
      fs.writeFileSync(dbPath, JSON.stringify(data, null, 2))
  
  }
  
  
  
  /* ================= LISTENER ================= */
  
  async function before(m) {
  
      if (!m.isGroup) return
  
      if (!m.sender) return
  
      if (m.key.fromMe) return
  
  
  
      let db = loadDB()
  
  
  
      if (!db[m.chat]) db[m.chat] = {}
  
      if (!db[m.chat][m.sender]) db[m.chat][m.sender] = 0
  
  
  
      db[m.chat][m.sender] += 1
  
  
  
      saveDB(db)
  
  }
  Object.defineProperty(__vxExports, "before", { enumerable: true, get: () => before });
  return __vxExports
})
