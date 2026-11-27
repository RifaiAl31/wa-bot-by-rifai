// Pencatat transaksi sewa, donasi, dan layanan pembayaran.

import { onDbChange } from '../db/database.js'

const MAX_INCOMING = 20000
const MAX_EVENTS = 20000
const MAX_DONOR_LIST = 500
const WIB = 7 * 36e5
const dayOf = (t) => new Date(t + WIB).toISOString().slice(0, 10)
const numOf = (jid) => String(jid || '').split('@')[0].split(':')[0]
const PAID = 'done'

function ensure(db) {
    const l = (db.ledger ||= {})
    l.seq ||= 0
    l.totals ||= { transaksi: 0, lunas: 0, omset: 0, byKind: {} }
    l.daily ||= {}
    l.transactions ||= {}
    l.index ||= {}
    l.customers ||= {}
    l.donors ||= {}
    l.incoming ||= {}
    l.products ||= {}
    l.rentals ||= {}
    l.events ||= []
    return l
}

// ───────── bentuk seragam dari tiap sumber ─────────
const SOURCES = {
    sewa: {
        items: (db) => Object.values(db.sewa?.orders || {}),
        map: (o) => ({
            ref: o.id, product: o.plan, name: `Sewa ${o.planName || ''}`.trim(), buyer: o.buyer, chat: o.group,
            price: o.price, unique: o.unique, total: o.total, status: o.status,
            via: o.paidVia || (o.proofAt ? 'qris-manual' : (o.gw ? 'gopay-auto' : 'qris')),
            gwRef: o.gw?.ref, gwTx: o.txId, note: o.note,
            extra: { group: o.group, groupName: o.groupName, days: o.days },
            createdAt: o.createdAt, paidAt: o.doneAt || null
        })
    },
    donate: {
        items: (db) => Object.values(db.merchant?.donations || {}),
        map: (o) => ({
            ref: o.id, product: 'donasi', name: 'Donasi', buyer: o.buyer, chat: o.chat,
            price: o.price ?? o.total, unique: o.unique, total: o.total, status: o.status,
            via: o.paidVia || 'gopay-auto', gwRef: o.gw?.ref, gwTx: o.txId, note: o.note,
            extra: { donorName: o.name },
            createdAt: o.createdAt, paidAt: o.paidAt || null
        })
    },
    sociabuzz: {
        items: (db) => Object.values(db.sociabuzz?.trx || {}),
        map: (o) => ({
            ref: o.id, product: 'sociabuzz', name: `Sociabuzz ${String(o.method || '').toUpperCase()}`.trim(),
            buyer: o.sender, chat: o.chat, price: o.amount, fee: o.fee, total: o.total,
            status: o.status || (o.paid ? PAID : 'pending'),
            via: `sociabuzz-${o.method || ''}`, gwRef: o.order_id, note: o.payment?.account_number ? `VA ${o.payment.bank || ''}` : undefined,
            createdAt: Date.parse(o.created) || Date.now(), paidAt: o.paidAt || null
        })
    },
}

const clean = (o) => { for (const k of Object.keys(o)) if (o[k] === undefined || o[k] === null || o[k] === '') delete o[k]; return o }

function bump(l, kind, tx) {
    const t = l.totals
    t.lunas++
    t.omset += Number(tx.total) || 0
    const bk = (t.byKind[kind] ||= { n: 0, omset: 0 })
    bk.n++; bk.omset += Number(tx.total) || 0

    const d = (l.daily[dayOf(tx.paidAt || Date.now())] ||= { n: 0, omset: 0, byKind: {} })
    d.n++; d.omset += Number(tx.total) || 0
    const dk = (d.byKind[kind] ||= { n: 0, omset: 0 })
    dk.n++; dk.omset += Number(tx.total) || 0
}

function touchCustomer(l, kind, tx, event) {
    const n = numOf(tx.buyer)
    if (!n) return
    const c = (l.customers[n] ||= { jid: tx.buyer, orders: 0, paid: 0, spent: 0, firstAt: tx.createdAt, lastAt: tx.createdAt, byKind: {} })
    const bk = (c.byKind[kind] ||= { orders: 0, paid: 0, spent: 0 })
    if (event === 'new') { c.orders++; bk.orders++ }
    if (event === 'paid') {
        c.paid++; c.spent += Number(tx.total) || 0; bk.paid++; bk.spent += Number(tx.total) || 0
        c.lastAt = tx.paidAt || Date.now()
    }
    c.firstAt = Math.min(c.firstAt || tx.createdAt, tx.createdAt || c.firstAt)
}

function touchDonor(l, tx) {
    const n = numOf(tx.buyer)
    if (!n) return
    const d = (l.donors[n] ||= { jid: tx.buyer, name: '', count: 0, total: 0, firstAt: tx.paidAt || Date.now(), lastAt: 0, lastNote: '' })
    d.count++
    d.total += Number(tx.total) || 0
    d.lastAt = tx.paidAt || Date.now()
    if (tx.extra?.donorName) d.name = tx.extra.donorName
    if (tx.note) d.lastNote = String(tx.note).slice(0, 100)
    // riwayat tiap donasi per donatur (permanen walau data donasi asli dibersihkan)
    const list = (d.list ||= [])
    list.push(clean({ id: tx.ref, total: Number(tx.total) || 0, at: tx.paidAt || Date.now(), note: tx.note ? String(tx.note).slice(0, 100) : undefined }))
    if (list.length > MAX_DONOR_LIST) list.splice(0, list.length - MAX_DONOR_LIST)
}

// ───────── sinkron data sewa ─────────
function logEvent(l, type, ref, data = {}) {
    l.events.push(clean({ at: Date.now(), type, ref, ...data }))
    if (l.events.length > MAX_EVENTS) l.events.splice(0, l.events.length - MAX_EVENTS)
}

function syncRentals(db, l) {
    let changed = false
    const now = Date.now()

    // sewa grup
    const rentals = db.sewa?.rentals || {}
    for (const [jid, rent] of Object.entries(rentals)) {
        if (!rent || typeof rent !== 'object') continue
        const json = JSON.stringify(rent)
        let r = l.rentals[jid]
        if (!r) {
            l.rentals[jid] = { jid, snapshot: rent, snapJson: json, firstAt: now, updatedAt: now }
            logEvent(l, 'rental_set', jid, { until: rent.until ?? null })
            changed = true
        } else if (r.snapJson !== json || r.removedAt) {
            if (r.removedAt) delete r.removedAt
            logEvent(l, 'rental_update', jid, { until: rent.until ?? null, diff: diffKeys(r.snapshot, rent) })
            r.snapshot = rent; r.snapJson = json; r.updatedAt = now
            changed = true
        }
    }
    for (const [jid, r] of Object.entries(l.rentals)) {
        if (rentals[jid] || r.removedAt) continue
        r.removedAt = now
        logEvent(l, 'rental_remove', jid)
        changed = true
    }
    return changed
}

// ───────── sinkron ─────────
export function syncLedger(db = global.kdb) {
    if (!db) return false
    const l = ensure(db)
    let changed = false
    const now = Date.now()

    for (const [kind, src] of Object.entries(SOURCES)) {
        for (const raw of src.items(db)) {
            if (!raw?.id) continue
            const m = clean(src.map(raw))
            const key = `${kind}:${m.ref}`
            const sig = `${m.status}|${m.paidAt || ''}|${m.total || ''}|${m.extra?.item ? 1 : 0}`
            let id = l.index[key]
            let tx = id && l.transactions[id]

            if (!tx) {
                id = `TX-${String(++l.seq).padStart(6, '0')}`
                tx = { id, kind, ...m, history: [{ at: m.createdAt || now, status: 'pending' }], counted: false }
                if (m.status !== 'pending') tx.history.push({ at: m.paidAt || now, status: m.status })
                tx.sig = sig
                l.index[key] = id
                l.transactions[id] = tx
                l.totals.transaksi++
                touchCustomer(l, kind, tx, 'new')
                changed = true
            } else if (tx.sig !== sig) {
                const prev = tx.status
                Object.assign(tx, m)
                if (prev !== m.status) tx.history.push({ at: m.paidAt || now, status: m.status })
                tx.sig = sig
                changed = true
            } else continue

            if (tx.status === PAID && !tx.counted) {
                tx.counted = true
                tx.paidAt = tx.paidAt || now
                bump(l, kind, tx)
                touchCustomer(l, kind, tx, 'paid')
                if (kind === 'donate') touchDonor(l, tx)
                changed = true
            }
        }
    }
    if (syncRentals(db, l)) changed = true
    return changed
}

/** Catat uang masuk dari gateway (terkait order atau tidak). Dipanggil dari lib/store/merchant.js. */
export function logIncoming(tx, match = null) {
    if (!global.kdb || !tx?.id) return
    const l = ensure(global.kdb)
    if (l.incoming[tx.id]) {
        if (match && !l.incoming[tx.id].ref) Object.assign(l.incoming[tx.id], { kind: match.kind, ref: match.ref })
        return
    }
    l.incoming[tx.id] = clean({ id: tx.id, amount: tx.amount, at: tx.ts, type: tx.type, status: tx.status, seenAt: Date.now(), kind: match?.kind, ref: match?.ref })
    const ids = Object.keys(l.incoming)
    if (ids.length > MAX_INCOMING) {
        for (const k of ids.sort((a, b) => (l.incoming[a].at || 0) - (l.incoming[b].at || 0)).slice(0, ids.length - MAX_INCOMING)) delete l.incoming[k]
    }
}

/** Rekap singkat untuk dipakai command/laporan. */
export function ledgerSummary(db = global.kdb) {
    const l = ensure(db)
    const today = dayOf(Date.now())
    return { ...l.totals, hariIni: l.daily[today] || { n: 0, omset: 0, byKind: {} }, pelanggan: Object.keys(l.customers).length, donatur: Object.keys(l.donors).length }
}

onDbChange((db) => syncLedger(db))
