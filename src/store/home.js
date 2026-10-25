import { getFirst } from '../api'

export default {
  namespaced: false,
  state: {
    home_recommend: {
      data: {
        edit: { song: [] },
        first: { song: [] },
      },
    },
  },
  getters: {
    home_recommend: (state) => state.home_recommend,
  },
  mutations: {
    SET_HOME_Recommend(state, data) {
      state.home_recommend = data
    },
  },
  actions: {
    async get_home_recommend({ commit }) {
      const res = await getFirst(1)
      commit('SET_HOME_Recommend', res.data)
    },
  },
}
