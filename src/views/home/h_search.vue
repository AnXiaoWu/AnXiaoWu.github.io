<template>
    <div>
      <div class="h_search">
          <van-icon name="arrow-left" size="1.25rem" color="#f0f0f0" />
      <div class="h_search_ipt">
        <van-icon name="search" size="1.25rem" color="#f0f0f0" />
        <input class="h_search_input" type="text" placeholder="搜索歌曲/音乐人/歌单" />
      </div>
      <div class="btn_search" @click="onsearch">搜索</div>
    </div>


        
    </div>
</template>

<script>
export default {
    data(){
        return {
            istrue:false,
            
        }
    },
    created(){

    },
    methods:{
        onsearch(){

        }
    }

}
</script>

<style>
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
.h_search .van-icon-arrow-left{
  line-height: 2.125rem;
  margin-right: 0.625rem;
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
  background-color: #fff;
  border: none;
  font-size: 0.875rem;
  color: #999;
}
.btn_search {
  width: 3rem;
  text-align: center;
  line-height: 2.125rem;
  font-size: 1rem;
  color: #fff;
  margin: 0 0.625rem;
}
</style>