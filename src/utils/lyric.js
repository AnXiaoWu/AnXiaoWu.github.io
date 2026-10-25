const TIME_RE = /\[(\d{1,2}):(\d{1,2})(?:[.:](\d{1,3}))?\]/g

/**
 * 解析歌词（兼容 LRC 带时间戳与纯文本两种格式）
 * @param {string} lrc 如 "[00:12.34]第一句\n第二句" 或纯文本歌词
 * @returns {{time: number|null, text: string}[]} time 为 null 表示无时间戳的纯文本行
 */
export function parseLyric(lrc) {
  if (!lrc || typeof lrc !== 'string') return []
  const lines = []
  lrc.split(/\r?\n/).forEach((row) => {
    const re = new RegExp(TIME_RE.source, 'g')
    const times = []
    let match
    while ((match = re.exec(row)) !== null) {
      const min = Number(match[1])
      const sec = Number(match[2])
      const ms = match[3] ? Number((match[3] + '00').slice(0, 3)) / 1000 : 0
      times.push(min * 60 + sec + ms)
    }
    const text = row.replace(re, '').trim()
    if (!text) return
    if (times.length) {
      times.forEach((time) => lines.push({ time, text }))
    } else {
      // 无时间戳的纯文本行（部分接口只返回纯文本歌词）
      lines.push({ time: null, text })
    }
  })
  return lines
}

/**
 * 根据当前播放时间找到应该高亮的歌词行
 * 只匹配带时间戳的行；未找到返回 -1
 */
export function findActiveLine(lines, time) {
  let result = -1
  for (let i = 0; i < lines.length; i++) {
    const t = lines[i].time
    if (t == null) continue
    if (t <= time) result = i
    else break
  }
  return result
}
