import Vue from "vue" 

import VueRouter from "vue-router"

Vue.use(VueRouter)

export default new VueRouter({
    // mode:'history',
    routes:[
        {path:'/',component:()=>import('@/views/Home')},
        {path:'/search',component:()=>import('../views/home/h_search.vue')},
        {path:'/classify',component:()=>import('../views/Classify.vue')},
        {path:"/ranking",component:()=>import('../views/Ranking.vue')},
        {path:'/musician',component:()=>import('../views/Musician.vue')},
        {path:'/activity',component:()=>import('../views/Activity.vue')},
        {path:'/ranking/:id',component:()=>import("../components/Ranking_list.vue")}

    ]
})