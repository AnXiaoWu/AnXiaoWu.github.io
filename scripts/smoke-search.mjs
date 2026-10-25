/**
 * 搜索页冒烟测试：热词 → 搜索歌曲 → 点击播放 → 歌单/音乐人 tab → 音乐人反查
 * 用法：dev server 起着，node scripts/smoke-search.mjs
 */
import { chromium } from 'playwright'

const BASE = 'http://127.0.0.1:8080'
const log = (name, ok, detail = '') =>
  console.log(`${ok ? '✅' : '❌'} ${name}${detail ? ` — ${detail}` : ''}`)

const browser = await chromium.launch()
const page = await browser.newPage({ viewport: { width: 390, height: 844 } })
const pageErrors = []
page.on('pageerror', (e) => pageErrors.push(e.message))

// 1. 打开搜索页，热词渲染
await page.goto(`${BASE}/#/search`, { waitUntil: 'networkidle' })
await page.waitForTimeout(1500)
const hotCount = await page.evaluate(() => document.querySelectorAll('.hot_tags .van-tag').length)
log('热词面板渲染', hotCount > 0, `${hotCount} 个热词`)

// 2. 输入关键词搜索
await page.fill('.h_search_input', '春华')
await page.press('.h_search_input', 'Enter')
await page.waitForTimeout(2500)
const songs = await page.evaluate(() => {
  const rows = [...document.querySelectorAll('.song_row')]
  return {
    count: rows.length,
    firstName: rows[0] ? rows[0].querySelector('.song_name').textContent : '',
    meta: rows[0] ? rows[0].querySelector('.song_meta').textContent : '',
    highlighted: !!rows[0] && !!rows[0].querySelector('.song_name .hl'),
  }
})
log('歌曲搜索', songs.count > 0, `${songs.count} 条 | ${songs.firstName} | ${songs.meta}`)
log('关键词高亮', songs.highlighted)

// 3. 点击第一首 → 播放器打开
await page.click('.song_row')
await page.waitForTimeout(3500)
const player = await page.evaluate(() => {
  const audio = document.querySelector('audio')
  return {
    shown: getComputedStyle(document.querySelector('.player')).display !== 'none',
    paused: audio && audio.paused,
    src: (audio && audio.src || '').slice(0, 60),
  }
})
log('点击歌曲播放', player.shown && player.paused === false, `paused=${player.paused}`)

// 4. 收起播放器，切到歌单 tab
await page.locator('.player-hide .van-icon').click()
await page.waitForFunction(
  () => getComputedStyle(document.querySelector('.player')).display === 'none'
)
await page.locator('.van-tab', { hasText: '歌单' }).click()
await page.waitForTimeout(2500)
const lists = await page.evaluate(() => {
  const cards = [...document.querySelectorAll('.songlist_card')]
  return {
    count: cards.length,
    title: cards[0] ? cards[0].querySelector('.songlist_title').textContent : '',
    cover: cards[0] ? !!cards[0].querySelector('img').src : false,
  }
})
log('歌单搜索', lists.count > 0, `${lists.count} 个 | ${lists.title} | 封面=${lists.cover}`)

// 5. 音乐人 tab
await page.locator('.van-tab', { hasText: '音乐人' }).click()
await page.waitForTimeout(2500)
const musicians = await page.evaluate(() => {
  const rows = [...document.querySelectorAll('.musician_row')]
  return {
    count: rows.length,
    name: rows[0] ? rows[0].querySelector('.musician_name').textContent : '',
    avatar: rows[0] ? !!rows[0].querySelector('img').src : false,
  }
})
log('音乐人搜索', musicians.count > 0, `${musicians.count} 个 | ${musicians.name} | 头像=${musicians.avatar}`)

// 6. 点击音乐人 → 反查其歌曲
await page.click('.musician_row')
await page.waitForTimeout(2500)
const back = await page.evaluate(() => ({
  keyword: document.querySelector('.h_search_input').value,
  songs: document.querySelectorAll('.song_row').length,
}))
log('音乐人反查歌曲', back.songs > 0, `关键词="${back.keyword}" ${back.songs} 首`)

// 7. 无结果关键词
await page.fill('.h_search_input', 'zzzz不存在的关键词zzzz')
await page.press('.h_search_input', 'Enter')
await page.waitForTimeout(2000)
const empty = await page.evaluate(() => !!document.querySelector('.van-empty'))
log('无结果空态', empty)

log('页面错误', pageErrors.length === 0, pageErrors.join(' ; ') || '无')

await browser.close()
console.log(pageErrors.length || songs.count ? '' : '')
process.exit(pageErrors.length || !songs.count ? 1 : 0)
