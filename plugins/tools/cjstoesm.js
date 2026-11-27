// tools/cjstoesm — satu file: metadata + kode fitur (gabungan dari engine3/plugins/tools/cjstoesm.js)
const __vx = require("../../lib/adapter/e3.js")
const __meta = {
  "name": "cjstoesm",
  "command": [
    "cjstoesm",
    "cjs2esm",
    "cjsconvert"
  ],
  "category": "tools",
  "desc": "Convert CommonJS ke ESM (ES Modules)",
  "usage": ".cjstoesm <reply kode>",
  "owner": false,
  "group": false,
  "private": false,
  "premium": false,
  "admin": false,
  "botAdmin": false,
  "cooldown": 5,
  "energi": 1,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
}
const __vdir = require('path').join(__dirname, "../../lib/ext/plugins/tools").split('\\').join('/')
module.exports = __vx.plugin("tools/cjstoesm", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + '/cjstoesm.js'
  const __vxDef = (m) => (m && m.__esModule ? m.default : m);
  const __vxUrl = require('url').pathToFileURL(__filename).href;
  const __vxExports = {};
  const config = __vxDef(require("../../lib/ext/config.e3.js"));
  const te = __vxDef(require("../../lib/ext/src/lib/vanxone-error.js"));
  const { fileURLToPath } = require("url");
  const path = __vxDef(require("path"));
  
  
  
  
  const pluginConfig = {
      name: 'cjstoesm',
      alias: ['cjs2esm', 'cjsconvert'],
      category: 'tools',
      description: 'Convert CommonJS ke ESM (ES Modules)',
      usage: '.cjstoesm <reply kode>',
      example: '.cjstoesm',
      isOwner: false,
      isPremium: false,
      isGroup: false,
      isPrivate: false,
      cooldown: 5,
      energi: 1,
      isEnabled: true
  }
  
  function convertCjsToEsm(code) {
      let result = code
  
      result = result.replace(/(?:const|let|var)\s*\{\s*([^}]+)\s*\}\s*=\s*require\s*\(\s*['"]([^'"]+)['"]\s*\)\s*;?/g, (match, imports, path) => {
          const items = imports.split(',').map(i => {
              const parts = i.trim().split(/\s*:\s*/)
              if (parts.length === 2) return `${parts[0].trim()} as ${parts[1].trim()}`
              return parts[0].trim()
          })
          return `import { ${items.join(', ')} } from '${path}';`
      })
  
      result = result.replace(/(?:const|let|var)\s+(\w+)\s*=\s*require\s*\(\s*['"]([^'"]+)['"]\s*\)\.(\w+)\s*;?/g, (match, name, path, prop) => {
          if (name === prop) return `import { ${prop} } from '${path}';`
          return `import { ${prop} as ${name} } from '${path}';`
      })
  
      result = result.replace(/(?:const|let|var)\s+(\w+)\s*=\s*require\s*\(\s*['"]([^'"]+)['"]\s*\)\.default\s*;?/g, (match, name, path) => {
          return `import ${name} from '${path}';`
      })
  
      result = result.replace(/(?:const|let|var)\s+(\w+)\s*=\s*require\s*\(\s*['"]([^'"]+)['"]\s*\)\s*;?/g, (match, name, path) => {
          return `import ${name} from '${path}';`
      })
  
      result = result.replace(/^require\s*\(\s*['"]([^'"]+)['"]\s*\)\s*;?$/gm, (match, path) => {
          return `import '${path}';`
      })
  
      result = result.replace(/module\.exports\s*=\s*\{([^}]+)\}\s*;?/g, (match, exports) => {
          const items = exports.split(',').map(i => {
              const parts = i.trim().split(/\s*:\s*/)
              if (parts.length === 2) return `${parts[1].trim()} as ${parts[0].trim()}`
              return parts[0].trim()
          })
          return `export { ${items.join(', ')} };`
      })
  
      result = result.replace(/module\.exports\s*=\s*(async\s+)?(function|class)\s*(\w*)\s*(\([^)]*\))?\s*\{/g, (match, async, type, name, params) => {
          if (name) return `export default ${async || ''}${type} ${name}${params || ''} {`
          return `export default ${async || ''}${type}${params || ''} {`
      })
  
      result = result.replace(/module\.exports\s*=\s*(async\s+)?\(([^)]*)\)\s*=>/g, (match, async, params) => {
          return `export default ${async || ''}(${params}) =>`
      })
  
      result = result.replace(/module\.exports\s*=\s*([^;\n]+)\s*;?/g, (match, value) => {
          return `export default ${value};`
      })
  
      result = result.replace(/exports\.(\w+)\s*=\s*(async\s+)?function\s*(\w*)\s*(\([^)]*\))?\s*\{/g, (match, exportName, async, name, params) => {
          return `export ${async || ''}function ${exportName}${params || ''} {`
      })
  
      result = result.replace(/exports\.(\w+)\s*=\s*(async\s+)?\(([^)]*)\)\s*=>\s*\{/g, (match, exportName, async, params) => {
          return `export const ${exportName} = ${async || ''}(${params}) => {`
      })
  
      result = result.replace(/exports\.(\w+)\s*=\s*(\w+)\s*;?/g, (match, key, value) => {
          if (key === value) return `export { ${key} };`
          return `export { ${value} as ${key} };`
      })
  
      result = result.replace(/exports\.(\w+)\s*=\s*([^;\n]+)\s*;?/g, (match, key, value) => {
          if (/^(async|function|\(|class)/.test(value.trim())) return match
          return `export const ${key} = ${value};`
      })
  
      result = result.replace(/module\.exports\.(\w+)\s*=\s*(\w+)\s*;?/g, (match, key, value) => {
          if (key === value) return `export { ${key} };`
          return `export { ${value} as ${key} };`
      })
  
      result = result.replace(/Object\.assign\s*\(\s*module\.exports\s*,\s*require\s*\(\s*['"]([^'"]+)['"]\s*\)\s*\)\s*;?/g, (match, path) => {
          return `export * from '${path}';`
      })
  
      if ((result.includes('__dirname') || result.includes('__filename')) && !result.includes('fileURLToPath')) {
          const helperCode = `import { fileURLToPath } from 'url';\nimport { dirname } from 'path';\nconst __filename = fileURLToPath(import.meta.url);\nconst __dirname = dirname(__filename);\n\n`
          result = helperCode + result
      }
  
      result = result.replace(/\n{3,}/g, '\n\n')
  
      return result.trim()
  }
  
  async function handler(m, { sock }) {
      let code = m.quotedBody || m.text?.trim()
  
      if (!code) {
          return m.reply(
              `🔄 *ᴄᴊs ᴛᴏ ᴇsᴍ ᴄᴏɴᴠᴇʀᴛᴇʀ*\n\n` +
              `> Convert CommonJS ke ES Modules\n\n` +
              `> *Cara pakai:*\n` +
              `> Reply kode CJS dengan ${m.prefix}cjstoesm\n\n` +
              `> *Contoh CJS:*\n` +
              `> \`const axios = require('axios')\`\n` +
              `> \`module.exports = handler\``
          )
      }
  
      try {
          const converted = await convertCjsToEsm(code)
          await sock.sendCodeBlock(m.chat, converted, m)
      } catch (error) { globalThis.__vanxoneCatch?.(error);
          m.reply(te(m.prefix, m.command, m.pushName))
      }
  }
  
  
  Object.defineProperty(__vxExports, "config", { enumerable: true, get: () => pluginConfig });
  Object.defineProperty(__vxExports, "handler", { enumerable: true, get: () => handler });
  return __vxExports
})
