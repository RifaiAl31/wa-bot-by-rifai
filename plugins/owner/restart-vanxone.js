// owner/restart — satu file: metadata + kode fitur (gabungan dari engine3/plugins/owner/restart.js)
const __vx = require("../../lib/adapter/e3.js")
const __meta = {
  "name": "restart",
  "command": [
    "reset",
    "reboot",
    "restartbot"
  ],
  "category": "owner",
  "desc": "Restart bot process (real restart)",
  "usage": ".restart",
  "owner": true,
  "group": false,
  "private": false,
  "premium": false,
  "admin": false,
  "botAdmin": false,
  "cooldown": 30,
  "energi": 0,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
}
const __vdir = require('path').join(__dirname, "../../lib/ext/plugins/owner").split('\\').join('/')
module.exports = __vx.plugin("owner/restart", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + '/restart.js'
  const __vxDef = (m) => (m && m.__esModule ? m.default : m);
  const __vxExports = {};
  const { spawn } = require("child_process");
  const path = __vxDef(require("path"));
  const te = __vxDef(require("../../lib/ext/src/lib/vanxone-error.js"));
  const pluginConfig = {
      name: 'restart',
      alias: ['reset', 'reboot', 'restartbot'],
      category: 'owner',
      description: 'Restart bot process (real restart)',
      usage: '.restart',
      example: '.restart',
      isOwner: true,
      isPremium: false,
      isGroup: false,
      isPrivate: false,
      cooldown: 30,
      energi: 0,
      isEnabled: true
  }
  
  async function handler(m, { sock }) {
      try {
          await m.react('🔄')
          
          const startTime = Date.now()
          
          await sock.sendMessage(m.chat, {
              text: `🔄 *ʀᴇsᴛᴀʀᴛɪɴɢ ʙᴏᴛ...*\n\n` +
                    `╭┈┈⬡「 📊 *ɪɴꜰᴏ* 」\n` +
                    `┃ ⏰ Time: ${new Date().toLocaleTimeString('id-ID')}\n` +
                    `┃ 🔧 Method: Process Spawn\n` +
                    `┃ 📦 PID: ${process.pid}\n` +
                    `╰┈┈⬡\n\n` +
                    `> Bot akan restart dalam 2 detik...\n` +
                    `> Proses mungkin memakan waktu 10-30 detik`
          }, { quoted: m })
          
          console.log('[Restart] Command triggered by:', m.sender)
          console.log('[Restart] Initiating graceful restart...')
          
          setTimeout(() => {
              const cwd = process.cwd()
              const isWindows = process.platform === 'win32'
              
              let command, args
              
              if (isWindows) {
                  command = 'cmd.exe'
                  args = ['/c', 'start', '/b', 'node', 'index.js']
              } else {
                  command = 'node'
                  args = ['index.js']
              }
              
              const child = spawn(command, args, {
                  cwd: cwd,
                  detached: true,
                  stdio: 'ignore',
                  shell: isWindows,
                  env: { ...process.env, RESTARTED: 'true', RESTART_TIME: startTime.toString() }
              })
              
              child.unref()
              
              console.log('[Restart] New process spawned, exiting current process...')
              
              setTimeout(() => {
                  process.exit(0)
              }, 500)
              
          }, 2000)
          
      } catch (error) {
          await m.react('☢')
          await m.reply(te(m.prefix, m.command, m.pushName))
      }
  }
  
  
  Object.defineProperty(__vxExports, "config", { enumerable: true, get: () => pluginConfig });
  Object.defineProperty(__vxExports, "handler", { enumerable: true, get: () => handler });
  return __vxExports
})
