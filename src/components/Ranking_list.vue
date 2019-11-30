<template>
  <div>
    <div class="king_van">
      <div>
        <van-nav-bar left-arrow @click-left="$router.back()">
          <van-icon name="music-o" slot="right" />
        </van-nav-bar>
      </div>
    </div>

    <div class="king_main">
      <div class="king_img">
        <img :src="kinglist.data.photoBig" :alt="kinglist.data.name" />
      </div>

      <div class="king_play">
        <div class="king_play_ic"><van-icon name="play-circle-o" /><p class="king_play_all">全部播放</p></div>
        <div><van-icon name="bars" /></div>
    </div>
    <div>
        <ul>
            <li class="king_list" v-for="(item,n) in $route.params.id == 'list25' ? sustain.data : kinglist.data.songs" :key="n"  @click="aplay(item.ID,item.SK,n)" >
                <div class="king_list_l">
                <div class="king_list_key">{{n+1}}</div>
                <div class="king_list_name">
                    <p>{{item.SN}}</p>
                    <p>{{item.user.NN}}</p>
                </div>
                </div>
                <div class="king_list_icon"><van-icon name="ellipsis" /></div>
            </li>
        </ul>
    </div>




    <audio></audio>
    </div>
    <!-- v-for="(item,n) in kinglist.data" :key="n" -->
  </div>
</template>

<script>
import {mapActions,mapMutations,mapGetters} from 'vuex'

export default {
  data() {
    return {
      kinglist: {
        data: {}
      },
      sustain:{
          data:{}
      },
      music:{
          mp3:{data:{}},
          lrc:{data:{}},
          url:""
      },
      muiscList:[],
      selPlay:{ //当前音乐的信息
        singer:"",//歌手
        playing:"",// 演唱
        sn:"",//歌名
        lg:"",//语言
        si:"",//封面图
        sw:"",//歌词
        sy:"",//音乐类型 古典 流行
        dynamicWords:"",//滚动歌词
        i:"",//音乐人头像
        src:"",//歌曲连接

      }

    };
  },
  components: {},
  created() {
    this.getKinglist();
   
  },
  mounted() {
    console.log(this.$route.params.id);
  },
  methods: {
    ...mapGetters(["fullScreen"]),

    ...mapMutations(["SET_PLAYLIST","SET_C_PLAY"]),
    ...mapActions(['selectPlay']),
    async getKinglist() {
              await this.$http
         .get(
          `/rank/detail?id=${this.$route.params.id}&pagesize=20&pageindex=1&songfields=ID%2CSN%2CSK%2CUID%2CST%2CDD%2CCT%2CGD%2CKM5%2CCK&userfields=ID%2CNN%2CI`
        )
        .then(res => {
          console.log("当前排行榜");
          console.log(res);
          this.kinglist = res.data;
          let list = res.data.data.songs
          this.muiscList = list
          console.log('下面是list')
          console.log(list)
         this.SET_PLAYLIST(list)
        })
        if(this.$route.params.id == 'list25'){
      await this.$http
           .get(
          `/songlist/hotsupportranklist?page=1&pageSize=20`
        )
        .then(res => {
          console.log("当前排行榜");
          console.log(res);
          this.sustain = res.data;
          let list = res.data.data
          this.muiscList = list
          this.SET_PLAYLIST(list)
        })
        }

  },
  aplay(id,sk,n){
      console.log(id+'---'+sk);
      this.bus.$emit("click","false")
      this.$http.get(`/song/newget?songid=${id}&songtype=${sk}&songfields=ID,SN,SK,SW,SS,ST,SI,CT,M,S,ZQ,WO,ZC,HY,YG,CK,D,RQ,DD,E,R,RC,SG,C,CS,LV,LG,SY,UID,PT,SCSR,SC,KM5&userfields=ID,NN,I&tag=SlideLyric`).then((res)=>{
       console.log('歌词');
         console.log(res);
         this.music.lrc = res.data.data
        this.selPlay.singer=res.data.data.YG//歌手
        this.selPlay.playing=res.data.data.S // 演唱
        this.selPlay.sn=res.data.data.SN//歌名
        this.selPlay.lg=res.data.data.LG//语言
        this.selPlay.si=res.data.data.SI//封面图
        this.selPlay.sw=res.data.data.SW//静态歌词
        this.selPlay.sy=res.data.data.SY//音乐类型 古典 流行
        this.selPlay.dynamicWords=res.data.data.dynamicWords//滚动歌词
        this.selPlay.i=res.data.data.user.I//音乐人头像
     })
      
     this.$http.get(`/song/getSongUrl?version=6.6.70&songid=${id}&songtype=${sk}`).then((res)=>{
       console.log('mp3');
         console.log(res);
         this.music.mp3 = res.data.data
         this.music.url = res.data.data.squrl;

         this.selPlay.src = res.data.data.hqurl ? res.data.data.hqurl : (res.data.data.lqurl ? res.data.data.lqurl : res.data.data.squrl)
        //  console.log(this.muiscList);
        console.log("music")
        // console.log(this.music)
        console.log(this.selPlay)
         this.selectPlay({
      List:this.selPlay,
      index:n
    })
     })

    //  this.SET_C_PLAY(this.selPlay)
     console.dir(n)
    //  this.$emit('select',id,n)
    
  },




}
}
</script>

<style>
.van-nav-bar{
    background-color: transparent;
    border:none;
    border-color: transparent;
}
.van-hairline--bottom::after{
    border:none;

}

.van-nav-bar .van-icon {
  color: #fff;
}
.king_main{
    position: absolute;
    top:0;
    left: 0;
    z-index: 0;
}
.king_img img {
  width: 100%;
}
.king_play{
    display: flex;
    justify-content: space-between;
    line-height: 40px;
    height: 40px;
    padding: 0 20px;
    font-size: 20px;
    border-bottom:1px solid #f0f0f0;

}
.king_play_ic{
    display: flex;
}
.king_play_ic .van-icon{
    line-height: 40px;

}
.king_play_all{
    font-size: 16px;
    margin-left: 10px;
    /* vertical-align: middle; */
}
.king_list{
display: flex;
justify-content: space-between;
margin-bottom: 10px;
}
.king_list:hover{
  background-color: #edf0f0;
}
.king_list_key{
    font-size: 16px;
    line-height: 50px;
    padding: 0 15px;
}
.king_list_l{
    display: flex;
    width: 300px;
}
.king_list_name :first-child{
    font-size: 14px;
    line-height: 36px;
    color: #333;
}
.king_list_name :last-child{
    font-size: 12px;
    color: #ccc;
}
.king_list_icon .van-icon{
    line-height: 50px;
    margin-right: 20px;
    font-size: 20px;
}
</style>