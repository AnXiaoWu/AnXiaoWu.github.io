<template>
  <div>
    <van-nav-bar title="音乐人" left-arrow @click-left="$router.back()">
      <van-icon name="volume-o" slot="right" />
    </van-nav-bar>

    <div class="m_musi">
      <div class="m_musiname">身份</div>
      <div class="s_cianname">
        <ul class="name_ul">
          <li class="" v-for="(item,n) in getmusilist.data.tags.identity" :key="n"><p>{{item}}</p></li>
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
          <li v-for="(item,n) in getmusilist.data.tags.genre" :key="n"><p>{{item}}</p></li>
        </ul>
      </div>
      <div class="s_icondo">
        <span>|</span><van-icon name="arrow-down" />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      getmusilist: {
        data: {
          tags: {
            identity: [],
            genre: []
          }
        }
      }
    };
  },
  components: {},
  created() {
    this.getMusilist();
  },
  methods: {
    async getMusilist() {
      // http://mobileapi.5sing.kugou.com/songlist/copy?id=29&model=Redmi%20Note%207%20Pro&oscode=28&osver=9&phoneInfo=9%23Redmi%20Note%207%20Pro%23xiaomi
      await this.$http
        .get("/mobile/songlist/copy?id=29&oscode=28&osver=9")
        .then(res => {
          console.log("音乐人列表名");
          console.log(res);
          this.getmusilist = res.data;
        });
    }
  }
};
</script>

<style>

.actives{
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
  width:295px ;
}
.s_cianname ul {
   display:flex;
  flex-wrap:nowrap;
  overflow-x: auto;
  -ms-overflow-style: none;
  -webkit-overflow-scrolling: touch;
  justify-content: space-between;
   
}
::-webkit-scrollbar {
            display: none
}
.s_cianname ul li {
    position: relative;
  width: auto;
  max-width: 100%;
  text-align: center;
 margin: 10px 0;
}
.s_cianname ul li p{
    width: 90px;
    max-width: 100px;
    line-height: 20px;
}
.s_icondo {
    line-height: 40px;
  color: #999;
  width: 50px;
}
.s_icondo span{
    margin-right: 10px;
}
</style>