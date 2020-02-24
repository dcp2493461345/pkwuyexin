import Vue from 'vue'
import Vuex from 'vuex'
import app from './modules/app'
import settings from './modules/settings'
import permission from './modules/permission'
import getters from './getters'
import state from './state'
import mutations from './mutations'
import actions from './actions'
import createPersistedState from 'vuex-persistedstate'
Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    app,
    settings,
    permission
  },
  getters,
  state,
  mutations,
  actions,
  plugins: [createPersistedState()]
})

export default store
