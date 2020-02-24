import router from './router'
import store from './store'
// import { Message } from 'element-ui'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import { getToken, getInfo } from '@/utils/auth'
import getPageTitle from '@/utils/get-page-title'
NProgress.configure({ showSpinner: false }) // NProgress Configuration

const whiteList = ['/login', '/loginretripwd', '/loginresetpwd', '/loginenternewpwd', '/dashboard'] // no redirect whitelist

router.beforeEach((to, from, next) => {
  // start progress bar
  NProgress.start()

  // set page title
  document.title = getPageTitle(to.meta.title)

  // determine whether the user has logged in
  const hasToken = getToken()
  // console.log(hasToken, 'hasToken')

  if (hasToken && store.state.userInfo !== '') {
    // store.dispatch('login', {
    //   name: info
    // })
    // console.log(JSON.parse(getInfo()))
    store.commit('setUserInfo', JSON.parse(getInfo()))
    if (to.path === '/') {
      // if is logged in, redirect to the home page
      next()
      // store
      NProgress.done()
    } else {
      next()
    }
  } else {
    /* has no token*/
    if (whiteList.indexOf(to.path) !== -1) {
      // in the free login whitelist, go directly
      next()
    } else {
      // other pages that do not have permission to access are redirected to the login page.
      next(`/login?redirect=${to.path}`)
      NProgress.done()
    }
  }
})

router.afterEach(() => {
  // finish progress bar
  NProgress.done()
})
