// owner/owner-savescrape — satu file: metadata + kode fitur (gabungan dari engine2/plugins/owner/owner-savescrape.js)
const __vx = require("../../lib/adapter/e2.js")
const __meta = {
  "command": [
    "savescrape"
  ],
  "category": "owner",
  "owner": true,
  "group": false,
  "admin": false,
  "botAdmin": false,
  "desc": "Fitur savescrape (dari Bot package)"
}
const __vdir = require('path').join(__dirname, "../../lib/ext/plugins/owner").split('\\').join('/')
module.exports = __vx.plugin("owner/owner-savescrape", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + '/owner-savescrape.js'
  const __vxDef = (m) => (m && m.__esModule ? m.default : m);
  const __vxExports = {};
  const { "promises": fs } = require("fs");
  const syntaxError = __vxDef(require("syntax-error"));
  const path = __vxDef(require("path"));
  
  const dir = './lib/scrape'
  
  let handler = async (m, { text, __dirname }) => {
  if (!text) throw 'Nama file?\nContoh:\n.savescrape y2mate'
  
  if (!m.quoted) throw 'Reply kode scrape'
  
  const code = m.quoted.text
  if (!code) throw 'Kode tidak terbaca'
  
  const filename = text.replace(/[^a-z0-9]/gi, '').toLowerCase() + '.js'
  const filepath = path.join(dir, filename)
  
  await fs.mkdir(dir, { recursive: true })
  
  const error = syntaxError(code, filename, {
  sourceType: 'module',
  allowAwaitOutsideFunction: true
  })
  
  if (error) throw error
  
  await fs.writeFile(filepath, code)
  
  m.reply(`✅ Scraper saved!
  
  📁 ${filepath}
  
  Import:
  import { ${filename.replace('.js','')} } from '../../lib/scrape/${filename}'
  `)
  }
  
  handler.help = ['savescrape']
  handler.tags = ['owner']
  handler.command = /^savescrape$/i
  handler.owner = true
  
  const __vxDefault = handler
  Object.defineProperty(__vxExports, "default", { enumerable: true, get: () => __vxDefault });
  return __vxExports
})
