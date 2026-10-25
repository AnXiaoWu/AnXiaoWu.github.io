<template>
  <div class="search_page">
    <home-search-bar
      show-back
      v-model="keyword"
      :hot-word="randomHotWord"
      @search="onSearch"
    />

    <!-- 未输入关键词：热词面板 -->
    <div v-if="!keyword" class="hot_panel">
      <p class="hot_title">{{ $t('m.searchHot') }}</p>
      <div class="hot_tags">
        <van-tag
          v-for="(word, i) in hotWords"
          :key="i"
          round
          plain
          type="primary"
          @click="quickSearch(word)"
        >
          {{ word }}
        </van-tag>
      </div>
    </div>

    <!-- 搜索结果 -->
    <van-tabs v-else v-model:active="activeTab" @change="onTabChange">
      <!-- 歌曲 -->
      <van-tab :title="$t('m.song')">
        <van-loading v-if="tabState.song.loading" class="result_loading" size="1.5rem">
          {{ $t('m.searching') }}
        </van-loading>
        <template v-else>
          <div v-if="tabState.song.error" class="result_error">
            <p>{{ $t('m.searchFail') }}</p>
            <van-button round size="small" type="primary" @click="loadTab(0)">
              {{ $t('m.retry') }}
            </van-button>
          </div>
          <van-empty v-else-if="!tabState.song.list.length" :description="$t('m.noResult')" />
          <div v-else class="song_list">
            <div
              v-for="(item, i) in tabState.song.list"
              :key="item.songId"
              class="song_row"
              @click="playSong(i)"
            >
              <div class="song_icon">
                <van-icon name="music-o" size="1.5rem" color="#28beb3" />
              </div>
              <div class="song_info">
                <p class="song_name" v-html="highlight(item.songName)"></p>
                <p class="song_meta">
                  {{ stripTags(item.singer) }} · {{ item.typeName }}
                  <span v-if="item.style && item.style !== 'NULL'"> · {{ item.style }}</span>
                  <span class="song_play_cnt">
                    · {{ znum(item.playCnt, 2) }}{{ $t('m.playCnt') }}
                  </span>
                </p>
              </div>
              <van-icon name="play-circle-o" size="1.25rem" color="#28beb3" />
            </div>
          </div>
        </template>
      </van-tab>

      <!-- 歌单 -->
      <van-tab :title="$t('m.songlist')">
        <van-loading v-if="tabState.songlist.loading" class="result_loading" size="1.5rem">
          {{ $t('m.searching') }}
        </van-loading>
        <template v-else>
          <div v-if="tabState.songlist.error" class="result_error">
            <p>{{ $t('m.searchFail') }}</p>
            <van-button round size="small" type="primary" @click="loadTab(1)">
              {{ $t('m.retry') }}
            </van-button>
          </div>
          <van-empty v-else-if="!tabState.songlist.list.length" :description="$t('m.noResult')" />
          <div v-else class="songlist_grid">
            <div
              v-for="item in tabState.songlist.list"
              :key="item.songListId"
              class="songlist_card"
              @click="openSonglist(item)"
            >
              <img
                class="songlist_cover"
                :src="item.pictureUrl"
                :alt="item.title"
                loading="lazy"
                @error="onImgError"
              />
              <p class="songlist_title" v-html="highlight(item.title)"></p>
              <p class="songlist_meta">
                {{ item.songCnt }}{{ $t('m.songsUnit') }}
                <span v-if="item.label"> · {{ item.label }}</span>
              </p>
            </div>
          </div>
        </template>
      </van-tab>

      <!-- 音乐人 -->
      <van-tab :title="$t('m.musician')">
        <van-loading v-if="tabState.musician.loading" class="result_loading" size="1.5rem">
          {{ $t('m.searching') }}
        </van-loading>
        <template v-else>
          <div v-if="tabState.musician.error" class="result_error">
            <p>{{ $t('m.searchFail') }}</p>
            <van-button round size="small" type="primary" @click="loadTab(2)">
              {{ $t('m.retry') }}
            </van-button>
          </div>
          <van-empty v-else-if="!tabState.musician.list.length" :description="$t('m.noResult')" />
          <div v-else class="musician_list">
            <div
              v-for="item in tabState.musician.list"
              :key="item.id"
              class="musician_row"
              @click="searchMusicianWorks(item)"
            >
              <img
                class="musician_avatar"
                :src="item.pictureUrl"
                :alt="item.nickName"
                loading="lazy"
                @error="onImgError"
              />
              <div class="musician_info">
                <p class="musician_name" v-html="highlight(item.nickName)"></p>
                <p class="musician_desc">{{ item.description }}</p>
              </div>
              <van-icon name="arrow" color="#999" />
            </div>
          </div>
        </template>
      </van-tab>
    </van-tabs>

    <!-- 加载更多 / 没有更多 -->
    <div v-if="keyword && currentHasMore" class="load_more">
      <van-button round block plain type="primary" :loading="currentTab.loadingMore" @click="loadMore">
        {{ $t('m.loadMore') }}
      </van-button>
    </div>
    <p v-else-if="keyword && currentTab.loaded && currentTab.list.length" class="no_more">
      {{ $t('m.noMore') }}
    </p>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import { search, getSearchHotWords, getSongListSongs } from '@/api'
import { znum } from '@/utils/format'
import HomeSearchBar from '@/components/home/HomeSearchBar.vue'

/** tab 索引 → 搜索参数（音乐人需要 sort=2&filter=1，其余 sort=1&filter=0） */
const TAB_PARAMS = [
  { type: 0, sort: 1, filter: 0 },
  { type: 1, sort: 1, filter: 0 },
  { type: 5, sort: 2, filter: 1 },
]

/** 去掉接口返回的关键词高亮标签。
 *  注意：部分数据的"标签"是实体编码的（&lt;em class="keyword"&gt;），
 *  需要先解码实体再剥标签，否则会显示成一串原文。 */
function stripTags(text) {
  return String(text || '')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#0?39;/g, "'")
    .replace(/&amp;/g, '&')
    .replace(/<[^>]*>/g, '')
}

function escapeHtml(text) {
  return String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

function escapeRegExp(text) {
  return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

/** 构造空的 tab 状态 */
function emptyTab() {
  return {
    list: [],
    page: 0,
    totalPages: 1,
    loading: false,
    loadingMore: false,
    error: false,
    loaded: false,
  }
}

export default {
  name: 'Search',
  components: { HomeSearchBar },
  data() {
    return {
      keyword: '',
      activeTab: 0,
      hotWords: [],
      randomHotWord: '',
      // 搜索结果按 tab 缓存：切 tab 不重复请求
      tabs: [emptyTab(), emptyTab(), emptyTab()],
      // 请求序号，避免连续搜索时旧响应覆盖新结果
      seq: 0,
    }
  },
  computed: {
    tabState() {
      return {
        song: this.tabs[0],
        songlist: this.tabs[1],
        musician: this.tabs[2],
      }
    },
    currentTab() {
      return this.tabs[this.activeTab]
    },
    /** 当前 tab 是否还有下一页 */
    currentHasMore() {
      const tab = this.currentTab
      return tab.loaded && tab.page < tab.totalPages
    },
  },
  created() {
    this.loadHotWords()
  },
  methods: {
    ...mapActions(['selectPlay']),
    znum,
    stripTags,

    /** 图片加载失败时隐藏，保留灰底占位 */
    onImgError(e) {
      e.target.style.visibility = 'hidden'
    },

    async loadHotWords() {
      try {
        const res = await getSearchHotWords()
        const list = (res.data && res.data.data) || []
        this.hotWords = list.map((w) => w.key || w.word || w.name).filter(Boolean)
        if (this.hotWords.length) {
          this.randomHotWord =
            this.hotWords[Math.floor(Math.random() * this.hotWords.length)]
        }
      } catch (e) {
        // 热词加载失败不影响搜索功能，静默处理
        console.warn('热词加载失败', e.message)
      }
    },

    quickSearch(word) {
      this.keyword = word
      this.onSearch(word)
    },

    /** 关键词高亮：先剥掉接口的 <em> 标签，重新按关键词拼接 */
    highlight(text) {
      const clean = escapeHtml(stripTags(text))
      if (!this.keyword) return clean
      const reg = new RegExp(`(${escapeRegExp(escapeHtml(this.keyword))})`, 'gi')
      return clean.replace(reg, '<span class="hl">$1</span>')
    },

    onSearch(keyword) {
      this.keyword = keyword
      this.tabs = [emptyTab(), emptyTab(), emptyTab()]
      this.loadTab(0)
    },

    onTabChange(index) {
      const tab = this.tabs[index]
      // 已加载过（含加载失败）的 tab 不重复请求
      if (!tab.loaded && !tab.loading) this.loadTab(index)
    },

    async loadTab(index) {
      const tab = this.tabs[index]
      const keyword = this.keyword.trim()
      if (!keyword || tab.loading) return
      tab.loading = true
      tab.error = false
      const seq = ++this.seq
      try {
        const res = await search(keyword, { ...TAB_PARAMS[index], page: 1 })
        if (seq !== this.seq) return // 已被更新的搜索覆盖
        // 注意：5ssearch 的返回没有 mobileapi 那样的 data 外层包装
        const body = res.data || {}
        const data = body.data || body
        tab.list = data.list || []
        tab.page = (data.pageInfo && data.pageInfo.cur) || 1
        tab.totalPages = (data.pageInfo && data.pageInfo.totalPages) || 1
        tab.loaded = true
      } catch (e) {
        if (seq !== this.seq) return
        tab.error = true
        console.error('搜索失败', e)
      } finally {
        if (seq === this.seq) tab.loading = false
      }
    },

    async loadMore() {
      const tab = this.currentTab
      if (tab.loadingMore || tab.page >= tab.totalPages) return
      tab.loadingMore = true
      const seq = this.seq
      try {
        const res = await search(this.keyword.trim(), {
          ...TAB_PARAMS[this.activeTab],
          page: tab.page + 1,
        })
        if (seq !== this.seq) return
        const body = res.data || {}
        const data = body.data || body
        tab.list = tab.list.concat(data.list || [])
        tab.page = (data.pageInfo && data.pageInfo.cur) || tab.page + 1
      } catch (e) {
        console.error('加载更多失败', e)
      } finally {
        tab.loadingMore = false
      }
    },

    /** 搜索结果 → 播放器需要的歌曲结构 */
    toPlayable(item) {
      return {
        ID: item.songId,
        SK: item.typeEname,
        SN: stripTags(item.songName),
        user: { NN: item.singer || item.nickName, I: '' },
      }
    },

    playSong(index) {
      const list = this.tabs[0].list.map((item) => this.toPlayable(item))
      if (!list.length) return
      this.selectPlay({ list, index })
    },

    /** 点击歌单：拉取歌单内歌曲直接播放 */
    async openSonglist(item) {
      const loading = this.$toast.loading({ duration: 0, forbidClick: true })
      try {
        const res = await getSongListSongs(item.songListId)
        const list = (res.data && res.data.data) || []
        if (!list.length) {
          this.$toast.fail(this.$t('m.noResult'))
          return
        }
        this.selectPlay({ list, index: 0 })
      } catch (e) {
        console.error('获取歌单歌曲失败', e)
        this.$toast.fail(this.$t('m.searchFail'))
      } finally {
        loading.close()
      }
    },

    /** 点击音乐人：用其昵称作为关键词搜歌曲 */
    searchMusicianWorks(item) {
      const name = stripTags(item.nickName)
      this.activeTab = 0
      this.onSearch(name)
    },
  },
}
</script>

<style scoped>
.search_page {
  min-height: 100vh;
  background: #fff;
  padding-bottom: 1.5rem;
}

/* 热词面板 */
.hot_panel {
  padding: 1.25rem;
}
.hot_title {
  font-size: 0.875rem;
  color: #999;
  margin-bottom: 0.75rem;
}
.hot_tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}
.hot_tags .van-tag {
  padding: 0.25rem 0.75rem;
  font-size: 0.8125rem;
  cursor: pointer;
}

/* 歌曲结果 */
.song_list {
  padding: 0 0.75rem;
}
.song_row {
  display: flex;
  align-items: center;
  gap: 0.625rem;
  padding: 0.625rem 0.25rem;
  border-bottom: 1px solid #f5f5f5;
  cursor: pointer;
}
.song_row:active {
  background: #f9f9f9;
}
.song_icon {
  width: 2.75rem;
  height: 2.75rem;
  border-radius: 0.4rem;
  background: #f0f7f6;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.song_info {
  flex: 1;
  min-width: 0;
}
.song_name {
  font-size: 0.9375rem;
  color: #333;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.song_meta {
  font-size: 0.75rem;
  color: #999;
  margin-top: 0.1875rem;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
:deep(.hl) {
  color: #28beb3;
  font-weight: 700;
}

/* 歌单结果 */
.songlist_grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.75rem;
  padding: 0.75rem;
}
.songlist_card {
  cursor: pointer;
}
.songlist_cover {
  width: 100%;
  aspect-ratio: 1 / 1;
  object-fit: cover;
  border-radius: 0.4rem;
  display: block;
  background: #f5f5f5;
}
.songlist_title {
  font-size: 0.8125rem;
  color: #333;
  margin-top: 0.375rem;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
.songlist_meta {
  font-size: 0.6875rem;
  color: #999;
  margin-top: 0.125rem;
}

/* 音乐人结果 */
.musician_list {
  padding: 0 0.75rem;
}
.musician_row {
  display: flex;
  align-items: center;
  gap: 0.625rem;
  padding: 0.625rem 0.25rem;
  border-bottom: 1px solid #f5f5f5;
  cursor: pointer;
}
.musician_avatar {
  width: 3rem;
  height: 3rem;
  border-radius: 50%;
  object-fit: cover;
  flex-shrink: 0;
  background: #f5f5f5;
}
.musician_info {
  flex: 1;
  min-width: 0;
}
.musician_name {
  font-size: 0.9375rem;
  color: #333;
}
.musician_desc {
  font-size: 0.75rem;
  color: #999;
  margin-top: 0.1875rem;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

/* 状态与底部 */
.result_loading {
  padding: 2rem 0;
  text-align: center;
  color: #999;
  font-size: 0.8125rem;
}
.result_error {
  padding: 2.5rem 0;
  text-align: center;
  color: #999;
  font-size: 0.875rem;
}
.result_error p {
  margin-bottom: 0.75rem;
}
.load_more {
  padding: 0.75rem 1.25rem 0;
}
.no_more {
  text-align: center;
  color: #bbb;
  font-size: 0.75rem;
  padding: 1rem 0 0;
}
</style>
