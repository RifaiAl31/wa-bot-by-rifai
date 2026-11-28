/* RIFAI ANNOUNCEMENT MANAGER — vanilla JS, same-origin API, no dependencies.
   Semua data server dirender lewat createElement/textContent (tanpa innerHTML). */
(function () {
  'use strict';

  var $ = function (id) { return document.getElementById(id); };
  var HARI = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
  var BULAN = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli',
    'Agustus', 'September', 'Oktober', 'November', 'Desember'];

  var state = {
    csrfToken: '', configured: false, authed: false, boot: null,
    currentTab: 'dashboard', formOpen: false, editId: null, editItem: null,
    editorImagePath: null, editorFormat: 'text', editorTemplateId: null,
    editorMode: 'relative', groupSearch: '', calendarItems: null,
    confirmResolve: null, loadingCount: 0
  };

  /* ------------------ DOM helper (XSS-safe) ------------------ */
  function make(tag, props, children) {
    var node = document.createElement(tag);
    props = props || {};
    Object.keys(props).forEach(function (key) {
      var value = props[key];
      if (value === null || value === undefined || value === false) return;
      if (key === 'text') node.textContent = String(value);
      else if (key === 'class') node.className = String(value);
      else if (key === 'hidden') node.hidden = !!value;
      else if (key === 'disabled') node.disabled = !!value;
      else if (key === 'checked') node.checked = !!value;
      else if (key.indexOf('on') === 0 && typeof value === 'function') node.addEventListener(key.slice(2), value);
      else node.setAttribute(key, String(value));
    });
    var list = children == null ? [] : (Array.isArray(children) ? children : [children]);
    list.forEach(function (child) {
      if (child === null || child === undefined || child === false) return;
      node.appendChild(child instanceof Node ? child : document.createTextNode(String(child)));
    });
    return node;
  }
  function clear(node) { if (node) while (node.firstChild) node.removeChild(node.firstChild); }
  function pad(n) { return String(n).padStart(2, '0'); }
  function pick(obj, keys, fallback) {
    for (var i = 0; i < keys.length; i++) {
      var v = obj && obj[keys[i]];
      if (v !== null && v !== undefined && v !== '') return String(v);
    }
    return fallback === undefined ? '—' : fallback;
  }
  function arr(value) { return Array.isArray(value) ? value : []; }
  function escapeAttr(value) { return encodeURIComponent(String(value)); }

  /* ------------------ Toast / confirm / loading ------------------ */
  function toast(message, kind) {
    var box = make('div', { class: 'toast toast-' + (kind || 'info'), text: String(message) });
    $('toast-root').appendChild(box);
    setTimeout(function () { if (box.parentNode) box.parentNode.removeChild(box); }, 5000);
  }
  function askConfirm(title, text) {
    $('confirm-title').textContent = title || 'Konfirmasi';
    $('confirm-text').textContent = text || '';
    $('confirm-modal').hidden = false;
    return new Promise(function (resolve) { state.confirmResolve = resolve; });
  }
  function settleConfirm(answer) {
    $('confirm-modal').hidden = true;
    var resolve = state.confirmResolve;
    state.confirmResolve = null;
    if (resolve) resolve(answer);
  }
  function setLoading(on) {
    state.loadingCount = Math.max(0, state.loadingCount + (on ? 1 : -1));
    $('loading-bar').hidden = state.loadingCount === 0;
  }
  async function withBusy(button, task) {
    if (button) button.disabled = true;
    setLoading(true);
    try { return await task(); }
    finally { setLoading(false); if (button && button.parentNode) button.disabled = false; }
  }

  /* ------------------ API ------------------ */
  function handle401() {
    state.authed = false;
    state.csrfToken = '';
    state.boot = null;
    state.formOpen = false;
    state.editId = null;
    state.calendarItems = null;
    showLogin();
    toast('Sesi berakhir. Silakan masuk kembali.', 'error');
  }
  async function api(path, options) {
    options = options || {};
    var method = options.method || 'GET';
    var headers = Object.assign({}, options.headers || {});
    if (method !== 'GET' && state.csrfToken) headers['x-csrf-token'] = state.csrfToken;
    var body = options.body;
    if (Object.prototype.hasOwnProperty.call(options, 'json')) {
      headers['Content-Type'] = 'application/json';
      body = JSON.stringify(options.json);
    }
    var response;
    try {
      response = await fetch('/api' + path, {
        method: method, headers: headers, body: body, credentials: 'same-origin'
      });
    } catch (err) {
      var net = new Error('Tidak dapat terhubung ke server.');
      net.status = 0;
      throw net;
    }
    if (response.status === 401 && path !== '/auth/login') {
      handle401();
      var expired = new Error('Sesi berakhir. Silakan masuk kembali.');
      expired.status = 401;
      throw expired;
    }
    var data = null;
    try { data = await response.json(); }
    catch (err) { data = null; }
    if (!response.ok) {
      var message = (data && (data.error || data.message)) || 'Permintaan gagal (' + response.status + ').';
      var failure = new Error(String(message));
      failure.status = response.status;
      throw failure;
    }
    return data || {};
  }

  /* ------------------ Format helpers ------------------ */
  function normTime(value) {
    if (!value) return '';
    var p = String(value).split(':');
    return pad(p[0]) + ':' + pad(p[1] === undefined ? 0 : p[1]);
  }
  function dateParts(value) {
    var p = String(value || '').split('-');
    if (p.length !== 3) return null;
    var y = Number(p[0]); var m = Number(p[1]); var d = Number(p[2]);
    if (!y || !m || !d) return null;
    return [y, m, d];
  }
  function formatEvent(dateStr, time) {
    var p = dateParts(dateStr);
    if (!p) return 'Tanggal belum diatur';
    var d = new Date(Date.UTC(p[0], p[1] - 1, p[2]));
    return HARI[d.getUTCDay()] + ', ' + pad(p[2]) + ' ' + (BULAN[p[1] - 1] || '') + ' ' + p[0] +
      (time ? ' · ' + String(time) + ' WIB' : '');
  }
  function formatStamp(value) {
    if (!value) return '—';
    var s = String(value).replace('T', ' ');
    var p = s.split(/[ :]/);
    if (p.length < 5) return s + ' WIB';
    return formatEvent(p[0] + '-' + p[1] + '-' + p[2], p[3] + ':' + p[4]);
  }
  function mediaUrl(path) {
    if (!path) return '';
    var name = String(path).split('?')[0].split('/').pop();
    return '/api/media/' + encodeURIComponent(name);
  }
  function bootObj(key, fallback) {
    var value = state.boot && state.boot[key];
    return value && typeof value === 'object' ? value : (fallback || {});
  }
  function schedules() {
    var b = state.boot || {};
    return arr(b.schedules && b.schedules.length ? b.schedules : b.announcements);
  }
  function groupName(jid) {
    var found = arr(state.boot && state.boot.groups).filter(function (g) { return g.id === jid; })[0];
    return found && found.subject ? found.subject : String(jid || '—');
  }
  function targetText(targets) {
    var list = arr(targets);
    if (!list.length) return 'Belum ada grup tujuan';
    return list.map(groupName).join(', ');
  }
  function statusBadge(status) {
    var s = String(status || '');
    var cls = 'badge-muted';
    var label = s || '—';
    if (s === 'active' || s === 'sent' || s === 'success') { cls = 'badge-ok'; label = 'Aktif / Berhasil'; }
    else if (s === 'draft') { cls = 'badge-muted'; label = 'Draft'; }
    else if (s === 'paused' || s === 'claimed' || s === 'queued' || s === 'pending_review' || s === 'pending') {
      cls = 'badge-warn';
      label = { paused: 'Jeda', claimed: 'Diproses', queued: 'Antrean', pending_review: 'Perlu persetujuan', pending: 'Tertunda' }[s] || s;
    } else if (s === 'failed' || s === 'missed') { cls = 'badge-bad'; label = s === 'failed' ? 'Gagal' : 'Terlewat'; }
    return make('span', { class: 'badge ' + cls, text: label });
  }
  function calBadge(status) {
    var s = String(status || '');
    var map = {
      success: ['cal-success', 'Berhasil'], pending: ['cal-pending', 'Tertunda'],
      upcoming: ['cal-upcoming', 'Akan datang'], failed: ['cal-failed', 'Gagal'],
      skipped: ['cal-skipped', 'Dilewati']
    };
    var info = map[s] || ['cal-skipped', s || '—'];
    return make('span', { class: 'cal-badge ' + info[0], text: info[1] });
  }
  function emptyNode(text) { return make('div', { class: 'empty', text: text }); }
  function sectionHead(title, subtitle, right) {
    return make('div', { class: 'section-head' }, [
      make('div', {}, [make('h2', { text: title }), make('p', { class: 'muted', text: subtitle })]),
      right || null
    ]);
  }
  function btn(label, action, attrs, cls) {
    var props = { type: 'button', class: 'btn ' + (cls || 'btn-ghost btn-mini'), text: label, 'data-action': action };
    Object.keys(attrs || {}).forEach(function (key) { props[key] = attrs[key]; });
    return make('button', props);
  }
  function table(headers, rows) {
    var wrap = make('div', { class: 'table-wrap' });
    var t = make('table', { class: 'data-table' });
    var thead = make('thead');
    var hr = make('tr');
    headers.forEach(function (h) { hr.appendChild(make('th', { text: h })); });
    thead.appendChild(hr);
    var tbody = make('tbody');
    rows.forEach(function (row) { tbody.appendChild(row); });
    t.appendChild(thead);
    t.appendChild(tbody);
    wrap.appendChild(t);
    return wrap;
  }
  function field(labelText, control, span, hintText) {
    var f = make('div', { class: 'field' + (span ? ' span-2' : '') });
    var lbl = make('label', { text: labelText });
    if (control.id) lbl.setAttribute('for', control.id);
    f.appendChild(lbl);
    f.appendChild(control);
    if (hintText) f.appendChild(make('div', { class: 'hint', text: hintText }));
    return f;
  }
  function selectNode(id, options, value) {
    var sel = make('select', { id: id });
    options.forEach(function (entry) {
      var opt = make('option', { value: entry[0], text: entry[1] });
      if (String(entry[0]) === String(value)) opt.selected = true;
      sel.appendChild(opt);
    });
    if (value !== undefined && value !== null && !options.some(function (e) { return String(e[0]) === String(value); })) {
      sel.value = String(value);
    }
    return sel;
  }

  /* ------------------ Render: shell ------------------ */
  function showLogin() {
    $('app-view').hidden = true;
    $('login-view').hidden = false;
    $('login-error').hidden = true;
    $('login-password').value = '';
    $('login-notice').hidden = state.configured;
    if (!state.configured) {
      $('login-notice').textContent = 'Autentikasi belum dikonfigurasi. Set DASHBOARD_PASSWORD di environment server.';
    }
  }
  function showApp() { $('login-view').hidden = true; $('app-view').hidden = false; }
  function renderWhatsappHeader() {
    var wa = bootObj('whatsapp');
    var connected = !!wa.connected;
    var badge = $('wa-status');
    badge.className = 'badge ' + (connected ? 'badge-ok' : 'badge-bad');
    badge.textContent = connected
      ? 'WhatsApp terhubung' + (wa.phone ? ' · ' + wa.phone : '')
      : 'WhatsApp terputus';
  }
  function switchTab(name) {
    state.currentTab = name;
    Array.prototype.forEach.call(document.querySelectorAll('.tab'), function (tab) {
      tab.classList.toggle('active', tab.getAttribute('data-tab') === name);
    });
    Array.prototype.forEach.call(document.querySelectorAll('.tab-panel'), function (panel) {
      panel.hidden = panel.id !== 'tab-' + name;
    });
    if (name === 'calendar' && state.calendarItems === null) loadCalendar();
  }
  function renderAll() {
    renderWhatsappHeader();
    renderDashboard();
    renderCreate();
    renderSchedules();
    renderCalendar();
    renderHistory();
    renderGroups();
    renderSettings();
    renderTemplates();
    renderAudit();
  }
  async function refresh() {
    state.boot = await api('/bootstrap');
    state.calendarItems = null;
    renderAll();
    if (state.currentTab === 'calendar') await loadCalendar();
  }

  /* ------------------ Dashboard ------------------ */
  function nextSendItem() {
    var candidates = schedules().filter(function (item) {
      return item.nextSendDate || item.scheduleAt || item.nextSendAt;
    });
    candidates.sort(function (a, b) {
      var ka = String(a.nextSendDate || (a.scheduleAt ? String(a.scheduleAt).slice(0, 10) : '9999')) + 'T' +
        String(a.nextSendAt || (a.scheduleAt ? String(a.scheduleAt).slice(11, 16) : '23:59'));
      var kb = String(b.nextSendDate || (b.scheduleAt ? String(b.scheduleAt).slice(0, 10) : '9999')) + 'T' +
        String(b.nextSendAt || (b.scheduleAt ? String(b.scheduleAt).slice(11, 16) : '23:59'));
      return ka < kb ? -1 : (ka > kb ? 1 : 0);
    });
    return candidates[0] || null;
  }
  function renderDashboard() {
    var host = $('tab-dashboard');
    clear(host);
    var s = bootObj('stats');
    host.appendChild(sectionHead('Dashboard', 'Ringkasan kondisi pengumuman dan koneksi WhatsApp.',
      btn('Muat ulang', 'refresh', {}, 'btn-ghost btn-sm')));

    var grid = make('div', { class: 'stats-grid' });
    [
      ['Total pengumuman', s.total, ''],
      ['Jadwal aktif', s.active, ''],
      ['Berhasil', s.sent, 'stat-ok'],
      ['Gagal', s.failed, 'stat-bad'],
      ['Tertunda', s.pending, 'stat-warn'],
      ['Terlewat', s.missed, 'stat-bad']
    ].forEach(function (entry) {
      grid.appendChild(make('div', { class: 'stat-card ' + entry[2] }, [
        make('span', { class: 'stat-value', text: entry[1] === undefined ? 0 : entry[1] }),
        make('span', { class: 'stat-label', text: entry[0] })
      ]));
    });
    host.appendChild(grid);

    var panels = make('div', { class: 'panel-grid' });

    var waPanel = make('div', { class: 'panel' });
    waPanel.appendChild(make('h3', { text: 'Status WhatsApp' }));
    var wa = bootObj('whatsapp');
    var waRow = make('div', { class: 'wa-detail' });
    waRow.appendChild(statusBadge(wa.connected ? 'active' : 'failed'));
    waRow.appendChild(make('span', { text: wa.connected ? 'Bot siap mengirim pengumuman.' : 'Pengiriman tertunda sampai bot terhubung.' }));
    waPanel.appendChild(waRow);
    if (wa.phone) waPanel.appendChild(make('p', { class: 'muted small-text', text: 'Nomor: ' + wa.phone }));
    var publicUrl = pick(bootObj('dashboard'), ['publicUrl'], '');
    waPanel.appendChild(make('p', { class: 'hint', text: 'Tautan dashboard: ' + (publicUrl || 'belum tersedia') }));
    panels.appendChild(waPanel);

    var nextPanel = make('div', { class: 'panel' });
    nextPanel.appendChild(make('h3', { text: 'Pengiriman berikutnya' }));
    var next = nextSendItem();
    if (!next) {
      nextPanel.appendChild(make('p', { class: 'muted', text: 'Belum ada jadwal pengiriman berikutnya.' }));
    } else {
      var box = make('div', { class: 'next-send' });
      box.appendChild(make('div', {}, [
        make('div', { class: 'row-title', text: next.scheduleName || next.name || next.title || next.id || 'Pengumuman' }),
        make('div', { class: 'row-sub', text: formatEvent(next.nextSendDate, next.nextSendAt || next.sendTime) }),
        make('div', { class: 'row-sub', text: 'Grup: ' + targetText(next.targets) })
      ]));
      box.appendChild(btn('Lihat jadwal', 'goto-schedules', {}, 'btn-secondary btn-sm'));
      nextPanel.appendChild(box);
    }
    panels.appendChild(nextPanel);
    host.appendChild(panels);

    var activity = make('div', { class: 'panel' });
    activity.appendChild(make('h3', { text: 'Aktivitas terbaru' }));
    var logs = arr(state.boot && state.boot.audit).slice(0, 6);
    if (!logs.length) {
      activity.appendChild(make('p', { class: 'muted', text: 'Belum ada aktivitas tercatat.' }));
    } else {
      var ul = make('ul', { class: 'activity-list' });
      logs.forEach(function (log) {
        ul.appendChild(make('li', {}, [
          make('span', { class: 'muted small-text', text: pick(log, ['createdAt', 'at', 'timestamp', 'waktu']) + ' · ' }),
          make('span', { text: pick(log, ['action', 'aksi', 'event']) }),
          make('span', { class: 'muted', text: ' — ' + pick(log, ['detail', 'target', 'actor', 'ip'], '') })
        ]));
      });
      activity.appendChild(ul);
    }
    host.appendChild(activity);
  }

  /* ------------------ Create / edit form ------------------ */
  function resetEditor() {
    state.formOpen = false;
    state.editId = null;
    state.editItem = null;
    state.editorImagePath = null;
    state.editorFormat = 'text';
    state.editorTemplateId = null;
    state.editorMode = 'relative';
  }
  function openEditor(item, template) {
    state.formOpen = true;
    state.editId = item ? item.id : null;
    if (template) {
      item = {
        scheduleName: template.name || '',
        title: template.title || '',
        body: template.body || '',
        imagePath: template.imagePath || null,
        targets: template.targets || [],
        weekday: template.weekday,
        offsetDays: template.offsetDays,
        sendTime: template.sendTime,
        format: 'text'
      };
    }
    state.editItem = item || null;
    state.editorImagePath = item ? (item.imagePath || null) : null;
    state.editorFormat = item && item.format ? item.format : (state.editorImagePath ? 'both' : 'text');
    state.editorTemplateId = template ? template.id : (item ? (item.templateId || null) : null);
    state.editorMode = item && item.mode === 'once' && item.scheduleAt ? 'once' : 'relative';
    switchTab('create');
    renderCreate();
  }
  function renderGroupChoicesInto(host, selected) {
    clear(host);
    var groups = arr(state.boot && state.boot.groups);
    var chosen = arr(selected);
    if (!groups.length) {
      host.appendChild(make('span', { class: 'muted', text: 'Belum ada grup WhatsApp terdeteksi.' }));
      return;
    }
    groups.forEach(function (group) {
      var label = make('label', { class: 'group-label' });
      label.appendChild(make('input', {
        type: 'checkbox', value: group.id, 'data-group': '1',
        checked: chosen.indexOf(group.id) !== -1
      }));
      var text = make('span');
      text.appendChild(make('span', { text: group.subject || group.id }));
      text.appendChild(make('span', { class: 'group-jid', text: group.id }));
      label.appendChild(text);
      host.appendChild(label);
    });
  }
  function renderImagePreviewInto(host, path) {
    clear(host);
    if (!path) return;
    host.appendChild(make('img', { src: mediaUrl(path), alt: 'Pratinjau gambar' }));
    host.appendChild(make('div', { class: 'hint', text: 'Gambar tersimpan: ' + String(path).split('/').pop() }));
  }
  function renderCreate() {
    var host = $('tab-create');
    clear(host);
    host.appendChild(sectionHead('Buat Pengumuman',
      state.editId ? 'Ubah jadwal pengumuman ' + state.editId + ' (riwayat pengiriman tidak diubah).'
        : 'Susun pesan, grup tujuan, dan jadwal otomatis pengiriman.',
      btn('+ Pengumuman baru', 'create-new', {}, 'btn-primary btn-sm')));

    if (!state.formOpen) {
      var intro = make('div', { class: 'panel' });
      intro.appendChild(make('h3', { text: 'Siap membuat pengumuman baru?' }));
      intro.appendChild(make('p', { class: 'muted', text: 'Isi nama, judul, isi pesan, grup tujuan, serta hari dan jam kirim. Tanggal pengiriman dihitung otomatis dari tanggal mulai dan hari kegiatan.' }));
      intro.appendChild(btn('Buka formulir', 'create-new', {}, 'btn-primary'));
      host.appendChild(intro);
      return;
    }

    var item = state.editItem || {};
    var settings = bootObj('settings');
    var form = make('form', { id: 'create-form', class: 'panel', autocomplete: 'off' });
    var grid = make('div', { class: 'form-grid' });

    var fName = make('input', { id: 'f-name', type: 'text', required: true, maxlength: '120', value: '' });
    fName.value = item.scheduleName || item.name || '';
    grid.appendChild(field('Nama pengumuman', fName, false, 'Contoh: Pengumuman Rapat Minggu'));

    var fTitle = make('input', { id: 'f-title', type: 'text', required: true, maxlength: '200' });
    fTitle.value = item.title || '';
    grid.appendChild(field('Judul pesan', fTitle, false, 'Judul akan tampil di awal pesan WhatsApp.'));

    var fBody = make('textarea', { id: 'f-body', rows: '5', required: true });
    fBody.value = item.body || '';
    grid.appendChild(field('Isi pesan', fBody, true, 'Tulis isi pengumuman lengkap.'));

    var fStart = make('input', { id: 'f-startDate', type: 'date', required: true });
    fStart.value = item.startDate || item.eventDate || '';
    grid.appendChild(field('Tanggal mulai / kegiatan', fStart, false, 'Tanggal acuan perhitungan jadwal.'));

    var weekday = item.weekday === undefined || item.weekday === null || item.weekday === '' ? 1 : Number(item.weekday);
    var fWeekday = selectNode('f-weekday', HARI.map(function (h, i) { return [i, h]; }), weekday);
    grid.appendChild(field('Hari kegiatan', fWeekday, false, '0 = Minggu, 6 = Sabtu.'));

    var offset = item.offsetDays === undefined || item.offsetDays === null || item.offsetDays === '' ? 1 : Number(item.offsetDays);
    var offsetOptions = [[1, '1 hari sebelum kegiatan'], [0, 'Pada hari kegiatan']];
    if (offset === 7) offsetOptions.unshift([7, '7 hari sebelum kegiatan']);
    var fOffset = selectNode('f-offsetDays', offsetOptions, offset);
    grid.appendChild(field('Waktu pengiriman', fOffset, false, 'Jarak kirim terhadap hari kegiatan.'));

    var fTime = make('input', { id: 'f-sendTime', type: 'time', required: true });
    fTime.value = item.sendTime || settings.defaultSendTime || '19:00';
    grid.appendChild(field('Jam pengiriman (WIB)', fTime, false, 'Jam eksekusi pengiriman.'));

    var repeat = item.repeat || 'none';
    var fRepeat = selectNode('f-repeat', [
      ['none', 'Sekali'], ['weekly', 'Setiap minggu'], ['forever', 'Selamanya']
    ], repeat);
    grid.appendChild(field('Pengulangan', fRepeat, false, 'Sekali / tiap minggu / selamanya.'));

    var fImage = make('input', { id: 'f-image', type: 'file', accept: 'image/jpeg,image/png,image/webp' });
    grid.appendChild(field('Gambar poster (opsional)', fImage, false, 'JPG, PNG, atau WebP, maksimal 5MB.'));

    var groupsBox = make('div', { class: 'targets-box' });
    var allGroups = make('input', { id: 'f-allGroups', type: 'checkbox' });
    var allLabel = make('label', { class: 'check-row' });
    allLabel.appendChild(allGroups);
    allLabel.appendChild(make('strong', { text: 'Pilih semua grup' }));
    groupsBox.appendChild(allLabel);
    var groupsHost = make('div', { id: 'f-groups', class: 'groups-grid' });
    groupsBox.appendChild(groupsHost);
    grid.appendChild(field('Grup tujuan', groupsBox, true));

    var activeBox = make('div', { class: 'targets-box' });
    var activeInput = make('input', { id: 'f-active', type: 'checkbox', checked: (item.status === 'active' || Number(item.is_active) === 1) });
    var activeLabel = make('label', { class: 'check-row' });
    activeLabel.appendChild(activeInput);
    activeLabel.appendChild(make('span', { text: 'Aktifkan jadwal otomatis (centang) atau simpan sebagai draft tidak aktif.' }));
    activeBox.appendChild(activeLabel);
    grid.appendChild(field('Status', activeBox, true));
    form.appendChild(grid);

    var previewHost = make('div', { class: 'preview-box', id: 'f-preview', hidden: true });
    form.appendChild(previewHost);
    form.appendChild(make('p', { id: 'f-error', class: 'form-error', hidden: true }));

    var actions = make('div', { class: 'form-actions' });
    actions.appendChild(btn('Preview', 'preview-create', {}, 'btn-secondary'));
    actions.appendChild(btn('Simpan Jadwal', 'save-create', {}, 'btn-primary'));
    actions.appendChild(btn('Batal', 'close-editor', {}, 'btn-ghost'));
    form.appendChild(actions);
    host.appendChild(form);

    renderGroupChoicesInto(groupsHost, item.targets);
    var imgPreview = make('div', { id: 'f-image-preview', class: 'image-preview' });
    var imageField = Array.prototype.filter.call(grid.children, function (node) {
      return node.querySelector && node.querySelector('#f-image');
    })[0];
    if (imageField) imageField.appendChild(imgPreview);
    renderImagePreviewInto(imgPreview, state.editorImagePath);
  }
  function collectCreate() {
    var targets = Array.prototype.slice.call(($('f-groups') || { querySelectorAll: function () { return []; } }).querySelectorAll('input[data-group]'))
      .filter(function (input) { return input.checked; })
      .map(function (input) { return input.value; });
    var active = !!($('f-active') && $('f-active').checked);
    var startDate = $('f-startDate').value;
    var item = state.editItem || {};
    var settings = bootObj('settings');
    return {
      id: state.editId || undefined,
      scheduleName: $('f-name').value.trim(),
      name: $('f-name').value.trim(),
      title: $('f-title').value.trim(),
      body: $('f-body').value,
      weekday: Number($('f-weekday').value),
      eventDate: startDate,
      startDate: startDate,
      eventTime: item.eventTime || '',
      location: item.location || '',
      imagePath: state.editorImagePath || null,
      targets: targets,
      repeat: $('f-repeat').value,
      offsetDays: Number($('f-offsetDays').value),
      sendTime: normTime($('f-sendTime').value),
      format: state.editorFormat,
      mode: state.editorMode,
      scheduleAt: item.scheduleAt || null,
      templateId: state.editorTemplateId || null,
      catchUp: item.catchUp || settings.catchUp || 'skip',
      status: active ? 'active' : 'draft',
      is_active: active ? 1 : 0
    };
  }
  function validateCreate(payload) {
    if (!payload.scheduleName) return 'Nama pengumuman wajib diisi.';
    if (!payload.title) return 'Judul wajib diisi.';
    if (!payload.body.trim()) return 'Isi pesan wajib diisi.';
    if (!payload.startDate) return 'Tanggal mulai wajib diisi.';
    if (!payload.sendTime) return 'Jam pengiriman wajib diisi.';
    if (!payload.targets.length) return 'Pilih minimal satu grup tujuan.';
    return '';
  }
  function showFormError(message) {
    var box = $('f-error');
    if (!box) { toast(message, 'error'); return; }
    box.textContent = message;
    box.hidden = false;
  }
  async function saveCreate(button) {
    var payload = collectCreate();
    var invalid = validateCreate(payload);
    if (invalid) { showFormError(invalid); return; }
    await withBusy(button, async function () {
      try {
        if (state.editId) await api('/announcements/' + escapeAttr(state.editId), { method: 'PATCH', json: payload });
        else await api('/announcements', { method: 'POST', json: payload });
        var wasEdit = !!state.editId;
        resetEditor();
        await refresh();
        toast(wasEdit ? 'Jadwal diperbarui. Riwayat tidak diubah.' : 'Jadwal pengumuman disimpan.', 'success');
        switchTab('schedules');
      } catch (err) { showFormError(err.message); }
    });
  }
  async function previewCreate(button) {
    var payload = collectCreate();
    if (!payload.title && !payload.body.trim()) { showFormError('Isi judul atau pesan terlebih dahulu.'); return; }
    await withBusy(button, async function () {
      try {
        var result = await api('/preview', { method: 'POST', json: {
          title: payload.title, body: payload.body, eventDate: payload.eventDate,
          eventTime: payload.eventTime, location: payload.location,
          format: payload.format, imagePath: payload.imagePath
        } });
        var host = $('f-preview');
        clear(host);
        host.appendChild(make('h3', { text: 'Hasil preview (teks persis pesan)' }));
        if (payload.imagePath) host.appendChild(make('img', { src: mediaUrl(payload.imagePath), alt: 'Poster pengumuman' }));
        host.appendChild(make('pre', { class: 'whatsapp-preview', text: result.text === undefined ? '' : String(result.text) }));
        host.hidden = false;
      } catch (err) { showFormError(err.message); }
    });
  }

  /* ------------------ Jadwal otomatis ------------------ */
  function renderSchedules() {
    var host = $('tab-schedules');
    clear(host);
    host.appendChild(sectionHead('Jadwal Otomatis',
      'Kelola jadwal A/B/C, jadwal tambahan, dan seluruh penjadwalan pengumuman.',
      btn('Muat ulang', 'refresh', {}, 'btn-ghost btn-sm')));
    host.appendChild(make('div', {
      class: 'note',
      text: 'Tanggal kirim berikutnya dihitung otomatis oleh sistem dari tanggal mulai, hari kegiatan, offset (1 hari sebelumnya / hari kegiatan), dan jam kirim. Anda tidak perlu mengisi tanggal kirim manual.'
    }));

    var items = schedules();
    if (!items.length) { host.appendChild(emptyNode('Belum ada jadwal pengumuman.')); return; }
    var rows = items.map(function (item) {
      var tr = make('tr');
      var nameCell = make('td');
      nameCell.appendChild(make('div', { class: 'row-title', text: item.scheduleName || item.name || item.title || item.id || '—' }));
      nameCell.appendChild(make('div', { class: 'row-sub', text: (item.id || '—') + ' · ' + (item.title || '') }));
      tr.appendChild(nameCell);
      tr.appendChild(make('td', { text: HARI[Number(item.weekday) || 0] || '—' }));
      var offset = Number(item.offsetDays || 0);
      tr.appendChild(make('td', { text: offset === 0 ? 'Hari kegiatan' : offset + ' hari sebelum' }));
      tr.appendChild(make('td', { text: item.sendTime || '—' }));
      tr.appendChild(make('td', { text: { none: 'Sekali', weekly: 'Setiap minggu', forever: 'Selamanya' }[item.repeat] || (item.repeat || '—') }));
      var targetCell = make('td');
      targetCell.appendChild(make('div', { class: 'row-sub break', text: targetText(item.targets) }));
      tr.appendChild(targetCell);
      var statusCell = make('td');
      statusCell.appendChild(statusBadge(item.status));
      tr.appendChild(statusCell);
      tr.appendChild(make('td', { text: item.nextSendDate ? formatEvent(item.nextSendDate, item.nextSendAt || item.sendTime) : '—' }));
      var actionCell = make('td');
      var actions = make('div', { class: 'actions' });
      var active = item.status === 'active' || Number(item.is_active) === 1;
      if (active) actions.appendChild(btn('Jeda', 'schedule-pause', { 'data-id': item.id }, 'btn-ghost'));
      else actions.appendChild(btn('Aktifkan', 'schedule-activate', { 'data-id': item.id }, 'btn-secondary'));
      actions.appendChild(btn('Edit', 'schedule-edit', { 'data-id': item.id }, 'btn-secondary'));
      actions.appendChild(btn('Kirim Sekarang', 'schedule-send', { 'data-id': item.id }, 'btn-primary'));
      actions.appendChild(btn('Hapus', 'schedule-delete', { 'data-id': item.id }, 'btn-danger'));
      actionCell.appendChild(actions);
      tr.appendChild(actionCell);
      return tr;
    });
    host.appendChild(table(['Nama', 'Hari', 'Offset', 'Jam', 'Pengulangan', 'Grup', 'Status', 'Kirim berikutnya', 'Aksi'], rows));
  }

  /* ------------------ Kalender ------------------ */
  function todayISO() {
    try {
      var fmt = new Intl.DateTimeFormat('en-US', { year: 'numeric', month: '2-digit', day: '2-digit', timeZone: 'Asia/Jakarta' });
      var parts = {};
      fmt.formatToParts(new Date()).forEach(function (p) { parts[p.type] = p.value; });
      if (parts.year && parts.month && parts.day) return parts.year + '-' + parts.month + '-' + parts.day;
    } catch (e) { /* abaikan */ }
    var d = new Date();
    return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate());
  }
  function shiftISO(iso, days) {
    var d = new Date(iso + 'T00:00:00Z');
    d.setUTCDate(d.getUTCDate() + days);
    return d.toISOString().slice(0, 10);
  }
  function weekStartISO(iso) {
    var d = new Date(iso + 'T00:00:00Z');
    if (isNaN(d.getTime())) return iso;
    var diff = (d.getUTCDay() + 6) % 7;
    d.setUTCDate(d.getUTCDate() - diff);
    return d.toISOString().slice(0, 10);
  }
  function weekLabel(iso) {
    var today = todayISO();
    if (weekStartISO(iso) === weekStartISO(today)) return 'Minggu ini';
    if (weekStartISO(iso) === shiftISO(weekStartISO(today), 7)) return 'Minggu depan';
    return 'Lainnya';
  }
  async function loadCalendar() {
    try {
      var result = await api('/calendar?weeks=2');
      state.calendarItems = arr(result.items);
      if (state.currentTab === 'calendar') renderCalendar();
    } catch (err) { toast(err.message, 'error'); }
  }
  function renderCalendar() {
    var host = $('tab-calendar');
    clear(host);
    host.appendChild(sectionHead('Kalender Pengiriman',
      'Jadwal minggu ini dan minggu depan, dikelompokkan per tanggal kirim.',
      btn('Muat ulang', 'calendar-refresh', {}, 'btn-ghost btn-sm')));
    var items = state.calendarItems;
    if (items === null) {
      host.appendChild(make('div', { class: 'empty', text: 'Memuat kalender…' }));
      return;
    }
    if (!items.length) { host.appendChild(emptyNode('Tidak ada pengiriman pada minggu ini dan minggu depan.')); return; }
    var groups = {};
    items.forEach(function (item) {
      var key = item.sendDate || item.eventDate || 'tanpa-tanggal';
      if (!groups[key]) groups[key] = [];
      groups[key].push(item);
    });
    var keys = Object.keys(groups).sort();
    var grid = make('div', { class: 'cal-grid' });
    keys.forEach(function (key) {
      var day = make('div', { class: 'cal-day' });
      var head = make('div', { class: 'cal-day-head' });
      head.appendChild(make('strong', { text: formatEvent(key === 'tanpa-tanggal' ? '' : key) }));
      head.appendChild(make('span', { class: 'hint', text: weekLabel(key === 'tanpa-tanggal' ? todayISO() : key) }));
      day.appendChild(head);
      var list = make('ul', { class: 'cal-list' });
      groups[key].forEach(function (item) {
        var li = make('li', { class: 'cal-item' });
        var main = make('div', { class: 'cal-item-main' });
        main.appendChild(make('span', { class: 'cal-time', text: item.sendTime || '--:--' }));
        main.appendChild(make('span', { class: 'row-title', text: item.scheduleName || item.name || item.title || item.id || 'Pengumuman' }));
        main.appendChild(make('div', { class: 'row-sub', text: 'Kegiatan: ' + formatEvent(item.eventDate, item.eventTime) }));
        li.appendChild(main);
        li.appendChild(calBadge(item.status));
        list.appendChild(li);
      });
      day.appendChild(list);
      grid.appendChild(day);
    });
    host.appendChild(grid);
  }

  /* ------------------ Riwayat pengiriman ------------------ */
  function runActualTime(run) {
    return formatStamp(run.sentAt || run.createdAt);
  }
  function runErrorText(run) {
    var reasons = arr(run.details).filter(function (d) { return d && d.reason; })
      .map(function (d) { return pick(d, ['jid'], '') + ': ' + d.reason; });
    if (reasons.length) return reasons.join(' · ');
    return run.error || run.reason || '—';
  }
  function renderHistory() {
    var host = $('tab-history');
    clear(host);
    host.appendChild(sectionHead('Riwayat Pengiriman',
      'Status setiap proses kirim beserta snapshot pesan dan detail kegagalan.',
      btn('Muat ulang', 'refresh', {}, 'btn-ghost btn-sm')));
    var runs = arr(state.boot && state.boot.history);
    if (!runs.length) { host.appendChild(emptyNode('Belum ada riwayat pengiriman.')); return; }
    var rows = runs.map(function (run) {
      var tr = make('tr');
      var statusCell = make('td');
      statusCell.appendChild(statusBadge(run.status));
      if (run.kind) statusCell.appendChild(make('div', { class: 'row-sub', text: 'Jenis: ' + run.kind }));
      if (run.actor) statusCell.appendChild(make('div', { class: 'row-sub', text: 'Oleh: ' + run.actor }));
      tr.appendChild(statusCell);

      var snapshot = run.snapshot || {};
      var snapCell = make('td');
      snapCell.appendChild(make('div', { class: 'row-title break', text: pick(run, ['scheduleName', 'name', 'title'], '—') }));
      snapCell.appendChild(make('div', { class: 'row-sub', text: 'Judul: ' + (snapshot.title || run.title || '—') }));
      snapCell.appendChild(make('div', { class: 'row-sub break', text: 'Isi: ' + (snapshot.body || run.body || '—') }));
      snapCell.appendChild(make('div', { class: 'row-sub', text: 'Key: ' + pick(run, ['key', 'id'], '—') }));
      tr.appendChild(snapCell);

      var groupCell = make('td');
      groupCell.appendChild(make('div', { class: 'row-sub break', text: targetText(snapshot.targets || run.targets) }));
      var details = arr(run.details);
      if (details.length) {
        groupCell.appendChild(make('div', { class: 'row-sub', text: 'Penerima: ' + details.length }));
      }
      tr.appendChild(groupCell);

      var timeCell = make('td');
      timeCell.appendChild(make('div', { text: runActualTime(run) }));
      if (run.sendDate || run.sendTime) {
        timeCell.appendChild(make('div', { class: 'row-sub', text: 'Jadwal: ' + (run.sendDate || '—') + ' ' + (run.sendTime || '') }));
      }
      tr.appendChild(timeCell);

      tr.appendChild(make('td', { class: 'row-sub break', text: runErrorText(run) }));

      var actionCell = make('td');
      var actions = make('div', { class: 'actions' });
      if (run.status === 'failed') {
        actions.appendChild(btn('Retry', 'run-retry', {
          'data-id': pick(run, ['id', 'key'], ''), 'data-key': run.key || ''
        }, 'btn-secondary'));
      }
      if (run.status === 'pending_review') {
        actions.appendChild(btn('Approve', 'run-approve', {
          'data-id': pick(run, ['id', 'key'], ''), 'data-key': run.key || ''
        }, 'btn-primary'));
      }
      if (!actions.childNodes.length) actions.appendChild(make('span', { class: 'muted', text: '—' }));
      actionCell.appendChild(actions);
      tr.appendChild(actionCell);
      return tr;
    });
    host.appendChild(table(['Status', 'Pengumuman & snapshot', 'Grup', 'Waktu aktual', 'Error', 'Aksi'], rows));
  }

  /* ------------------ Grup WhatsApp ------------------ */
  function renderGroups() {
    var host = $('tab-groups');
    clear(host);
    var groups = arr(state.boot && state.boot.groups);
    host.appendChild(sectionHead('Grup WhatsApp',
      groups.length + ' grup terdeteksi dari sesi WhatsApp bot.',
      btn('Muat ulang', 'refresh', {}, 'btn-ghost btn-sm')));
    var toolbar = make('div', { class: 'toolbar' });
    var search = make('input', { id: 'group-search', type: 'search', placeholder: 'Cari nama atau ID grup…', value: state.groupSearch });
    toolbar.appendChild(search);
    host.appendChild(toolbar);
    var listHost = make('div', { id: 'group-list' });
    host.appendChild(listHost);
    renderGroupList();
  }
  function renderGroupList() {
    var host = $('group-list');
    if (!host) return;
    clear(host);
    var q = state.groupSearch.toLowerCase();
    var groups = arr(state.boot && state.boot.groups).filter(function (g) {
      return !q || String(g.subject || '').toLowerCase().indexOf(q) !== -1 || String(g.id || '').toLowerCase().indexOf(q) !== -1;
    });
    if (!groups.length) { host.appendChild(emptyNode('Tidak ada grup yang cocok.')); return; }
    var rows = groups.map(function (g) {
      var tr = make('tr');
      tr.appendChild(make('td', { class: 'row-title', text: g.subject || '(tanpa nama)' }));
      tr.appendChild(make('td', { class: 'row-sub break mono', text: g.id || '—' }));
      return tr;
    });
    host.appendChild(table(['Nama grup', 'ID grup (JID)'], rows));
  }

  /* ------------------ Pengaturan ------------------ */
  function renderSettings() {
    var host = $('tab-settings');
    clear(host);
    host.appendChild(sectionHead('Pengaturan', 'Konfigurasi perilaku penjadwalan dan status layanan.', null));
    var settings = bootObj('settings');
    var form = make('form', { id: 'settings-form', class: 'panel' });
    var grid = make('div', { class: 'form-grid' });

    var tz = make('div', { class: 'readonly-box', text: settings.timezone || 'Asia/Jakarta' });
    grid.appendChild(field('Zona waktu (baca saja)', tz, false, 'Zona waktu ditetapkan oleh server.'));

    var catchUp = selectNode('s-catchUp', [
      ['skip', 'SKIP'], ['online', 'SEND WHEN ONLINE'], ['review', 'MANUAL REVIEW']
    ], settings.catchUp || 'skip');
    grid.appendChild(field('Penanganan pengiriman terlewat', catchUp, false, 'SKIP / SEND WHEN ONLINE / MANUAL REVIEW.'));

    var defaultTime = make('input', { id: 's-defaultTime', type: 'time', required: true });
    defaultTime.value = settings.defaultSendTime || '19:00';
    grid.appendChild(field('Jam kirim bawaan (WIB)', defaultTime, false));

    var maxPending = make('input', { id: 's-maxPending', type: 'number', min: '1', max: '1000', required: true });
    maxPending.value = settings.maxPending === undefined ? 20 : settings.maxPending;
    grid.appendChild(field('Maksimum antrean pending', maxPending, false));

    var scheduler = make('div', { class: 'readonly-box' });
    scheduler.appendChild(statusBadge(settings.schedulerRunning ? 'active' : 'paused'));
    scheduler.appendChild(make('span', { class: 'muted small-text', text: settings.schedulerRunning ? ' Scheduler berjalan.' : ' Scheduler tidak berjalan.' }));
    grid.appendChild(field('Status scheduler', scheduler, false));

    var portBox = make('div', { class: 'readonly-box' });
    var publicUrl = pick(bootObj('dashboard'), ['publicUrl'], '');
    portBox.appendChild(make('div', { class: 'break', text: publicUrl || 'Tautan publik belum tersedia.' }));
    portBox.appendChild(make('div', { class: 'hint', text: 'Port dashboard ditentukan oleh konfigurasi server.' }));
    grid.appendChild(field('Status port dashboard', portBox, false));
    form.appendChild(grid);

    form.appendChild(make('div', { class: 'form-actions' }, [
      make('button', { type: 'submit', class: 'btn btn-primary', text: 'Simpan Pengaturan' })
    ]));

    var info = make('div', { class: 'panel' });
    info.appendChild(make('h3', { text: 'Kata sandi admin' }));
    info.appendChild(make('p', { class: 'muted', text: 'Kata sandi admin dibaca dari variabel lingkungan DASHBOARD_PASSWORD di server. Nilai password tidak pernah ditampilkan di halaman ini. Hubungi administrator jika perlu menggantinya.' }));
    host.appendChild(form);
    host.appendChild(info);
  }
  async function saveSettings(button) {
    var payload = {
      catchUp: $('s-catchUp').value,
      defaultSendTime: normTime($('s-defaultTime').value),
      maxPending: Number($('s-maxPending').value)
    };
    if (!payload.defaultSendTime || isNaN(payload.maxPending) || payload.maxPending < 1) {
      toast('Periksa jam kirim dan maksimum antrean.', 'error');
      return;
    }
    await withBusy(button, async function () {
      try {
        await api('/settings', { method: 'PATCH', json: payload });
        await refresh();
        toast('Pengaturan disimpan.', 'success');
      } catch (err) { toast(err.message, 'error'); }
    });
  }

  /* ------------------ Template ------------------ */
  function templateMatches(id) {
    return arr(state.boot && state.boot.templates).filter(function (t) { return t.id === id; })[0] || null;
  }
  function renderTemplates() {
    var host = $('tab-templates');
    clear(host);
    host.appendChild(sectionHead('Template', 'Template pesan yang sering dipakai; klik Pakai untuk menyalin ke formulir.',
      btn('+ Template baru', 'template-new', {}, 'btn-primary btn-sm')));
    var templates = arr(state.boot && state.boot.templates);
    if (!templates.length) { host.appendChild(emptyNode('Belum ada template tersimpan.')); return; }
    var list = make('div', { class: 'card-list' });
    templates.forEach(function (tpl) {
      var card = make('div', { class: 'template-card' });
      var left = make('div');
      left.appendChild(make('div', { class: 'row-title', text: tpl.name || '(tanpa nama)' }));
      left.appendChild(make('div', { class: 'row-sub', text: (tpl.id || '—') + ' · ' + (tpl.title || '') }));
      left.appendChild(make('div', { class: 'template-body break', text: tpl.body || '' }));
      left.appendChild(make('div', { class: 'row-sub', text: 'Hari: ' + (HARI[Number(tpl.weekday)] || '—') + ' · Offset: ' + (tpl.offsetDays === 0 ? 'hari kegiatan' : (tpl.offsetDays || 1) + ' hari sebelum') + ' · Jam: ' + (tpl.sendTime || '—') }));
      left.appendChild(make('div', { class: 'row-sub break', text: 'Grup: ' + targetText(tpl.targets) }));
      card.appendChild(left);
      var actions = make('div', { class: 'actions' });
      actions.appendChild(btn('Pakai', 'template-use', { 'data-id': tpl.id }, 'btn-primary'));
      actions.appendChild(btn('Edit', 'template-edit', { 'data-id': tpl.id }, 'btn-secondary'));
      actions.appendChild(btn('Hapus', 'template-delete', { 'data-id': tpl.id }, 'btn-danger'));
      card.appendChild(actions);
      list.appendChild(card);
    });
    host.appendChild(list);
  }
  function closeTemplateModal() {
    var root = $('modal-root');
    clear(root);
  }
  function openTemplateEditor(tpl) {
    closeTemplateModal();
    tpl = tpl || {};
    var isEdit = !!tpl.id;
    var imagePath = tpl.imagePath || null;
    var overlay = make('div', { class: 'modal' });
    overlay.appendChild(make('div', { class: 'modal-backdrop', 'data-action': 'template-close' }));
    var dialog = make('div', { class: 'modal-dialog modal-wide', role: 'dialog', 'aria-modal': 'true', 'aria-label': 'Editor template' });
    dialog.appendChild(make('div', { class: 'modal-head' }, [
      make('h2', { text: isEdit ? 'Edit template ' + tpl.id : 'Template baru' }),
      make('button', { type: 'button', class: 'icon-btn', 'data-action': 'template-close', 'aria-label': 'Tutup', text: '✕' })
    ]));
    var form = make('form', { id: 'template-form', autocomplete: 'off', 'data-tpl-id': isEdit ? tpl.id : '' });
    var body = make('div', { class: 'modal-body' });
    var grid = make('div', { class: 'form-grid' });

    var name = make('input', { id: 't-name', type: 'text', required: true, maxlength: '120' });
    name.value = tpl.name || '';
    grid.appendChild(field('Nama template', name, false));

    var title = make('input', { id: 't-title', type: 'text', maxlength: '200' });
    title.value = tpl.title || '';
    grid.appendChild(field('Judul pesan', title, false));

    var text = make('textarea', { id: 't-body', rows: '5', required: true });
    text.value = tpl.body || '';
    grid.appendChild(field('Isi template', text, true));

    var wd = tpl.weekday === undefined || tpl.weekday === null || tpl.weekday === '' ? 1 : Number(tpl.weekday);
    grid.appendChild(field('Hari kegiatan', selectNode('t-weekday', HARI.map(function (h, i) { return [i, h]; }), wd), false));
    var off = tpl.offsetDays === undefined || tpl.offsetDays === null || tpl.offsetDays === '' ? 1 : Number(tpl.offsetDays);
    var offOpts = [[1, '1 hari sebelum kegiatan'], [0, 'Pada hari kegiatan']];
    if (off === 7) offOpts.unshift([7, '7 hari sebelum kegiatan']);
    grid.appendChild(field('Offset', selectNode('t-offset', offOpts, off), false));

    var sendTime = make('input', { id: 't-sendTime', type: 'time' });
    sendTime.value = tpl.sendTime || bootObj('settings').defaultSendTime || '19:00';
    grid.appendChild(field('Jam kirim', sendTime, false));

    var image = make('input', { id: 't-image', type: 'file', accept: 'image/jpeg,image/png,image/webp' });
    grid.appendChild(field('Gambar opsional', image, false));

    var groupsBox = make('div', { class: 'targets-box' });
    var allGroups = make('input', { id: 't-allGroups', type: 'checkbox' });
    var allLabel = make('label', { class: 'check-row' });
    allLabel.appendChild(allGroups);
    allLabel.appendChild(make('strong', { text: 'Pilih semua grup' }));
    groupsBox.appendChild(allLabel);
    var groupsHost = make('div', { id: 't-groups', class: 'groups-grid' });
    groupsBox.appendChild(groupsHost);
    grid.appendChild(field('Grup tujuan', groupsBox, true));
    body.appendChild(grid);
    var imagePreview = make('div', { id: 't-image-preview', class: 'image-preview' });
    var imageField = Array.prototype.filter.call(grid.children, function (node) {
      return node.querySelector && node.querySelector('#t-image');
    })[0];
    if (imageField) imageField.appendChild(imagePreview);
    form.appendChild(body);

    form.appendChild(make('div', { class: 'modal-foot' }, [
      make('button', { type: 'button', class: 'btn btn-ghost', 'data-action': 'template-close', text: 'Batal' }),
      make('button', { type: 'submit', class: 'btn btn-primary', text: isEdit ? 'Simpan Perubahan' : 'Simpan Template' })
    ]));
    dialog.appendChild(form);
    overlay.appendChild(dialog);
    $('modal-root').appendChild(overlay);
    renderGroupChoicesInto(groupsHost, tpl.targets);
    renderImagePreviewInto(imagePreview, imagePath);
    if (imagePath) imagePreview.setAttribute('data-image-path', imagePath);
    $('t-name').focus();
  }
  async function saveTemplate(form, button) {
    var targets = Array.prototype.slice.call($('t-groups').querySelectorAll('input[data-group]'))
      .filter(function (input) { return input.checked; }).map(function (input) { return input.value; });
    var editingId = form.getAttribute('data-tpl-id') || '';
    var payload = {
      name: $('t-name').value.trim(),
      title: $('t-title').value.trim(),
      body: $('t-body').value,
      weekday: Number($('t-weekday').value),
      offsetDays: Number($('t-offset').value),
      sendTime: normTime($('t-sendTime').value),
      imagePath: imagePathForTemplate(),
      targets: targets,
      format: 'text'
    };
    if (!payload.name) { toast('Nama template wajib diisi.', 'error'); return; }
    if (!payload.body.trim()) { toast('Isi template wajib diisi.', 'error'); return; }
    await withBusy(button, async function () {
      try {
        if (editingId) await api('/templates/' + escapeAttr(editingId), { method: 'PATCH', json: payload });
        else await api('/templates', { method: 'POST', json: payload });
        closeTemplateModal();
        await refresh();
        toast(editingId ? 'Template diperbarui.' : 'Template disimpan.', 'success');
      } catch (err) { toast(err.message, 'error'); }
    });
  }
  function imagePathForTemplate() {
    var preview = $('t-image-preview');
    if (!preview || !preview.getAttribute('data-image-path')) return null;
    return preview.getAttribute('data-image-path');
  }
  async function deleteTemplate(id, button) {
    var tpl = templateMatches(id);
    var ok = await askConfirm('Hapus template', 'Hapus template "' + (tpl ? tpl.name : id) + '"?');
    if (!ok) return;
    await withBusy(button, async function () {
      try {
        await api('/templates/' + escapeAttr(id), { method: 'DELETE' });
        await refresh();
        toast('Template dihapus.', 'success');
      } catch (err) { toast(err.message, 'error'); }
    });
  }

  /* ------------------ Audit ------------------ */
  function renderAudit() {
    var host = $('tab-audit');
    clear(host);
    host.appendChild(sectionHead('Log Audit', 'Catatan aktivitas administrasi (baca saja).',
      make('span', { class: 'badge badge-muted', text: 'Read-only' })));
    var logs = arr(state.boot && state.boot.audit);
    if (!logs.length) { host.appendChild(emptyNode('Belum ada aktivitas tercatat.')); return; }
    var rows = logs.map(function (log) {
      var tr = make('tr');
      [pick(log, ['createdAt', 'at', 'timestamp', 'waktu']),
        pick(log, ['action', 'aksi', 'event']),
        pick(log, ['detail', 'target', 'item', 'description', 'actor', 'ip']),
        pick(log, ['ip', 'ipAddress', 'ip_address'], '')].forEach(function (value) {
        tr.appendChild(make('td', { class: 'break', text: value }));
      });
      return tr;
    });
    host.appendChild(table(['Waktu', 'Aksi', 'Detail / Aktor', 'IP'], rows));
  }

  /* ------------------ Actions ------------------ */
  async function scheduleAction(id, action, button) {
    var item = schedules().filter(function (a) { return a.id === id; })[0] || {};
    if (action === 'delete') {
      var ok = await askConfirm('Hapus jadwal', 'Hapus pengumuman "' + (item.scheduleName || item.name || item.title || id) + '"? Riwayat pengiriman tetap disimpan.');
      if (!ok) return;
    }
    if (action === 'send') {
      var sendOk = await askConfirm('Kirim sekarang', 'Kirim pengumuman "' + (item.scheduleName || item.name || item.title || id) + '" sekarang ke grup tujuan?');
      if (!sendOk) return;
    }
    await withBusy(button, async function () {
      try {
        var path = action === 'delete' ? '/announcements/' + escapeAttr(id)
          : action === 'send' ? '/announcements/' + escapeAttr(id) + '/send'
            : '/schedules/' + escapeAttr(id) + '/' + action;
        await api(path, { method: action === 'delete' ? 'DELETE' : 'POST', json: action === 'delete' ? undefined : {} });
        await refresh();
        toast({
          activate: 'Jadwal diaktifkan.', pause: 'Jadwal dijeda.',
          delete: 'Pengumuman dihapus.', send: 'Pengiriman dimulai.'
        }[action] || 'Berhasil.', 'success');
      } catch (err) { toast(err.message, 'error'); }
    });
  }
  async function retryRun(id, key, button) {
    var ok = await askConfirm('Retry pengiriman', 'Kirim ulang pengiriman yang gagal ini?');
    if (!ok) return;
    await withBusy(button, async function () {
      try {
        try {
          await api('/announcements/' + escapeAttr(id) + '/retry', { method: 'POST', json: { runKey: key } });
        } catch (err) {
          if (err.status !== 404) throw err;
          await api('/announcements/retry', { method: 'POST', json: { runKey: key } });
        }
        await refresh();
        toast('Pengiriman ulang dimulai.', 'success');
      } catch (err) { toast(err.message, 'error'); }
    });
  }
  async function approveRun(id, key, button) {
    var ok = await askConfirm('Approve pengiriman', 'Setujui pengiriman yang menunggu review ini?');
    if (!ok) return;
    await withBusy(button, async function () {
      try {
        await api('/schedules/' + escapeAttr(id) + '/approve', { method: 'POST', json: { runKey: key } });
        await refresh();
        toast('Pengiriman disetujui.', 'success');
      } catch (err) { toast(err.message, 'error'); }
    });
  }
  async function uploadImage(file, input, onDone) {
    var types = ['image/jpeg', 'image/png', 'image/webp'];
    if (types.indexOf(file.type) === -1 || file.size > 5 * 1024 * 1024) {
      toast('Gambar harus JPG/PNG/WebP dan maksimal 5MB.', 'error');
      input.value = '';
      return;
    }
    var form = new FormData();
    form.append('file', file);
    await withBusy(null, async function () {
      try {
        var result = await api('/upload', { method: 'POST', body: form });
        var path = result.file && result.file.path ? result.file.path : null;
        if (!path) throw new Error('Server tidak mengembalikan path gambar.');
        onDone(path);
        toast('Gambar berhasil diunggah.', 'success');
      } catch (err) { toast(err.message, 'error'); input.value = ''; }
    });
  }

  /* ------------------ Events ------------------ */
  function bindEvents() {
    $('login-form').addEventListener('submit', async function (event) {
      event.preventDefault();
      var errorBox = $('login-error');
      errorBox.hidden = true;
      await withBusy($('login-submit'), async function () {
        try {
          var result = await api('/auth/login', { method: 'POST', json: { password: $('login-password').value } });
          state.csrfToken = result.csrfToken || '';
          state.authed = true;
          $('login-password').value = '';
          showApp();
          switchTab('dashboard');
          await refresh();
          toast('Berhasil masuk.', 'success');
        } catch (err) {
          errorBox.textContent = err.message;
          errorBox.hidden = false;
        }
      });
    });
    $('logout-btn').addEventListener('click', async function () {
      try { await api('/auth/logout', { method: 'POST' }); } catch (err) { /* abaikan */ }
      state.authed = false;
      state.csrfToken = '';
      state.boot = null;
      resetEditor();
      closeTemplateModal();
      showLogin();
      toast('Berhasil keluar.', 'info');
    });
    document.querySelector('.tabs').addEventListener('click', function (event) {
      var tab = event.target.closest('[data-tab]');
      if (tab) switchTab(tab.getAttribute('data-tab'));
    });
    $('confirm-ok').addEventListener('click', function () { settleConfirm(true); });

    document.addEventListener('input', function (event) {
      if (event.target && event.target.id === 'group-search') {
        state.groupSearch = event.target.value.trim();
        renderGroupList();
      }
    });
    document.addEventListener('change', function (event) {
      var target = event.target;
      if (!target) return;
      if (target.id === 'f-allGroups') {
        Array.prototype.forEach.call($('f-groups').querySelectorAll('input[data-group]'), function (input) {
          input.checked = target.checked;
        });
      } else if (target.id === 't-allGroups') {
        var host = $('t-groups');
        if (host) Array.prototype.forEach.call(host.querySelectorAll('input[data-group]'), function (input) {
          input.checked = target.checked;
        });
      } else if (target.id === 'f-image') {
        var file = target.files && target.files[0];
        if (file) uploadImage(file, target, function (path) {
          state.editorImagePath = path;
          var preview = $('f-image-preview');
          if (preview) renderImagePreviewInto(preview, path);
        });
      } else if (target.id === 't-image') {
        var tfile = target.files && target.files[0];
        if (tfile) uploadImage(tfile, target, function (path) {
          var preview = $('t-image-preview');
          if (preview) {
            preview.setAttribute('data-image-path', path);
            renderImagePreviewInto(preview, path);
          }
        });
      }
    });
    document.addEventListener('submit', function (event) {
      var form = event.target;
      if (!form) return;
      if (form.id === 'create-form') { event.preventDefault(); saveCreate(form.querySelector('[data-action="save-create"]')); }
      else if (form.id === 'settings-form') { event.preventDefault(); saveSettings(form.querySelector('[type="submit"]')); }
      else if (form.id === 'template-form') { event.preventDefault(); saveTemplate(form, form.querySelector('[type="submit"]')); }
    });

    document.addEventListener('click', async function (event) {
      var target = event.target.closest('[data-action]');
      if (!target) return;
      var action = target.getAttribute('data-action');
      var id = target.getAttribute('data-id') || '';

      if (action === 'refresh') {
        await withBusy(target, async function () {
          try { await refresh(); toast('Data diperbarui.', 'info'); }
          catch (err) { toast(err.message, 'error'); }
        });
      } else if (action === 'goto-schedules') {
        switchTab('schedules');
      } else if (action === 'create-new') {
        openEditor(null, null);
      } else if (action === 'close-editor') {
        resetEditor();
        renderCreate();
      } else if (action === 'preview-create') {
        await previewCreate(target);
      } else if (action === 'save-create') {
        await saveCreate(target);
      } else if (action === 'calendar-refresh') {
        await withBusy(target, async function () { await loadCalendar(); });
      } else if (action === 'schedule-activate' || action === 'schedule-pause' || action === 'schedule-delete' || action === 'schedule-send') {
        var verb = action.split('-')[1];
        await scheduleAction(id, verb, target);
      } else if (action === 'schedule-edit') {
        var item = schedules().filter(function (a) { return a.id === id; })[0];
        if (item) openEditor(item, null);
      } else if (action === 'run-retry') {
        await retryRun(id, target.getAttribute('data-key') || '', target);
      } else if (action === 'run-approve') {
        await approveRun(id, target.getAttribute('data-key') || '', target);
      } else if (action === 'template-new') {
        openTemplateEditor(null);
      } else if (action === 'template-edit') {
        var tpl = templateMatches(id);
        if (tpl) openTemplateEditor(tpl);
      } else if (action === 'template-delete') {
        await deleteTemplate(id, target);
      } else if (action === 'template-use') {
        var source = templateMatches(id);
        if (source) {
          openEditor(null, source);
          toast('Template disalin ke formulir pengumuman.', 'success');
        }
      } else if (action === 'template-close') {
        closeTemplateModal();
      } else if (action === 'close-preview') {
        $('preview-modal').hidden = true;
      } else if (action === 'confirm-cancel') {
        settleConfirm(false);
      }
    });
    document.addEventListener('keydown', function (event) {
      if (event.key !== 'Escape') return;
      if (!$('confirm-modal').hidden) settleConfirm(false);
      else if (!$('preview-modal').hidden) $('preview-modal').hidden = true;
      else if ($('modal-root').firstChild) closeTemplateModal();
      else if (state.formOpen) { resetEditor(); renderCreate(); }
    });
  }

  /* ------------------ Init ------------------ */
  async function init() {
    bindEvents();
    try {
      var status = await api('/auth/status');
      state.configured = !!status.configured;
      state.authed = !!status.authenticated;
      if (state.authed) {
        showApp();
        switchTab('dashboard');
        await refresh();
      } else {
        showLogin();
      }
    } catch (err) {
      showLogin();
      toast(err.message, 'error');
    }
  }
  init();
})();
