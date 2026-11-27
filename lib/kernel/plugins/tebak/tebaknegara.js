import { runGame } from '../../lib/engine/plugins.js'

const handler = (m, ctx) => runGame('tebaknegara', m, ctx)

handler.tags = ['tebak']
handler.command = ['tebaknegara']
export default handler
