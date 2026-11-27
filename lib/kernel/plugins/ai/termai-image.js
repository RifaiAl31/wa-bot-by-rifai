// AI gambar via Termai: bingimg, dalle3, animediff (teks -> gambar)
//                       bingedit, imageedit/edit, finding + preset edit, clay, tozombie (gambar -> ...)
import { tJson, tImage, imageEdit, minimizeImage, webpToPng, uploadCdn, statusMsg } from '../../lib/services/termai.js'
import { pickMedia, reactTo } from '../../lib/core/file.js'

const mk = (prompt, ...keys) => keys.map(k => [k, prompt])
const EDITS = Object.fromEntries([
  ...mk('change skin color to black', 'hitamkan', 'irengkan', 'irengin'),
  ...mk('change skin color to white', 'putihkan', 'putihin'),
  ...mk('change skin color to red', 'merahkan', 'merahin'),
  ...mk('change skin color to orange', 'orenkan', 'orenin'),
  ...mk('change skin color to yellow', 'kuningkan', 'kuningin'),
  ...mk('change skin color to green', 'hijaukan', 'hijauin'),
  ...mk('change skin color to blue', 'birukan', 'biruin', 'jadibiru'),
  ...mk('change skin color to purple', 'ungukan', 'unguin'),
  ...mk('change skin color to dark', 'gelapkan', 'gelapin'),
  ...mk('change skin color to metallic silver, reflective silver body paint texture, street performer style, highly detailed metallic sheen', 'silverkan', 'silverin', 'manusiasilver'),
  ...mk('change skin color to shiny metallic gold, reflective gold paint, statuesque appearance, luxury gold texture', 'emaskan', 'goldkan', 'manusiaemas'),
  ...mk('edit the image into Iron Man suit, helmet open showing the original face, keep the face highly accurate and similar to the input photo, cinematic lighting, detailed metallic armor, glowing arc reactor on the chest, realistic Marvel movie style', 'ironman'),
  ...mk("convert into Avatar Na'vi character, glowing neon blue skin with faint stripes, bioluminescent dots on face, yellow eyes, braided hair, Pandora jungle background", 'avatar', 'navikan'),
  ...mk('convert into Hulk style, giant muscular build, green skin, angry expression, ripped clothes, realistic cinematic look', 'hulk', 'hulkkan', 'jadihulk'),
  ...mk('convert into a realistic zombie, pale decaying skin, cinematic horror lighting, dramatic shadows, post-apocalyptic background, detailed and spooky', 'zombiefy', 'jadi-zombie'),
  ...mk('convert into cyberpunk cyborg style, mechanical parts integrated into skin, glowing neon LED lines on face and body, futuristic high-tech clothing, synthwave city background', 'cyberpunk', 'cyborg', 'robotkan'),
  ...mk('convert the image into cute chibi anime style, small body proportions, oversized head, large sparkling eyes, colorful soft shading, kawaii expression, pastel color palette, clean line art', 'chibi'),
  ...mk('convert the image into Studio Ghibli style animation, soft hand-drawn colors, warm lighting, dreamy atmosphere, high detail background painting, expressive character design', 'ghibli'),
  ...mk('illustration of a 1/7 scale figure, highly detailed and realistic style, placed on a computer desk. the figure is mounted on a circular transparent acrylic base (no text or logos). on the computer screen, show the 3D modeling process of the same figure. next to the monitor, place a Tamiya-style toy packaging box with the original artwork printed on it. scene should look natural, clean, and photorealistic.', 'tofigur', 'jadifigur'),
  ...mk('change background to a tropical beach with white sand, turquoise ocean water, palm trees, sunny sky, photorealistic high detail', 'pantai', 'dipantai', 'jadipantai', 'backgroundpantai')
])

const TEXT2IMG = ['bingimg', 'bingcreate', 'dalle3', 'animediff']
const NEEDS_IMG = ['bingedit', 'bimg2img', 'img2bing', 'imageedit', 'edit', 'finding', 'clay', 'clayfilters', 'clayfilter', 'toclay', 'tozombie', ...Object.keys(EDITS)]

// ambil gambar (kirim langsung / reply), stiker statis dikonversi ke png
async function getImage(m) {
  const media = pickMedia(m)
  if (!media) return null
  const isSticker = /webp/.test(media.mime) || media.mtype === 'stickerMessage'
  if (!isSticker && !/image/.test(media.mime)) return null
  let buf = await media.download()
  if (isSticker) buf = await webpToPng(buf)
  return buf
}

let handler = async (m, { sock, text, prefix, command, reply }) => {
  const cmd = String(command).toLowerCase()
  const p = prefix || '.'
  const q = String(text || '').trim()
  const send = (image, caption) => sock.sendMessage(m.chat, { image, ...(caption ? { caption } : {}) }, { quoted: m })

  try {
    // ───── teks -> gambar ─────
    if (TEXT2IMG.includes(cmd)) {
      if (!q) return reply(`Mau gambar apa?\n\n*Contoh:*\n${p}${cmd} kucing astronot di bulan`)
      await reactTo(sock, m, '⏳')
      if (cmd === 'bingimg' || cmd === 'bingcreate') {
        const r = await tJson('/api/text2img/bing', { params: { prompt: q } })
        if (!r?.status || !r.data?.length) throw new Error(r?.msg || 'Gagal membuat gambar.')
        for (const url of r.data) await send({ url })
      } else if (cmd === 'dalle3') {
        await send(await tImage('/api/text2img/dalle3', { params: { prompt: q } }), `🖌️ Dalle 3\nPrompt: ${q}`)
      } else {
        const [prompt, extra] = q.split('|').map(s => s.trim())
        await send(await tImage('/api/text2img/animediff', { params: extra ? { prompt: [prompt, extra] } : { prompt } }), `Prompt: ${q}`)
      }
      return reactTo(sock, m, '✅')
    }

    // ───── gambar -> gambar/teks ─────
    if (NEEDS_IMG.includes(cmd)) {
      let prompt = EDITS[cmd] || q
      if (cmd === 'finding') {
        if (!q) return reply(`Sertakan nama orangnya.\n\n*Contoh:* kirim gambar dengan caption ${p}finding Budi`)
        prompt = `create a Pixar-style movie poster inspired by Finding Nemo, underwater ocean background, colorful corals and fishes, cinematic lighting, text on the poster should say "Finding ${q}" in bold Pixar-style font`
      }
      const needsPrompt = ['bingedit', 'bimg2img', 'img2bing', 'imageedit', 'edit'].includes(cmd)
      if (needsPrompt && !q) return reply(`Tulis prompt-nya (bahasa Inggris lebih bagus).\n\n*Contoh:* kirim/reply gambar dengan caption ${p}${cmd} make it look like a watercolor painting`)

      const raw = await getImage(m)
      if (!raw) return reply(`Kirim gambar atau reply gambar dengan caption ${p}${cmd}${needsPrompt ? ' <prompt>' : ''}`)
      await reactTo(sock, m, '⏳')

      if (['clay', 'clayfilters', 'clayfilter', 'toclay'].includes(cmd)) {
        const url = await uploadCdn(raw)
        await send(await tImage('/api/img2img/clay-filters', { params: { url } }))
      } else if (cmd === 'tozombie') {
        const url = await uploadCdn(await minimizeImage(raw))
        await send(await tImage('/api/img2img/to-zombie', { params: { url } }))
      } else if (['bingedit', 'bimg2img', 'img2bing'].includes(cmd)) {
        const r = await tJson('/api/img2img/bing', { data: { prompt: q, image: await minimizeImage(raw) } })
        if (!r?.status || !r.data?.length) throw new Error(r?.msg || 'Gagal mengedit gambar.')
        for (const url of r.data) await send({ url })
      } else {
        await send(await imageEdit(await minimizeImage(raw), prompt))
      }
      return reactTo(sock, m, '✅')
    }
  } catch (e) {
    console.error('[TERMAI-IMAGE]', e)
    await reactTo(sock, m, '❌')
    return reply(`❌ Gagal: ${e?.message || e}`)
  }
}

handler.command = [...TEXT2IMG, ...NEEDS_IMG]
handler.help = ['bingimg <prompt>', 'dalle3 <prompt>', 'animediff <prompt>', 'bingedit <prompt>', 'edit <prompt>', 'clay', 'tozombie', 'finding <nama>', 'chibi', 'ghibli', 'hulk', 'ironman', 'tofigur', 'pantai']
handler.tags = ['ai']
handler.limit = true

export default handler
