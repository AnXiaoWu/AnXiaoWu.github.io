import Vue from 'vue'
import Vuex from 'vuex'

import home from './home'
import playr from './playr'

Vue.use(Vuex)

export default new Vuex.Store({
    modules:{
        home,
        playr,
    },
    
})