<template>
  <div class="subject">
    <router-link to="/classify">
      <div>
        <van-image :src="iconSort" class="subject_img" />
        <p>{{ $t('m.sort') }}</p>
      </div>
    </router-link>
    <router-link to="/ranking">
      <div>
        <van-image :src="iconRank" class="subject_img" />
        <p>{{ $t('m.Leaderboard') }}</p>
      </div>
    </router-link>
    <router-link to="/musician">
      <div>
        <van-image :src="iconMusician" class="subject_img" />
        <p>{{ $t('m.musician') }}</p>
      </div>
    </router-link>
    <router-link to="/activity">
      <div>
        <van-image :src="iconActivity" class="subject_img" />
        <p>{{ $t('m.activities') }}</p>
      </div>
    </router-link>
  </div>
</template>

<script>
import iconSort from '@/assets/icon/fenlei_1.svg'
import iconRank from '@/assets/icon/paihangbang.svg'
import iconMusician from '@/assets/icon/huatong.svg'
import iconActivity from '@/assets/icon/lihua.svg'

export default {
  name: 'SubjectMenu',
  data() {
    return { iconSort, iconRank, iconMusician, iconActivity }
  },
}
</script>

<style scoped>
.subject {
  display: flex;
  font-size: 0.86rem;
  justify-content: space-around;
  text-align: center;
  padding: 1.25rem 0;
}
.subject_img {
  width: 2.2rem;
  height: 2.2rem;
}
</style>
