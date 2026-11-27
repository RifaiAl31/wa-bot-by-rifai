/* Kode yang berjalan DI DALAM kartu pemutar Tinta (browser WhatsApp). Dibaca & ditanam oleh lib/livecard.js.
   ES5 saja, tanpa backtick. Variabel D (data) dipasang oleh server sebelum kode ini. */
(function () {
  'use strict'
  var $ = function (i) { return document.getElementById(i) }
  var sheet = $('sheet'), M = $('m'), fil = $('fil'), kn = $('kn'), bar = $('bar'), ct = $('ct'), st = $('st')
  var curEl = $('cur'), durEl = $('dur')
  var isVideo = D.kind === 'video'
  var mode = 'el', userTap = false, tick = null, aLoop = false, aMuted = false
  // cadangan WebAudio (khusus audio)
  var actx = null, abuf = null, asrc = null, aGain = null, aOff = 0, aStart = 0, aPlaying = false, decoding = null

  function f(s) { s = Math.max(0, Math.floor(s || 0)); return Math.floor(s / 60) + ':' + ('0' + (s % 60)).slice(-2) }
  function say(m) { if (st) st.textContent = m || '' }

  // ---------- perintah ke chat: sendPrompt -> salin ke clipboard
  function act(c) {
    var sent = false
    try { if (typeof window.sendPrompt === 'function') { window.sendPrompt(c); sent = true } } catch (e) {}
    if (sent) return say('Dijalankan: ' + c)
    try {
      var x = document.createElement('textarea'); x.value = c; x.style.cssText = 'position:fixed;opacity:0'
      document.body.appendChild(x); x.select(); var ok = document.execCommand('copy'); x.remove()
      say(ok ? 'Disalin: ' + c + ' (tempel & kirim ke chat)' : 'Ketik: ' + c)
    } catch (e) { say('Ketik: ' + c) }
  }
  window.act = act

  // ---------- pemutar
  function b2ab(uri) { var b = atob(uri.slice(uri.indexOf(',') + 1)), n = b.length, u = new Uint8Array(n); for (var i = 0; i < n; i++) u[i] = b.charCodeAt(i); return u.buffer }
  function wa() {
    if (decoding) return decoding
    decoding = new Promise(function (ok, no) {
      try {
        var AC = window.AudioContext || window.webkitAudioContext
        if (!AC) return no(new Error('tanpa WebAudio'))
        actx = actx || new AC(); aGain = actx.createGain(); aGain.connect(actx.destination)
        var r = actx.decodeAudioData(b2ab(M.getAttribute('src')), function (b) { abuf = b; ok(b) }, no)
        if (r && r.then) r.then(function (b) { abuf = b; ok(b) }, no)
      } catch (e) { no(e) }
    })
    return decoding
  }
  function dur() {
    if (mode === 'wa') return abuf ? abuf.duration : (D.clip || 0)
    var d = M.duration
    return isFinite(d) && d > 0 ? d : (D.clip || D.full || 0)
  }
  function cur() { return mode === 'wa' ? (aPlaying ? Math.min(dur(), aOff + (actx.currentTime - aStart)) : aOff) : (M.currentTime || 0) }
  function isPlaying() { return mode === 'wa' ? aPlaying : !M.paused }
  function aStop() { try { if (asrc) { var s = asrc; asrc = null; s.onended = null; s.stop(0) } } catch (e) {} }
  function waStart() {
    aStop(); asrc = actx.createBufferSource(); asrc.buffer = abuf; asrc.connect(aGain); aGain.gain.value = aMuted ? 0 : 1
    var me = asrc
    asrc.onended = function () { if (me !== asrc || !aPlaying) return; if (cur() >= dur() - 0.3) { if (aLoop) { aOff = 0; waStart() } else { aPlaying = false; aOff = 0; onEnd() } } }
    asrc.start(0, aOff); aStart = actx.currentTime; aPlaying = true
  }
  function startWA() {
    mode = 'wa'; say('Memuat audio...')
    return wa().then(function () { return actx.resume() }).then(function () { waStart(); say(''); onPlay() })
  }
  function onPlay() { sheet.className = 'sheet on'; ct.className = 'ct'; if (!tick) tick = setInterval(paint, 120) }
  function onPause() { sheet.className = 'sheet' }
  function onEnd() { onPause(); aOff = 0; if (mode === 'el') { try { M.currentTime = 0 } catch (e) {} } paint(); setAct(-1); if (lt) lt.style.transform = 'translateY(0)' }
  function paint() {
    var d = dur(), t = cur(), p = d ? Math.min(100, t / d * 100) : 0
    fil.style.width = p + '%'; kn.style.left = p + '%'; curEl.textContent = f(t); if (d) durEl.textContent = f(d)
    syncLy(t)
  }
  function fail(e1, e2) {
    ct.className = 'ct need'
    say((isVideo ? 'Video' : 'Audio') + ' gagal: ' + ((e2 && e2.name) || e2 || '') + (e1 && e1.name ? ' / ' + e1.name : ''))
    var b = $('ab-dl'); if (b) b.className = 'ab k'
  }
  function play() {
    if (!M) return
    if (mode === 'wa') { startWA().catch(function (e) { fail(null, e) }); return }
    var p; try { p = M.play() } catch (e) { p = Promise.reject(e) }
    var t0 = M.currentTime
    var chk = function () { setTimeout(function () { if (mode === 'el' && !M.paused && M.currentTime - t0 < 0.15) { M.pause(); if (isVideo) fail(null, new Error('diam')); else startWA().catch(function (e) { fail(null, e) }) } }, 1500) }
    if (p && p.then) p.then(function () { onPlay(); chk() }).catch(function (e) {
      if (e && e.name === 'NotAllowedError' && !userTap) { ct.className = 'ct need'; return }
      if (isVideo) return fail(e, e)
      startWA().catch(function (e2) { fail(e, e2) })
    })
    else { onPlay(); chk() }
  }
  function pause() { if (mode === 'wa') { if (aPlaying) { aOff = cur(); aPlaying = false; aStop() } onPause() } else { M.pause(); onPause() } }
  function seek(t) {
    var d = dur(); t = Math.max(0, Math.min((d || t) - 0.05, t))
    if (mode === 'wa') { aOff = t; if (aPlaying) waStart() } else M.currentTime = t
    paint(); if (!isPlaying()) play()
  }
  function tap(el, fn) {
    if (!el) return
    var last = 0
    var h = function (e) { var n = Date.now(); if (n - last < 350) return; last = n; userTap = true; try { fn(e) } catch (x) { say('Galat: ' + x.message) } }
    el.addEventListener('click', h)
    el.addEventListener('touchend', function (e) { h(e); if (e.cancelable) e.preventDefault() }, { passive: false })
  }

  // ---------- lirik
  var L = (D.lyr && D.lyr.lines) || [], lt = $('lt'), lw = $('lw'), els = [], actI = -1
  if (lt) L.forEach(function (l, i) {
    var e = document.createElement('div'); e.className = 'ln'; e.textContent = l.s || '\u266a'
    if (D.lyr.mode === 'sync') e.onclick = function () { userTap = true; seek(l.t) }
    lt.appendChild(e); els.push(e)
  })
  function center(i) { if (!els[i] || !lw) return; var e = els[i], y = e.offsetTop + e.offsetHeight / 2 - lw.clientHeight / 2; lt.style.transform = 'translateY(' + (-Math.max(0, y)) + 'px)' }
  function setAct(i) { if (i === actI) return; actI = i; els.forEach(function (e, k) { e.className = 'ln' + (k === i ? ' on' : k < i ? ' pst' : '') }); if (i >= 0) center(i) }
  function idxAt(t) { var lo = 0, hi = L.length - 1, r = -1; while (lo <= hi) { var m = (lo + hi) >> 1; if (L[m].t <= t + 0.2) { r = m; lo = m + 1 } else hi = m - 1 } return r }
  function syncLy(t) {
    if (!lt) return
    if (D.lyr.mode === 'sync') setAct(idxAt(t))
    else if (D.lyr.mode === 'plain') { var tot = D.full || D.clip || 1, p = Math.min(1, t / tot); setAct(Math.min(L.length - 1, Math.floor(p * L.length))) }
  }

  // ---------- daftar hasil / aksi / pencarian
  var R = $('rs'); if (R) R.addEventListener('click', function (e) { var n = e.target; while (n && n !== R) { if (n.getAttribute && n.getAttribute('data-i') != null) { userTap = true; act(D.results[+n.getAttribute('data-i')].cmd); return } n = n.parentNode } })
  var AB = $('acts'); if (AB) AB.addEventListener('click', function (e) { var n = e.target; while (n && n !== AB) { if (n.getAttribute && n.getAttribute('data-a') != null) { act(D.actions[+n.getAttribute('data-a')].cmd); return } n = n.parentNode } })
  var q = $('q'), go = $('go')
  function doSearch() { var v = (q.value || '').trim(); if (!v) return say('Ketik kata kunci dulu.'); act(D.searchCmd + ' ' + v) }
  if (go) { go.addEventListener('click', doSearch); q.addEventListener('keydown', function (e) { if (e.key === 'Enter') doSearch() }) }

  // ---------- pasang pemutar
  if (M && D.hasMedia) {
    M.addEventListener('play', function () { if (mode === 'el') onPlay() })
    M.addEventListener('pause', function () { if (mode === 'el') onPause() })
    M.addEventListener('ended', function () { if (mode === 'el') { if (D.nextCmd && !aLoop) { onEnd(); say('Lagu berikutnya...'); act(D.nextCmd) } else onEnd() } })
    M.addEventListener('timeupdate', paint); M.addEventListener('loadedmetadata', paint); M.addEventListener('seeked', paint)
    M.addEventListener('error', function () { if (mode === 'el' && !abuf && isVideo) fail(null, new Error('format tidak didukung')) })
    tap($('pp'), function () { isPlaying() ? pause() : play() })
    tap($('bk'), function () { seek(cur() - 10) })
    tap($('fw'), function () { seek(cur() + 10) })
    tap($('lp'), function () { aLoop = !aLoop; M.loop = aLoop; $('lp').className = 'bt sm' + (aLoop ? ' act' : '') })
    tap($('mt'), function () { aMuted = !aMuted; M.muted = aMuted; if (aGain) aGain.gain.value = aMuted ? 0 : 1; $('mt').className = 'bt sm' + (aMuted ? ' act' : '') })
    if (isVideo) tap(M, function () { isPlaying() ? pause() : play() })
    var drag = false
    var at = function (e) { var r = bar.getBoundingClientRect(), x = (e.touches ? e.touches[0].clientX : e.clientX) - r.left, p = Math.max(0, Math.min(1, x / r.width)), t = p * dur(); if (mode === 'wa') { aOff = t; if (aPlaying) waStart() } else M.currentTime = t; paint() }
    bar.addEventListener('mousedown', function (e) { drag = true; userTap = true; at(e) })
    bar.addEventListener('touchstart', function (e) { drag = true; userTap = true; at(e) }, { passive: true })
    window.addEventListener('mousemove', function (e) { if (drag) at(e) })
    window.addEventListener('touchmove', function (e) { if (drag) at(e) }, { passive: true })
    window.addEventListener('mouseup', function () { drag = false })
    window.addEventListener('touchend', function () { drag = false })
    setTimeout(play, 300)
  } else {
    var pp = $('pp'); if (pp) pp.style.opacity = '.35'
    say('Media tidak ikut di kartu ini' + (D.noMediaWhy ? ': ' + D.noMediaWhy : '.'))
    var b = $('ab-dl'); if (b) b.className = 'ab k'
  }
  setTimeout(function () { center(Math.max(0, actI)) }, 300)
  paint()
})()
