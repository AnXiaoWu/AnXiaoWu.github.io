import { playMode } from '../config/play.config'
import { getSongDetail, getSongUrl } from '../api'

const MODE_KEY = 'playMode'

function loadMode() {
  const saved = Number(localStorage.getItem(MODE_KEY))
  return [playMode.sequence, playMode.loop, playMode.random].includes(saved)
    ? saved
    : playMode.sequence
}

export default {
  state: {
    // 歌手
    singer: {},
    // 播放中
    playing: false,
    // 全屏播放页
    fullScreen: false,
    // 播放列表
    playList: [],
    // 顺序列表
    sequenceList: [],
    // 播放模式：顺序 / 循环 / 随机
    mode: loadMode(),
    // 当前索引
    curentIndex: -1,
    // 当前播放歌曲（含播放地址与歌词）
    cplay: {},
  },
  getters: {
    singer: (state) => state.singer, // 歌手
    playing: (state) => state.playing, // 是否播放中
    fullScreen: (state) => state.fullScreen, // 全屏播放页
    playList: (state) => state.playList, // 播放列表
    sequenceList: (state) => state.sequenceList, // 顺序列表
    mode: (state) => state.mode, // 播放模式
    curentIndex: (state) => state.curentIndex, // 当前索引
    curentSong: (state) => state.playList[state.curentIndex] || {},
    cplay: (state) => state.cplay, // 当前歌曲
    hasCurrentSong: (state) => !!(state.cplay && state.cplay.src),
  },
  mutations: {
    SET_SINGER(state, singer) {
      state.singer = singer
    },
    SET_PLAYING(state, flag) {
      state.playing = flag
    },
    SET_FULL_SCREEN(state, flag) {
      state.fullScreen = flag
    },
    SET_PLAYLIST(state, list) {
      state.playList = list
    },
    SET_SEQUENCE_LIST(state, list) {
      state.sequenceList = list
    },
    SET_MODE(state, mode) {
      state.mode = mode
    },
    SET_CURENT_INDEX(state, index) {
      state.curentIndex = index
    },
    SET_C_PLAY(state, song) {
      state.cplay = song
    },
  },
  actions: {
    /** 播放列表中的第 index 首 */
    async selectPlay({ commit, dispatch }, { list, index }) {
      commit('SET_SEQUENCE_LIST', list)
      commit('SET_PLAYLIST', list)
      commit('SET_CURENT_INDEX', index)
      commit('SET_FULL_SCREEN', true)
      await dispatch('loadCurrentSong')
    },

    /** 加载当前索引歌曲的详情与播放地址 */
    async loadCurrentSong({ state, commit }) {
      const song = state.playList[state.curentIndex]
      if (!song) return
      commit('SET_PLAYING', false)
      try {
        const [detailRes, urlRes] = await Promise.all([
          getSongDetail(song.ID, song.SK),
          getSongUrl(song.ID, song.SK),
        ])
        const detail = (detailRes.data && detailRes.data.data) || {}
        const urlData = (urlRes.data && urlRes.data.data) || {}
        commit('SET_C_PLAY', {
          id: song.ID,
          type: song.SK,
          singer: detail.YG || (song.user && song.user.NN) || '',
          playing: detail.S || '',
          sn: detail.SN || song.SN || '',
          lg: detail.LG || '',
          si: detail.SI || '',
          sw: detail.SW || '',
          sy: detail.SY ? detail.SY.split('|') : [],
          dynamicWords: detail.dynamicWords || '',
          i: (detail.user && detail.user.I) || (song.user && song.user.I) || '',
          src: urlData.hqurl || urlData.lqurl || urlData.squrl || '',
        })
        commit('SET_PLAYING', true)
      } catch (e) {
        console.error('加载歌曲失败', e)
      }
    },

    prevSong({ dispatch }) {
      dispatch('step', -1)
    },
    nextSong({ dispatch }) {
      dispatch('step', 1)
    },
    /** 按播放模式计算下一首索引并加载 */
    async step({ state, commit, dispatch }, delta) {
      const len = state.sequenceList.length
      if (!len) return
      let index
      if (delta > 0 && state.mode === playMode.random && len > 1) {
        do {
          index = Math.floor(Math.random() * len)
        } while (index === state.curentIndex)
      } else {
        index = state.curentIndex + delta
        if (index < 0) index = len - 1
        if (index >= len) index = 0
      }
      commit('SET_CURENT_INDEX', index)
      await dispatch('loadCurrentSong')
    },
    /** 播放列表中指定一首 */
    async playAt({ commit, dispatch }, index) {
      commit('SET_CURENT_INDEX', index)
      await dispatch('loadCurrentSong')
    },
    /** 切换播放模式 */
    setMode({ state, commit }, mode) {
      commit('SET_MODE', mode)
      localStorage.setItem(MODE_KEY, String(mode))
    },
    togglePlaying({ commit }, flag) {
      commit('SET_PLAYING', flag)
    },
    setFullScreen({ commit }, flag) {
      commit('SET_FULL_SCREEN', flag)
    },
  },
}
