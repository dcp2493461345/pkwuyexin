import axios from 'axios'
// import { Message } from 'element-ui'
import store from '@/store'
import { getToken, removeToken } from '@/utils/auth'
import router from '../router/index'
// axios.defaults.headers.common['token'] = 'eyJ1aWQiOjEsImlwIjoiMjIwLjE2Ni4yMzguMjI5In0'
const service = axios.create({
  baseURL: 'http://www.parking.com', // url = base url + request url
  // headers: {
  //   'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
  // },
  timeout: 5000 // request timeout
})

// axios.defaults.headers.common['Authorization'] = AUTH_TOKEN;
// request interceptor
service.interceptors.request.use(
  // if (window.history && window.history.pushState) {
  //   $(window).on('popstate', function () {
  //     // 当点击浏览器的 后退和前进按钮 时才会被触发，
  //     window.history.pushState('forward', null, '');
  //     window.history.forward(1);
  //   })
  // }
  // window.history.pushState('forward', null, '')
  // window.history.forward(1)
  config => {
    // if (getToken()) {
    const parkid = JSON.parse(localStorage.getItem('userInfo')).Communityid
    const token = sessionStorage.getItem('token')
    //config.headers['token'] = token
    // } else if(JSON.parse(localStorage.getItem("userInfo"))){
    //config.headers['parkid'] = parkid
    // // }
    config.headers.token = 'Bearer ' + token
    // config.headers.parkid='Bearer ' + parkid
    // console.log(config);
    return config
  },
  error => {
    console.log(error) // for debug
    return Promise.reject(error)
  }
)

service.interceptors.response.use(
  response => {
    const res = response.data
    if (res.code === 10000) {
      // localStorage.removeItem('userInfo')
      localStorage.removeItem('userInfo')
      removeToken()
      store.commit('removeUserInfo')
      router.push('/')
    }
    return res
  }
)

export default service
