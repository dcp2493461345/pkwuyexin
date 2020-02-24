import axios from 'axios'
import store from '@/store'
import { getToken, removeToken } from '@/utils/auth'
import router from '../router/index'
const service = axios.create({
  baseURL: 'http://yapi.txsqtech.com/public', // url = base url + request url
  // baseURL: 'http://test.txsqtech.com' // url = base url + request url
  // timeout:  // request timeout
})

service.interceptors.request.use(
  config => {
    if (getToken()) {
      const token = sessionStorage.getItem('token')
      config.headers['token'] = token
    } else {
      const obj = {}
      for (const i in config.headers) {
        if (i !== 'token') {
          obj[i] = config.headers[i]
        }
      } // 这里没用
      config.headers = obj
    }
    return config
  },
  error => {
    console.log(error) // for debug
    return Promise.reject(error)
  }
)

service.interceptors.response.use(
  response => {
    var res = response.data
    if (res.code === 10000) {
      sessionStorage.removeItem('token')
      localStorage.removeItem('userInfo')
      removeToken()
      store.commit('removeUserInfo')
      router.push('/')
    }
    return res
  }
)

export default service
