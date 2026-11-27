'use strict'
Object.defineProperty(exports, "__esModule", { value: true });
const __vxDef = (m) => (m && m.__esModule ? m.default : m);
const __vxExports = {};
const axios = __vxDef(require("axios"));
const config = __vxDef(require("../../config.e7.js"));

function getConfig() {
  return config?.pakasir || {};
}

function isEnabled() {
  const c = getConfig();
  return Boolean(c.enabled && (c.apiKey || c.slug || c.project));
}

async function cancelTransaction(orderId, amount) {
  const c = getConfig();
  if (!isEnabled()) return { success: false, disabled: true };
  if (!c.cancelUrl) return { success: false, unsupported: true };
  const response = await axios.post(c.cancelUrl, { orderId, amount }, {
    timeout: Number(c.timeout) || 15000,
    headers: c.apiKey ? { Authorization: `Bearer ${c.apiKey}` } : undefined,
  });
  return response.data;
}

async function simulatePayment(orderId, amount) {
  const c = getConfig();
  if (!c.sandbox) return { success: false, sandbox: false };
  if (!c.simulateUrl) return { success: true, simulated: true, orderId, amount };
  const response = await axios.post(c.simulateUrl, { orderId, amount }, {
    timeout: Number(c.timeout) || 15000,
    headers: c.apiKey ? { Authorization: `Bearer ${c.apiKey}` } : undefined,
  });
  return response.data;
}

const __vxDefault = { isEnabled, cancelTransaction, simulatePayment };


Object.defineProperty(__vxExports, "default", { enumerable: true, get: () => __vxDefault });
Object.defineProperty(__vxExports, "isEnabled", { enumerable: true, get: () => isEnabled });
Object.defineProperty(__vxExports, "cancelTransaction", { enumerable: true, get: () => cancelTransaction });
Object.defineProperty(__vxExports, "simulatePayment", { enumerable: true, get: () => simulatePayment });
Object.defineProperties(exports, Object.getOwnPropertyDescriptors(__vxExports));
