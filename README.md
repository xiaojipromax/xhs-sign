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

```bash
# 安装依赖
npm install crypto-js

# 测试默认接口签名
node xhs.js

# 指定接口路径和参数
node xhs.js '/api/sns/web/v1/note/detail' '{"note_id":"xxx"}'
```

```js
// 作为模块引用
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

- Cookie 等隐私字段已替换为 placeholder，使用时替换回真实值
- 仅供学习研究，请遵守平台使用协议
