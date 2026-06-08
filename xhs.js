/**
 * 小红书 X-S 签名逆向
 * =====================
 * 用法:
 *   node xhs.js                              # 测试签名
 *   node xhs.js '/api/xxx' '{"key":"val"}'   # 指定路径和数据
 *
 * 依赖: npm install crypto-js
 */
require('./env.js');
require('./code.js');
require('./data.js');
const CryptoJS = require('crypto-js');

// 自定义 Base64 字符表
const B64 = [
    "Z","m","s","e","r","b","B","o","H","Q","t","N","P","+","w","O",
    "c","z","a","/","L","p","n","g","G","8","y","J","q","4","2","K",
    "W","Y","j","0","D","S","f","d","i","k","x","3","V","T","1","6",
    "I","l","U","A","F","M","9","7","h","E","C","v","u","R","X","5"
];

function tripletToBase64(e) {
    return B64[e >> 18 & 63] + B64[e >> 12 & 63] + B64[e >> 6 & 63] + B64[63 & e];
}

function encodeChunk(e, r, a) {
    for (var c, d = [], s = r; s < a; s += 3)
        c = (e[s] << 16 & 0xff0000) + (e[s + 1] << 8 & 65280) + (255 & e[s + 2]),
        d.push(tripletToBase64(c));
    return d.join("");
}

function encodeUtf8(e) {
    for (var r = encodeURIComponent(e), a = [], c = 0; c < r.length; c++) {
        var d = r.charAt(c);
        if ("%" === d) {
            var s = parseInt(r.charAt(c + 1) + r.charAt(c + 2), 16);
            a.push(s), c += 2;
        } else a.push(d.charCodeAt(0));
    }
    return a;
}

function b64Encode(e) {
    for (var r, a = e.length, d = a % 3, s = [], u = 16383, f = 0, l = a - d; f < l; f += u)
        s.push(encodeChunk(e, f, f + u > l ? l : f + u));
    return 1 === d ? (r = e[a - 1],
    s.push(B64[r >> 2] + B64[r << 4 & 63] + "==")) : 2 === d && (r = (e[a - 2] << 8) + e[a - 1],
    s.push(B64[r >> 10] + B64[r >> 4 & 63] + B64[r << 2 & 63] + "=")),
    s.join("");
}

function getXS(urlPath, data) {
    let combined = urlPath + data;
    let u = window.mnsv2(combined, CryptoJS.MD5(combined).toString(), CryptoJS.MD5(urlPath).toString());
    let payload = {
        x0: '4.3.0',
        x1: "xhs-pc-web",
        x2: "Windows",
        x3: u,
        x4: 'object'
    };
    return "XYS_" + b64Encode(encodeUtf8(JSON.stringify(payload)));
}

if (require.main === module) {
    let args = process.argv.slice(2);
    let path = args[0] || '/api/sns/web/v1/homefeed';
    let data = args[1] || '{"cursor_score":"1.7686467959220057E9","num":20,"refresh_type":3,"note_index":0,"unread_begin_note_id":"","unread_end_note_id":"","unread_note_count":0,"category":"homefeed_recommend","search_key":"","need_num":6,"image_formats":["jpg","webp","avif"],"need_filter_image":false}';
    process.stdout.write(getXS(path, data) + '\n');
}

module.exports = { getXS };
