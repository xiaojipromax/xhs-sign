# xhs-sign

小红书 X-S 签名逆向，纯 Node.js 实现，可直接 `require()` 集成到爬虫或 API 调用中。

## 签名流程

1. 用 `mnsv2` 签名函数对 `urlPath + data` 生成短码
2. 组装 4 个 payload 字段（x0 版本 / x1 平台 / x2 OS / x3 签名码 / x4 类型）
3. payload 先 `encodeURIComponent` 再自定义 Base64 编码
4. 返回 `XYS_` 前缀的签名字符串

## 文件

| 文件 | 说明 |
|------|------|
| `xhs.js` | 签名入口，`getXS(urlPath, data)` 返回 X-S 头 |
| `env.js` | 浏览器环境模拟（`window`、`document`、`navigator` 等） |
| `code.js` | mnsv2 虚拟机的 code 段 |
| `data.js` | mnsv2 虚拟机的 data 段 |

> code.js 和 data.js 还原自混淆后的 JSVM，非原始源码，用于分析学习。

## 用法

### 参数从哪来

打开浏览器 DevTools → Network，筛选 XHR/Fetch，随便点一个小红书接口，复制 **URL 路径**（`/api/` 开头那截）和 **请求体 JSON**。这两个就是 `urlPath` 和 `data`。

### 直接跑 xhs.js

```bash
npm install crypto-js

# 默认示例（推荐页，参数固定写死在代码里）
node xhs.js

# 换成你自己的参数：node xhs.js <接口路径> <请求体JSON>
node xhs.js '/api/sns/web/v1/note/detail' '{"note_id":"66abc123000000001a01e5f5"}'
node xhs.js '/api/sns/web/v1/comment/list' '{"note_id":"66abc123000000001a01e5f5","cursor":""}'
```

- **输入**：接口路径 + 请求体 JSON（直接从浏览器复制就行，不用改格式）
- **输出**：终端打印 `XYS_` 开头的加密签名串，粘到请求头 `X-S` 字段即可

### 作为模块引用

```js
const { getXS } = require('./xhs.js');
const xs = getXS('/api/sns/web/v1/homefeed', JSON.stringify(data));
fetch('https://edith.xiaohongshu.com/api/sns/web/v1/homefeed', {
    headers: { 'X-S': xs }
});
```

## 环境

- Node.js 16+
- crypto-js（MD5 用，核心 HMAC-SHA256 走 window 下注入的 crypto）

## 注意

- `env.js` 里的 Cookie 是真实值示例，替换成你自己的即可使用（浏览器 F12 → Application → Cookies 复制）
- 仅供学习研究，请遵守平台使用协议
