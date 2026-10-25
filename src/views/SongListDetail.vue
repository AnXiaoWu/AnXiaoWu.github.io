<template>
  <div class="songlist_detail">
    <van-nav-bar :title="$t('m.songlist')" left-arrow @click-left="$router.back()" />

    <jz-loading v-show="status === 'loading'" />
    <jz-fail v-show="status === 'fail'" @retry="init" />

    <div v-show="status === 'success'">
      <!-- 歌单信息 -->
      <div class="sl_header">
        <div class="sl_cover_wrap">
          <img v-if="cover" class="sl_cover" :src="cover" :alt="title" loading="lazy" />
          <div v-else class="sl_cover sl_cover_empty"><van-icon name="music-o" /></div>
        </div>
        <div class="sl_info">
          <h2 class="sl_title">{{ title }}</h2>
          <p v-if="creator" class="sl_creator">
            <van-icon name="manager-o" />
            {{ creator }}
          </p>
          <p class="sl_count">{{ songs.length }} {{ $t('m.songs') }}</p>
          <van-button size="small" round type="danger" class="sl_play_all" @click="playAll">
            <van-icon name="play-circle-o" />
            {{ $t('m.playAll') }}
          </van-button>
        </div>
      </div>

      <!-- 歌曲列表 -->
      <div class="sl_list">
        <p
          v-for="(item, n) in songs"
          :key="n"
          class="sl_row"
          :class="{ sl_row_active: isCurrent(item) }"
          @click="playAt(n)"
        >
          <span class="sl_index">{{ n + 1 }}</span>
          <span class="sl_song_name">{{ item.SN }}</span>
          <span class="sl_singer">{{ item.user && item.user.NN }}</span>
          <van-icon v-if="isCurrent(item)" class="sl_playing" name="volume-o" />
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import { getSongListSongs } from '@/api'
import JzLoading from '@/components/common/JzLoading.vue'
import JzFail from '@/components/common/JzFail.vue'

export default {
  name: 'SongListDetail',
  components: { JzLoading, JzFail },
  data() {
    return {
      status: 'loading', // loading | success | fail
      songs: [],
    }
  },
  computed: {
    ...mapGetters(['playList', 'curentIndex']),
    id() {
      return this.$route.params.id
    },
    // 歌单元信息随路由 query 传入（无独立详情接口），刷新后丢失时用兜底
    title() {
      return this.$route.query.title || this.$t('m.songlist')
    },
    cover() {
      return this.$route.query.cover || ''
    },
    creator() {
      return this.$route.query.creator || ''
    },
  },
  created() {
    this.init()
  },
  methods: {
    ...mapActions(['selectPlay']),
    async init() {
      this.status = 'loading'
      try {
        const res = await getSongListSongs(this.id)
        this.songs = (res.data && res.data.data) || []
        this.status = 'success'
      } catch (e) {
        console.error('获取歌单歌曲失败', e)
        this.status = 'fail'
      }
    },
    isCurrent(song) {
      const current = this.playList[this.curentIndex]
      return !!current && current.ID === song.ID && current.SK === song.SK
    },
    playAll() {
      if (!this.songs.length) return
      this.selectPlay({ list: this.songs, index: 0 })
    },
    playAt(index) {
      // 已在播放该歌单中的曲子时，只打开播放页不重新加载
      if (this.isCurrent(this.songs[index])) {
        this.$store.dispatch('setFullScreen', true)
        return
      }
      this.selectPlay({ list: this.songs, index })
    },
  },
}
</script>

<style scoped>
.songlist_detail {
  min-height: 100vh;
  background: #f7f7f7;
}
.sl_header {
  display: flex;
  padding: 1rem 1.25rem;
  background: #fff;
}
.sl_cover_wrap {
  flex-shrink: 0;
}
.sl_cover {
  width: 7.5rem;
  height: 7.5rem;
  border-radius: 0.5rem;
  display: block;
  object-fit: cover;
}
.sl_cover_empty {
  background: #eee;
  color: #bbb;
  font-size: 2.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
}
.sl_info {
  flex: 1;
  margin-left: 1rem;
  position: relative;
}
.sl_title {
  font-size: 1.0625rem;
  color: #333;
  line-height: 1.4;
  margin: 0;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
.sl_creator,
.sl_count {
  font-size: 0.75rem;
  color: #999;
  margin: 0.375rem 0 0;
}
.sl_creator .van-icon {
  vertical-align: middle;
  margin-right: 0.125rem;
}
.sl_play_all {
  position: absolute;
  bottom: 0;
  left: 0;
  height: 2rem;
  padding: 0 0.875rem;
}
.sl_list {
  margin-top: 0.625rem;
  background: #fff;
  padding: 0.375rem 1.25rem;
}
.sl_row {
  display: flex;
  align-items: center;
  padding: 0.6875rem 0;
  font-size: 0.9375rem;
  color: #333;
  border-bottom: 1px solid #f2f2f2;
  cursor: pointer;
}
.sl_row:last-child {
  border-bottom: none;
}
.sl_index {
  width: 1.75rem;
  flex-shrink: 0;
  color: #999;
  font-size: 0.875rem;
}
.sl_song_name {
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.sl_singer {
  flex-shrink: 0;
  max-width: 40%;
  margin-left: 0.75rem;
  font-size: 0.75rem;
  color: #999;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.sl_row_active .sl_song_name,
.sl_row_active .sl_index {
  color: #e03c3c;
}
.sl_playing {
  flex-shrink: 0;
  margin-left: 0.5rem;
  color: #e03c3c;
}
</style>
