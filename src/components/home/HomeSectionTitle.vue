<template>
  <div>
    <div class="h_list_title">
      <van-cell :title="title" is-link icon="hot" size="large" />
    </div>
    <slot />
  </div>
</template>

<script>
export default {
  name: 'HomeSectionTitle',
  props: {
    title: {
      type: String,
      required: true,
    },
  },
}
</script>

<style scoped>
.h_list_title {
  margin-bottom: 10px;
}
.h_list_title :deep(.van-cell) {
  font-weight: 700;
  font-size: 1.75rem;
}
</style>
