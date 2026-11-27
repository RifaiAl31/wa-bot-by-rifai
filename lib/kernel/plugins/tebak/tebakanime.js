import { runGame } from '../../lib/engine/plugins.js'

const handler = (m, ctx) => runGame('tebakanime', m, ctx)

handler.tags = ['tebak']
handler.command = ['tebakanime']
export default handler
