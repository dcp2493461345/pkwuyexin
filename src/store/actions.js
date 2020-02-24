import {
  postLogin,
  postLogout,
  postGetCode,
  postRetrieve,
  postResetPwd,
  postGetCodes,
  postnewPwd,
  postHighest,
  postQuerya,
  postDelete,
  postHighests
} from '@/api/user'

import { payMent, setmeal } from '@/api/pay'
import { setToken, removeToken } from '@/utils/auth'
import router from '../router/index'
const actions = {

  login ({ commit }, userInfo) {
    console.log(userInfo, 222)
    const { name, password } = userInfo
    return new Promise((resolve, reject) => {
      postLogin({ name: name.trim(), password: password })
        .then(response => {
          // 登陆
          if (response.code === 200) {
            //将userInfo存localstorage
            commit('setUserInfo', response)
            //将token存sessionStorage
            setToken(response.token)
            localStorage.setItem('userInfo', JSON.stringify(response))
          } else if (response.code === 302) {
            commit('setUserInfo', response)
            setToken(response.token)
            localStorage.setItem('userInfo', JSON.stringify(response))
          }
          resolve(response)
        }).catch(error => {
          reject(error)
        })
    })
  },
  // 退出登陆
  logout ({ commit }, userInfo) {
    console.log(userInfo.data)
    const { uid } = userInfo.data
    return new Promise((resolve, reject) => {
      postLogout({ uid }).then((response) => {
        console.log(response)
        if (response.code === 200) {
          commit('setUserInfo', {})
          localStorage.clear()
          localStorage.removeItem('userInfo')
          removeToken()
          router.push('/')
          resolve()
        }
      }).catch(error => {
        reject(error)
      })
    })
  },
  getCode ({ commit }, userInfo) {
    var { username } = userInfo
    // console.log(username, 'username')
    username = Number(username)
    return new Promise((resolve, reject) => {
      postGetCode({ phone: username }).then((response) => {
        console.log(response)
        resolve(response)
      }).catch(error => {
        reject(error)
      })
    })
  },
  // 重置获取验证码
  getCodes ({ commit }, userInfo) {
    console.log(userInfo, 13213123)
    const { phones, phone, name } = userInfo
    return new Promise((resolve, reject) => {
      postGetCodes({ phones, phone, name }).then((response) => {
        resolve(response)
      }).catch(error => {
        reject(error)
      })
    })
  },
  // 重置密码
  resetPwd ({ commit }, userInfo) {
    console.log(userInfo)
    return new Promise((resolve, reject) => {
      postResetPwd(userInfo).then((response) => {
        resolve(response)
        commit('setUserInfo', {})
        localStorage.removeItem('userInfo')
        removeToken()
      }).catch(error => {
        reject(error)
      })
    })
  },
  // 找回密码
  retrieve ({ commit }, userInfo) {
    // console.log(userInfo, 'name')
    const { username, code, auth } = userInfo
    return new Promise((resolve, reject) => {
      postRetrieve({ phone: username, code, auth }).then((response) => {
        resolve(response)
        commit('setUserInfo', {})
        localStorage.removeItem('userInfo')
        removeToken()
      }).catch(error => {
        reject(error)
      })
    })
  },
  // 输入新密码
  enterPwd ({ commit }, userInfo) {
    // console.log(userInfo, 'chen')
    const { password, pwd, phone } = userInfo
    return new Promise((resolve, reject) => {
      postnewPwd({ password, pwd, phone }).then((response) => {
        if (response.code === 200) {
          commit('setUserInfo', response)
          setToken(response.token)
          localStorage.setItem('userInfo', JSON.stringify(response))
        } else if (response.code === 302) {
          commit('setUserInfo', response)
          setToken(response.token)
          localStorage.setItem('userInfo', JSON.stringify(response))
        }
        resolve(response)
      }).catch(error => {
        reject(error)
      })
    })
  },
  // 选择小区
  choiceCommunity ({ commit }, userInfo) {
    console.log(userInfo, 'choice')
    const { uid, Communityid } = userInfo
    return new Promise((resolve, reject) => {
      postHighest({ uid, Communityid }).then((resp) => {
        console.log('ininininininin')
        resolve(resp)
      }).catch(error => {
        reject(error)
      })
    })
  },
  // 添加权限
  addPremission ({ commit }, addall) {
    return new Promise((resolve, reject) => {
      postQuerya(addall).then((resp) => {
        resolve(resp)
      }).catch(error => {
        reject(error)
      })
    })
  },
  // 删除职位
  deleteAccount ({ commit }, dele) {
    console.log(dele)
    return new Promise((resolve, reject) => {
      postDelete(dele).then((resp) => {
        resolve(resp)
      }).catch(error => {
        reject(error)
      })
    })
  },
  // 微信生成二维码
  weixinErWeiMa ({ commit }, dataInfo) {
    console.log('action里面微信生成二维码')
    console.log(dataInfo)
    // const { money, name, communityid, propertyId, number } = dataInfo
    return new Promise((resolve, reject) => {
      payMent(dataInfo).then((resp) => {
        resolve(resp)
      }).catch(error => {
        reject(error)
      })
    })
  },
  // 按小区首字母搜索小区
  letterCommunity ({ commit }, dataInfo) {
    // const { money, name, communityid, propertyId, number } = dataInfo
    return new Promise((resolve, reject) => {
      postHighests(dataInfo).then((resp) => {
        resolve(resp)
      }).catch(error => {
        reject(error)
      })
    })
  },
  // 获取套餐数据
  getSetmealData ({ commit }, data) {
    // const { money, name, communityid, propertyId, number } = dataInfo
    return new Promise((resolve, reject) => {
      setmeal(data).then((resp) => {
        resolve(resp)
      }).catch(error => {
        reject(error)
      })
    })
  }
}

export default actions
