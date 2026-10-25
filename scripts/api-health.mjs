/**
 * 接口体检脚本：逐一测试项目使用及文档记录的 5sing 接口
 * 用法：先启动 dev server（npm run dev），再 node scripts/api-health.mjs
 */
const BASE = 'http://127.0.0.1:8080/mobile'

const SONGFIELDS =
  'ID,SN,SK,SW,SS,ST,SI,CT,M,S,ZQ,WO,ZC,HY,YG,CK,D,RQ,DD,E,R,RC,SG,C,CS,LV,LG,SY,UID,PT,SCSR,SC,KM5'
const RANK_SONGFIELDS = 'ID,SN,SK,UID,ST,DD,CT,GD,KM5,CK'

/** [分组, 入口, 接口, 是否在用, URL] */
const cases = [
  // ---------- 项目正在使用的接口 ----------
  ['首页', '轮播图', '/other/getAdvert?advert_id=26', true, '/other/getAdvert?advert_id=26'],
  ['首页', '轮播图(旧)', '/other/getAdvert?advert_id=48', false, '/other/getAdvert?advert_id=48'],
  ['首页', '小编推荐', '/songlist/first?isfirst=1', true, '/songlist/first?isfirst=1'],
  ['首页', '推荐歌单', '/go/getRecommendSongList?tag=-1', true, '/go/getRecommendSongList?tag=-1'],
  ['首页', '热门精选(原)', '/songlist/hotIp?page=1&pageSize=10', false, '/songlist/hotIp?page=1&pageSize=10'],
  ['首页', '热门精选(现)', '/song/GetRecommend?page=1&pagesize=10', true, '/song/GetRecommend?page=1&pagesize=10'],
  ['分区', '风格列表', '/song/getstyles', true, '/song/getstyles'],
  ['排行榜', '榜单列表', '/rank/list?count=4', true, '/rank/list?count=4'],
  ['排行榜', '榜单详情', '/rank/detail?id=yc', true, `/rank/detail?id=yc&pagesize=20&pageindex=1&songfields=${RANK_SONGFIELDS}&userfields=ID,NN,I`],
  ['排行榜', '应援榜单', '/songlist/hotsupportranklist', true, '/songlist/hotsupportranklist?page=1&pageSize=20'],
  ['音乐人', '身份/曲风标签', '/songlist/copy?id=29', true, '/songlist/copy?id=29&oscode=28&osver=9'],
  ['播放页', '歌曲详情(歌词)', '/song/newget', true, `/song/newget?songid=4244440&songtype=yc&songfields=${SONGFIELDS}&userfields=ID,NN,I&tag=SlideLyric`],
  ['播放页', '播放地址', '/song/getSongUrl', true, '/song/getSongUrl?version=6.6.70&songid=4244440&songtype=yc'],

  // ---------- 文档有记录、项目未接入的候选接口 ----------
  ['音乐人', '热门音乐人', '/user/listmusician', false, '/user/listmusician?pagesize=6&pageindex=1&fields=ID,NN,I,M,YCRQ,FCRQ&from=androidPhone'],
  ['音乐人', '新人榜', '/complex/GetSetWeekRankingList', false, '/complex/GetSetWeekRankingList?id=2&apiVersion=1&page=1&pageSize=6'],
  ['搜索', '随机热词', '/go/SearchsHotWords', false, '/go/SearchsHotWords'],
  ['歌单', '歌单内歌曲', '/song/getsonglistsong', false, '/song/getsonglistsong?id=5d74c5f0da767f9a4e1ae6f3&songfields=ID,SN,SK,UID,ST,DD,CT,GD,KM5,CK&userfields=ID,NN,I&version=6.9.31'],
  ['视频', '音乐视频列表', '/mv/list', false, '/mv/list?pageIndex=1&pageSize=10&type=2&where=1&sortType=3'],
  ['圈子', '圈子活动', '/circle/circlemain', false, '/circle/circlemain?action=circle/get_index_activity'],
  ['圈子', '热圈推荐', '/circle/circlemain', false, '/circle/circlemain?action=circle/index_list_block'],
  ['播放页', '为你推荐', '/song/RecommendList', false, '/song/RecommendList?pageSize=20&page=1&version=69330&osversion=9'],
]

/** 跨域候选接口（当前 vite 未代理，直连测试） */
const crossDomain = [
  ['首页', 'getBanner', 'http://service.5sing.kugou.com/h5/getBanner?from=web&id=26'],
  ['首页', 'webRecommendNew(编辑推荐)', 'http://service.5sing.kugou.com/h5/webRecommendNew?p=1&t=1&l=10&s=%E7%BC%96%E8%BE%91%E6%8E%A8%E8%8D%90&from=web'],
  ['搜索', 'search', 'http://search.5sing.kugou.com/home/json?keyword=dd&sort=1&page=1&filter=0&type=0&from=web'],
]

function summarize(json) {
  if (json === null || typeof json !== 'object') return '非 JSON'
  const data = json.data
  if (data === undefined || data === null) return `无 data 字段（code=${json.code}）`
  if (Array.isArray(data)) return data.length ? `数组 ${data.length} 项` : '空数组'
  if (typeof data === 'object') {
    const keys = Object.keys(data)
    const arrKeys = keys.filter((k) => Array.isArray(data[k]))
    const info = arrKeys.map((k) => `${k}[${data[k].length}]`).join(' ')
    return `对象 {${keys.slice(0, 6).join(',')}} ${info}`
  }
  return String(data).slice(0, 60)
}

async function testOne(group, entry, name, inUse, url, base) {
  const full = (base || BASE) + url
  const started = Date.now()
  try {
    const res = await fetch(full, { signal: AbortSignal.timeout(20000) })
    const ms = Date.now() - started
    const text = await res.text()
    let json = null
    try {
      json = JSON.parse(text)
    } catch {
      /* 非 JSON（可能是 JSONP 或错误页） */
    }
    const ok = res.ok && json && json.code === 100 && json.data !== undefined
    const empty = json && (Array.isArray(json.data) ? json.data.length === 0 : json.data === null || json.data === '')
    const status = !res.ok ? `HTTP ${res.status}` : !json ? '非JSON' : json.code !== 100 ? `code=${json.code}` : empty ? '空数据' : '正常'
    console.log(
      `${ok && !empty ? '✅' : '❌'} [${group}·${entry}] ${name}\n` +
        `     状态: ${status} | ${ms}ms | ${summarize(json)}\n` +
        `     ${inUse ? '项目在用' : '未接入'}`
    )
    return { name, status, ok: ok && !empty }
  } catch (e) {
    console.log(`❌ [${group}·${entry}] ${name}\n     状态: 请求失败 ${e.message.slice(0, 80)} | ${inUse ? '项目在用' : '未接入'}`)
    return { name, status: '失败', ok: false }
  }
}

console.log('===== mobileapi 域名（经 dev 代理） =====')
let results = []
for (const [group, entry, name, inUse, url] of cases) {
  results.push(await testOne(group, entry, name, inUse, url))
}

console.log('\n===== 跨域接口（直连，未配代理） =====')
for (const [group, entry, url] of crossDomain) {
  results.push(await testOne(group, entry, entry, false, url.replace(/^https?:\/\/[^/]+/, ''), url.replace(/\/[^/]*$/, '')))
}

const failedInUse = results.filter((r) => !r.ok)
console.log(`\n===== 汇总：共测试 ${results.length} 个，异常 ${failedInUse.length} 个 =====`)
if (failedInUse.length) {
  console.log('异常列表：')
  failedInUse.forEach((r) => console.log(`  - ${r.name} (${r.status})`))
}
