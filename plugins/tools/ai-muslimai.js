// ai/ai-muslimai — satu file: metadata + kode fitur (gabungan dari engine2/plugins/ai/ai-muslimai.js)
const __vx = require("../../lib/adapter/e2.js")
const __meta = {
  "command": [
    "muslim-ai"
  ],
  "category": "tools",
  "owner": false,
  "group": false,
  "admin": false,
  "botAdmin": false,
  "desc": "Fitur muslim-ai (dari Bot package)"
}
const __vdir = require('path').join(__dirname, "../../lib/ext/plugins/ai").split('\\').join('/')
module.exports = __vx.plugin("ai/ai-muslimai", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + '/ai-muslimai.js'
  const __vxExports = {};
  let oota = async (m, {
      conn,
      text
  }) => {
      try {
          const res = await fetch(`https://api.ootaizumi.web.id/ai/muslim-ai?text=${text ? text : "assalamualaikum"}`);
  
          const response = await res.json();
          if (!response?.message) return m.reply("❌ Gomene gada response message!");
  
          m.reply(response?.message);
      } catch (e) {
          m.reply("❌ Gomene Error Mungkin lu kebanyakan request!");
      }
  }
  
  oota.help = oota.command = ["muslim-ai"]
  oota.tags = ["ai"];
  
  const __vxDefault = oota
  Object.defineProperty(__vxExports, "default", { enumerable: true, get: () => __vxDefault });
  return __vxExports
})
