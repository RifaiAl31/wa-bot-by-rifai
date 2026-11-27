// tools/enc — satu file: metadata + kode fitur (gabungan dari engine2/plugins/tools/enc.js)
const __vx = require("../../lib/adapter/e2.js")
const __meta = {
  "command": [
    "obfuscate",
    "enc",
    "encrypt"
  ],
  "category": "tools",
  "owner": false,
  "group": false,
  "admin": false,
  "botAdmin": false,
  "desc": "Fitur encrypt (dari Bot package)"
}
const __vdir = require('path').join(__dirname, "../../lib/ext/plugins/tools").split('\\').join('/')
module.exports = __vx.plugin("tools/enc", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + '/enc.js'
  const __vxDef = (m) => (m && m.__esModule ? m.default : m);
  const __vxExports = {};
  const JavaScriptObfuscator = __vxDef(require("javascript-obfuscator"));
  
  let handler = async (m, {
      args
  }) => {
      try {
          const modes = ["low", "high"]
          const usage = "Reply Codenyanya!!!\n\n*Example:*\n.obfuscate high"
          if (!m.quoted) return m.reply(usage)
          const type = args.shift().toLowerCase()
          if (!modes.includes(type)) return m.reply(usage)
          const message = type === "high" ? await Encrypt(m.quoted.text) : await Decrypt(m.quoted.text)
          if (args.length >= 2) {
              const texts = args.slice(1).join(" ")
              const response = type === "high" ? await Encrypt(texts) : await Decrypt(texts)
              return m.reply(response)
          }
  
          return m.reply(message)
  
      } catch (e) {
          await m.reply(eror)
      }
  }
  handler.help = ['encrypt']
  handler.tags = ['tools']
  handler.command = /^(encrypt|enc)$/i
  handler.limit = true
  const __vxDefault = handler
  
  async function Encrypt(query) {
      const obfuscationResult = JavaScriptObfuscator.obfuscate(query, {
          compact: true,
          controlFlowFlattening: true,
          controlFlowFlatteningThreshold: 1,
          numbersToExpressions: true,
          simplify: true,
          stringArrayShuffle: true,
          splitStrings: true,
          stringArrayThreshold: 1,
          sourceMap: false,
          sourceMapMode: "separate",
      })
  
      return obfuscationResult.getObfuscatedCode()
  }
  
  async function Decrypt(encryptedCode) {
      const decryptedCode = JavaScriptObfuscator.obfuscate(encryptedCode, {
          compact: false,
          controlFlowFlattening: true,
      }).getObfuscatedCode()
  
      return decryptedCode
  }
  Object.defineProperty(__vxExports, "default", { enumerable: true, get: () => __vxDefault });
  return __vxExports
})
