import Vue from 'vue'
import App from './App.vue'
import Vuex from 'vuex'
import router from "./routers/index"
import store from "./store/index"
import axios from 'axios'
import './config/fontsizi'
import Vant from 'vant';
import 'vant/lib/index.css';


Vue.use(Vuex)
Vue.use(Vant);

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app')
