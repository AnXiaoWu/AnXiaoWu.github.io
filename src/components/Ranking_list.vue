<template>
  <div>
    <div class="king_van">
      <div>
        <van-nav-bar left-arrow @click-left="$router.back()">
          <template #right>
          <van-icon name="music-o" />
        </template>
        </van-nav-bar>
      </div>
    </div>

    <div class="king_main">
      <div class="king_img">
        <img :src="kinglist.data.photoBig" :alt="kinglist.data.name" loading="lazy" />
      </div>

      <div class="king_play">
        <div class="king_play_ic" @click="aplay(0)">
          <van-icon name="play-circle-o" />
          <p class="king_play_all">全部播放</p>
        </div>
        <div><van-icon name="bars" /></div>
      </div>

      <div>
        <ul>
          <li
            class="king_list"
            v-for="(item, n) in songList"
            :key="n"
            @click="aplay(n)"
          >
            <div class="king_list_l">
              <div class="king_list_key">{{ n + 1 }}</div>
              <div class="king_list_name">
                <p>{{ item.SN }}</p>
                <p>{{ item.user && item.user.NN }}</p>
              </div>
            </div>
            <div class="king_list_icon"><van-icon name="ellipsis" /></div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import { getRankDetail, getHotSupportRankList } from '@/api'

export default {
  name: 'RankingList',
  data() {
    return {
      kinglist: { data: {} },
      sustain: { data: [] },
    }
  },
  computed: {
    isSupportRank() {
      return this.$route.params.id === 'list25'
    },
    songList() {
      return this.isSupportRank ? this.sustain.data : this.kinglist.data.songs || []
    },
  },
  created() {
    this.getKinglist()
  },
  methods: {
    ...mapActions(['selectPlay']),
    async getKinglist() {
      try {
        const res = await getRankDetail(this.$route.params.id)
        this.kinglist = res.data
      } catch (e) {
        console.error('获取榜单详情失败', e)
      }

      if (this.isSupportRank) {
        try {
          const res = await getHotSupportRankList(1, 20)
          this.sustain = res.data
        } catch (e) {
          console.error('获取应援榜单失败', e)
        }
      }
    },
    // 点击歌曲：把当前列表和索引交给 store，由播放器统一加载播放
    aplay(n) {
      this.selectPlay({ list: this.songList, index: n })
    },
  },
}
</script>

<style scoped>
.van-nav-bar {
  background-color: transparent;
  border: none;
}
.van-hairline--bottom::after {
  border: none;
}
.van-nav-bar .van-icon {
  color: #fff;
}
.king_main {
  position: absolute;
  top: 0;
  left: 0;
  z-index: 0;
}
.king_img img {
  width: 100%;
  display: block;
}
.king_play {
  display: flex;
  justify-content: space-between;
  line-height: 40px;
  height: 40px;
  padding: 0 20px;
  font-size: 20px;
  border-bottom: 1px solid #f0f0f0;
}
.king_play_ic {
  display: flex;
}
.king_play_ic .van-icon {
  line-height: 40px;
}
.king_play_all {
  font-size: 16px;
  margin-left: 10px;
}
.king_list {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
}
.king_list:hover {
  background-color: #edf0f0;
}
.king_list_key {
  font-size: 16px;
  line-height: 50px;
  padding: 0 15px;
}
.king_list_l {
  display: flex;
  width: 300px;
}
.king_list_name :first-child {
  font-size: 14px;
  line-height: 36px;
  color: #333;
}
.king_list_name :last-child {
  font-size: 12px;
  color: #ccc;
}
.king_list_icon .van-icon {
  line-height: 50px;
  margin-right: 20px;
  font-size: 20px;
}
</style>
