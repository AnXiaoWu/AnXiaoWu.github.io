<template>
  <div>
    <van-nav-bar :title="$t('m.sort')" left-arrow @click-left="$router.back()">
      <template #right>
      <van-icon name="volume-o" />
    </template>
    </van-nav-bar>

    <div>
      <van-grid :border="false">
        <van-grid-item
          v-for="(item, n) in styleList"
          :key="n"
          border
          :text="item.style"
        />
      </van-grid>
    </div>
  </div>
</template>

<script>
import { getStyles } from '@/api'
import { arrayk } from '@/utils/format'

export default {
  name: 'Classify',
  data() {
    return {
      styleList: [],
    }
  },
  created() {
    this.getClassify()
  },
  methods: {
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
