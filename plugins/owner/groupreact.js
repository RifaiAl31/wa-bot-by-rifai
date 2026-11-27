// owner/groupreact — saklar reaksi otomatis pada notifikasi member masuk / keluar grup (logika reaksinya: plugins/group/groupreact.hook.js)
const COMMANDS = {
  joinreact: { property: 'joinReact', title: 'JOIN REACT', emoji: '👋 🎉 💗', description: 'reaction otomatis pada notifikasi saat member masuk grup' },
  leavereact: { property: 'leaveReact', title: 'LEAVE REACT', emoji: '😢 👋 🚶‍♂️', description: 'reaction otomatis pada notifikasi saat member keluar/dikeluarkan' }
}

module.exports = {
  name: 'groupreact',
  command: ['joinreact', 'leavereact'],
  category: 'owner',
  desc: 'Reaksi otomatis saat member masuk / keluar grup',
  usage: 'on / off / status',
  owner: true,
  run: async ({ command, args, prefix, settings, saveSettings, reply }) => {
    const cfg = COMMANDS[command]
    if (!cfg) return
    if (!settings || typeof settings !== 'object') return reply('✗ Pengaturan bot tidak ditemukan.')

    const action = String(args?.[0] || '').trim().toLowerCase()
    if (action === 'on' || action === 'off') {
      settings[cfg.property] = action === 'on'
      try { saveSettings() } catch (err) {
        console.log('[GROUP AUTO REACT] Gagal menyimpan pengaturan:', err?.message || err)
        return reply('✗ Gagal menyimpan pengaturan reaction ke database.')
      }
    } else if (action && action !== 'status') {
      return reply(`Format: ${prefix}${command} on/off\nStatus: ${settings[cfg.property] === false ? 'OFF' : 'ON'}`)
    }

    const enabled = settings[cfg.property] !== false
    return reply(
      `╭─「 ${cfg.title} 」\n` +
      `│ Status : ${enabled ? 'ON' : 'OFF'}\n` +
      `│ Emoji  : ${cfg.emoji}\n` +
      `│ Fungsi : ${cfg.description}\n` +
      `│\n` +
      `│ ${prefix}${command} on\n` +
      `│ ${prefix}${command} off\n` +
      `╰────────────────`
    )
  }
}
