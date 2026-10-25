<template>
  <div class="h_sieces" v-if="list.length">
    <div v-for="(item, n) in list" :key="n">
      <img class="ad_img" :src="item.thumb" :alt="item.title" loading="lazy" />
    </div>
  </div>
</template>

<script>
export default {
  name: 'HomeSmallAd',
  props: {
    list: {
      type: Array,
      default: () => [],
    },
  },
}
</script>

<style scoped>
.h_sieces {
  width: 100%;
  padding: 0.625rem 1.25rem 1.25rem;
}
.ad_img {
  height: 100%;
  width: 100%;
  border-radius: 0.3rem;
  display: block;
}
</style>
