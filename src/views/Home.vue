<template>
  <div>
    <div class="h_search">
      <div class="h_search_ipt">
        <van-icon name="search" size="1.25rem" color="#f0f0f0" />
        <input class="h_search_input" type="text" readonly placeholder="搜索歌曲/音乐人/歌单" />
      </div>
      <div class="btn_search">搜索</div>
    </div>

    <!-- 轮播图 -->
    <div class="h_swipe">
      <van-swipe :autoplay="3000" indicator-color="white">
        <van-swipe-item v-for="(item,n) in swipes.data" :key="n">
          <a :href="item.url">
            <img :src="item.thumb" />
          </a>
        </van-swipe-item>
      </van-swipe>
    </div>

    <!-- 菜单 -->
    <div class="subject">
      <router-link to="/">
        <div>
          <img src="../assets/icon/fenlei_1.svg" alt />
          <p>分类</p>
        </div>
      </router-link>
      <router-link to="/">
        <div>
          <img src="../assets/icon/paihangbang.svg" alt />
          <p>排行榜</p>
        </div>
      </router-link>
      <router-link to="/">
        <div>
          <img src="../assets/icon/huatong.svg" alt />
          <p>音乐人</p>
        </div>
      </router-link>
      <router-link to="/">
        <div>
          <img src="../assets/icon/lihua.svg" alt />
          <p>活动</p>
        </div>
      </router-link>
    </div>

    <!-- 小广告 -->
    <div class="h_sieces">
      <div v-for="(item,n) in sieces.data" :key="n">
        <img :src="item.thumb" alt />
      </div>
    </div>
    <!-- 推荐 -->
    <div class="h_recommend">
      <div class="recom">
        <div>
          <p class="recom_h1">编辑推荐</p>
        </div>
        <div class="recom_list" >
          <p v-for="(item,n) in home_recommend.data.edit.song" :key="n">{{item.songName+'-'+item.singer}}</p>
        </div>
      </div>
      <div class="recom recoms">
        <div class="recom_r_top">
          <p class="recom_r_top_h1">新歌推荐</p>
          <div class="recom_r_list" >
          <p v-for="(item,n) in home_recommend.data.first.song.slice(0,2)" :key="n">{{item.songName+'-'+item.singer}}</p>
          </div>
         
        </div>
        <div class="recom_r_btm">
          <p class="">随心FM</p>
        </div>
      </div>
    </div>
<!-- 推荐歌单 -->
    <div class="">
      <div class="h_list_title"><van-cell title="推荐歌单" is-link icon="hot" to="/" size="large"  /></div>
      <musi-list :items="songlist"></musi-list>

    </div>
<!-- 热门精选 -->
    <div class="">
      <div class="h_list_title"><van-cell title="热门精选" is-link icon="hot" to="/" size="large"  /></div>
      
      <div>
        <ul class="h_">
          <li></li>
        </ul>
      </div>

    </div>


<audio controls src="http://wsaudio.bssdlbig.kugou.com/1909161801/JA7Iguu8-MyB-kXihBzEUw/1568714500/bss/extname/wsaudio/1068624ee910e7ea32bb3c4f155d7c48.mp3" autoplay style="width:100%"></audio>
<video controls src="http://wsvideo.bssdlbig.kugou.com/1909161716/b4_b3H9WNxoEXZMATJnvPw/1568711817/f004e8f50b5f0e3f482bf00e843006f5.mp4" style="width:100%"></video>
  </div>
</template>

<script>
import axios from "axios";
import MusiList from '../components/MusiList'
import {mapState,mapGetters,mapMutations,mapActions} from "vuex"
export default {
  components:{
    MusiList
  },
  data() {
    return {
      swipes: "",
      sieces: "",
      songlist:''
    };
  },
  created() {
    this.getSwipe();
    this.getPiece();
    this.get_home_recommend()
    this.getSonglist()
    console.log("初始化了");
  },
  computed: {
    ...mapGetters(['home_recommend'])
  },
  methods: {
    ...mapActions(['get_home_recommend']),
   async getSwipe() {
      // http://mobileapi.5sing.kugou.com/other/getAdvert?advert_id=26
      console.log("轮播图");
      let res = await axios
        .get("/mobile/other/getAdvert?advert_id=26")
        .then(res => {
          console.log(res);
          this.swipes = res.data;
        })
        .catch(err => {
          console.log(err);
        });
    },
    async getPiece() {
      console.log("一个图片");
      let res = await axios.get("/mobile/other/getAdvert?advert_id=48").then(res => {
        console.log(res);
        this.sieces = res.data;
      });
    },
    async getSonglist(){
      console.log('推荐歌单');
      let res = await axios.get("/mobile/go/getRecommendSongList?tag=-1").then((res)=>{
        console.log(res);
        this.songlist = res.data
      })
    }
  }
};
</script>

<style >
.h_search {
  height: 3.125rem;
  width: 100%;
  background-color: #28beb3;
  /* background-color: #28beb41a; */
  padding: 0.5rem 0 0.5rem 0.5rem;
  display: flex;
  /* position: absolute; */
  top: 0;
  left: 0;
  z-index: 100;

  /* justify-content: space-between; */
}
.h_search_ipt {
  position: relative;
  width: 90%;
}
.h_search .van-icon-search {
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
.btn_search {
  width: 3rem;
  text-align: center;
  line-height: 2.125rem;
  font-size: 1rem;
  color: #fff;
}
.h_swipe {
  position: relative;
}
.van-swipe img {
  width: 100%;
  height: 100%;
}
.bg-slid {
  position: absolute;
  width: 100%;
  background-color: rgba(0, 0, 0, 0.877);
  top: 0;
  left: 0;
  font-size: 99;
  height: 100%;
}
.bg-slide {
  position: absolute;
  width: 100%;
  bottom: 0;
  height: 1.875rem;
  margin: 0 auto;
  background-repeat: no-repeat;
  background-image: url("../assets/icon/bg-slide.png");
  background-size: 100% 4.5rem;
  z-index: 0;
}
.subject {
  display: flex;
  font-size: 0.86rem;
  justify-content: space-around;
  text-align: center;
  padding: 1.25rem 0;
}
.subject img {
  width: 2.2rem;
  height: 2.2rem;
}
.h_sieces {
  width: 100%;
  padding: 0.625rem 1.25rem 1.25rem;
}
.h_sieces img {
  height: 100%;
  width: 100%;
  border-radius: 0.3rem;
}
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
  position:relative;
}
.recoms{
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
  font-weight:700;
}
.recom_h1{
  width: 2.8rem;
  margin: 0.625rem 0.9375rem;
  font-size: 1.25rem;
  font-weight:700;
}
.recom_r_top_h1{
padding: 1.25rem;
font-weight:700;
}
.recom_list{
  position: absolute;
  bottom: 0.9375rem;
  left: 0.9375rem;
  font-size: 0.875rem;
}
.recom_r_list{
  position: absolute;
  bottom: 0.9375rem;
  left: 1.25rem;
  font-size: 0.75rem;
}
.h_list_title{
  margin-bottom: 10px;
}
.h_list_title .van-cell{
font-weight: 700;
font-size: 1.75rem;
}
</style>