<template>
  <div class="h_recommend">
    <div class="recom">
      <div>
        <p class="recom_h1">编辑推荐</p>
      </div>
      <div class="recom_list">
        <p v-for="(item, n) in editSongs" :key="n">{{ item.songName }}-{{ item.singer }}</p>
      </div>
    </div>
    <div class="recom recoms">
      <div class="recom_r_top">
        <p class="recom_r_top_h1">新歌推荐</p>
        <div class="recom_r_list">
          <p v-for="(item, n) in firstSongs.slice(0, 2)" :key="n">{{ item.songName }}-{{ item.singer }}</p>
        </div>
      </div>
      <div class="recom_r_btm">
        <p>随心FM</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'HomeRecommend',
  props: {
    editSongs: {
      type: Array,
      default: () => [],
    },
    firstSongs: {
      type: Array,
      default: () => [],
    },
  },
}
</script>

<style scoped>
.h_recommend {
  padding: 0.625rem 1.25rem 1.25rem;
  display: flex;
  justify-content: space-between;
}
.recom {
  background-color: #45c3ab;
  width: calc(50% - 0.5rem);
  height: 11rem;
  border-radius: 0.4rem;
  color: #fff;
  font-size: 1.125rem;
  position: relative;
}
.recoms {
  background-color: transparent;
}
.recom_r_top {
  height: 7rem;
  background-color: #74bcee;
  margin-bottom: 1rem;
  border-radius: 0.4rem;
  position: relative;
}
.recom_r_btm {
  height: 3rem;
  background-color: #f1d567;
  border-radius: 0.4rem;
  line-height: 3rem;
  padding-left: 1.25rem;
  font-weight: 700;
}
.recom_h1 {
  width: 2.8rem;
  margin: 0.625rem 0.9375rem;
  font-size: 1.25rem;
  font-weight: 700;
}
.recom_r_top_h1 {
  padding: 1.25rem;
  font-weight: 700;
}
.recom_list {
  width: 100%;
  position: absolute;
  bottom: 0.9375rem;
  left: 0.9375rem;
  font-size: 0.875rem;
}
.recom_list p {
  width: calc(100% - 1.25rem);
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.recom_r_list {
  position: absolute;
  width: 100%;
  bottom: 0.9375rem;
  left: 1.25rem;
  font-size: 0.75rem;
}
.recom_r_list p {
  width: calc(100% - 1.25rem);
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
</style>
