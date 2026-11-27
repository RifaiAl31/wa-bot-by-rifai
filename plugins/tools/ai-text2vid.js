// ai/ai-text2vid — satu file: metadata + kode fitur (gabungan dari engine2/plugins/ai/ai-text2vid.js)
const __vx = require("../../lib/adapter/e2.js")
const __meta = {
  "command": [
    "aivid",
    "img2vid",
    "txt2vid"
  ],
  "category": "tools",
  "owner": false,
  "group": false,
  "admin": false,
  "botAdmin": false,
  "desc": "Fitur aivid (dari Bot package)"
}
const __vdir = require('path').join(__dirname, "../../lib/ext/plugins/ai").split('\\').join('/')
module.exports = __vx.plugin("ai/ai-text2vid", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + '/ai-text2vid.js'
  const __vxDef = (m) => (m && m.__esModule ? m.default : m);
  const __vxNs = (m) => (m && m.__esModule ? m : (m !== null && (typeof m === 'object' || typeof m === 'function') ? Object.assign(Object.create(null), m, { default: m }) : { default: m }));
  const __vxExports = {};
  const { AIArtClient, VIDEO_ENGINES } = require("../../lib/ext/lib/aiart.js");
  const uploadImage = __vxDef(require("../../lib/ext/lib/uploadImage.js"));
  
  const client = new AIArtClient()
  
  let handler = async (m, { conn, text, usedPrefix, command }) => {
  text = text || ''
  usedPrefix = usedPrefix || m.prefix || '.'
  command = command || m.command || 'aivid'
    try {
  
      let imageUrl = ''
  
      if (m.quoted) {
  
        const mime =
          (m.quoted.msg || m.quoted).mimetype || ''
  
        if (/image/i.test(mime)) {
  
          const media = await m.quoted.download()
  
          imageUrl = await (typeof uploadImage === 'function' ? uploadImage : uploadImage.default)(media)
  
        }
  
      }
  
      if (!text && !imageUrl) {
        return m.reply(
  `🎬 *AI Video Generator*
  
  Text → Video
  
  ${usedPrefix + command} beautiful waterfall
  
  Reply Gambar
  
  ${usedPrefix + command} make it move
  
  Engine
  
  --engine=wan
  --engine=hunyuan
  --engine=ltx2
  
  Durasi
  
  --duration=5
  --duration=10
  --duration=20`
        )
      }
  
      await m.react('🎬')
  
      let engine = 'wan'
      let duration = 5
  
      const args = text.split(/\s+/)
      const prompt = []
  
      for (const arg of args) {
  
        if (arg.startsWith('--engine=')) {
          engine = arg.slice(9)
          continue
        }
  
        if (arg.startsWith('--duration=')) {
          duration = Number(arg.slice(11)) || 5
          continue
        }
  
        prompt.push(arg)
  
      }
  
      const engineInfo =
        VIDEO_ENGINES[engine] ||
        VIDEO_ENGINES.wan
  
      const msg = await conn.reply(
        m.chat,
  `🎬 *AI Video Generator*
  
  📝 ${prompt.join(' ') || '-'}
  
  ⚙️ ${engineInfo.name}
  
  ⏳ Progress : 0%`,
        m
      )
  
      let last = -1
  
      const result =
        await client.generateVideo(
          prompt.join(' '),
          {
            engine,
            duration,
            imageUrl
          },
          async (_, progress) => {
  
            if (progress === last)
              return
  
            last = progress
  
            try {
  
              await conn.sendMessage(
                m.chat,
                {
                  text:
  `🎬 AI Video
  
  ⚙️ ${engineInfo.name}
  
  📊 ${progress}%`,
                  edit: msg.key
                }
              )
  
            } catch {}
  
          }
        )
  
      const video =
        result.video_url ||
        result.url ||
        result.output ||
        result.result?.video_url ||
        result.result?.url
  
      if (!video)
        throw new Error(
          'Video tidak ditemukan.'
        )
  
      await conn.sendFile(
        m.chat,
        video,
        'ai-video.mp4',
  `✅ *Video Berhasil Dibuat*
  
  📝 Prompt :
  ${prompt.join(' ') || '-'}
  
  🎬 Engine :
  ${engineInfo.name}
  
  ⏱️ Durasi :
  ${duration} detik`,
        m,
        false,
        {
          mimetype: 'video/mp4'
        }
      )
  
      await m.react('✅')
  
    } catch (e) {
  
      console.error(e)
  
      await m.react('❌')
  
      m.reply(
  `Terjadi kesalahan.
  
  ${e.message}`
      )
  
    }
  
  }
  
  handler.help = [
    'aivid <prompt>',
    'aivid (reply image)'
  ]
  
  handler.tags = ['ai']
  
  handler.command = /^(aivid|txt2vid|img2vid)$/i
  
  handler.limit = 8
  
  const __vxDefault = handler
  Object.defineProperty(__vxExports, "default", { enumerable: true, get: () => __vxDefault });
  return __vxExports
})
