'use strict'
Object.defineProperty(exports, "__esModule", { value: true });
const __vxDef = (m) => (m && m.__esModule ? m.default : m);
const __vxExports = {};
/*
# Name : Preset AlightMotion Finder
# Type : ESM
# Url : https://bintangapi.my.id
*/

const axios = __vxDef(require("axios"));

async function amfind(url) {
    const { data } = await axios.get(
        'https://bintangapi.my.id/api/amfind/',
        {
            params: { url },
            headers: {
                Accept: '*/*',
                'Accept-Language': 'id-ID,id;q=0.9,en-US;q=0.8,en;q=0.7',
                Connection: 'keep-alive',
                Origin: 'https://starlabs.biz.id',
                Referer: 'https://starlabs.biz.id/',
                'Sec-Fetch-Dest': 'empty',
                'Sec-Fetch-Mode': 'cors',
                'Sec-Fetch-Site': 'cross-site',
                'User-Agent': 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Mobile Safari/537.36',
            },
            timeout: 30000
        }
    )

    if (!data?.success || !data?.data) {
        throw new Error('Preset tidak ditemukan.')
    }

    return data.data
}

const __vxDefault = amfind

Object.defineProperty(__vxExports, "amfind", { enumerable: true, get: () => amfind });
Object.defineProperty(__vxExports, "default", { enumerable: true, get: () => __vxDefault });
Object.defineProperties(exports, Object.getOwnPropertyDescriptors(__vxExports));
