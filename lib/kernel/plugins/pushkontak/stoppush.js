import { jpmJobs } from '../../lib/group/sosial.js'

let handler = async (m, { reply }) => {
    const jobs = jpmJobs()
    if (!jobs.pushRunning) return reply('❌ Push kontak tidak sedang berjalan.')
    jobs.pushRunning = false
    return reply('*▢ PUSH KONTAK*\n• Status : Dihentikan')
}

handler.command = ['stoppush', 'stoppushkontak', 'stoppus']
handler.tags = ['pushkontak']
handler.owner = true

export default handler
