<template>
    <div class="musi_list">
        <ul class="one_ul" >
           <li class="noe_li" v-for="(item,n) in items.data" :key="n">
               <div class="noe_li_imgs">
                   <img class="noe_li_img" :src="item.Picture" alt="">
                   <div class="noe_listen">
                       <van-icon name="service-o" />
                      {{item.PlayCount | znum(2)}}
                   </div>
               </div>
               <p class="li_title">{{item.Title}}</p>
               <p class="li_nn">{{item.user.NN}}</p>
           </li>
          

        </ul>
    </div>
</template>

<script>
export default {
    props:['items']
}
</script>

<style>
.musi_list{
    padding: 0 1.25rem;
}
.one_ul{
    /* background-color: aqua; */
    width: 100%;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
}
    .noe_li{
        width: calc(100% / 3 - 0.3125rem);
        /* background-color: lightcoral; */
        margin-bottom: 0.625rem;
    }
    .noe_li_imgs{
        position: relative;
    }
    .noe_li_img{
        width: 100%;
        border-radius: 0.4rem;
    }
    .li_title{
        font-size: 0.8125rem;
        word-wrap:break-all;
        color: #333;
    }
    
    .li_nn{
    font-size: 11px;
    color: #999;
    }
    .noe_listen{
        position: absolute;
        bottom: 0.625rem;
        left: 0.625rem;
        color: #fff;
        font-size: 0.625rem;
        line-height: 1rem;
    }
    .one_ul .van-icon{
        vertical-align: middle;
    }

</style>