/**
 * 5sing 接口 CORS 反代（Cloudflare Worker）
 *
 * 背景：GitHub Pages 是 https 站点，而
 *   - mobileapi.5sing.kugou.com  证书是 *.kugou.com，不匹配多级子域，浏览器直接报证书错误
 *   - 5ssearch.kugou.com         证书没问题，但不返回 CORS 头，浏览器照样拦截
 * 所以需要一层同源（或放行 CORS）的反代。
 *
 * 部署（免费套餐即可，约 2 分钟）：
 *   1. 登录 https://dash.cloudflare.com → Workers & Pages → Create Worker
 *   2. 把本文件全部内容粘贴进编辑器，Deploy
 *   3. 记下 Worker 域名，例如 https://xxx.你的子域.workers.dev
 *   4. 在仓库根目录执行（二选一）：
 *      - 直接用 workers.dev 域名：
 *          .env.production 中 VITE_API_BASE=https://<worker域名>
 *                          VITE_SEARCH_API_BASE=https://<worker域名>
 *      - 或给 Worker 绑定自定义子域（如 api.你的域名.com），再用该域名
 *
 * 路由约定（与前端 .env.production 对应）：
 *   <worker>/mobile/xxx      -> http://mobileapi.5sing.kugou.com/xxx
 *   <worker>/search-api/xxx  -> https://5ssearch.kugou.com/xxx
 */

const UPSTREAM = {
  '/mobile': 'http://mobileapi.5sing.kugou.com',
  '/search-api': 'https://5ssearch.kugou.com',
}

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET,HEAD,OPTIONS',
  'Access-Control-Allow-Headers': '*',
  'Access-Control-Max-Age': '86400',
}

export default {
  async fetch(request) {
    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: CORS_HEADERS })
    }

    const url = new URL(request.url)
    const prefix = Object.keys(UPSTREAM).find((p) => url.pathname.startsWith(p))
    if (!prefix) {
      return new Response(JSON.stringify({ message: 'unknown route' }), {
        status: 404,
        headers: { 'content-type': 'application/json', ...CORS_HEADERS },
      })
    }

    const target = new URL(UPSTREAM[prefix] + url.pathname.slice(prefix.length) + url.search)

    const upstream = await fetch(target, {
      method: request.method,
      headers: {
        // 只透传必要的头，避免把 Cloudflare 的内部头带给上游
        'user-agent': request.headers.get('user-agent') || '',
        accept: request.headers.get('accept') || '*/*',
      },
    })

    const response = new Response(upstream.body, upstream)
    Object.entries(CORS_HEADERS).forEach(([k, v]) => response.headers.set(k, v))
    return response
  },
}
