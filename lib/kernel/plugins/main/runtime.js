import { wrapPlugin } from '../../lib/engine/plugins.js'
import { runtime } from '../../lib/core/system.js'

const pluginConfig = {
    name: 'runtime',
    alias: ['rt'],
    category: 'main',
    description: 'Tampilkan lama bot sudah berjalan',
    usage: '.runtime',
    example: '.runtime',
    isOwner: false,
    isPremium: false,
    isGroup: false,
    isPrivate: false,
    cooldown: 3,
    energi: 0,
    isEnabled: true
}

async function handler(m, { reply }) {
    await reply(`*Runtime Bot:* ${runtime(process.uptime())}`)
}

export default wrapPlugin(pluginConfig, handler)
