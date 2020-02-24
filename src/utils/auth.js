// import Cookies from 'js-cookie'

const TokenKey = 'token'
const UserInfo = 'userInfo'
const ReplaceData = 'replcaeData'
const ReplaceRouteList = 'replaceRouteList'
export function getToken () {
  return sessionStorage.getItem(TokenKey)
}

export function getInfo () {
  const info = localStorage.getItem('userInfo')
  return info
}
// 本地存储userInfo
export function setInfo (userInfo) {
  const wyUserInfo = JSON.stringify(userInfo)
  const info = localStorage.setItem(UserInfo, wyUserInfo)
  return info
}
export function setToken (token) {
  // console.log(token, '存token到session')
  return sessionStorage.setItem(TokenKey, token)
}

export function removeToken () {
  return sessionStorage.removeItem(TokenKey)
}
// 存入userInfo的初始data
export function setReplaceData (replaceData) {
  const wyRepslceData = JSON.stringify(replaceData)
  const info = localStorage.setItem(ReplaceData, wyRepslceData)
  return info
}
// 取出初始data
export function getReplaceData (replaceData) {
  const info = localStorage.getItem(replaceData)
  return info
}
// 在local里面存入后台返回的一级路由
export function setRoutes (list) {
  console.log('存入location')
  const setRoutesList = JSON.stringify(list)
  const info = localStorage.setItem(ReplaceRouteList, setRoutesList)
  return info
}

