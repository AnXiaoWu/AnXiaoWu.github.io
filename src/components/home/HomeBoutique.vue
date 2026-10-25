<template>
  <div class="h_boutique">
    <ul class="boutique">
      <li class="boutique_img" v-for="(item, n) in list" :key="n">
        <img class="boutique_img_tag" :src="item.pic" :alt="item.title" loading="lazy" />
        <div class="boutique_describe">
          <p class="boutique_describe_p">{{ item.title }}</p>
          <p class="boutique_descrube_num">{{ item.nickname }}</p>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'HomeBoutique',
  props: {
    list: {
      type: Array,
      default: () => [],
    },
  },
}
</script>

<style scoped>
.h_boutique {
  position: relative;
  padding: 0 1.25rem;
}
.boutique {
  display: flex;
  flex-wrap: nowrap;
  overflow-x: auto;
  -ms-overflow-style: none;
  -webkit-overflow-scrolling: touch;
  justify-content: space-between;
}
.boutique::-webkit-scrollbar {
  display: none;
}
.boutique_img {
  position: relative;
  color: #fff;
}
.boutique_img_tag {
  width: 8.75rem;
  height: 8.75rem;
  margin-right: 0.625rem;
  border-radius: 0.4rem;
  display: block;
}
.boutique :last-child .boutique_img_tag {
  margin-right: 0;
}
.boutique_describe {
  position: absolute;
  bottom: 0.625rem;
  left: 0.625rem;
}
.boutique_describe_p {
  width: 8.75rem;
  font-size: 0.8rem;
  padding-right: 1.25rem;
  font-weight: 700;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.boutique_descrube_num {
  font-size: 0.6875rem;
  color: #ccc;
}
</style>
