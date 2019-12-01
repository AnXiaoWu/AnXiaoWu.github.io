
import Vue from 'vue'
import App from './App.vue'
import Vuex from 'vuex'
import router from "./routers/index"
import store from "./store/index"
import axios from 'axios'
import './config/fontsizi'
import Vant from 'vant'
import 'vant/lib/index.css'
// import i18n from "./config/i18n"
import VueI18n from "vue-i18n"
import bus from "./config/bus"
// import buildConfig from './config/build.config'
// import filter from "./config/filters"
Vue.use(Vuex)
Vue.use(Vant);
Vue.use(VueI18n)



let debug = process.env.NODE_ENV == 'development'
Vue.prototype.$http = axios
Vue.config.productionTip = false

function lang(){
  let t = localStorage.getItem('lang')
  if(t) return t
  else return "zh"
}
const languge = lang()

const i18n = new VueI18n({
  locale:languge,
  messages:{
    "zh":require("./assets/lang/chinese"),
    "en":require("./assets/lang/english")
  }
});

Vue.prototype.bus = bus;

axios.defaults.baseURL = debug ? '/mobile' : 'http://mobileapi.5sing.kugou.com'
// axios.defaults.baseURL = debug ? 'http://app.1718m.cn' : '/mobile'
// axios.defaults.baseURL = debug ? '/mobile' : 'http://app.1718m.cn'

// axios.defaults.baseURL = debug ? 'http://mobileapi.5sing.kugou.com' : '/mobile'

Vue.filter("znum", function (value, n) {
  if (value >= 10000) {
    let m = n + 1
    let num = (value / 10000).toFixed(m)
    return num.substring(0, num.indexOf('.') + m) + "万"
  } else {
    return value
  }
})
Vue.filter("arrayk",function(value){
  for(var i = 0;i < value.length;i++){
        if(value[i]===undefined){
          value.splce(i,1)
          i = i-1
        }
      }
      return value
})

new Vue({
  i18n,
  router,
  store,
  render: h => h(App),
}).$mount('#app')
