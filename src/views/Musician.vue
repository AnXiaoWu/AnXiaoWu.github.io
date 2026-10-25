<template>
  <div>
    <van-nav-bar :title="$t('m.musician')" left-arrow @click-left="$router.back()">
      <template #right>
      <van-icon name="volume-o" />
    </template>
    </van-nav-bar>

    <div class="m_musi">
      <div class="m_musiname">身份</div>
      <div class="s_cianname">
        <ul class="name_ul">
          <li v-for="(item, n) in tags.identity" :key="n"><p>{{ item }}</p></li>
        </ul>
      </div>
      <div class="s_icondo">
        <span>|</span><van-icon name="arrow-down" />
      </div>
    </div>

    <div class="m_musi">
      <div class="m_musiname">曲风</div>
      <div class="s_cianname">
        <ul class="name_ul">
          <li v-for="(item, n) in tags.genre" :key="n"><p>{{ item }}</p></li>
        </ul>
      </div>
      <div class="s_icondo">
        <span>|</span><van-icon name="arrow-down" />
      </div>
    </div>
  </div>
</template>

<script>
import { getMusicianTags } from '@/api'

export default {
  name: 'Musician',
  data() {
    return {
      tags: {
        identity: [],
        genre: [],
      },
    }
  },
  created() {
    this.getMusilist()
  },
  methods: {
    async getMusilist() {
      try {
        const res = await getMusicianTags()
        const data = (res.data && res.data.data) || {}
        this.tags = {
          identity: data.tags && data.tags.identity ? data.tags.identity : [],
          genre: data.tags && data.tags.genre ? data.tags.genre : [],
        }
      } catch (e) {
        console.error('获取音乐人标签失败', e)
      }
    },
  },
}
</script>

<style scoped>
.actives {
  background-color: #ccc;
  border-radius: 1rem;
}
.m_musi {
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  padding: 10px 0;
  overflow-x: hidden;
  height: 60px;
}
.m_musiname {
  width: 50px;
  line-height: 40px;
  text-align: center;
  font-size: 14px;
  color: #999;
}
.s_cianname {
  position: relative;
  width: 295px;
}
.s_cianname ul {
  display: flex;
  flex-wrap: nowrap;
  overflow-x: auto;
  -ms-overflow-style: none;
  -webkit-overflow-scrolling: touch;
  justify-content: space-between;
}
.s_cianname::-webkit-scrollbar {
  display: none;
}
.s_cianname ul li {
  position: relative;
  width: auto;
  max-width: 100%;
  text-align: center;
  margin: 10px 0;
}
.s_cianname ul li p {
  width: 90px;
  max-width: 100px;
  line-height: 20px;
}
.s_icondo {
  line-height: 40px;
  color: #999;
  width: 50px;
}
.s_icondo span {
  margin-right: 10px;
}
</style>
