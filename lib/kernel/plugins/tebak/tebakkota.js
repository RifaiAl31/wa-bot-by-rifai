import { runGame } from '../../lib/engine/plugins.js'

const handler = (m, ctx) => runGame('tebakkota', m, ctx)

handler.tags = ['tebak']
handler.command = ['tebakkota']
export default handler
