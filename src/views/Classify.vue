<template>
    <div>
  <van-nav-bar title="分区"  left-arrow>
  <van-icon name="volume-o" slot="right" />
  </van-nav-bar>

    <div>
    <van-grid :border="false">
    <van-grid-item v-for="(item,n) in classify.data" :key="n" :icon="item.white" border :text="item.style" />

    </van-grid>
    </div>
    </div>
</template>

<script>

import axios from 'axios'
export default {
    data(){
        return{
        classify:''
        }
    },
    created(){
        this.getClassify()
    },
    methods:{
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
    
</style>