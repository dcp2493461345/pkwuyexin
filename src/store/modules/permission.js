
import router, { asyncRouterMap } from '@/router/index'
import { recursionRouter } from '@/utils/recursion-router'
import dynamicRouter from '@/router/dynamic-router'
// import state1 from '../state'
export default {
  namespaced: true,
  state: {
    permissionList: null /** 所有路由 */,
    sidebarMenu: null /** 导航菜单 */,
    currentMenu: '' /** 当前active导航菜单 */
  },
  getters: {},
  mutations: {
    SET_PERMISSION (state, routes) {
      state.permissionList = routes
    },
    CLEAR_PERMISSION (state) {
      state.permissionList = null
    },
    // 生成左侧导航栏菜单
    SET_MENU (state, menu) {
      state.sidebarMenu = menu
    },
    CLEAR_MENU (state) {
      state.sidebarMenu = []
    },
    SET_CURRENT_MENU (state, currentMenu) {
      state.currentMenu = currentMenu
    }
  },
  actions: {
    FETCH_PERMISSION ({ commit, state }) {
      // 处理后台给的权限数组
      commit('CLEAR_PERMISSION')
      var permissionList = JSON.parse(localStorage.getItem('RouterLists'))
      /*  根据权限筛选出我们设置好的路由并加入到path=''的children */
      /*  根据后台权限跟我们定义好的权限对比，筛选出对应的路由并加入到path=''的children */
      const routes = recursionRouter(permissionList, dynamicRouter)
      const MainContainer = asyncRouterMap.find(v => v.path === '')
      const mainChildren = MainContainer.children
      // console.log(mainChildren, 'mainChildren')
      if (mainChildren.length !== 0) {
        mainChildren.filter(item => {
          console.log(item.name)
          item.name === 'dashboard'
        }
        )
      }

      const children = JSON.parse(JSON.stringify(mainChildren))

      children.push(...routes)
      console.log('将siderbarmenu存入local22222222222222')
      localStorage.setItem('siderbarMenus', JSON.stringify(children))
      commit('SET_MENU', children)
      /*
为所有有children的菜单路由设置第一个children为默认路由
主要是供面包屑用，防止点击面包屑后进入某个路由下的 '' 路由,比如/manage/
而我们的路由是
      /*  初始路由 */
      const initialRoutes = router.options.routes
      /*  动态添加路由 */
      // router.match = createRouter1(constantRoutes).match
      // router.addRoutes(children)
      /* 完整的路由表 */
      commit('SET_PERMISSION', [...initialRoutes, ...asyncRouterMap])
    }
  }
}
