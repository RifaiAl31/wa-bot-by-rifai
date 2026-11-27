// owner/mediapoll — satu file: metadata + kode fitur (gabungan dari engine8/plugins/owner/mediapoll.js)
const __vx = require("../../lib/adapter/e8.js")
const __meta = {
  "name": "mediapoll",
  "command": [
    "mediapoll",
    "pollimage",
    "polinggambar"
  ],
  "category": "owner",
  "desc": "Kirim Polling Media berdasarkan struktur evals",
  "usage": ".mediapoll Judul | Opsi1 | Opsi2",
  "owner": true,
  "group": false,
  "private": false,
  "premium": false,
  "admin": false,
  "botAdmin": false,
  "cooldown": 0,
  "energi": 0,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
}
const __vdir = require('path').join(__dirname, "../../lib/ext/plugins/owner").split('\\').join('/')
module.exports = __vx.plugin("owner/mediapoll", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + '/mediapoll.js'
  const __vxDef = (m) => (m && m.__esModule ? m.default : m);
  const __vxExports = {};
  const fs = __vxDef(require("fs"));
  const path = __vxDef(require("path"));
  const axios = __vxDef(require("axios"));
  const os = __vxDef(require("os"));
  const crypto = __vxDef(require("crypto"));
  const { getDatabase } = require("../../lib/ext/src/lib/vanxone-database.e8.js");
  const messageBuilder = __vxDef(require("../../lib/MessageBuilder.js"));
  const { AIRich } = messageBuilder;
  const config = __vxDef(require("../../lib/ext/config.e8.js"));
  const util = __vxDef(require("util"));
  
  const pluginConfig = {
      name: 'mediapoll',
      alias: ['pollimage', 'polinggambar'],
      category: 'owner',
      description: 'Kirim Polling Media berdasarkan struktur evals',
      usage: '.mediapoll Judul | Opsi1 | Opsi2',
      isOwner: true,
      isPremium: false,
      isGroup: false,
      isPrivate: false,
      cooldown: 0,
      energi: 0,
      isEnabled: true
  }
  
  async function handler(m, { sock, store }) {
      if (!config.isOwner(m.sender)) {
          return m.reply('❌ *Owner Only!*')
      }
  
      const text = m.text?.replace(/^\.\w+\s*/, '')
      if (!text) {
          return m.reply(
              `⚙️ *ᴍᴇᴅɪᴀ ᴘᴏʟʟ*\n\n` +
              `> Masukkan Judul dan 2 Opsi!\n` +
              `*Contoh:*\n` +
              `> \`.mediapoll well | well | welll\``
          )
      }
  
      const args = text.split('|').map(v => v.trim())
      if (args.length < 3) {
          return m.reply('❌ Format salah! Gunakan pemisah `|`. Contoh: `.mediapoll well | well | welll`')
      }
  
      const title = args[0]
      const opt1 = args[1]
      const opt2 = args[2]
  
      const conn = sock;
  
      try {
          await m.reply('⏳ *Membuat media poll...*')
  
          const hash1 = crypto.createHash('sha256').update(opt1).digest('hex')
          const hash2 = crypto.createHash('sha256').update(opt2).digest('hex')
  
          const newParentId = await conn.relayMessage(
            m.chat,
            {
              messageContextInfo: {
                messageSecret: "JUnbqvod4DDJXEZPreu/+c6AggJEZHKUA1vqIwLqrM4="
              },
              pollCreationMessageV3: {
                name: title,
                options: [
                  {
                    optionName: opt1,
                    optionHash: hash1
                  },
                  {
                    optionName: opt2,
                    optionHash: hash2
                  }
                ],
                selectableOptionsCount: 1,
                pollContentType: 2
              }
            },
            {
              additionalNodes: [
                {
                  tag: "meta",
                  attrs: {
                    polltype: "creation",
                    contenttype: "image"
                  }
                }
              ]
            }
          );
  
          await conn.relayMessage(
            m.chat,
            {
              messageContextInfo: {
                messageSecret: "00amelVejv5ccI0ljv9l0fbGa4C/hwifrxZK3IjJC8s=",
                messageAssociation: {
                  associationType: 7,
                  parentMessageKey: {
                    remoteJid: m.chat,
                    fromMe: true,
                    id: newParentId
                  }
                }
              },
              pollCreationOptionImageMessage: {
                message: {
                  imageMessage: {
                    url: "https://mmg.whatsapp.net/o1/v/t24/f2/m232/AQO0LwA7Ku1HLXMdx3e9RJ1WXZpWPP0A87BNa2y7DzxxecWWuQdFDP6ei-WiQ8sQvwe4yCjuLjvCelbQTrEUXbcFubu7lwJjBIbJG5CqXA?ccb=9-4&oh=01_Q5Aa5QF8XVIUCbzpqblnyPV5XDG30cRf1I_DPNVmtkHYp3k3Zw&oe=6AB10AD0&_nc_sid=e6ed6c&mms3=true",
                    mimetype: "image/jpeg",
                    fileSha256: "28R5wLoMqv7846E4No4JqQiobixendw3awNq/DFgv2s=",
                    fileLength: 30810,
                    height: 512,
                    width: 512,
                    mediaKey: "ZBr4s6QyEiFNOlshCRQ3Mvlt/KpZkkOwa+Q1ToN+0hQ=",
                    fileEncSha256: "2T2k9BUcGdhMHeeZrLuDxgl5I2xgmDeyLqFfCgCmX+Y=",
                    directPath: "/o1/v/t24/f2/m232/AQO0LwA7Ku1HLXMdx3e9RJ1WXZpWPP0A87BNa2y7DzxxecWWuQdFDP6ei-WiQ8sQvwe4yCjuLjvCelbQTrEUXbcFubu7lwJjBIbJG5CqXA?ccb=9-4&oh=01_Q5Aa5QF8XVIUCbzpqblnyPV5XDG30cRf1I_DPNVmtkHYp3k3Zw&oe=6AB10AD0&_nc_sid=e6ed6c",
                    mediaKeyTimestamp: 1787396888,
                    jpegThumbnail: "/9j/2wBDABALDA4MChAODQ4SERATGCgaGBYWGDEjJR0oOjM9PDkzODdASFxOQERXRTc4UG1RV19iZ2hnPk1xeXBkeFxlZ2P/2wBDARESEhgVGC8aGi9jQjhCY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2P/wAARCAAgACADASIAAhEBAxEB/8QAGgABAAIDAQAAAAAAAAAAAAAABgMEAAEFAv/EACwQAAIBAgUDAgUFAAAAAAAAAAECAwQRAAUSITEGQWETURQigaHBFSNCkdH/xAAVAQEBAAAAAAAAAAAAAAAAAAAAAv/EABYRAQEBAAAAAAAAAAAAAAAAAAABEf/aAAwDAQACEQMRAD8Ac1ULzxhY5mhYMDqUX+mDLZrDS1s6fqFdJqY7BFITfsSeMIM29cZbP8OdLem24Fzx2wMymhepUuUDRTM0er+S+eeL/nAXIc1MraWzeuBDXVvRjG1rb779/wCvrhRl9IaWM6qmWoLAfNI1/f8A3AjN8rmo5tccYaBQpLr23tv53++GHT071GS07uQSF0gg3uBtv5wFTqXMjSwmnV2jLxk6l5Pa1+3nHD6dkzAStHGoFLywk5Uniw59sSdRZfUJXionkd0eUcj5bXJAH07H274ygkmSonc3W5A0nxe34wqpNa6ikzBv2gUamNwFTdmYDvifpCsl9RadXJRySyEcC3IPvcAW848VlQah6ZEQqyMX1A9r7m+OXRSxQZxPrYxr6tgycx78j7jCFj//2Q=="
                  }
                }
              }
            },
            {
              additionalNodes: [
                {
                  tag: "meta",
                  attrs: {
                    message_association_type: "media_poll"
                  }
                }
              ]
            }
          );
  
          await conn.relayMessage(
            m.chat,
            {
              messageContextInfo: {
                messageSecret: "cqsG6iJ5xmgcgS6a01aDWQIamR5mjQIUixKxTKlCzPk=",
                messageAssociation: {
                  associationType: 7,
                  parentMessageKey: {
                    remoteJid: m.chat,
                    fromMe: true,
                    id: newParentId
                  }
                }
              },
              pollCreationOptionImageMessage: {
                message: {
                  imageMessage: {
                    url: "https://mmg.whatsapp.net/o1/v/t24/f2/m235/AQM5OCCDt4FxgFs2lSnkACBo8E1t5DGBoBJ8qSqnnGzR68QVqNYOrnxBWpxOeoFjLSEfj0gKRSG9vf-njEsAt65_W3Z0r0q-hqZ5xqn2GA?ccb=9-4&oh=01_Q5Aa5QEoA21w-E_AUREisr16dhJP6-OlGC2A4i4XkHERI3eyGg&oe=6AB10B00&_nc_sid=e6ed6c&mms3=true",
                    mimetype: "image/jpeg",
                    fileSha256: "28R5wLoMqv7846E4No4JqQiobixendw3awNq/DFgv2s=",
                    fileLength: 30810,
                    height: 512,
                    width: 512,
                    mediaKey: "g2cMl1bEwnadLFG7QyC2Lza7dgYCucy6r5ga9S1X5Qw=",
                    fileEncSha256: "ATA/U9d5tzMVxQHF/ZilYfzYKebTVkZZ79GrVTzjGT0=",
                    directPath: "/o1/v/t24/f2/m235/AQM5OCCDt4FxgFs2lSnkACBo8E1t5DGBoBJ8qSqnnGzR68QVqNYOrnxBWpxOeoFjLSEfj0gKRSG9vf-njEsAt65_W3Z0r0q-hqZ5xqn2GA?ccb=9-4&oh=01_Q5Aa5QEoA21w-E_AUREisr16dhJP6-OlGC2A4i4XkHERI3eyGg&oe=6AB10B00&_nc_sid=e6ed6c",
                    mediaKeyTimestamp: 1787396888,
                    jpegThumbnail: "/9j/2wBDABALDA4MChAODQ4SERATGCgaGBYWGDEjJR0oOjM9PDkzODdASFxOQERXRTc4UG1RV19iZ2hnPk1xeXBkeFxlZ2P/2wBDARESEhgVGC8aGi9jQjhCY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2P/wAARCAAgACADASIAAhEBAxEB/8QAGgABAAIDAQAAAAAAAAAAAAAABgMEAAEFAv/EACwQAAIBAgUDAgUFAAAAAAAAAAECAwQRAAUSITEGQWETURQigaHBFSNCkdH/xAAVAQEBAAAAAAAAAAAAAAAAAAAAAv/EABYRAQEBAAAAAAAAAAAAAAAAAAABEf/aAAwDAQACEQMRAD8Ac1ULzxhY5mhYMDqUX+mDLZrDS1s6fqFdJqY7BFITfsSeMIM29cZbP8OdLem24Fzx2wMymhepUuUDRTM0er+S+eeL/nAXIc1MraWzeuBDXVvRjG1rb779/wCvrhRl9IaWM6qmWoLAfNI1/f8A3AjN8rmo5tccYaBQpLr23tv53++GHT071GS07uQSF0gg3uBtv5wFTqXMjSwmnV2jLxk6l5Pa1+3nHD6dkzAStHGoFLywk5Uniw59sSdRZfUJXionkd0eUcj5bXJAH07H274ygkmSonc3W5A0nxe34wqpNa6ikzBv2gUamNwFTdmYDvifpCsl9RadXJRySyEcC3IPvcAW848VlQah6ZEQqyMX1A9r7m+OXRSxQZxPrYxr6tgycx78j7jCFj//2Q=="
                  }
                }
              }
            },
            {
              additionalNodes: [
                {
                  tag: "meta",
                  attrs: {
                    message_association_type: "media_poll"
                  }
                }
              ]
            }
          );
  
      } catch (e) {
          console.error(e)
          m.reply(`❌ *Terjadi Error:*\n\`\`\`${util.format(e)}\`\`\``)
      }
  }
  
  
  Object.defineProperty(__vxExports, "config", { enumerable: true, get: () => pluginConfig });
  Object.defineProperty(__vxExports, "handler", { enumerable: true, get: () => handler });
  return __vxExports
})
