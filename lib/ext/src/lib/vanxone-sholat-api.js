'use strict'
Object.defineProperty(exports, "__esModule", { value: true });
const __vxDef = (m) => (m && m.__esModule ? m.default : m);
const __vxExports = {};
const axios = __vxDef(require("axios"));
const NodeCache = __vxDef(require("node-cache"));
const BASE_URL = 'https://api.myquran.com/v2/sholat';
const cache = new NodeCache({ stdTTL: 86400 });

async function searchKota(query) {
    const key = `kota_${query.toLowerCase()}`;
    const cached = cache.get(key);
    if (cached) return cached;

    const { data } = await axios.get(`${BASE_URL}/kota/cari/${encodeURIComponent(query)}`, { timeout: 10000 });
    if (data?.status && Array.isArray(data.data) && data.data.length > 0) {
        const result = data.data[0];
        cache.set(key, result);
        return result;
    }
    return null;
}

async function fetchAllKota() {
    const cached = cache.get('all_kota');
    if (cached) return cached;

    const { data } = await axios.get(`${BASE_URL}/kota/semua`, { timeout: 15000 });
    if (data?.status && Array.isArray(data.data)) {
        cache.set('all_kota', data.data);
        return data.data;
    }
    throw new Error('Gagal mengambil daftar kota');
}

async function getTodaySchedule(kotaId) {
    const now = new Date(new Date().toLocaleString('en-US', { timeZone: 'Asia/Jakarta' }));
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');

    const key = `jadwal_${kotaId}_${year}_${month}_${day}`;
    const cached = cache.get(key);
    if (cached) return cached;

    const { data } = await axios.get(`${BASE_URL}/jadwal/${kotaId}/${year}/${month}/${day}`, { timeout: 10000 });
    if (data?.status && data.data) {
        cache.set(key, data.data);
        return data.data;
    }
    throw new Error('Gagal mengambil jadwal sholat');
}

function extractPrayerTimes(jadwalData) {
    const j = jadwalData.jadwal || jadwalData;
    return {
        imsak: j.imsak || '-',
        subuh: j.subuh || '-',
        terbit: j.terbit || '-',
        dhuha: j.dhuha || '-',
        dzuhur: j.dzuhur || '-',
        ashar: j.ashar || '-',
        maghrib: j.maghrib || '-',
        isya: j.isya || '-'
    };
}

function clearCache() {
    cache.flushAll();
}


Object.defineProperty(__vxExports, "searchKota", { enumerable: true, get: () => searchKota });
Object.defineProperty(__vxExports, "fetchAllKota", { enumerable: true, get: () => fetchAllKota });
Object.defineProperty(__vxExports, "getTodaySchedule", { enumerable: true, get: () => getTodaySchedule });
Object.defineProperty(__vxExports, "extractPrayerTimes", { enumerable: true, get: () => extractPrayerTimes });
Object.defineProperty(__vxExports, "clearCache", { enumerable: true, get: () => clearCache });
Object.defineProperties(exports, Object.getOwnPropertyDescriptors(__vxExports));
