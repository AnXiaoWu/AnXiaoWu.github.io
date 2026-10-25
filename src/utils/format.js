/**
 * 数字超过 1 万时转换为「x.x万」格式
 * （原 main.js 中的全局 filter，Vue 3 已移除 filter，改为工具函数）
 */
export function znum(value, n = 0) {
  if (value == null || value === '') return value
  const num = Number(value)
  if (Number.isNaN(num)) return value
  if (num >= 10000) {
    const digits = n + 1
    const str = (num / 10000).toFixed(digits)
    return str.substring(0, str.indexOf('.') + digits) + '万'
  }
  return num
}

/** 过滤数组中的 undefined 元素 */
export function arrayk(value) {
  if (!Array.isArray(value)) return value
  return value.filter((item) => item !== undefined)
}

/** 秒数格式化为 mm:ss */
export function formatTime(seconds) {
  const s = Math.floor(Number(seconds) || 0)
  const m = Math.floor(s / 60)
  const sec = s % 60
  return `${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`
}
