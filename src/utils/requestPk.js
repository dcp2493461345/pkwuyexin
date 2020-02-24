import axios from 'axios'
import store from '@/store'
import Vue from 'vue'
import { getToken, removeToken } from '@/utils/auth'
import router from '../router/index'
import QS from 'qs'
const service = axios.create({
  baseURL: 'http://yapi.txsqtech.com/public', // url = base url + request url
  // baseURL: 'http://test.txsqtech.com',
  // baseURL: 'http://www.parking.com/',
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
  },
  timeout: 5000 // request timeout
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
    window.history.forward(1)
    window.history.forward(-1)
    const res = response.data
    if (res.code === 10000) {
      localStorage.removeItem('userInfo')
      removeToken()
      store.commit('removeUserInfo')
      window.location.href = '/'
      router.push('/')
    }
    return res
  }
)

export default service
