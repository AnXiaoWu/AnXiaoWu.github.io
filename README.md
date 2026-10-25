# my-5sing

仿 5sing 的移动端 H5 应用。技术栈：**Vue 3 + Vite + Vuex 4 + Vue Router 4 + Vant 4 + vue-i18n 9 + axios**。

## 环境要求

- Node.js >= 18

## 开发

```bash
npm install
npm run dev        # 启动开发服务器（默认 http://localhost:8080）
```

开发环境下接口通过 Vite 代理转发（见 `vite.config.js`）：

- `/mobile` → `http://mobileapi.5sing.kugou.com`
- `/search-api` → `https://5ssearch.kugou.com`（搜索接口，原 `search.5sing.kugou.com` 已 404）

## 构建

```bash
npm run build      # 输出到 dist/
npm run preview    # 本地预览构建产物
```

## 部署

推送到 `master` 分支会自动触发 GitHub Actions：构建 `dist` 并通过官方 artifact 方式部署到 GitHub Pages（Source 需为 `GitHub Actions` 模式）。

### 生产环境接口反代（重要）

线上站点是 https，而 5sing 接口无法被浏览器直连：

- `mobileapi.5sing.kugou.com`：证书为 `*.kugou.com` 通配符，**不匹配多级子域**，浏览器直接报证书错误（`ERR_CERT_COMMON_NAME_INVALID`）
- `5ssearch.kugou.com`：证书正常，但**不返回 CORS 头**，浏览器拦截跨域响应

因此生产环境必须有一层反代。最简便的免费方案是 Cloudflare Worker，代码已备好：`deploy/cors-proxy-worker.js`，复制到 Cloudflare Workers 部署即可（约 2 分钟，文件头部有详细步骤）。部署完成后把 `.env.production` 的两个地址改成你的 Worker 域名：

```bash
VITE_API_BASE=https://<worker域名>        # /mobile/* 会被转发到 mobileapi
VITE_SEARCH_API_BASE=https://<worker域名> # /search-api/* 会被转发到 5ssearch
```

> 开发环境（`npm run dev`）不受影响，接口走 Vite 本地代理，功能完整。
> 注意：GitHub Pages 只托管静态文件，无法自身做反向代理，所以这一步绕不开。

## 目录结构

```
src/
├── api/            # 统一接口层（axios 实例 + 接口函数）
├── assets/         # 静态资源 / 多语言
├── components/
│   ├── common/     # JzLoading / JzFail / JzLoadmore
│   ├── home/       # 首页拆分子组件
│   └── player/     # 播放器
├── config/         # i18n / 移动端适配 / 播放模式常量
├── routers/        # 路由（hash 模式）
├── store/          # Vuex（home / playr 模块）
├── utils/          # 工具函数（数字格式化 / 歌词解析）
└── views/          # 页面
```

## 说明

- 接口文档见 `接口文档.md`（5sing 开放接口，仅作学习参考）。
- 生产环境默认直连 5sing 接口（`.env.production`），https 站点会遇到混合内容拦截，需要自建代理。
- 搜索接口（`5ssearch.kugou.com`）不返回 CORS 头，https 站点直连同样会被浏览器拦截，需要自建反代并把 `VITE_SEARCH_API_BASE` 改成同源代理路径。
- 已知失效接口（截至 2026-10）：`songlist/hotIp`（返回空，已改用 `song/GetRecommend`）、`other/getAdvert?advert_id=48`（返回空，仅 23/25/26 各有 1 条）、`service.5sing.kugou.com/h5/*` 与 `search.5sing.kugou.com`（整域 404）、`complex/GetSetWeekRankingList`（code=99999）。可用 `node scripts/api-health.mjs` 随时复测（需 dev server 运行中）。

## 冒烟测试（可选）

`scripts/smoke-test.mjs` 会用无头浏览器打开各个页面，验证渲染、接口数据与图片加载；`scripts/smoke-player.mjs` 专项测试播放页；`scripts/smoke-search.mjs` 专项测试搜索页；`scripts/smoke-songlist.mjs` 专项测试歌单详情页。使用前安装：

```bash
npm i -D playwright
npx playwright install chromium
node scripts/smoke-test.mjs
node scripts/smoke-player.mjs
node scripts/smoke-search.mjs
node scripts/smoke-songlist.mjs
```
