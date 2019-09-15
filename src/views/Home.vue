<template>
  <div>
    <div class="h_search">
      <div class="h_search_ipt">
          <van-icon name="search" size="1.25rem" color="#f0f0f0" />
          <input class="h_search_input" type="text" readonly placeholder="搜索歌曲/音乐人/歌单" >
      </div>
      <div class="btn_search">搜索</div>
    </div>

    <!-- 轮播图 -->
    <div class="h_swipe">
      <van-swipe :autoplay="3000" indicator-color="white" >
        <van-swipe-item  v-for="(item,n) in swipes.data" :key="n"><a :href="item.url"><img :src="item.thumb"></a></van-swipe-item>
      </van-swipe>
     
    </div>



    <!-- 菜单 -->
    <div class="subject">
        <router-link to="/">
        <div><img src="../assets/icon/fenlei_1.svg" alt=""><p>分类</p></div></router-link>
        <router-link to="/">
        <div><img src="../assets/icon/paihangbang.svg" alt=""><p>排行榜</p></div></router-link>
        <router-link to="/">
        <div><img src="../assets/icon/huatong.svg" alt=""><p>音乐人</p></div></router-link>
        <router-link to="/">
        <div><img src="../assets/icon/lihua.svg" alt=""><p>活动</p></div></router-link>

    </div>

    <!-- 小广告 -->
    <div>
        <div v-for="(item,n) in sieces.data" :key="n" >
            <img :src="item.thumb" alt="">
        </div>
    </div>


  </div>
</template>

<script>
import axios from "axios";
export default {
  data() {
    return {
      swipes: "",
      sieces:''
    };
  },
  created() {
    this.getSwipe();
    this.getPiece()
    console.log("初始化了");
  },
  computed: {},
  methods: {
 
    getSwipe() {
      // http://mobileapi.5sing.kugou.com/other/getAdvert?advert_id=26
      console.log("轮播图");
      let res = axios
        .get("/mobile/other/getAdvert?advert_id=26")
        .then(res => {
          console.log(res);
          this.swipes = res.data;
        })
        .catch(err => {
          console.log(err);
        });
    },
    getPiece(){
        console.log('一个图片');
        let res = axios.get("/mobile/other/getAdvert?advert_id=48")
        .then((res)=>{
            console.log(res);
        this.pieces = res.data
        })
    }
  }
};
</script>

<style >
.h_search {
  height: 3.125rem;
  width: 100%;
  /* background-color: #28beb3; */
  background-color: #28beb41a;
  padding:0.5rem 0 0.5rem 0.5rem;
  display: flex;
  position: absolute;
  top: 0;
  left: 0;
  z-index: 100;

  /* justify-content: space-between; */
}
.h_search_ipt{
    position: relative;
    width: 90%;
}
.h_search .van-icon-search{
  position: absolute;
  left: 0.625rem;
  top:calc(50% - 0.625rem)
}
.h_search_input{
height: 2.125rem;
padding-left: 2.5rem;
width: 100%;
border-radius: 0.3rem;
background-color: rgba(255, 255, 255, 0.123);
border:none;
font-size: 0.875rem;
color:rgb(240, 240, 240);
}
.btn_search{
    width: 3rem;
    text-align: center;
    line-height: 2.125rem;
    font-size: 1rem;
    color: #fff;
}
.h_swipe{
    position: relative;
}
.van-swipe img{
    width: 100%;
    height: 100%;
}
.bg-slid{
    position: absolute;
    width: 100%;
    background-color: rgba(0, 0, 0, 0.877);
    top:0;
    left: 0;
    font-size: 99;
    height: 100%;
}
.bg-slide{
    position: absolute;
    width: 100%;
    bottom: 0;
    height: 1.875rem;
    margin: 0 auto;
    background-repeat: no-repeat;
    background-image: url('../assets/icon/bg-slide.png');
    background-size: 100% 4.5rem;
    z-index: 0;
}
.subject{
    display:flex;
    font-size: 0.86rem;
    justify-content: space-around;
    text-align: center;
    padding:1.25rem 0;
}
.subject img{
    width: 2.2rem;
    height: 2.2rem;
}
</style>