import { createApp } from 'vue'
import App from './App.vue'
import router from './routers'
import store from './store'
import { i18n } from './config/i18n'
import './config/fontsizi'

// Vant 组件由 unplugin-vue-components 按需自动引入（见 vite.config.js）

const app = createApp(App)

app.use(store)
app.use(router)
app.use(i18n)

app.mount('#app')
