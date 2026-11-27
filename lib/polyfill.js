// lib/polyfill.js — metode tambahan pada Array/String yang dipakai banyak fitur hasil porting (mis. [..].getRandom()).
'use strict'
const def = (proto, name, fn) => { if (!proto[name]) Object.defineProperty(proto, name, { value: fn, writable: true, configurable: true, enumerable: false }) }
def(Array.prototype, 'getRandom', function () { return this[Math.floor(Math.random() * this.length)] })
def(Array.prototype, 'pickRandom', function () { return this[Math.floor(Math.random() * this.length)] })
def(Array.prototype, 'random', function () { return this[Math.floor(Math.random() * this.length)] })
def(Array.prototype, 'shuffle', function () { const a = this.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]] } return a })
def(String.prototype, 'capitalize', function () { return this.charAt(0).toUpperCase() + this.slice(1) })
def(Number.prototype, 'toRupiah', function () { return 'Rp' + Number(this).toLocaleString('id-ID') })
