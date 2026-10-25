<template>
  <div class="fail" role="button" tabindex="0" @click="onRetry" @keydown.enter="onRetry">
    <slot>网络问题，点击重试</slot>
  </div>
</template>

<script>
export default {
  name: 'JzFail',
  emits: ['retry'],
  methods: {
    onRetry() {
      this.$emit('retry')
    },
  },
}
</script>

<style scoped>
.fail {
  text-align: center;
  font-size: 1.6rem;
  line-height: 10rem;
  cursor: pointer;
}
</style>
