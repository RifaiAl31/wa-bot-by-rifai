const test = require('node:test')
const assert = require('node:assert/strict')
const audio = require('../lib/public-audio')

test('accepts supported YouTube URL forms', () => {
  assert.equal(audio.validateUrl('https://www.youtube.com/watch?v=video1234567').platform, 'youtube')
  assert.equal(audio.validateUrl('https://youtu.be/video1234567').platform, 'youtube')
  assert.equal(audio.validateUrl('https://music.youtube.com/watch?v=video1234567').platform, 'youtube')
})

test('accepts TikTok video and short-link hosts', () => {
  assert.equal(audio.validateUrl('https://www.tiktok.com/@user/video/1234567890').platform, 'tiktok')
  assert.equal(audio.validateUrl('https://vt.tiktok.com/AbCdEf/').platform, 'tiktok')
  assert.equal(audio.validateUrl('https://vm.tiktok.com/AbCdEf/').platform, 'tiktok')
})

test('rejects invalid URLs, credentials, ports, and unrelated hosts', () => {
  for (const url of [
    'not a URL',
    'file:///etc/passwd',
    'https://youtube.com.example.org/watch?v=video1234567',
    'https://user:pass@youtube.com/watch?v=video1234567',
    'https://youtube.com:8443/watch?v=video1234567',
    'http://127.0.0.1/'
  ]) {
    assert.throws(() => audio.validateUrl(url), /Link tidak valid/)
  }
})

test('extracts links from command text and formats metadata safely', () => {
  assert.equal(audio.extractUrl('please .mp3 https://youtu.be/video1234567).'), 'https://youtu.be/video1234567')
  assert.deepEqual(
    audio.parseMetadata('Song title\tChannel\t125\thttps://example.com/thumb.jpg', 'youtube'),
    { title: 'Song title', creator: 'Channel', duration: 125, thumbnail: 'https://example.com/thumb.jpg' }
  )
  assert.equal(audio.safeFilename('title/with:unsafe chars'), 'title with unsafe chars.mp3')
})

test('registers the three requested downloader commands', () => {
  const youtube = require('../plugins/downloader/ytmp3')
  const tiktok = require('../plugins/downloader/ttmp3')
  assert.ok(youtube.command.includes('ytmp3'))
  assert.ok(youtube.command.includes('mp3'))
  assert.ok(tiktok.command.includes('ttmp3'))
})
