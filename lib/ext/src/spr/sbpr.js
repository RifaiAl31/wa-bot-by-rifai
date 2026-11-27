'use strict'
Object.defineProperty(exports, "__esModule", { value: true });
const __vxExports = {};
// Jembatan ke lib/privrelay.js (modul relay privat WhatsApp Bot)
const { createRequire } = require("node:module");
const m = require('../../../../lib/privrelay.js')
const sendBatchPrivateRelay = m.sendBatchPrivateRelay
const sendBatchPrivateRelayUnified = m.sendBatchPrivateRelayUnified

Object.defineProperty(__vxExports, "sendBatchPrivateRelay", { enumerable: true, get: () => sendBatchPrivateRelay });
Object.defineProperty(__vxExports, "sendBatchPrivateRelayUnified", { enumerable: true, get: () => sendBatchPrivateRelayUnified });
Object.defineProperties(exports, Object.getOwnPropertyDescriptors(__vxExports));
