// owner/clearsesi — fitur tambahan (plugins.zip), disesuaikan untuk WhatsApp Bot
const __vx = require("../../lib/adapter/e2.js")
const __meta = {
  "command": [
    "delsesi",
    "deletesesi"
  ],
  "category": "owner",
  "owner": false,
  "group": false,
  "admin": false,
  "botAdmin": false,
  "desc": "Fitur delsesi",
  "usage": ".delsesi"
}
const __vdir = __dirname.split('\\').join('/')
module.exports = __vx.plugin("vxnew/owner/clearsesi", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + "/clearsesi.js"
  const __vxDef = (m) => (m && m.__esModule ? m.default : m);
  const __vxImp = async (m) => { const r = require(m); return r && r.__esModule ? r : Object.assign({ default: r }, r) };
  const __vxExports = {};
  const fs = __vxDef(require("node:fs"));
  
  let handler = async (m, {
      conn
  }) => {
      const ootaedit = await conn.sendMessage(m.chat, {
          text: "Wait.... Sessions Mau Di Hapus!"
      }, {
          quoted: m
      });
      fs.readdir(`./sessions`, async function(err, files) {
          if (err) {
              console.log('Unable to scan directory: ' + err);
              return m.reply('Unable to scan directory: ' + err);
          }
          let filteredArray = await files.filter(item => item.startsWith("pre-key") ||
              item.startsWith("sender-key") || item.startsWith("session-") || item.startsWith("app-state")
          )
          let teks = ` *– 乂 Sessions - Akan Di Delete*\n\n`
          if (filteredArray.length == 0) return conn.sendMessage(m.chat, {
              text: `${teks}`,
              edit: ootaedit.key
          }, {
              quoted: m
          })
          filteredArray.map(function(e, i) {
              teks += (i + 1) + `. ${e}\n`
          })
          await conn.sendMessage(m.chat, {
              text: `${teks}`,
              edit: ootaedit.key
          }, {
              quoted: m
          })
          await sleep(2000)
          await conn.sendMessage(m.chat, {
              text: `🖐️Wait... Sessions Mau Di Hapus!!`,
              edit: ootaedit.key
          }, {
              quoted: m
          })
          await filteredArray.forEach(function(file) {
              fs.unlinkSync(`./sessions/${file}`)
          });
          await sleep(2000)
          await conn.sendMessage(m.chat, {
              text: `✅ Oke Sessions Udah Di Hapus!!`,
              edit: ootaedit.key
          }, {
              quoted: m
          })
      });
  };
  
  handler.command = ["delsesi", "clearsesi", "deletesesi"];
  handler.help = ["delsesi", "clearsesi", "deletesesi"];
  handler.tags = ["owner"];
  handler.owner = true;
  
  async function sleep(ms) {
      return new Promise(resolve => setTimeout(resolve, ms));
  }
  
  
  
  const __vxDefault = handler

  Object.defineProperty(__vxExports, "default", { enumerable: true, get: () => __vxDefault });
  for (const k of ['before', 'all']) { if (typeof __vxExports[k] === 'function' && typeof __vxDefault === 'function' && !__vxDefault[k]) __vxDefault[k] = __vxExports[k] }
  return __vxExports
})
