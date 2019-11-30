
import Vue from 'vue'
import VueI18n from "vue-i18n"

import chinese from "../assets/lang/chinese"
import english from "../assets/lang/english"

Vue.use(VueI18n)

 let i18n = new VueI18n({
  lang:"中文",
  messages:{
    "中文":chinese,
    "English":english,
    // "Japan":Japan
  },
  list:["中文","English","Japan"]

})
export default {
  i18n:i18n
}