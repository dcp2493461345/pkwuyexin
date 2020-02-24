import Vue from 'vue'

import 'normalize.css/normalize.css' // A modern alternative to CSS resets

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import locale from 'element-ui/lib/locale/lang/en' // lang i18n

import '@/styles/index.scss' // global css

import App from './App'
import store from './store'
import router from './router'
import { removeToken } from '@/utils/auth'
import '@/icons' // icon
//全局引用自主开发组件（分页/弹框）
import eleconfig from './components/index.js'
Vue.use(eleconfig)
import { postSelect_position_list } from '@/api/user'
export const eventBus = new Vue();
//创建bus
const bus = new Vue();
Vue.prototype.$bus = bus;
// import '@/permission' // permission control

/**
 * If you don't want to use mock-server
 * you want to use MockJs for mock api
 * you can execute: mockXHR()
 *
 * Currently MockJs will be used in the production environment,
 * please remove it before going online! ! !
 */
import * as mock from '../mock'
if (process.env.NODE_ENV === 'production') {
  mock.mockXHR()
}

// set ElementUI lang to EN
Vue.use(ElementUI)

Vue.config.productionTip = false

router.beforeEach((to, from, next) => {
  // console.log(to, 'totooto')
  if (to.meta.toClearLocalStorage) {
    removeToken()
    localStorage.clear()
  }
  if (to.meta.isToken) {
    // const sessionToken = sessionStorage.getItem('token')
    const userInfo = JSON.parse(localStorage.getItem('userInfo'))
    if (userInfo) {
      next()
    } else {
      next('/login/welcome')
    }
  } else {
    next()
  }
  if (to.name === "community") {
    localStorage.setItem('siderbarMenus', [])
    localStorage.setItem('dashCreate', 1)
  } else if (to.name === "dashboard" || to.meta.isReload || to.name === "parkdashboard") {
    const userInfo = JSON.parse(localStorage.getItem('userInfo'))
    const { uid, Communityid, type } = userInfo
    postSelect_position_list({ uid, Communityid, type }).then(resp => {
      // console.log(resp, '后台获取到的路由数据1222222222')
      if (resp.code === 200) {
        localStorage.setItem('RouterLists', JSON.stringify(resp.msg))
        if (!store.state.permission.permissionList) {
          store.dispatch('permission/FETCH_PERMISSION')
        }
      }
    })
  }
})
router.afterEach((to, from, next) => {
  store.commit('permission/SET_CURRENT_MENU', to.name)
})
new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
