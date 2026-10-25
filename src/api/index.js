import { http, searchHttp } from './http'

const SONGFIELDS =
  'ID,SN,SK,SW,SS,ST,SI,CT,M,S,ZQ,WO,ZC,HY,YG,CK,D,RQ,DD,E,R,RC,SG,C,CS,LV,LG,SY,UID,PT,SCSR,SC,KM5'

/** 广告/轮播图 */
export const getAdvert = (advertId) =>
  http.get('/other/getAdvert', { params: { advert_id: advertId } })

/** 首页 - 小编推荐（编辑推荐 + 新歌推荐） */
export const getFirst = (isfirst = 1) =>
  http.get('/songlist/first', { params: { isfirst } })

/** 首页 - 推荐歌单 */
export const getRecommendSongList = (tag = -1) =>
  http.get('/go/getRecommendSongList', { params: { tag } })

/** 首页 - 热门精选（原 songlist/hotIp 接口已失效，改用 song/GetRecommend） */
export const getHotIp = (page = 1, pageSize = 10) =>
  http.get('/song/GetRecommend', { params: { page, pageSize } })

/** 分区 - 风格列表 */
export const getStyles = () => http.get('/song/getstyles')

/** 排行榜 - 榜单列表 */
export const getRankList = (count = 4) =>
  http.get('/rank/list', { params: { count } })

/** 排行榜 - 榜单详情（歌曲列表） */
export const getRankDetail = (id, pageIndex = 1, pageSize = 20) =>
  http.get('/rank/detail', {
    params: {
      id,
      pagesize: pageSize,
      pageindex: pageIndex,
      songfields: 'ID,SN,SK,UID,ST,DD,CT,GD,KM5,CK',
      userfields: 'ID,NN,I',
    },
  })

/** 排行榜 - 应援榜单 */
export const getHotSupportRankList = (page = 1, pageSize = 20) =>
  http.get('/songlist/hotsupportranklist', { params: { page, pageSize } })

/** 音乐人 - 标签（身份/曲风） */
export const getMusicianTags = () =>
  http.get('/songlist/copy', { params: { id: 29, oscode: 28, osver: 9 } })

/** 歌曲详情（含歌词） */
export const getSongDetail = (songId, songType) =>
  http.get('/song/newget', {
    params: {
      songid: songId,
      songtype: songType,
      songfields: SONGFIELDS,
      userfields: 'ID,NN,I',
      tag: 'SlideLyric',
    },
  })

/** 歌曲播放地址 */
export const getSongUrl = (songId, songType) =>
  http.get('/song/getSongUrl', {
    params: { version: '6.6.70', songid: songId, songtype: songType },
  })

/**
 * 搜索（5ssearch.kugou.com，原 search.5sing.kugou.com 已 404）
 * @param {string} keyword 关键词
 * @param {object} options
 * @param {number} options.type 0=歌曲 1=歌单 5=音乐人
 * @param {number} options.sort 排序：1=综合/热度 2=音乐人用
 * @param {number} options.filter 0=不过滤 1=音乐人用
 * @param {number} options.page 页码，每页 10 条
 */
export const search = (keyword, { type = 0, sort = 1, filter = 0, page = 1 } = {}) =>
  searchHttp.get('/home/json', {
    params: { keyword, type, sort, filter, page, from: 'web' },
  })

/** 搜索框 - 随机热词 */
export const getSearchHotWords = () => http.get('/go/SearchsHotWords')

/** 歌单 - 内部歌曲列表（返回字段与排行榜一致：ID/SN/SK/user，可直接播放） */
export const getSongListSongs = (songListId) =>
  http.get('/song/getsonglistsong', {
    params: {
      id: songListId,
      songfields: 'ID,SN,SK,UID,ST,DD,CT,GD,KM5,CK',
      userfields: 'ID,NN,I',
      version: '6.9.31',
    },
  })
