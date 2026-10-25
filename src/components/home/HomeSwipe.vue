<template>
  <div class="h_swipe">
    <van-swipe :autoplay="3000" indicator-color="white">
      <van-swipe-item v-for="(item, n) in list" :key="n">
        <a :href="item.url">
          <img class="swipe_img" :src="item.thumb" :alt="item.title" loading="lazy" />
        </a>
      </van-swipe-item>
    </van-swipe>
  </div>
</template>

<script>
export default {
  name: 'HomeSwipe',
  props: {
    list: {
      type: Array,
      default: () => [],
    },
  },
}
</script>

<style scoped>
.h_swipe {
  position: relative;
}
.swipe_img {
  width: 100%;
  height: 100%;
  display: block;
}
</style>
