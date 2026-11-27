// lib/vanxone.js — data fitur owner hasil porting WhatsApp Bot: user premium & grup "bypass mode self"
'use strict'
const { createStore } = require("../store.js")

const store = createStore('WhatsApp Bot', { bypass: [] })

const isBypass = (gid) => store.data.bypass.includes(gid)
function setBypass(gid, on) {
  const has = isBypass(gid)
  if (on === has) return false
  if (on) store.data.bypass.push(gid)
  else store.data.bypass.splice(store.data.bypass.indexOf(gid), 1)
  store.save()
  return true
}

const listBypass = () => [...store.data.bypass]

module.exports = { listBypass, isBypass, setBypass }
