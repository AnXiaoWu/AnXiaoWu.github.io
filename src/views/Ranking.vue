<template>
    <div>
    <h2>5sing音乐排行榜</h2>
    <div class="ranking" v-for="(item,n) in ranking.data" :key="n">
        <div><img :src="item.photo" alt=""></div>
        <div><p v-for="(i,m) in item.songs" :key="m"><span>{{m}}</span>{{i}}</p></div>
    </div>

    <h2>分区排行榜</h2>
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
            await axios.get('/mobile/rank/list?count=4').then((res)=>{
                console.log('5sing音乐排行榜');
                console.log(res);
                this.ranking = res.data
            })
        },
        async getClassify(){
          await axios.get('/mobile/song/getstyles').then((res)=>{
                console.log('分区');
                console.log(res);
                this.classify = res.data
            })
        }
    }
}
</script>

<style>
.ranking{
    display: flex;
    font-size: 1rem;
}
.ranking img{
    width: 6.875rem;
}
    
</style>