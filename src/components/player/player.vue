<template>
  <div>
    <!-- ===== 迷你播放条 ===== -->
    <div class="mini-player" v-show="!fullScreen && hasCurrentSong" @click="openFull">
      <div class="mini-cover" :class="{ spinning: playing }">
        <img :src="cover" alt="" />
      </div>
      <div class="mini-info">
        <p class="mini-name">{{ cplay.sn || '未知歌曲' }}</p>
        <p class="mini-lyric">{{ activeLyricText || (cplay.singer || '未知歌手') }}</p>
      </div>
      <van-icon
        class="mini-btn"
        :name="playing ? 'pause-circle-o' : 'play-circle-o'"
        @click.stop="togglePlay"
      />
      <van-icon class="mini-btn" name="revoke" @click.stop="nextSong" />
    </div>

    <!-- ===== 全屏播放页 ===== -->
    <div class="player" v-show="fullScreen">
      <div class="player-bg">
        <img v-if="cover" :src="cover" alt="" />
      </div>
      <div class="player-mask"></div>

      <div class="player-content">
        <!-- 顶部：返回 + 标题 -->
        <div class="player-hide">
          <van-icon name="arrow-down" @click="closeFull" />
        </div>
        <div class="player-title">
          <p class="musi_name">{{ cplay.sn || '未知歌曲' }}</p>
          <p class="musi_singer">
            {{ cplay.singer || cplay.playing || '未知歌手' }}
            <span v-for="(cp, i) in (cplay.sy || [])" :key="i" class="tag">{{ cp }}</span>
          </p>
        </div>

        <!-- 中部：唱片 / 歌词 切换 -->
        <div class="player-body" :class="{ 'show-lyric': showLyric }">
          <div class="disc-wrap" @click="showLyric = true">
            <div class="disc" :class="{ spinning: playing }">
              <img v-if="cover" class="disc-cover" :src="cover" alt="" />
              <van-icon v-else class="disc-placeholder" name="music-o" />
            </div>
          </div>
          <div class="lyric-wrap" @click="showLyric = false">
            <ul class="lyric-list" ref="lyricList">
              <li
                v-for="(line, i) in lyricLines"
                :key="i"
                :class="{ active: i === activeIndex }"
                @click.stop="seekTo(line.time)"
              >
                {{ line.text }}
              </li>
              <li v-if="!lyricLines.length" class="empty">暂无歌词</li>
            </ul>
          </div>
        </div>

        <!-- 底部：进度条 + 控制栏 -->
        <div class="player-footer">
          <van-slider
            class="progress"
            :model-value="currentTime"
            :max="duration || 0"
            bar-height="4px"
            button-size="14px"
            active-color="#ffffff"
            inactive-color="rgba(255, 255, 255, 0.25)"
            @change="onSeek"
          />
          <div class="times">
            <span>{{ currentTimeText }}</span>
            <span>{{ durationText }}</span>
          </div>
          <div class="controls">
            <span class="mode-btn" @click="toggleMode">{{ modeText }}</span>
            <van-icon class="ctrl-btn" name="revoke" @click="prevSong" />
            <van-icon
              class="ctrl-btn main"
              :name="playing ? 'pause-circle-o' : 'play-circle-o'"
              @click="togglePlay"
            />
            <van-icon class="ctrl-btn" name="exchange" @click="nextSong" />
            <van-icon class="ctrl-btn" name="bars" @click="showPlaylist = true" />
          </div>
        </div>
      </div>

      <audio
        ref="audio"
        v-show="false"
        :src="src"
        @play="onPlay"
        @pause="onPause"
        @timeupdate="onTimeUpdate"
        @loadedmetadata="onTimeUpdate"
        @ended="onEnded"
        @error="onError"
      ></audio>
    </div>

    <!-- ===== 播放列表弹层 ===== -->
    <van-popup
      v-model:show="showPlaylist"
      class="playlist-popup"
      position="bottom"
      round
      teleport="body"
    >
      <div class="playlist">
        <div class="playlist-head">
          <span>当前播放（{{ playList.length }}）</span>
          <van-icon name="cross" @click="showPlaylist = false" />
        </div>
        <ul class="playlist-list">
          <li
            v-for="(item, i) in playList"
            :key="i"
            :class="{ active: i === curentIndex }"
            @click="playAt(i)"
          >
            <van-icon :name="i === curentIndex ? 'play-circle-o' : 'music-o'" />
            <span class="pl-name">{{ item.SN }}</span>
            <span class="pl-singer">{{ item.user && item.user.NN }}</span>
          </li>
        </ul>
      </div>
    </van-popup>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import { formatTime } from '@/utils/format'
import { parseLyric, findActiveLine } from '@/utils/lyric'
import { playMode } from '@/config/play.config'

const MODE_TEXT = {
  [playMode.sequence]: '顺序播放',
  [playMode.loop]: '单曲循环',
  [playMode.random]: '随机播放',
}
const DEFAULT_COVER =
  'http://wsing.bssdl.kugou.com/c4c1752d4fb60c199478b4ba8406c7e1.jpg'

export default {
  name: 'Player',
  data() {
    return {
      currentTime: 0,
      duration: 0,
      showLyric: false,
      showPlaylist: false,
      defaultCover: DEFAULT_COVER,
    }
  },
  computed: {
    ...mapGetters([
      'playing',
      'fullScreen',
      'playList',
      'sequenceList',
      'curentIndex',
      'mode',
      'cplay',
      'hasCurrentSong',
    ]),
    src() {
      return this.cplay.src || ''
    },
    cover() {
      return this.cplay.si || this.cplay.i || this.defaultCover
    },
    lyricLines() {
      return parseLyric(this.cplay.sw)
    },
    activeIndex() {
      return findActiveLine(this.lyricLines, this.currentTime)
    },
    activeLyricText() {
      const line = this.lyricLines[this.activeIndex]
      return line ? line.text : ''
    },
    modeText() {
      return MODE_TEXT[this.mode] || '顺序播放'
    },
    currentTimeText() {
      return formatTime(this.currentTime)
    },
    durationText() {
      return formatTime(this.duration)
    },
  },
  watch: {
    // 新歌曲加载完成且播放页打开时自动播放
    src(val) {
      if (val && this.fullScreen) {
        this.currentTime = 0
        this.duration = 0
        this.$nextTick(() => {
          const audio = this.$refs.audio
          if (audio) audio.play().catch(() => {})
        })
      }
    },
    // 歌词高亮行滚动到视口中间
    activeIndex(i) {
      const ul = this.$refs.lyricList
      if (!ul || i < 0 || !this.showLyric) return
      const li = ul.children[i]
      if (li) ul.scrollTop = li.offsetTop - ul.clientHeight / 2 + li.clientHeight / 2
    },
    // 切歌时重置歌词视图
    cplay() {
      this.showLyric = false
    },
  },
  methods: {
    ...mapActions([
      'togglePlaying',
      'prevSong',
      'nextSong',
      'setMode',
      'setFullScreen',
      'playAt',
    ]),
    openFull() {
      this.setFullScreen(true)
    },
    closeFull() {
      this.setFullScreen(false)
    },
    togglePlay() {
      const audio = this.$refs.audio
      if (!audio || !this.src) return
      if (audio.paused) audio.play().catch(() => {})
      else audio.pause()
    },
    toggleMode() {
      const next =
        this.mode === playMode.sequence
          ? playMode.loop
          : this.mode === playMode.loop
            ? playMode.random
            : playMode.sequence
      this.setMode(next)
    },
    /** 拖动进度条结束后跳转播放位置 */
    onSeek(value) {
      const audio = this.$refs.audio
      this.currentTime = value
      if (audio && this.duration) audio.currentTime = value
    },
    /** 点击歌词行跳转 */
    seekTo(time) {
      const audio = this.$refs.audio
      this.currentTime = time
      if (audio && this.duration) audio.currentTime = time
    },
    onPlay() {
      this.togglePlaying(true)
    },
    onPause() {
      this.togglePlaying(false)
    },
    onError() {
      this.togglePlaying(false)
      console.warn('音频加载失败：', this.src)
    },
    onTimeUpdate() {
      const audio = this.$refs.audio
      if (!audio) return
      this.currentTime = audio.currentTime
      this.duration = audio.duration || 0
    },
    onEnded() {
      if (this.mode === playMode.loop) {
        const audio = this.$refs.audio
        if (audio) {
          audio.currentTime = 0
          audio.play().catch(() => {})
        }
      } else {
        this.nextSong()
      }
    },
  },
}
</script>

<style scoped>
/* ===== 迷你播放条 ===== */
.mini-player {
  position: fixed;
  left: 0.75rem;
  right: 0.75rem;
  bottom: 0.75rem;
  height: 3.5rem;
  z-index: 100;
  display: flex;
  align-items: center;
  padding: 0 0.75rem;
  border-radius: 1.75rem;
  background: rgba(30, 30, 32, 0.92);
  backdrop-filter: blur(10px);
  box-shadow: 0 0.25rem 1rem rgba(0, 0, 0, 0.25);
  color: #fff;
}
.mini-cover {
  width: 2.5rem;
  height: 2.5rem;
  flex: none;
  border-radius: 50%;
  overflow: hidden;
  border: 2px solid rgba(255, 255, 255, 0.25);
  animation: spin 20s linear infinite;
  animation-play-state: paused;
}
.mini-cover.spinning {
  animation-play-state: running;
}
.mini-cover img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}
.mini-info {
  flex: 1;
  min-width: 0;
  margin: 0 0.625rem;
}
.mini-name {
  font-size: 0.875rem;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.mini-lyric {
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.6);
  margin-top: 0.125rem;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.mini-btn {
  font-size: 1.75rem;
  color: #fff;
  margin-left: 0.375rem;
  flex: none;
}

/* ===== 全屏播放页 ===== */
.player {
  position: fixed;
  inset: 0;
  z-index: 999;
  color: #fff;
  overflow: hidden;
  background: #23232a;
}
.player-bg {
  position: absolute;
  inset: 0;
}
.player-bg img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  filter: blur(3rem) brightness(0.45) saturate(1.3);
  transform: scale(1.5);
}
.player-mask {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    to bottom,
    rgba(0, 0, 0, 0.15) 0%,
    rgba(0, 0, 0, 0.05) 40%,
    rgba(0, 0, 0, 0.45) 100%
  );
}
.player-content {
  position: relative;
  height: 100%;
  display: flex;
  flex-direction: column;
  padding: 0 1.25rem;
}
.player-hide {
  height: 3.25rem;
  line-height: 3.25rem;
  font-size: 1.5rem;
  flex: none;
  opacity: 0.85;
}
.player-title {
  text-align: center;
  flex: none;
  padding: 0 2rem;
}
.musi_name {
  font-size: 1.125rem;
  font-weight: 600;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.musi_singer {
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.65);
  margin-top: 0.375rem;
}
.musi_singer .tag {
  display: inline-block;
  padding: 0.0625rem 0.3125rem;
  margin-left: 0.25rem;
  border: 1px solid rgba(255, 255, 255, 0.4);
  border-radius: 0.25rem;
  font-size: 0.625rem;
  transform: scale(0.9);
}

/* 中部：唱片与歌词 */
.player-body {
  position: relative;
  flex: 1;
  min-height: 0;
}
.disc-wrap,
.lyric-wrap {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: opacity 0.35s ease, transform 0.35s ease;
}
.lyric-wrap {
  opacity: 0;
  pointer-events: none;
  transform: translateY(0.75rem);
  align-items: stretch;
}
.player-body.show-lyric .disc-wrap {
  opacity: 0;
  pointer-events: none;
  transform: translateY(-0.75rem);
}
.player-body.show-lyric .lyric-wrap {
  opacity: 1;
  pointer-events: auto;
  transform: none;
}
.disc {
  width: 14rem;
  height: 14rem;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.08);
  border: 0.5rem solid rgba(0, 0, 0, 0.3);
  box-shadow: 0 0 2rem rgba(0, 0, 0, 0.4), 0 0 0 0.0625rem rgba(255, 255, 255, 0.12);
  display: flex;
  align-items: center;
  justify-content: center;
  animation: spin 20s linear infinite;
  animation-play-state: paused;
}
.disc.spinning {
  animation-play-state: running;
}
.disc-cover {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
}
.disc-placeholder {
  font-size: 3rem;
  color: rgba(255, 255, 255, 0.4);
}
.lyric-list {
  width: 100%;
  height: 100%;
  overflow-y: auto;
  scroll-behavior: smooth;
  text-align: center;
  padding: 40% 0;
  -ms-overflow-style: none;
}
.lyric-list::-webkit-scrollbar {
  display: none;
}
.lyric-list li {
  font-size: 0.875rem;
  line-height: 2.25;
  color: rgba(255, 255, 255, 0.45);
  transition: color 0.25s ease, transform 0.25s ease;
  transform-origin: center;
}
.lyric-list li.active {
  color: #fff;
  font-weight: 600;
  transform: scale(1.08);
}
.lyric-list li.empty {
  color: rgba(255, 255, 255, 0.35);
}

/* 底部控制区 */
.player-footer {
  flex: none;
  padding-bottom: 1.5rem;
}
.progress {
  margin: 0 0.25rem;
}
.times {
  display: flex;
  justify-content: space-between;
  font-size: 0.6875rem;
  color: rgba(255, 255, 255, 0.6);
  margin-top: 0.375rem;
}
.controls {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 0.875rem;
}
.mode-btn {
  font-size: 0.6875rem;
  color: rgba(255, 255, 255, 0.75);
  width: 3.25rem;
  text-align: center;
  line-height: 1.3;
}
.ctrl-btn {
  font-size: 1.75rem;
  color: #fff;
}
.ctrl-btn.main {
  font-size: 3.25rem;
}

/* ===== 播放列表弹层 ===== */
.playlist {
  background: #2b2b31;
  color: #fff;
  max-height: 60vh;
  display: flex;
  flex-direction: column;
  border-radius: 1rem 1rem 0 0;
}
.playlist-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.875rem 1.25rem;
  font-size: 0.9375rem;
  font-weight: 600;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
}
.playlist-list {
  overflow-y: auto;
  padding: 0.5rem 0;
  -ms-overflow-style: none;
}
.playlist-list::-webkit-scrollbar {
  display: none;
}
.playlist-list li {
  display: flex;
  align-items: center;
  padding: 0.625rem 1.25rem;
  font-size: 0.875rem;
}
.playlist-list li.active {
  color: #28beb3;
}
.playlist-list li .van-icon {
  margin-right: 0.625rem;
  font-size: 1.125rem;
  flex: none;
}
.pl-name {
  flex: 1;
  min-width: 0;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.pl-singer {
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.45);
  margin-left: 0.625rem;
  flex: none;
}
.playlist-list li.active .pl-singer {
  color: rgba(40, 190, 179, 0.7);
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>

<style>
/* 播放列表弹层 teleport 到 body，需要盖住全屏播放页（z-index 999） */
.playlist-popup {
  z-index: 1001;
}
</style>
