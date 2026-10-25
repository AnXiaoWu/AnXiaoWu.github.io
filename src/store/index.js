import { createStore } from 'vuex'

import home from './home'
import playr from './playr'

export default createStore({
  modules: {
    home,
    playr,
  },
})
