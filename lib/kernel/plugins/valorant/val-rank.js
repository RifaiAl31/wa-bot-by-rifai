// Wiki Valorant: val-rank (data lokal di ./data/rank.json, edit file itu untuk menambah/mengubah data)

import { readFileSync } from 'fs'
import { wrapClassic, oneCommand } from '../../lib/engine/plugins.js'

const DATA = JSON.parse(readFileSync(new URL('./data/rank.json', import.meta.url), 'utf8'))

const _plugin = (() => {
const handler = async (m) => {
    return m.reply(`*Tier Rank Valorant*\n\n${DATA.join(' → ')}`)
}
handler.help = ['val-rank']
handler.tags = ['valorant']
handler.command = ['val-rank']
handler.register = true
handler.limit = true
return wrapClassic(handler)
})()

_plugin.tags = ['valorant']

// satu command = nama file
export default oneCommand(_plugin, 'val-rank')
