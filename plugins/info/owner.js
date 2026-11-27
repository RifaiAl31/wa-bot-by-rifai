module.exports = {
  name: 'owner',
  command: ['owner'],
  category: 'info',
  desc: 'Kontak owner bot',
  run: async ({ sock, msg, from, config }) => {
    const name = config.ownerName || 'Owner Bot'
    const vcard = [
      'BEGIN:VCARD',
      'VERSION:3.0',
      `FN:${name}`,
      'END:VCARD'
    ].join('\n')

    await sock.sendMessage(
      from,
      { contacts: { displayName: name, contacts: [{ vcard }] } },
      { quoted: msg }
    )
  }
}
