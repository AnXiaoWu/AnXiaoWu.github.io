<template>
    <div>
          <van-nav-bar title="排行榜"  left-arrow @click-left="$router.back()">
  <van-icon name="volume-o" slot="right" />
  </van-nav-bar>

    <h2>5sing音乐排行</h2>
    <div class="ranking" v-for="(item,n) in ranking.data" :key="n">
        <router-link class="ranking_to" :to="'/ranking/'+item.id">
        <div><img :src="item.photo" alt=""></div>
        <div><p class="ran_songs" v-for="(i,m) in item.songs.slice(0,3)" :key="m"><span>{{m}}</span>{{i}}</p></div>
        <div class="ran_right"><van-icon name="arrow" /></div>
        </router-link>
    </div>

    <h2>分区排行榜{{$t("m.finds.phps")}}</h2>
    <van-grid :border="false" :column-num="3">
    <van-grid-item v-for="(item,n) in classify.data" :key="n">
        <van-image :src="item.pic" />
    </van-grid-item>
    
</van-grid>
    </div>
</template>

<script>
import axios from 'axios'
export default {
    data(){
        return{
        ranking:'',
        classify:''
        }
    },
    created(){
        this.getranking()
        this.getClassify()
    },
    methods:{

        async getranking(){
            await axios.get('/rank/list?count=4').then((res)=>{
                console.log('5sing音乐排行榜');
                console.log(res);
                this.ranking = res.data
            })
        },
        async getClassify(){
          await axios.get('/song/getstyles').then((res)=>{
                console.log('分区');
                console.log(res);
                this.classify = res.data
            })
        }
    }
}
</script>

<style>
.ranking_to{
    display: flex;
    font-size: 1rem;
    vertical-align: middle;
    position: relative;
    padding: 0.625rem;
}
.ranking:hover{
    background-color: beige;
}
.ranking img{
    width: 6.875rem;
    margin-right: 10px;
}
h2{
    font-size: 1.25rem;
    padding: 0.625rem;
}
.ran_right{
    position: absolute;
    line-height: 7.0938rem;
    right: 0.625rem;
}
.ran_songs{
    padding: 0.5625rem 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    width: 13rem;
    font-size: 0.875rem;
}
.ran_songs span{
    margin-right: 0.625rem;
}
    
</style>