// .analisis-catatan — kirim satu/beberapa foto catatan rapat, lalu konfirmasi hasilnya.
'use strict'
const flow = require('../../lib/noteFlow')

module.exports = {
  name: 'analisis-catatan',
  command: ['analisis-catatan'],
  category: 'tools',
  desc: 'Baca foto catatan rapat tulisan tangan dengan AI vision dan simpan transkripnya',
  usage: '<foto> (boleh beberapa halaman)',
  run: async ({ sock, msg, from, prefix, reply }) => {
    const hasImage = !!flow.imageFrom(msg)
    if (!hasImage && msg?.key?.fromMe !== true) {
      return reply([
        'Kirim foto catatan rapat dengan caption .analisis-catatan,',
        'atau balas foto tersebut dengan .analisis-catatan.',
        '',
        `Boleh kirim beberapa foto satu per satu, lalu ketik *selesai* untuk dianalisis.`,
        `Batalkan dengan ${prefix}batal.`,
      ].join('\n'))
    }
    return flow.startAnalysis({ sock, msg, from })
  },
}
