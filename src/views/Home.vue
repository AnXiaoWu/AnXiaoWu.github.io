<template>
  <div>
    <jz-loading v-show="status === 'loading'" />
    <jz-fail v-show="status === 'fail'" @retry="init" />
    <div v-show="status === 'success'">
      <section class="lang_bar">
        <button class="lang_btn" @click="langToggle">{{ $t('m.lang') }}</button>
      </section>

      <home-search-bar />

      <!-- 轮播图 -->
      <home-swipe :list="swipeList" />

      <!-- 菜单 -->
      <subject-menu />

      <!-- 小广告（getAdvert?advert_id=48 已失效返回空数组，无数据时隐藏） -->
      <home-small-ad v-if="adList.length" :list="adList" />

      <!-- 编辑推荐 / 新歌推荐 -->
      <home-recommend :edit-songs="editSongs" :first-songs="firstSongs" />

      <!-- 推荐歌单 -->
      <home-section-title title="推荐歌单">
        <musi-list :items="songlist" />
      </home-section-title>

      <!-- 热门精选 -->
      <home-section-title title="热门精选">
        <home-boutique :list="boutiqueList" />
      </home-section-title>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import { setLocale } from '@/config/i18n'
import { getAdvert, getRecommendSongList, getHotIp } from '@/api'
import { arrayk } from '@/utils/format'

import JzLoading from '@/components/common/JzLoading.vue'
import JzFail from '@/components/common/JzFail.vue'
import MusiList from '@/components/MusiList.vue'
import HomeSearchBar from '@/components/home/HomeSearchBar.vue'
import HomeSwipe from '@/components/home/HomeSwipe.vue'
import SubjectMenu from '@/components/home/SubjectMenu.vue'
import HomeSmallAd from '@/components/home/HomeSmallAd.vue'
import HomeRecommend from '@/components/home/HomeRecommend.vue'
import HomeSectionTitle from '@/components/home/HomeSectionTitle.vue'
import HomeBoutique from '@/components/home/HomeBoutique.vue'

export default {
  name: 'Home',
  components: {
    JzLoading,
    JzFail,
    MusiList,
    HomeSearchBar,
    HomeSwipe,
    SubjectMenu,
    HomeSmallAd,
    HomeRecommend,
    HomeSectionTitle,
    HomeBoutique,
  },
  data() {
    return {
      status: 'loading', // loading | success | fail
      swipeList: [],
      adList: [],
      songlist: { data: [] },
      boutiqueList: [],
    }
  },
  computed: {
    ...mapGetters(['home_recommend']),
    editSongs() {
      return this.home_recommend.data.edit.song || []
    },
    firstSongs() {
      return this.home_recommend.data.first.song || []
    },
  },
  created() {
    this.init()
  },
  methods: {
    ...mapActions(['get_home_recommend']),
    async init() {
      this.status = 'loading'
      try {
        await Promise.all([
          this.getSwipe(),
          this.getPiece(),
          this.getSonglist(),
          this.getBoutique(),
          this.get_home_recommend(),
        ])
        this.status = 'success'
      } catch (e) {
        console.error('首页数据加载失败', e)
        this.status = 'fail'
      }
    },
    async getSwipe() {
      const res = await getAdvert(26)
      this.swipeList = arrayk(res.data.data) || []
    },
    async getPiece() {
      const res = await getAdvert(48)
      this.adList = arrayk(res.data.data) || []
    },
    async getSonglist() {
      const res = await getRecommendSongList(-1)
      this.songlist = res.data
    },
    async getBoutique() {
      const res = await getHotIp(1, 10)
      // song/GetRecommend 返回按频道分组的数据，这里拍平成一维列表
      const channels = (res.data && res.data.data) || []
      const items = []
      channels.forEach((channel) => {
        ;(channel.list || []).forEach((item) => {
          items.push({
            pic: item.pic,
            title: item.song_name || item.name,
            nickname: item.nickname,
            click: item.click,
          })
        })
      })
      this.boutiqueList = items.slice(0, 10)
    },
    langToggle() {
      const next = this.$i18n.locale === 'zh' ? 'en' : 'zh'
      setLocale(next)
    },
  },
}
</script>

<style scoped>
.lang_bar {
  display: flex;
  justify-content: flex-end;
  padding: 0.5rem 1rem 0;
}
.lang_btn {
  border: 1px solid #28beb3;
  background: #fff;
  color: #28beb3;
  border-radius: 1rem;
  font-size: 0.875rem;
  padding: 0.25rem 0.875rem;
  cursor: pointer;
}
</style>
