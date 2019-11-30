<template>
  <div class="player" v-show="istrue" >

    <div class="normal-player"  >

    <div class="player_hide" >
      <van-icon name="arrow-down" @touchstart="isShow" />
    </div>
    <div class="player_title">
      <p class="musi_name">{{cplay.singer ? cplay.singr : ''}}-{{cplay.sn ? cplay.sn  : "歌手-歌曲名称"}}</p>
      <span>{{cplay.sy ? cplay.sy : "流行"}}</span>
    </div>
    <div>
      <div class="musi_singr">
        <div class="musi_photo">
          <img src="http://wsing.bssdl.kugou.com/c4c1752d4fb60c199478b4ba8406c7e1.jpg" alt />
        </div>
        <p>{{cplay.playing ? cplay.playing : "演唱"}}</p>
      </div>
    </div>

    <div class="musi_lrc">
      <!-- 歌词 -->
      <div class="music_lyric">
        <ul class="music_scroll">
          <li>{{cplay ? cplay : "歌词"}}</li>
        </ul>
      </div>
    </div>

    <div class="music_control">
      <div class="music_progress">
        <div>00:00</div>
        <div class="progress">
          <van-progress
            :percentage="5"
            pivot-text="00:00"
            pivot-color="#7232dd"
            color="linear-gradient(to right, #be99ff, #7232dd)"
          />
        </div>
        <div>00:00</div>
      </div>
      <div class="misic_click">
          <van-button round color="#7232dd01" @click="play_sbtn" icon="arrow-left" type="primary" />
          <van-button round color="#7232dd01" @click="play_btn" icon="play" type="primary" />
          <van-button round color="#7232dd01" @click="play_xbtn" icon="arrow" type="primary" />
      </div>
    </div>
</div>


    <!-- <div class="mini-player" v-show="!fullScreen" ></div> -->

    <audio id="audio"  :src="cplay.src" ></audio>
  </div>
</template>

<script>
import {mapGetters,mapActions} from 'vuex'

export default {
  data() {
    return {
        istrue:false,
    };
  },
  created() {
   this.bus.$on("click",(ev)=>{
     console.log("bus 事件")
     this.istrue = true
     console.log(ev)
   });
   console.log('我来了')
  },
  methods: {
    ...mapGetters(["fullScreen",]),
    isShow(ev){
      console.log("触摸事件")
      this.istrue = false;
      ev.preventDefault()
      
    },
  },
  computed:{
    ...mapGetters(['playList',"cplay"]),
      play_btn(){
          const audio = document.getElementById('audio');
          if(!istrue){
              audio.play()
          }else{
              audio.pause()
          }
      },
      play_sbtn(){

      },
      play_xbtn(){

      }
      
  },
  watch: {
  
  },
};
</script>

<style>
.player {
  /* display:none; */
  width: 100%;
  height: 100%;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 999;
  background-color: #333;
  color: #fff;
}
.player_hide {
  position: absolute;
  width: 100%;
  height: 66px;
  line-height: 66px;
  font-size: 20px;
  padding-left: 10px;
  color: #fff;
  top: 0;
  left: 0;
}
.player_title {
  width: 100%;
  padding: 20px 0;
  text-align: center;
}
.musi_name {
  font-size: 14px;
  margin-bottom: 5px;
}
.player_title span {
  display: inline-block;
  padding: 3px;
  border: 1px solid #ccc;
  font-size: 8px;
  color: #ccc;
  margin: 0 5px;
}
.musi_singr {
  display: flex;
  line-height: 40px;
  padding-bottom: 10px;
  border-bottom: 1px solid #f0f0f0;
}
.musi_photo {
  height: 40px;
  margin: 0 10px;
}
.musi_photo img {
  height: 100%;
  border-radius: 50%;
}
.musi_lrc {
  width: 100%;
  padding: 10px 0;
  text-align: center;
}
.music_lyric {
  width: 100%;
  position: relative;
  /* height: 420px; */
}
.music_scroll {
 overflow: hidden;
  width: 100%;

}
.music_scroll p {
  height: 20px;
}
.music_control {
  position: absolute;
  height: 120px;
  width: 100%;
  background-color: coral;
  bottom: 0;
  left: 0;
  padding: 10px 20px;
}
.progress {
  width: 100%;
  padding: 0 10px;
}
.music_progress {
  display: flex;
  justify-content: space-between;
}
.misic_click{
    display: flex;
    justify-content: space-between;
}
</style>