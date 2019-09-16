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

Vue.filter("znum",function(value,n){
  if(value >= 10000){
    let m = n+1
    let num = (value/10000).toFixed(m)
    return num.substring(0,num.indexOf('.')+m) + "万"
  }else{
    return value
  }
})

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app')
