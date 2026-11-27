import { runGame } from '../../lib/engine/plugins.js'

const handler = (m, ctx) => runGame('tebakmakanan', m, ctx)

handler.tags = ['tebak']
handler.command = ['tebakmakanan']
export default handler
