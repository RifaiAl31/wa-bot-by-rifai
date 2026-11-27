import { runGame } from '../../lib/engine/plugins.js'

const handler = (m, ctx) => runGame('tebakprofesi', m, ctx)

handler.tags = ['tebak']
handler.command = ['tebakprofesi']
export default handler
