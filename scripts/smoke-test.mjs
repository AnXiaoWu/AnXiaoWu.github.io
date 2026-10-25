/* 运行时冒烟测试：用无头 Chromium 打开 dev server，检查页面渲染与接口数据 */
import { chromium } from 'playwright'

const base = 'http://127.0.0.1:8080'
const browser = await chromium.launch()
const page = await browser.newPage({ viewport: { width: 390, height: 844 } })

const errors = []
page.on('pageerror', (err) => errors.push('pageerror: ' + err.message))
page.on('console', (msg) => {
  if (msg.type() === 'error') errors.push('console: ' + msg.text())
})

async function check(url, expectTexts, name) {
  await page.goto(url, { waitUntil: 'networkidle' })
  await page.waitForTimeout(1500)
  const text = await page.evaluate(() => document.body.innerText)
  const missing = expectTexts.filter((t) => !text.includes(t))
  const imgCount = await page.evaluate(() => document.images.length)
  const loadedImgs = await page.evaluate(
    () => Array.from(document.images).filter((i) => i.complete && i.naturalWidth > 0).length
  )
  console.log(`\n[${name}] ${url}`)
  console.log(`  文本片段: ${text.replace(/\s+/g, ' ').slice(0, 120)}`)
  console.log(`  期望文本缺失: ${missing.length ? missing.join(',') : '无'}`)
  console.log(`  图片: ${loadedImgs}/${imgCount} 加载成功`)
  if (missing.length) process.exitCode = 1
}

await check(base, ['推荐歌单', '热门精选', '编辑推荐', '新歌推荐'], '首页')
await check(`${base}/#/ranking`, ['5sing音乐排行', '原创排行榜'], '排行榜')
await check(`${base}/#/classify`, ['古风'], '分区')
await check(`${base}/#/musician`, ['身份', '曲风', '古风'], '音乐人')
await check(`${base}/#/ranking/yc`, ['全部播放'], '榜单详情')

await page.screenshot({ path: 'smoke-home.png', fullPage: false })
console.log('\n页面错误:', errors.length ? errors.slice(0, 8) : '无')
if (errors.length) process.exitCode = 1

await browser.close()
