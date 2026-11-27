const sv = require('../../lib/survival')
module.exports = {
  name: 'setsurvival',
  command: ['setsurvival', 'survival-mode'],
  category: 'owner',
  desc: 'Nyalakan/matikan mode bertahan hidup (biaya energi, saldo, limit per fitur)',
  usage: '.setsurvival on|off',
  owner: true,
  run: async ({ args, prefix, reply }) => {
    const a = (args[0] || '').toLowerCase()
    if (!['on', 'off'].includes(a)) return reply(`Mode bertahan hidup sekarang: ${sv.enabled() ? 'AKTIF' : 'MATI'}\nUbah: ${prefix}setsurvival on|off`)
    sv.setEnabled(a === 'on')
    return reply(`Mode bertahan hidup ${a === 'on' ? 'diaktifkan' : 'dimatikan'}.`)
  }
}
