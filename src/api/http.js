import axios from 'axios'

/**
 * 统一 axios 实例。
 * baseURL 来自环境变量：
 *  - 开发环境：/mobile（由 vite.config.js 代理到 mobileapi.5sing.kugou.com）
 *  - 生产环境：https://mobileapi.5sing.kugou.com（直连）
 */
const http = axios.create({
  baseURL: import.meta.env.VITE_API_BASE || '/mobile',
  timeout: 15000,
})

http.interceptors.response.use(
  (res) => res,
  (error) => {
    // 统一错误提示，避免每个页面重复 catch
    const msg =
      error.code === 'ECONNABORTED'
        ? '请求超时，请检查网络'
        : error.response
          ? `请求失败(${error.response.status})`
          : '网络异常，请稍后重试'
    error.message = msg
    return Promise.reject(error)
  }
)

/**
 * 搜索服务实例（独立域名 5ssearch.kugou.com）。
 * baseURL 来自环境变量：
 *  - 开发环境：/search-api（由 vite.config.js 代理到 https://5ssearch.kugou.com）
 *  - 生产环境：https://5ssearch.kugou.com（该接口无 CORS 头，https 站点需自建反代）
 */
const searchHttp = axios.create({
  baseURL: import.meta.env.VITE_SEARCH_API_BASE || '/search-api',
  timeout: 15000,
})

searchHttp.interceptors.response.use(
  (res) => res,
  (error) => {
    const msg =
      error.code === 'ECONNABORTED'
        ? '请求超时，请检查网络'
        : error.response
          ? `请求失败(${error.response.status})`
          : '网络异常，请稍后重试'
    error.message = msg
    return Promise.reject(error)
  }
)

export { http, searchHttp }
