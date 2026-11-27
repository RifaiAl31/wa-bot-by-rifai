'use strict'
Object.defineProperty(exports, "__esModule", { value: true });
const __vxExports = {};
// Lightweight order store/poller used by the Store plugins.
// Orders are kept in memory for the current bot process. The public API is
// intentionally small so existing Store plugins can use it without requiring
// an external database or payment service.

const orders = new Map();
let pollerTimer = null;

function normalizeId(orderId) {
  return String(orderId || '').trim().toUpperCase();
}

function cloneOrder(order) {
  return order ? { ...order, items: Array.isArray(order.items) ? order.items.map((item) => ({ ...item })) : order.items } : null;
}

function createOrder(orderId, data = {}) {
  const id = normalizeId(orderId || data.orderId);
  if (!id) throw new Error('orderId is required');
  const now = new Date().toISOString();
  const order = {
    ...data,
    orderId: id,
    createdAt: data.createdAt || now,
    updatedAt: now,
    status: data.status || 'pending',
  };
  orders.set(id, order);
  return cloneOrder(order);
}

function getOrder(orderId) {
  return cloneOrder(orders.get(normalizeId(orderId)));
}

function updateOrder(orderId, patch = {}) {
  const id = normalizeId(orderId);
  const current = orders.get(id);
  if (!current) return null;
  const updated = { ...current, ...patch, orderId: id, updatedAt: new Date().toISOString() };
  orders.set(id, updated);
  return cloneOrder(updated);
}

function deleteOrder(orderId) {
  return orders.delete(normalizeId(orderId));
}

function getAllOrders() {
  return Array.from(orders.values(), cloneOrder);
}

function getOrdersByGroup(groupId) {
  return getAllOrders().filter((order) => order.groupId === groupId);
}

function getOrdersByBuyer(buyerJid) {
  return getAllOrders().filter((order) => order.buyerJid === buyerJid);
}

function cleanupExpired(maxAgeMs = 24 * 60 * 60 * 1000) {
  const cutoff = Date.now() - maxAgeMs;
  for (const [id, order] of orders) {
    const created = Date.parse(order.createdAt || '');
    if (Number.isFinite(created) && created < cutoff && !['completed', 'cancelled'].includes(order.status)) {
      orders.set(id, { ...order, status: 'expired', updatedAt: new Date().toISOString() });
    }
  }
}

function startOrderPoller(sock = null, intervalMs = 60_000) {
  if (pollerTimer) return pollerTimer;
  pollerTimer = setInterval(() => cleanupExpired(), intervalMs);
  pollerTimer.unref?.();
  return pollerTimer;
}

function stopOrderPoller() {
  if (pollerTimer) clearInterval(pollerTimer);
  pollerTimer = null;
}

const __vxDefault = {
  createOrder,
  getOrder,
  updateOrder,
  deleteOrder,
  getAllOrders,
  getOrdersByGroup,
  getOrdersByBuyer,
  cleanupExpired,
  startOrderPoller,
  stopOrderPoller,
};



Object.defineProperty(__vxExports, "default", { enumerable: true, get: () => __vxDefault });
Object.defineProperty(__vxExports, "createOrder", { enumerable: true, get: () => createOrder });
Object.defineProperty(__vxExports, "getOrder", { enumerable: true, get: () => getOrder });
Object.defineProperty(__vxExports, "updateOrder", { enumerable: true, get: () => updateOrder });
Object.defineProperty(__vxExports, "deleteOrder", { enumerable: true, get: () => deleteOrder });
Object.defineProperty(__vxExports, "getAllOrders", { enumerable: true, get: () => getAllOrders });
Object.defineProperty(__vxExports, "getOrdersByGroup", { enumerable: true, get: () => getOrdersByGroup });
Object.defineProperty(__vxExports, "getOrdersByBuyer", { enumerable: true, get: () => getOrdersByBuyer });
Object.defineProperty(__vxExports, "cleanupExpired", { enumerable: true, get: () => cleanupExpired });
Object.defineProperty(__vxExports, "startOrderPoller", { enumerable: true, get: () => startOrderPoller });
Object.defineProperty(__vxExports, "stopOrderPoller", { enumerable: true, get: () => stopOrderPoller });
Object.defineProperties(exports, Object.getOwnPropertyDescriptors(__vxExports));
