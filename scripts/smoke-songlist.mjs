/**
 * 歌单详情页冒烟测试
 * 覆盖：首页推荐歌单点击进入详情、歌曲列表渲染、点击播放、
 *       全部播放、搜索页歌单入口进入详情
 */
import { chromium } from 'playwright'

const BASE = 'http://127.0.0.1:8080'
let failed = 0

function log(name, ok, extra = '') {
  console.log(`${ok ? '✅' : '❌'} ${name}${extra ? ' | ' + extra : ''}`)
  if (!ok) failed++
}

const browser = await chromium.launch()
const page = await browser.newPage({ viewport: { width: 390, height: 844 } })
const pageErrors = []
page.on('pageerror', (e) => pageErrors.push(e.message))

// 1. 首页推荐歌单 → 进入详情页
await page.goto(BASE + '/', { waitUntil: 'networkidle' })
await page.waitForTimeout(1500)
const card = page.locator('.noe_li').first()
await card.waitFor({ state: 'visible', timeout: 15000 })
const cardTitle = await card.locator('.li_title').textContent()
await card.click()
await page.waitForTimeout(2500)

const url = page.url()
log('进入歌单详情页', url.includes('/#/songlist/'), url.slice(-60))

const detail = await page.evaluate(() => ({
  title: (document.querySelector('.sl_title') || {}).textContent || '',
  cover: (document.querySelector('.sl_cover') || {}).src || '',
  rows: document.querySelectorAll('.sl_row').length,
  hasPlayAll: !!document.querySelector('.sl_play_all'),
  firstSong: (document.querySelector('.sl_song_name') || {}).textContent || '',
}))
log('歌单信息渲染', !!detail.title && !!detail.cover, `标题:${detail.title} 封面:${detail.cover ? '有' : '无'}`)
log('歌曲列表渲染', detail.rows > 0, `${detail.rows} 首`)
log('播放全部按钮', detail.hasPlayAll)

// 2. 点击第一首歌播放
await page.click('.sl_row')
await page.waitForTimeout(3000)
const playing = await page.evaluate(() => {
  const audio = document.querySelector('audio')
  const pl = document.querySelector('.player')
  return {
    shown: pl && getComputedStyle(pl).display !== 'none',
    paused: audio && audio.paused,
    src: (audio && audio.src || '').slice(0, 60),
  }
})
log('点击歌曲播放', playing.shown && playing.paused === false, playing.src)

// 3. 当前行高亮
const active = await page.evaluate(() => document.querySelectorAll('.sl_row_active').length)
log('当前播放行高亮', active === 1, `${active} 行高亮`)

// 4. 返回 → 搜索页歌单入口
await page.evaluate(() => {
  const hide = document.querySelector('.player-hide .van-icon')
  if (hide) hide.click()
})
await page.waitForTimeout(600)
await page.goto(BASE + '/#/search', { waitUntil: 'networkidle' })
await page.waitForTimeout(1500)
await page.fill('.h_search_input', '春华')
await page.press('.h_search_input', 'Enter')
await page.waitForTimeout(2000)
await page.locator('.van-tab', { hasText: '歌单' }).click()
await page.waitForTimeout(2500)

const searchCards = await page.locator('.songlist_card').count()
log('搜索歌单结果渲染', searchCards > 0, `${searchCards} 个歌单`)

await page.locator('.songlist_card').first().click()
await page.waitForTimeout(2500)
const detail2 = await page.evaluate(() => ({
  isDetail: window.location.hash.includes('/songlist/'),
  rows: document.querySelectorAll('.sl_row').length,
}))
log('搜索页歌单进入详情', detail2.isDetail && detail2.rows > 0, `${detail2.rows} 首`)

// 5. 全部播放
await page.click('.sl_play_all')
await page.waitForTimeout(3000)
const playAll = await page.evaluate(() => {
  const audio = document.querySelector('audio')
  return audio && !audio.paused && !!audio.src
})
log('全部播放', !!playAll)

log('页面错误', pageErrors.length === 0, pageErrors.join('; ').slice(0, 200))

await page.screenshot({ path: 'smoke-songlist.png' })
await browser.close()
console.log(failed === 0 ? '\n全部通过 🎉' : `\n${failed} 项失败`)
process.exit(failed === 0 ? 0 : 1)
