<template>
  <div class="h_search">
    <van-icon
      v-if="showBack"
      name="arrow-left"
      size="1.25rem"
      color="#f0f0f0"
      @click="$router.back()"
    />
    <div class="h_search_ipt">
      <van-icon name="search" size="1.25rem" color="#f0f0f0" />
      <input
        class="h_search_input"
        type="text"
        :value="modelValue"
        :placeholder="placeholderText"
        :readonly="!showBack"
        autofocus
        @click="onTap"
        @input="onInput"
        @keyup.enter="onSubmit"
      />
    </div>
    <div class="btn_search" @click="onSubmit">{{ $t('m.search') }}</div>
  </div>
</template>

<script>
export default {
  name: 'HomeSearchBar',
  props: {
    // 搜索页展示返回箭头，且输入框可编辑
    showBack: {
      type: Boolean,
      default: false,
    },
    // 输入框内容（v-model）
    modelValue: {
      type: String,
      default: '',
    },
    // 随机热词，有则作为 placeholder 展示
    hotWord: {
      type: String,
      default: '',
    },
  },
  emits: ['update:modelValue', 'search'],
  computed: {
    placeholderText() {
      return this.hotWord || this.$t('m.searchPlaceholder')
    },
  },
  methods: {
    /** 首页态：点击跳转到搜索页 */
    onTap() {
      if (!this.showBack) this.$router.push({ path: '/search' })
    },
    onInput(e) {
      this.$emit('update:modelValue', e.target.value)
    },
    /** 触发搜索；首页态点击按钮同样先去搜索页 */
    onSubmit() {
      if (!this.showBack) {
        this.$router.push({ path: '/search' })
        return
      }
      const keyword = (this.modelValue || '').trim()
      if (keyword) this.$emit('search', keyword)
    },
  },
}
</script>

<style scoped>
.h_search {
  height: 3.125rem;
  width: 100%;
  background-color: #28beb3;
  padding: 0.5rem 0 0.5rem 0.5rem;
  display: flex;
  top: 0;
  left: 0;
  z-index: 100;
}
.h_search_ipt {
  position: relative;
  width: 90%;
}
.h_search .van-icon-arrow-left {
  line-height: 2.125rem;
  margin-right: 0.625rem;
}
.h_search_ipt .van-icon-search {
  position: absolute;
  left: 0.625rem;
  top: calc(50% - 0.625rem);
}
.h_search_input {
  height: 2.125rem;
  padding-left: 2.5rem;
  width: 100%;
  border-radius: 0.3rem;
  background-color: rgba(255, 255, 255, 0.13);
  border: none;
  font-size: 0.875rem;
  color: rgb(240, 240, 240);
}
.h_search_input::placeholder {
  color: rgba(255, 255, 255, 0.8);
}
.btn_search {
  width: 3rem;
  text-align: center;
  line-height: 2.125rem;
  font-size: 1rem;
  color: #fff;
  margin: 0 0.625rem;
  cursor: pointer;
}
</style>
