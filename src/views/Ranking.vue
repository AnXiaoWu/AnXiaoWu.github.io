<template>
  <div>
    <van-nav-bar :title="$t('m.Leaderboard')" left-arrow @click-left="$router.back()">
      <template #right>
      <van-icon name="volume-o" />
    </template>
    </van-nav-bar>

    <h2>5sing音乐排行</h2>
    <div class="ranking" v-for="(item, n) in rankList" :key="n">
      <router-link class="ranking_to" :to="'/ranking/' + item.id">
        <div><img class="rank_img" :src="item.photo" :alt="item.name" loading="lazy" /></div>
        <div class="rank_info">
          <p class="rank_name">{{ item.name }}</p>
          <p class="ran_songs" v-for="(i, m) in (item.songs || []).slice(0, 3)" :key="m">
            <span>{{ m + 1 }}</span>{{ i }}
          </p>
        </div>
        <div class="ran_right"><van-icon name="arrow" /></div>
      </router-link>
    </div>

    <h2>分区排行榜</h2>
    <van-grid :border="false" :column-num="3">
      <van-grid-item v-for="(item, n) in styleList" :key="n">
        <img class="style_img" :src="item.pic" :alt="item.style" loading="lazy" />
      </van-grid-item>
    </van-grid>
  </div>
</template>

<script>
import { getRankList, getStyles } from '@/api'
import { arrayk } from '@/utils/format'

export default {
  name: 'Ranking',
  data() {
    return {
      rankList: [],
      styleList: [],
    }
  },
  created() {
    this.getRanking()
    this.getClassify()
  },
  methods: {
    async getRanking() {
      try {
        const res = await getRankList(4)
        this.rankList = arrayk(res.data.data) || []
      } catch (e) {
        console.error('获取排行榜失败', e)
      }
    },
    async getClassify() {
      try {
        const res = await getStyles()
        this.styleList = arrayk(res.data.data) || []
      } catch (e) {
        console.error('获取分区失败', e)
      }
    },
  },
}
</script>

<style scoped>
.ranking_to {
  display: flex;
  font-size: 1rem;
  vertical-align: middle;
  position: relative;
  padding: 0.625rem;
}
.ranking:hover {
  background-color: beige;
}
.rank_img {
  width: 6.875rem;
  height: 6.875rem;
  margin-right: 10px;
  border-radius: 0.4rem;
}
.style_img {
  width: 100%;
}
h2 {
  font-size: 1.25rem;
  padding: 0.625rem;
}
.ran_right {
  position: absolute;
  line-height: 7.0938rem;
  right: 0.625rem;
}
.ran_songs {
  padding: 0.5625rem 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  width: 13rem;
  font-size: 0.875rem;
}
.rank_info {
  flex: 1;
  min-width: 0;
}
.rank_name {
  font-size: 1rem;
  font-weight: 700;
  color: #333;
  padding: 0.375rem 0 0.125rem;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.ran_songs span {
  margin-right: 0.625rem;
}
</style>
