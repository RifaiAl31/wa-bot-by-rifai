import { countCommands } from '../../lib/engine/plugins.js'

let handler = async (m, { reply }) => {
    const total = countCommands().toLocaleString('id-ID')
    const botName = global.namebot ? String(global.namebot) : 'BOT'

    return reply(`📊 *TOTAL COMMAND ${botName.toUpperCase()}*\n\nTotal command : *${total}*`)
}

handler.command = ['t']
handler.help = ['t']
handler.tags = ['main']

export default handler
