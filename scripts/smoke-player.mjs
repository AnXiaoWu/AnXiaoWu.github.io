/* 播放页专项冒烟测试 */
import { chromium } from 'playwright'

const base = 'http://127.0.0.1:8080'
const browser = await chromium.launch()
const page = await browser.newPage({ viewport: { width: 390, height: 844 } })
const errors = []
page.on('pageerror', (e) => errors.push('pageerror: ' + e.message))
page.on('console', (m) => {
  if (m.type() === 'error') errors.push('console: ' + m.text())
})

function log(name, ok, extra = '') {
  console.log(`${ok ? '✅' : '❌'} ${name}${extra ? ' — ' + extra : ''}`)
  if (!ok) process.exitCode = 1
}

await page.goto(`${base}/#/ranking/yc`, { waitUntil: 'networkidle' })
await page.waitForTimeout(1500)

// 1. 点击第一首歌
await page.click('.king_list')
await page.waitForTimeout(2500)
let full = await page.evaluate(() => {
  const el = document.querySelector('.player')
  return {
    shown: getComputedStyle(el).display !== 'none',
    title: document.querySelector('.musi_name')?.textContent || '',
    singer: document.querySelector('.musi_singer')?.textContent || '',
  }
})
log('点击歌曲打开全屏播放页', full.shown, `${full.title} / ${full.singer}`)

// 2. 唱片与歌词切换
await page.click('.disc-wrap')
await page.waitForTimeout(600)
const lyric = await page.evaluate(() => {
  const wrap = document.querySelector('.player-body')
  const active = document.querySelector('.lyric-list li.active')
  return {
    showLyric: wrap.classList.contains('show-lyric'),
    lyricCount: document.querySelectorAll('.lyric-list li').length,
    activeText: active ? active.textContent : '',
  }
})
log('点击唱片切换到歌词页', lyric.showLyric && lyric.lyricCount > 0, `歌词 ${lyric.lyricCount} 行，高亮：${lyric.activeText}`)

// 3. 点击歌词行跳转（仅在有带时间戳的歌词行时测试）
const timedCount = await page.evaluate(
  () => document.querySelectorAll('.lyric-list li:not(.empty)').length
)
if (timedCount > 3) {
  const before = await page.evaluate(() => document.querySelector('audio').currentTime)
  await page.click('.lyric-list li:nth-child(4)')
  await page.waitForTimeout(800)
  const after = await page.evaluate(() => document.querySelector('audio').currentTime)
  log('点击歌词行跳转进度', Math.abs(after - before) > 1, `${before.toFixed(1)}s -> ${after.toFixed(1)}s`)
} else {
  log('歌词为纯文本（无时间戳），跳过跳转测试', true, `共 ${timedCount} 行`)
}

// 4. 播放/暂停
await page.click('.ctrl-btn.main')
await page.waitForTimeout(400)
const paused = await page.evaluate(() => document.querySelector('audio').paused)
log('点击主按钮暂停', paused === true)
await page.click('.ctrl-btn.main')
await page.waitForTimeout(400)
const resumed = await page.evaluate(() => document.querySelector('audio').paused)
log('再次点击恢复播放', resumed === false)

// 5. 下一首（controls 第 4 个子元素：模式/上一首/播放/下一首/列表）
const firstTitle = await page.evaluate(() => document.querySelector('.musi_name').textContent)
await page.click('.controls > :nth-child(4)')
await page.waitForTimeout(2500)
const secondTitle = await page.evaluate(() => document.querySelector('.musi_name').textContent)
log('下一首切换歌曲', firstTitle !== secondTitle, `${firstTitle} -> ${secondTitle}`)

// 6. 播放模式切换
const mode1 = await page.evaluate(() => document.querySelector('.mode-btn').textContent)
await page.click('.mode-btn')
await page.waitForTimeout(200)
const mode2 = await page.evaluate(() => document.querySelector('.mode-btn').textContent)
log('播放模式切换', mode1 !== mode2, `${mode1} -> ${mode2}`)

// 7. 播放列表弹层
await page.click('.controls > :nth-child(5)')
await page.waitForTimeout(500)
const popup = await page.evaluate(() => {
  const list = document.querySelector('.playlist-list')
  return {
    shown: !!list && getComputedStyle(list.closest('.van-popup')).display !== 'none',
    count: list ? list.children.length : 0,
  }
})
log('播放列表弹层', popup.shown && popup.count > 0, `${popup.count} 首`)

// 8. 列表中点播第三首
await page.click('.playlist-list li:nth-child(3)')
await page.waitForTimeout(2500)
const thirdTitle = await page.evaluate(() => document.querySelector('.musi_name').textContent)
log('列表中点播', thirdTitle !== secondTitle, `当前：${thirdTitle}`)

// 9. 关闭全屏 → 迷你播放条（先收起播放列表弹层）
await page.click('.playlist-head .van-icon')
await page.waitForTimeout(500)
await page.click('.player-hide .van-icon')
await page.waitForTimeout(600)
const mini = await page.evaluate(() => {
  const el = document.querySelector('.mini-player')
  const audio = document.querySelector('audio')
  return {
    shown: getComputedStyle(el).display !== 'none',
    name: el.querySelector('.mini-name').textContent,
    lyric: el.querySelector('.mini-lyric').textContent,
    stillPlaying: audio && !audio.paused,
  }
})
log('收起后显示迷你播放条', mini.shown, `${mini.name} | ${mini.lyric} | 后台播放中: ${mini.stillPlaying}`)

// 10. 迷你条点开全屏
await page.click('.mini-player')
await page.waitForTimeout(400)
const reopen = await page.evaluate(
  () => getComputedStyle(document.querySelector('.player')).display !== 'none'
)
log('迷你条点击恢复全屏', reopen)

await page.screenshot({ path: 'smoke-player.png' })
await page.screenshot({ path: 'smoke-player-mini.png' })
console.log('\n页面错误:', errors.length ? errors.slice(0, 8) : '无')
if (errors.length) process.exitCode = 1
await browser.close()
