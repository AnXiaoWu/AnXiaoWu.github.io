import { createRouter, createWebHashHistory } from 'vue-router'

const routes = [
  { path: '/', component: () => import('@/views/Home.vue') },
  { path: '/search', component: () => import('@/views/Search.vue') },
  { path: '/classify', component: () => import('@/views/Classify.vue') },
  { path: '/ranking', component: () => import('@/views/Ranking.vue') },
  { path: '/musician', component: () => import('@/views/Musician.vue') },
  { path: '/activity', component: () => import('@/views/Activity.vue') },
  { path: '/ranking/:id', component: () => import('@/components/Ranking_list.vue') },
]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
  scrollBehavior: () => ({ top: 0 }),
})

export default router
