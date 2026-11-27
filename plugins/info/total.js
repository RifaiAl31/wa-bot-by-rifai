// info/total — fitur tambahan (plugins.zip), disesuaikan untuk WhatsApp Bot
const __vx = require("../../lib/adapter/e2.js")
const __meta = {
  "command": [
    "total",
    "totaltags"
  ],
  "category": "info",
  "owner": false,
  "group": false,
  "admin": false,
  "botAdmin": false,
  "desc": "Fitur total",
  "usage": ".total"
}
const __vdir = __dirname.split('\\').join('/')
module.exports = __vx.plugin("vxnew/info/total", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + "/total.js"
  const __vxDef = (m) => (m && m.__esModule ? m.default : m);
  const __vxImp = async (m) => { const r = require(m); return r && r.__esModule ? r : Object.assign({ default: r }, r) };
  const __vxExports = {};
  let handler = async (m) => {
      const pluginsObj = (global.pg || (typeof pg !== 'undefined' ? pg : null))?.plugins || global.plugins || {};
      const fileAll = Object.keys(pluginsObj);
  
      const pluginList = [];
      for (let fold of fileAll) {
          if (pluginsObj[fold]) pluginList.push(pluginsObj[fold]);
      }
  
      const tags = new Set();
      let totalFitur = 0;
  
      for (let v of pluginList) {
          if (!v) continue;
          if (Array.isArray(v.tags)) {
              for (let t of v.tags) if (t) tags.add(t);
          }
          if (Array.isArray(v.help)) {
              totalFitur += v.help.length;
          } else if (v.help) {
              totalFitur += 1;
          }
      }
  
      m.reply(
  `╔══════════════════════════╗
  ║  📊 *TOTAL FITUR & TAGS* 📊  ║
  ╚══════════════════════════╝
  
  ┌───❖ *STATISTIK BOT* ❖───
  │
  ├─⚡ *Total Fitur Command:* ${totalFitur} fitur
  ├─🏷️ *Total Kategori Tags:* ${tags.size} kategori
  ├─📁 *Total File Plugin   :* ${fileAll.length} plugin
  │
  └─────────────────────────`
      );
  };
  
  handler.help = ["total", "totalfitur", "totaltags"];
  handler.command = /^(total|totalfitur|totaltags)$/i;
  handler.tags = ["info"];
  
  
  const __vxDefault = handler

  Object.defineProperty(__vxExports, "default", { enumerable: true, get: () => __vxDefault });
  for (const k of ['before', 'all']) { if (typeof __vxExports[k] === 'function' && typeof __vxDefault === 'function' && !__vxDefault[k]) __vxDefault[k] = __vxExports[k] }
  return __vxExports
})
