/* Dashboard Auto Pengumuman — vanilla JS, same-origin API, no dependencies. */
(function () {
  'use strict';

  var $ = function (id) { return document.getElementById(id); };

  var HARI = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
  var BULAN = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli',
    'Agustus', 'September', 'Oktober', 'November', 'Desember'];

  var state = {
    csrfToken: '',
    configured: false,
    authed: false,
    bootstrap: null,
    filter: 'all',
    search: '',
    editId: null,
    editorImagePath: null,
    confirmResolve: null
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
      if (child === null || child === undefined) return;
      node.appendChild(child instanceof Node ? child : document.createTextNode(String(child)));
    });
    return node;
  }

  function clear(node) { while (node.firstChild) node.removeChild(node.firstChild); }
  function pad(n) { return String(n).padStart(2, '0'); }
  function pick(obj, keys, fallback) {
    for (var i = 0; i < keys.length; i++) {
      var v = obj && obj[keys[i]];
      if (v !== null && v !== undefined && v !== '') return String(v);
    }
    return fallback === undefined ? '—' : fallback;
  }

  /* ------------------ Toast / confirm ------------------ */
  function toast(message, kind) {
    var box = make('div', { class: 'toast toast-' + (kind || 'info'), text: message });
    $('toast-root').appendChild(box);
    setTimeout(function () { if (box.parentNode) box.parentNode.removeChild(box); }, 4500);
  }

  function askConfirm(text) {
    $('confirm-text').textContent = text;
    $('confirm-modal').hidden = false;
    return new Promise(function (resolve) { state.confirmResolve = resolve; });
  }

  function settleConfirm(answer) {
    $('confirm-modal').hidden = true;
    var resolve = state.confirmResolve;
    state.confirmResolve = null;
    if (resolve) resolve(answer);
  }

  /* ------------------ API ------------------ */
  function handle401() {
    state.authed = false;
    state.csrfToken = '';
    state.bootstrap = null;
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
      response = await fetch('/api' + path, { method: method, headers: headers, body: body, credentials: 'same-origin' });
    } catch (err) {
      throw new Error('Tidak dapat terhubung ke server.');
    }
    // Login salah juga 401: jangan dianggap sesi habis, biarkan pesan aslinya tampil.
    if (response.status === 401 && path !== '/auth/login') {
      handle401();
      throw new Error('Sesi berakhir. Silakan masuk kembali.');
    }
    var data;
    try { data = await response.json(); }
    catch (err) { throw new Error('Respons server tidak valid.'); }
    if (!response.ok) throw new Error(data && data.error ? String(data.error) : 'Permintaan gagal.');
    return data;
  }

  async function withBusy(button, task) {
    if (button) button.disabled = true;
    try { return await task(); }
    finally { if (button && button.parentNode) button.disabled = false; }
  }

  /* ------------------ Format ------------------ */
  function normTime(value) {
    if (!value) return '';
    var parts = String(value).split(':');
    return pad(parts[0]) + '.' + pad(parts[1] === undefined ? 0 : parts[1]);
  }
  function inputTime(value) {
    if (!value) return '';
    var parts = String(value).split('.');
    if (parts.length < 2) return String(value);
    return pad(parts[0]) + ':' + pad(parts[1]);
  }
  function dateParts(value) {
    var parts = String(value || '').split('-').map(Number);
    return parts.length === 3 ? parts : null;
  }
  function formatEvent(dateStr, time) {
    var p = dateParts(dateStr);
    if (!p) return 'Tanggal belum diatur';
    var d = new Date(Date.UTC(p[0], p[1] - 1, p[2]));
    return HARI[d.getUTCDay()] + ', ' + pad(p[2]) + ' ' + (BULAN[p[1] - 1] || '') + ' ' +
      p[0] + ' pukul ' + (time || '--.--') + ' WIB';
  }
  function formatWIB(value) {
    if (!value) return '—';
    var s = String(value).replace('T', ' ');
    var p = s.split(/[ :]/);
    if (p.length < 5) return s + ' WIB';
    return formatEvent(p[0] + '-' + p[1] + '-' + p[2], p[3] + '.' + p[4]);
  }
  function mediaUrl(path) {
    if (!path) return '';
    var name = String(path).split('?')[0].split('/').pop();
    return '/api/media/' + encodeURIComponent(name);
  }
  function scheduleText(item) {
    if (!item) return '—';
    if (item.mode === 'once') return 'Sekali pada ' + formatWIB(item.scheduleAt);
    var offset = Number(item.offsetDays || 0);
    var when = offset === 0 ? 'pada hari kegiatan' : offset + ' hari sebelum kegiatan';
    return 'Relatif: ' + when + ' pukul ' + (item.sendTime || '—') + ' WIB';
  }
  function targetText(targets) {
    if (!targets || !targets.length) return 'Belum ada grup tujuan';
    var groups = (state.bootstrap && state.bootstrap.groups) || [];
    return targets.map(function (jid) {
      var found = groups.filter(function (g) { return g.id === jid; })[0];
      return found && found.subject ? found.subject : jid;
    }).join(', ');
  }
  function statusLabel(status) {
    return { draft: 'Draft', active: 'Aktif', paused: 'Jeda', claimed: 'Tertunda',
      sent: 'Berhasil', failed: 'Gagal' }[status] || (status || '—');
  }
  function statusBadge(status) {
    var cls = 'badge-muted';
    if (status === 'active' || status === 'sent') cls = 'badge-ok';
    else if (status === 'paused' || status === 'claimed') cls = 'badge-warn';
    else if (status === 'failed') cls = 'badge-bad';
    return make('span', { class: 'badge ' + cls, text: statusLabel(status) });
  }

  /* ------------------ Render: auth / shell ------------------ */
  function showLogin() {
    $('app-view').hidden = true;
    $('login-view').hidden = false;
    $('login-error').hidden = true;
    $('login-password').value = '';
    $('login-notice').hidden = state.configured;
    if (!state.configured) {
      $('login-notice').textContent = 'Autentikasi belum dikonfigurasi di server. Hubungi administrator.';
    }
  }
  function showApp() {
    $('login-view').hidden = true;
    $('app-view').hidden = false;
  }

  function renderStats() {
    var stats = (state.bootstrap && state.bootstrap.stats) || {};
    var grid = $('stats-grid');
    clear(grid);
    var cards = [
      ['Total', stats.total], ['Aktif', stats.active], ['Draft', stats.draft],
      ['Terjadwal', stats.pending === undefined ? stats.scheduled : stats.pending],
      ['Berhasil', stats.sent], ['Gagal', stats.failed]
    ];
    cards.forEach(function (entry) {
      grid.appendChild(make('div', { class: 'stat-card' }, [
        make('span', { class: 'stat-value', text: entry[1] === undefined ? 0 : entry[1] }),
        make('span', { class: 'stat-label', text: entry[0] })
      ]));
    });
  }

  function renderWhatsapp() {
    var wa = (state.bootstrap && state.bootstrap.whatsapp) || {};
    var connected = !!wa.connected;
    var badge = $('wa-status');
    badge.className = 'badge ' + (connected ? 'badge-ok' : 'badge-bad');
    badge.textContent = connected ? 'WhatsApp terhubung' : 'WhatsApp terputus';
    var detail = $('wa-detail');
    clear(detail);
    detail.appendChild(statusBadge(connected ? 'sent' : 'failed'));
    detail.appendChild(make('span', {
      text: connected ? 'Bot siap mengirim pengumuman.' : 'Pengiriman tidak dapat dilakukan sampai bot terhubung.'
    }));
    if (wa.phone) detail.appendChild(make('span', { class: 'muted', text: 'Nomor: ' + wa.phone }));
    var url = state.bootstrap && state.bootstrap.dashboard && state.bootstrap.dashboard.publicUrl;
    $('public-url').textContent = url || '—';
  }

  /* ------------------ Render: announcements ------------------ */
  function filteredAnnouncements() {
    var items = (state.bootstrap && state.bootstrap.announcements) || [];
    var q = state.search.toLowerCase();
    return items.filter(function (item) {
      if (state.filter !== 'all' && String(item.status || '') !== state.filter) return false;
      if (!q) return true;
      return [item.id, item.title, item.body, item.location].join(' ').toLowerCase().indexOf(q) !== -1;
    });
  }

  function actionButton(label, action, id, cls) {
    return make('button', { type: 'button', class: 'btn btn-mini ' + (cls || 'btn-ghost'),
      'data-action': action, 'data-id': id, text: label });
  }

  function announcementActions(item) {
    var wrap = make('div', { class: 'actions' });
    wrap.appendChild(actionButton('Edit', 'edit-ann', item.id, 'btn-secondary'));
    wrap.appendChild(actionButton('Hapus', 'delete-ann', item.id, 'btn-danger'));
    wrap.appendChild(actionButton('Kirim Sekarang', 'send-ann', item.id, 'btn-primary'));
    var active = Number(item.is_active) === 1 || item.status === 'active';
    wrap.appendChild(actionButton(active ? 'Jeda' : 'Aktifkan', 'toggle-ann', item.id, 'btn-ghost'));
    return wrap;
  }

  function renderAnnouncements() {
    var items = filteredAnnouncements();
    var host = $('ann-list');
    clear(host);
    if (!items.length) {
      host.appendChild(make('div', { class: 'empty', text: 'Tidak ada pengumuman yang cocok.' }));
      return;
    }

    var tableWrap = make('div', { class: 'table-wrap desktop-only' });
    var table = make('table', { class: 'ann-table' });
    var thead = make('thead');
    var headRow = make('tr');
    ['ID / Judul', 'Kegiatan', 'Format', 'Status', 'Aksi'].forEach(function (label) {
      headRow.appendChild(make('th', { text: label }));
    });
    thead.appendChild(headRow);
    var tbody = make('tbody');
    items.forEach(function (item) {
      var tr = make('tr');
      var first = make('td');
      first.appendChild(make('div', { class: 'row-title', text: item.title || '(tanpa judul)' }));
      first.appendChild(make('div', { class: 'row-sub', text: item.id + ' · ' + targetText(item.targets) }));
      tr.appendChild(first);
      var eventCell = make('td');
      eventCell.appendChild(make('div', { text: formatEvent(item.eventDate, item.eventTime) }));
      eventCell.appendChild(make('div', { class: 'row-sub', text: scheduleText(item) }));
      tr.appendChild(eventCell);
      tr.appendChild(make('td', { text: item.format || 'text' }));
      var statusCell = make('td');
      statusCell.appendChild(statusBadge(item.status));
      if (Number(item.is_active) === 0 && item.status !== 'paused') {
        statusCell.appendChild(make('div', { class: 'row-sub', text: 'Nonaktif' }));
      }
      tr.appendChild(statusCell);
      var actionCell = make('td');
      actionCell.appendChild(announcementActions(item));
      tr.appendChild(actionCell);
      tbody.appendChild(tr);
    });
    table.appendChild(thead);
    table.appendChild(tbody);
    tableWrap.appendChild(table);
    host.appendChild(tableWrap);

    var mobile = make('div', { class: 'mobile-only' });
    items.forEach(function (item) {
      var card = make('div', { class: 'ann-card' });
      var head = make('div', { class: 'ann-card-head' });
      head.appendChild(make('div', {}, [
        make('div', { class: 'row-title', text: item.title || '(tanpa judul)' }),
        make('div', { class: 'row-sub', text: item.id + ' · ' + (item.format || 'text') })
      ]));
      head.appendChild(statusBadge(item.status));
      card.appendChild(head);
      card.appendChild(make('div', { class: 'ann-card-body', text: formatEvent(item.eventDate, item.eventTime) }));
      card.appendChild(make('div', { class: 'ann-card-body', text: 'Jadwal: ' + scheduleText(item) }));
      card.appendChild(make('div', { class: 'ann-card-body', text: 'Grup: ' + targetText(item.targets) }));
      card.appendChild(announcementActions(item));
      mobile.appendChild(card);
    });
    host.appendChild(mobile);
  }

  /* ------------------ Render: history ------------------ */
  function renderHistory() {
    var runs = (state.bootstrap && state.bootstrap.history) || [];
    var host = $('history-list');
    clear(host);
    if (!runs.length) {
      host.appendChild(make('div', { class: 'empty', text: 'Belum ada riwayat pengiriman.' }));
      return;
    }
    var wrap = make('div', { class: 'table-wrap' });
    var table = make('table', { class: 'history-table' });
    var thead = make('thead');
    var headRow = make('tr');
    ['Status', 'Waktu', 'Pengumuman', 'Target', 'Detail', 'Aksi'].forEach(function (label) {
      headRow.appendChild(make('th', { text: label }));
    });
    thead.appendChild(headRow);
    var tbody = make('tbody');

    runs.forEach(function (run) {
      var tr = make('tr');
      var statusCell = make('td');
      statusCell.appendChild(statusBadge(run.status));
      statusCell.appendChild(make('div', { class: 'row-sub', text: pick(run, ['kind'], '—') }));
      tr.appendChild(statusCell);

      var timeCell = make('td');
      timeCell.appendChild(make('div', { text: pick(run, ['sentAt', 'createdAt'], '—') }));
      if (run.sendDate || run.sendTime) {
        timeCell.appendChild(make('div', { class: 'row-sub',
          text: 'Jadwal: ' + (run.sendDate || '—') + ' ' + (run.sendTime || '') }));
      }
      tr.appendChild(timeCell);

      var idCell = make('td');
      idCell.appendChild(make('div', { class: 'row-title', text: pick(run, ['id'], '—') }));
      idCell.appendChild(make('div', { class: 'row-sub', text: run.eventDate ? 'Kegiatan: ' + run.eventDate : '' }));
      if (run.actor) idCell.appendChild(make('div', { class: 'row-sub', text: 'Oleh: ' + run.actor }));
      tr.appendChild(idCell);

      var details = Array.isArray(run.details) ? run.details : [];
      var targetCell = make('td');
      targetCell.appendChild(make('div', { class: 'row-sub', text: details.length + ' penerima' }));
      details.slice(0, 4).forEach(function (d) {
        targetCell.appendChild(make('div', { class: 'row-sub', text: pick(d, ['jid'], '—') + ' · ' + statusLabel(d.status) }));
      });
      if (details.length > 4) {
        targetCell.appendChild(make('div', { class: 'row-sub', text: '+' + (details.length - 4) + ' lainnya' }));
      }
      tr.appendChild(targetCell);

      var errorCell = make('td');
      var reasons = details.filter(function (d) { return d.reason; })
        .map(function (d) { return pick(d, ['jid'], '') + ': ' + d.reason; });
      errorCell.appendChild(make('div', { class: 'row-sub', text: reasons.length ? reasons.join(' · ') : '—' }));
      tr.appendChild(errorCell);

      var actionCell = make('td');
      if (run.status === 'failed' && run.key) {
        actionCell.appendChild(make('button', { type: 'button', class: 'btn btn-mini btn-secondary',
          'data-action': 'retry-run', 'data-id': pick(run, ['id'], ''), 'data-key': run.key, text: 'Retry' }));
      } else {
        actionCell.appendChild(make('span', { class: 'muted', text: '—' }));
      }
      tr.appendChild(actionCell);
      tbody.appendChild(tr);
    });

    table.appendChild(thead);
    table.appendChild(tbody);
    wrap.appendChild(table);
    host.appendChild(wrap);
  }

  /* ------------------ Render: templates / audit ------------------ */
  function renderTemplates() {
    var templates = (state.bootstrap && state.bootstrap.templates) || [];
    var host = $('template-list');
    clear(host);
    if (!templates.length) {
      host.appendChild(make('div', { class: 'empty', text: 'Belum ada template tersimpan.' }));
      return;
    }
    templates.forEach(function (tpl) {
      var card = make('div', { class: 'template-card' });
      var left = make('div');
      left.appendChild(make('div', { class: 'row-title', text: tpl.name || '(tanpa nama)' }));
      left.appendChild(make('div', { class: 'row-sub', text: tpl.id || '' }));
      left.appendChild(make('div', { class: 'template-body', text: tpl.body || '' }));
      card.appendChild(left);
      var actions = make('div', { class: 'actions' });
      actions.appendChild(actionButton('Pakai', 'use-template', tpl.id, 'btn-primary'));
      actions.appendChild(actionButton('Edit', 'edit-template', tpl.id, 'btn-secondary'));
      actions.appendChild(actionButton('Hapus', 'delete-template', tpl.id, 'btn-danger'));
      card.appendChild(actions);
      host.appendChild(card);
    });
  }

  function renderAudit() {
    var logs = (state.bootstrap && state.bootstrap.audit) || [];
    var host = $('audit-list');
    clear(host);
    if (!logs.length) {
      host.appendChild(make('div', { class: 'empty', text: 'Belum ada aktivitas tercatat.' }));
      return;
    }
    var wrap = make('div', { class: 'table-wrap' });
    var table = make('table', { class: 'audit-table' });
    var thead = make('thead');
    var headRow = make('tr');
    ['Waktu', 'Aksi', 'Target', 'IP'].forEach(function (label) { headRow.appendChild(make('th', { text: label })); });
    thead.appendChild(headRow);
    var tbody = make('tbody');
    logs.forEach(function (log) {
      var tr = make('tr');
      [pick(log, ['createdAt', 'at', 'time', 'timestamp', 'waktu']),
        pick(log, ['action', 'aksi', 'event']),
        pick(log, ['target', 'detail', 'item', 'announcement_id']),
        pick(log, ['ip', 'ipAddress', 'ip_address'])].forEach(function (value) {
        tr.appendChild(make('td', { text: value }));
      });
      tbody.appendChild(tr);
    });
    table.appendChild(thead);
    table.appendChild(tbody);
    wrap.appendChild(table);
    host.appendChild(wrap);
  }

  function renderAll() {
    renderStats();
    renderWhatsapp();
    renderAnnouncements();
    renderHistory();
    renderTemplates();
    renderAudit();
  }

  async function reload() {
    state.bootstrap = await api('/bootstrap');
    renderAll();
  }

  /* ------------------ Editor ------------------ */
  function templateMatches(id) {
    var templates = (state.bootstrap && state.bootstrap.templates) || [];
    return templates.filter(function (t) { return t.id === id; })[0] || null;
  }
  function announcementMatches(id) {
    var items = (state.bootstrap && state.bootstrap.announcements) || [];
    return items.filter(function (a) { return a.id === id; })[0] || null;
  }

  function renderGroupChoices(selected) {
    var host = $('f-groups');
    var groups = (state.bootstrap && state.bootstrap.groups) || [];
    clear(host);
    if (!groups.length) {
      host.appendChild(make('span', { class: 'muted', text: 'Tidak ada grup tersedia.' }));
      return;
    }
    var selectedList = Array.isArray(selected) ? selected : [];
    groups.forEach(function (group) {
      var label = make('label', { class: 'group-label' });
      label.appendChild(make('input', { type: 'checkbox', value: group.id,
        checked: selectedList.indexOf(group.id) !== -1, 'data-group': '1' }));
      var text = make('span');
      text.appendChild(make('span', { text: group.subject || group.id }));
      text.appendChild(make('span', { class: 'group-jid', text: group.id }));
      label.appendChild(text);
      host.appendChild(label);
    });
  }

  function renderImagePreview(path) {
    var host = $('f-image-preview');
    clear(host);
    if (!path) return;
    host.appendChild(make('img', { src: mediaUrl(path), alt: 'Pratinjau poster' }));
    host.appendChild(make('div', { class: 'hint', text: 'Gambar tersimpan: ' + String(path).split('/').pop() }));
  }

  function updateModeFields() {
    var relative = $('f-mode').value === 'relative';
    $('rel-fields').hidden = !relative;
    $('rel-time-field').hidden = !relative;
    $('once-field').hidden = relative;
    $('f-sendTime').required = relative;
    $('f-scheduleAt').required = !relative;
  }

  function openEditor(item, initialBody) {
    state.editId = item ? item.id : null;
    state.editorImagePath = item ? (item.imagePath || null) : null;
    $('editor-title').textContent = item ? 'Edit pengumuman ' + item.id : 'Pengumuman baru';
    $('f-title').value = item ? (item.title || '') : '';
    $('f-body').value = item ? (item.body || '') : (initialBody || '');
    $('f-eventDate').value = item ? (item.eventDate || '') : '';
    $('f-eventTime').value = inputTime(item ? item.eventTime : '');
    $('f-location').value = item ? (item.location || '') : '';
    $('f-format').value = item && item.format ? item.format : 'text';
    $('f-mode').value = item && item.mode === 'once' ? 'once' : 'relative';
    $('f-offsetDays').value = item ? String(item.offsetDays === undefined ? 1 : item.offsetDays) : '1';
    $('f-sendTime').value = inputTime(item ? item.sendTime : '08.00');
    $('f-scheduleAt').value = item ? (item.scheduleAt || '') : '';
    $('f-image').value = '';
    renderGroupChoices(item ? item.targets : []);
    $('f-all-groups').checked = false;
    renderImagePreview(state.editorImagePath);
    updateModeFields();
    $('editor-send-now').hidden = !state.editId;
    $('editor-modal').hidden = false;
  }

  function collectEditor(active) {
    var targets = Array.prototype.slice.call($('f-groups').querySelectorAll('input[data-group]'))
      .filter(function (input) { return input.checked; })
      .map(function (input) { return input.value; });
    var relative = $('f-mode').value === 'relative';
    return {
      title: $('f-title').value.trim(),
      body: $('f-body').value,
      eventDate: $('f-eventDate').value,
      eventTime: normTime($('f-eventTime').value),
      location: $('f-location').value.trim(),
      format: $('f-format').value,
      mode: relative ? 'relative' : 'once',
      offsetDays: relative ? Number($('f-offsetDays').value) : 0,
      sendTime: relative ? normTime($('f-sendTime').value) : '',
      scheduleAt: relative ? '' : $('f-scheduleAt').value,
      targets: targets,
      imagePath: state.editorImagePath,
      is_active: active ? 1 : 0,
      status: active ? 'active' : 'draft'
    };
  }

  function validateEditor(payload) {
    if (!payload.title) return 'Judul wajib diisi.';
    if (!payload.body.trim()) return 'Isi pesan wajib diisi.';
    if (!payload.eventDate) return 'Tanggal kegiatan wajib diisi.';
    if (!payload.eventTime || payload.eventTime.indexOf('NaN') !== -1) return 'Jam kegiatan wajib diisi.';
    if (payload.mode === 'relative' && !/^\d{2}\.\d{2}$/.test(payload.sendTime)) return 'Jam kirim wajib diisi.';
    if (payload.mode === 'once' && !payload.scheduleAt) return 'Waktu kirim sekali wajib diisi.';
    if (!payload.targets.length) return 'Pilih minimal satu grup tujuan.';
    return '';
  }

  async function saveEditor(active, button) {
    var payload = collectEditor(active);
    var invalid = validateEditor(payload);
    if (invalid) { toast(invalid, 'error'); return; }
    await withBusy(button, async function () {
      if (state.editId) {
        await api('/announcements/' + encodeURIComponent(state.editId), { method: 'PATCH', json: payload });
      } else {
        await api('/announcements', { method: 'POST', json: payload });
      }
      $('editor-modal').hidden = true;
      await reload();
      toast(active ? 'Pengumuman disimpan dan diaktifkan.' : 'Draft pengumuman disimpan.', 'success');
    });
  }

  function showPreview() {
    var payload = collectEditor(false);
    // Samakan persis dengan lib/autoAnnouncementScheduler.js announcementText().
    var parts = dateParts(payload.eventDate);
    var line = 'Tanggal belum diatur';
    if (parts) {
      var d = new Date(Date.UTC(parts[0], parts[1] - 1, parts[2]));
      line = HARI[d.getUTCDay()] + ', ' + pad(parts[2]) + ' ' + (BULAN[parts[1] - 1] || '') + ' ' + parts[0];
      if (payload.eventTime) line += ' pukul ' + String(payload.eventTime).replace('.', ':') + ' WIB';
    }
    if (payload.location) line += '\nLokasi: ' + payload.location;
    var text = ['📢 *' + payload.title + '*', '', line, '', payload.body].join('\n');
    $('preview-content').textContent = text;
    var imageHost = $('preview-image');
    clear(imageHost);
    if (payload.imagePath) imageHost.appendChild(make('img', { src: mediaUrl(payload.imagePath), alt: 'Poster pengumuman' }));

    var meta = $('preview-meta');
    clear(meta);
    meta.appendChild(make('div', { text: 'Format: ' + payload.format }));
    meta.appendChild(make('div', { text: 'Jadwal: ' + scheduleText(payload) }));
    meta.appendChild(make('div', { text: 'Grup tujuan: ' + (payload.targets.length ? targetText(payload.targets) : 'Belum ada') }));
    meta.appendChild(make('div', { text: 'Info di bawah ini tidak ikut terkirim.' }));
    $('preview-modal').hidden = false;
  }

  async function uploadImage(file, input) {
    if (['image/jpeg', 'image/png', 'image/webp'].indexOf(file.type) === -1) {
      toast('Format gambar harus JPG, PNG, atau WebP.', 'error');
      input.value = '';
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast('Ukuran gambar maksimal 5MB.', 'error');
      input.value = '';
      return;
    }
    var form = new FormData();
    form.append('file', file);
    try {
      var result = await api('/upload', { method: 'POST', body: form });
      state.editorImagePath = result.file && result.file.path ? result.file.path : null;
      renderImagePreview(state.editorImagePath);
      toast('Gambar berhasil diunggah.', 'success');
    } catch (err) {
      toast(err.message, 'error');
      input.value = '';
    }
  }

  /* ------------------ Actions ------------------ */
  async function sendAnnouncement(id, button) {
    var item = announcementMatches(id);
    var ok = await askConfirm('Kirim pengumuman "' + (item ? item.title : id) + '" sekarang ke grup tujuan?');
    if (!ok) return;
    await withBusy(button, async function () {
      try {
        await api('/announcements/' + encodeURIComponent(id) + '/send', { method: 'POST', json: {} });
        $('editor-modal').hidden = true;
        await reload();
        toast('Pengiriman berhasil dimulai.', 'success');
      } catch (err) { toast(err.message, 'error'); }
    });
  }

  async function deleteAnnouncement(id, button) {
    var item = announcementMatches(id);
    var ok = await askConfirm('Hapus pengumuman "' + (item ? item.title : id) + '"? Tindakan ini tidak dapat dibatalkan.');
    if (!ok) return;
    await withBusy(button, async function () {
      try {
        await api('/announcements/' + encodeURIComponent(id), { method: 'DELETE' });
        await reload();
        toast('Pengumuman dihapus.', 'success');
      } catch (err) { toast(err.message, 'error'); }
    });
  }

  async function toggleAnnouncement(id, button) {
    var item = announcementMatches(id);
    if (!item) return;
    var active = Number(item.is_active) === 1 || item.status === 'active';
    await withBusy(button, async function () {
      try {
        await api('/announcements/' + encodeURIComponent(id), { method: 'PATCH',
          json: { is_active: active ? 0 : 1, status: active ? 'paused' : 'active' } });
        await reload();
        toast(active ? 'Pengumuman dijeda.' : 'Pengumuman diaktifkan.', 'success');
      } catch (err) { toast(err.message, 'error'); }
    });
  }

  async function retryRun(id, key, button) {
    await withBusy(button, async function () {
      try {
        await api('/announcements/' + encodeURIComponent(id) + '/retry', { method: 'POST', json: { runKey: key } });
        await reload();
        toast('Pengiriman ulang berhasil dimulai.', 'success');
      } catch (err) { toast(err.message, 'error'); }
    });
  }

  function resetTemplateForm() {
    $('template-id').value = '';
    $('template-name').value = '';
    $('template-body').value = '';
    $('template-submit').textContent = 'Simpan template';
    $('template-reset').hidden = true;
  }

  async function deleteTemplate(id, button) {
    var tpl = templateMatches(id);
    var ok = await askConfirm('Hapus template "' + (tpl ? tpl.name : id) + '"?');
    if (!ok) return;
    await withBusy(button, async function () {
      try {
        await api('/templates/' + encodeURIComponent(id), { method: 'DELETE' });
        resetTemplateForm();
        await reload();
        toast('Template dihapus.', 'success');
      } catch (err) { toast(err.message, 'error'); }
    });
  }

  /* ------------------ Events ------------------ */
  function switchTab(name) {
    Array.prototype.forEach.call(document.querySelectorAll('.tab'), function (tab) {
      tab.classList.toggle('active', tab.getAttribute('data-tab') === name);
    });
    Array.prototype.forEach.call(document.querySelectorAll('.tab-panel'), function (panel) {
      panel.hidden = panel.id !== 'tab-' + name;
    });
  }

  function bindEvents() {
    $('login-form').addEventListener('submit', async function (event) {
      event.preventDefault();
      var button = $('login-submit');
      var errorBox = $('login-error');
      errorBox.hidden = true;
      await withBusy(button, async function () {
        try {
          var result = await api('/auth/login', { method: 'POST', json: { password: $('login-password').value } });
          state.csrfToken = result.csrfToken || '';
          state.authed = true;
          $('login-password').value = '';
          showApp();
          await reload();
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
      state.bootstrap = null;
      showLogin();
      toast('Berhasil keluar.', 'info');
    });

    document.querySelector('.tabs').addEventListener('click', function (event) {
      var tab = event.target.closest('[data-tab]');
      if (tab) switchTab(tab.getAttribute('data-tab'));
    });

    $('new-ann-btn').addEventListener('click', function () { openEditor(null); });

    $('ann-search').addEventListener('input', function (event) {
      state.search = event.target.value.trim();
      renderAnnouncements();
    });
    $('ann-filter').addEventListener('change', function (event) {
      state.filter = event.target.value;
      renderAnnouncements();
    });

    $('f-mode').addEventListener('change', updateModeFields);
    $('f-all-groups').addEventListener('change', function (event) {
      Array.prototype.forEach.call($('f-groups').querySelectorAll('input[data-group]'), function (input) {
        input.checked = event.target.checked;
      });
    });
    $('f-image').addEventListener('change', function (event) {
      var file = event.target.files && event.target.files[0];
      if (file) uploadImage(file, event.target);
    });

    $('editor-form').addEventListener('submit', function (event) { event.preventDefault(); });
    $('template-form').addEventListener('submit', async function (event) {
      event.preventDefault();
      var id = $('template-id').value;
      var body = { name: $('template-name').value.trim(), body: $('template-body').value };
      if (!body.name) { toast('Nama template wajib diisi.', 'error'); return; }
      if (!body.body.trim()) { toast('Isi template wajib diisi.', 'error'); return; }
      await withBusy($('template-submit'), async function () {
        try {
          if (id) await api('/templates/' + encodeURIComponent(id), { method: 'PATCH', json: body });
          else await api('/templates', { method: 'POST', json: body });
          resetTemplateForm();
          await reload();
          toast(id ? 'Template diperbarui.' : 'Template disimpan.', 'success');
        } catch (err) { toast(err.message, 'error'); }
      });
    });
    $('template-reset').addEventListener('click', resetTemplateForm);

    $('confirm-ok').addEventListener('click', function () { settleConfirm(true); });

    document.addEventListener('click', async function (event) {
      var target = event.target.closest('[data-action]');
      if (!target) return;
      var action = target.getAttribute('data-action');
      var id = target.getAttribute('data-id') || '';

      if (action === 'refresh') {
        await withBusy(target, async function () {
          try { await reload(); toast('Data diperbarui.', 'info'); }
          catch (err) { toast(err.message, 'error'); }
        });
      } else if (action === 'close-editor') {
        $('editor-modal').hidden = true;
      } else if (action === 'preview-editor') {
        showPreview();
      } else if (action === 'save-draft') {
        await saveEditor(false, target);
      } else if (action === 'save-active') {
        await saveEditor(true, target);
      } else if (action === 'send-now') {
        if (!state.editId) { toast('Simpan pengumuman terlebih dahulu.', 'error'); return; }
        await sendAnnouncement(state.editId, target);
      } else if (action === 'close-preview') {
        $('preview-modal').hidden = true;
      } else if (action === 'confirm-cancel') {
        settleConfirm(false);
      } else if (action === 'edit-ann') {
        var item = announcementMatches(id);
        if (item) openEditor(item);
      } else if (action === 'delete-ann') {
        await deleteAnnouncement(id, target);
      } else if (action === 'send-ann') {
        await sendAnnouncement(id, target);
      } else if (action === 'toggle-ann') {
        await toggleAnnouncement(id, target);
      } else if (action === 'retry-run') {
        await retryRun(id, target.getAttribute('data-key') || '', target);
      } else if (action === 'edit-template') {
        var tpl = templateMatches(id);
        if (tpl) {
          $('template-id').value = tpl.id;
          $('template-name').value = tpl.name || '';
          $('template-body').value = tpl.body || '';
          $('template-submit').textContent = 'Perbarui template';
          $('template-reset').hidden = false;
          switchTab('templates');
          $('template-name').focus();
        }
      } else if (action === 'delete-template') {
        await deleteTemplate(id, target);
      } else if (action === 'use-template') {
        var source = templateMatches(id);
        if (source) {
          openEditor(null, source.body || '');
          toast('Isi template disalin ke editor.', 'success');
        }
      }
    });

    document.addEventListener('keydown', function (event) {
      if (event.key !== 'Escape') return;
      if (!$('confirm-modal').hidden) settleConfirm(false);
      else if (!$('preview-modal').hidden) $('preview-modal').hidden = true;
      else if (!$('editor-modal').hidden) $('editor-modal').hidden = true;
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
        await reload();
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
