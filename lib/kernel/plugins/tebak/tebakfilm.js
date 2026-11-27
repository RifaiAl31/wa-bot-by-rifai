import { runGame } from '../../lib/engine/plugins.js'

const handler = (m, ctx) => runGame('tebakfilm', m, ctx)

handler.tags = ['tebak']
handler.command = ['tebakfilm']
export default handler
